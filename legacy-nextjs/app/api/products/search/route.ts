import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getProducts as getSyscomProducts } from "@/lib/syscom-client";
import { sanitizeQuery, extractSkuToken } from "@/lib/query-sanitizer";
import { getTechnicalData } from "@/lib/technical-catalog";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSku = searchParams.get("sku");

  if (!rawSku) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  const sku = sanitizeQuery(rawSku);

  try {
    let product: any = await prisma.product.findFirst({
      where: {
        sku: { equals: sku, mode: "insensitive" }
      },
      select: {
        sku: true,
        name: true,
        price_mxn: true,
      }
    });

    if (!product) {
      // Fallback a Syscom API
      try {
        const syscomRes = await getSyscomProducts({ search: sku, limit: 1 });
        if (syscomRes && syscomRes.products && syscomRes.products.length > 0) {
          const sp = syscomRes.products[0];
          let priceNum = 0;
          if (typeof sp.precio === 'number') {
            priceNum = sp.precio;
          } else if (typeof sp.precio === 'object' && sp.precio !== null) {
            priceNum = sp.precio.precio_1 || sp.precio.precio_especial || sp.precio.precio_lista || 0;
          }
          product = {
            sku: sp.modelo || sp.sku || sku,
            name: sp.titulo || sp.modelo || sku,
            price_mxn: priceNum
          };
        }
      } catch (e) {
        console.error("Error fetching product by SKU from Syscom API fallback:", e);
      }
    }

    if (!product) {
      // Fallback a Shopify GraphQL API
      try {
        const shopifyProd = await fetchShopifyProduct(sku);
        if (shopifyProd) {
          product = {
            sku: shopifyProd.sku || sku,
            name: shopifyProd.name,
            price_mxn: shopifyProd.price_mxn
          };
        }
      } catch (e) {
        console.error("Error fetching product by SKU from Shopify fallback:", e);
      }
    }

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product by SKU:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawQuery = body.query?.toString().trim();

    if (!rawQuery) {
      return NextResponse.json({ found: false, error: "Query is required" }, { status: 400 });
    }

    const cleanQuery = sanitizeQuery(rawQuery) || rawQuery;
    const skuToken = extractSkuToken(rawQuery) || cleanQuery;
    console.log(`[Product Search] Búsqueda iniciada. Raw: "${rawQuery}" -> Cleaned: "${cleanQuery}" -> Token: "${skuToken}"`);

    // Construir lista de targets a buscar en orden de especificidad
    const searchTargets: string[] = [];
    if (skuToken) searchTargets.push(skuToken);
    if (cleanQuery && cleanQuery !== skuToken) searchTargets.push(cleanQuery);

    // Variación con/sin paréntesis si aplica (ej. "MW5G (3-PACK)" -> "MW5G 3-PACK" y "MW5G")
    if (skuToken.includes("(") || skuToken.includes(")")) {
      const withoutParens = skuToken.replace(/[\(\)]/g, " ").replace(/\s+/g, " ").trim();
      if (withoutParens && !searchTargets.includes(withoutParens)) searchTargets.push(withoutParens);
      const basePart = skuToken.split(/[\(\s]/)[0]?.trim();
      if (basePart && basePart.length >= 3 && !searchTargets.includes(basePart)) searchTargets.push(basePart);
    }
    
    // Variación 1: Sin guiones ni diagonales solo si no contiene espacios ni paréntesis (ej. ST-1460E -> ST1460E)
    if (!skuToken.includes(" ") && !skuToken.includes("(")) {
      const unhyphenated = skuToken.replace(/[\-\/]/g, "");
      if (unhyphenated && unhyphenated !== skuToken) searchTargets.push(unhyphenated);

      // Variación 2: Sin sufijos de letra única final (ej. ST-1460 para ST-1460E)
      const trimmedSuffix = skuToken.replace(/[\-\/]?[A-Za-z]$/, "");
      if (trimmedSuffix && trimmedSuffix !== skuToken && trimmedSuffix.length >= 3) searchTargets.push(trimmedSuffix);
    }

    // Alias comercial canónico para Kits de CCTV
    const lowerRaw = rawQuery.toLowerCase();
    if (
      (lowerRaw.includes("kit") && (lowerRaw.includes("camara") || lowerRaw.includes("cctv"))) ||
      lowerRaw.includes("hl1080ps")
    ) {
      if (!searchTargets.includes("HL1080PS/INSTALADO")) {
        searchTargets.unshift("HL1080PS/INSTALADO");
      }
    }

    let products: any[] = [];

    // FASE 1: BÚSQUEDA EXACTA PRIORITARIA MULTI-CATÁLOGO (Shopify / CT -> Prisma DB -> Syscom API)
    // Buscamos coincidencia exacta del skuToken o targets principales para evitar que una coincidencia parcial
    // (ej. Candado MX123) opaque un producto exacto (ej. Sistema Mesh Tenda MX12-3 de CT/Shopify).
    const exactTargets = [skuToken, cleanQuery].filter(Boolean) as string[];

    // 1A. Coincidencia Exacta en Shopify (donde vive el catálogo de CT Internacional y productos activos de la tienda)
    for (const target of exactTargets) {
      if (products.length > 0) break;
      const shopifyProd = await fetchShopifyProduct(target);
      if (shopifyProd && shopifyProd.sku.toLowerCase() === target.toLowerCase()) {
        console.log(`[Product Search] Coincidencia exacta encontrada en Shopify/CT para "${target}": ${shopifyProd.sku}`);
        products.push(shopifyProd);
        break;
      }
    }

    // 1B. Coincidencia Exacta en Prisma DB
    if (products.length === 0) {
      for (const target of exactTargets) {
        if (products.length > 0) break;
        const exactMatch = await prisma.product.findFirst({
          where: {
            OR: [
              { sku: { equals: target, mode: "insensitive" } },
              { name: { equals: target, mode: "insensitive" } }
            ]
          }
        });
        if (exactMatch) {
          console.log(`[Product Search] Coincidencia exacta encontrada en BD para "${target}": ${exactMatch.sku}`);
          products.push(exactMatch);
          break;
        }
      }
    }

    // 1C. Coincidencia Exacta en Syscom API en vivo
    if (products.length === 0) {
      for (const target of exactTargets) {
        if (products.length > 0 || target.length < 3) continue;
        try {
          const syscomRes = await getSyscomProducts({ search: target, limit: 3 });
          if (syscomRes && syscomRes.products && syscomRes.products.length > 0) {
            const exactSyscom = syscomRes.products.find((sp: any) => {
              const spSku = (sp.modelo || sp.sku || "").toString().toLowerCase();
              return spSku === target.toLowerCase();
            });

            if (exactSyscom) {
              const skuVal = (exactSyscom.modelo || exactSyscom.sku || target).toString();
              const titleVal = (exactSyscom.titulo || exactSyscom.modelo || skuVal).toString();
              let priceNum = 0;
              if (typeof exactSyscom.precio === 'number') {
                priceNum = exactSyscom.precio;
              } else if (typeof exactSyscom.precio === 'object' && exactSyscom.precio !== null) {
                priceNum = exactSyscom.precio.precio_1 || exactSyscom.precio.precio_especial || exactSyscom.precio.precio_lista || 0;
              }

              let stockNum = 0;
              let cdmxStockNum = 0;
              let restoPaisStockNum = 0;
              if (typeof exactSyscom.total_existencia === 'number') stockNum = exactSyscom.total_existencia;
              else if (typeof exactSyscom.existencia === 'number') stockNum = exactSyscom.existencia;

              if (exactSyscom.existencia && typeof exactSyscom.existencia === 'object') {
                for (const [key, val] of Object.entries(exactSyscom.existencia)) {
                  const kUpper = key.toUpperCase();
                  const qty = Number(val) || 0;
                  if (kUpper.includes('CDMX') || kUpper.includes('VALLEJO') || kUpper.includes('TEPOTZOTLAN')) {
                    cdmxStockNum += qty;
                  } else if (kUpper !== 'TOTAL') {
                    restoPaisStockNum += qty;
                  }
                }
              }

              products.push({
                sku: skuVal,
                name: titleVal,
                price_mxn: priceNum,
                brand: formatBrand(typeof exactSyscom.marca === 'string' ? exactSyscom.marca : (exactSyscom.marca as any)?.nombre, skuVal),
                description: cleanDescription(exactSyscom.descripcion, 120),
                stock: stockNum,
                cdmx_stock: cdmxStockNum,
                resto_pais_stock: restoPaisStockNum,
                datasheet_url: null
              });
              break;
            }
          }
        } catch (err) {
          // ignore
        }
      }
    }

    // FASE 2: BÚSQUEDA EN SYSCOM API Y SHOPIFY/CT (Mayor actualidad y catálogo en vivo)
    if (products.length === 0) {
      for (const target of searchTargets) {
        if (products.length > 0 || target.length < 3) continue;

        // 2A. Consultar Shopify (CT Internacional y catálogo web)
        const shopifyProd = await fetchShopifyProduct(target);
        if (shopifyProd) {
          console.log(`[Product Search] Producto encontrado en Shopify/CT en Fase 2 para "${target}": ${shopifyProd.sku}`);
          products.push(shopifyProd);
          break;
        }

        // 2B. Consultar API Syscom en vivo
        try {
          console.log(`[Product Search] Consultando API Syscom en vivo para "${target}"...`);
          const syscomRes = await getSyscomProducts({ search: target, limit: 3 });

          if (syscomRes && syscomRes.products && syscomRes.products.length > 0) {
            console.log(`[Product Search] ${syscomRes.products.length} producto(s) encontrado(s) en Syscom para "${target}"`);
            for (const sp of syscomRes.products) {
              const skuVal = (sp.modelo || sp.sku || target).toString();
              const titleVal = (sp.titulo || sp.modelo || skuVal).toString();

              let priceNum = 0;
              if (typeof sp.precio === 'number') {
                priceNum = sp.precio;
              } else if (typeof sp.precio === 'object' && sp.precio !== null) {
                priceNum = sp.precio.precio_1 || sp.precio.precio_especial || sp.precio.precio_lista || 0;
              } else if (sp.precios && typeof sp.precios === 'object') {
                priceNum = (sp.precios.precio_1 as number) || (sp.precios.precio_especial as number) || 0;
              }

              const vendorVal = formatBrand(
                typeof sp.marca === 'string' ? sp.marca : (sp.marca as any)?.nombre,
                skuVal
              );
              const rawDesc = sp.descripcion || (sp.caracteristicas ? sp.caracteristicas.join(', ') : '');
              const descVal = cleanDescription(rawDesc, 120);

              let stockNum = 0;
              let cdmxStockNum = 0;
              let restoPaisStockNum = 0;

              if (typeof sp.total_existencia === 'number') {
                stockNum = sp.total_existencia;
              } else if (typeof sp.existencia === 'number') {
                stockNum = sp.existencia;
              } else if (typeof sp.stock === 'number') {
                stockNum = sp.stock;
              } else if (sp.existencia && typeof sp.existencia === 'object') {
                stockNum = (sp.existencia as any).total || 0;
              }

              if (sp.existencia && typeof sp.existencia === 'object') {
                for (const [key, val] of Object.entries(sp.existencia)) {
                  const kUpper = key.toUpperCase();
                  const qty = Number(val) || 0;
                  if (
                    kUpper.includes('CDMX') ||
                    kUpper.includes('VALLEJO') ||
                    kUpper.includes('AZCAPOTZALCO') ||
                    kUpper.includes('TEPOTZOTLAN') ||
                    kUpper.includes('TULTITLAN') ||
                    kUpper === 'DFA' ||
                    kUpper === 'D2A' ||
                    kUpper === 'DFP' ||
                    kUpper === 'DFT' ||
                    kUpper === 'DFC'
                  ) {
                    cdmxStockNum += qty;
                  } else if (kUpper !== 'TOTAL') {
                    restoPaisStockNum += qty;
                  }
                }
              }

              if (restoPaisStockNum === 0 && stockNum > cdmxStockNum) {
                restoPaisStockNum = Math.max(0, stockNum - cdmxStockNum);
              }

              let datasheetUrl: string | null = null;
              if (typeof sp.datasheet === 'string' && sp.datasheet.trim()) {
                datasheetUrl = sp.datasheet.trim();
              } else if (typeof sp.link_privado === 'string' && sp.link_privado.trim()) {
                datasheetUrl = sp.link_privado.trim();
              }

              products.push({
                sku: skuVal,
                name: titleVal,
                price_mxn: priceNum,
                brand: vendorVal,
                description: descVal,
                stock: stockNum,
                cdmx_stock: cdmxStockNum,
                resto_pais_stock: restoPaisStockNum,
                datasheet_url: datasheetUrl
              });
            }
            if (products.length > 0) break;
          }
        } catch (sysErr) {
          console.error(`[Product Search] Error en fallback de Syscom API para "${target}":`, sysErr);
        }
      }
    }

    // FASE 3: Fallback a Prisma DB local (candidatos aproximados)
    if (products.length === 0) {
      for (const target of searchTargets) {
        if (products.length > 0 || target.length < 3) continue;

        const candidates = await prisma.product.findMany({
          where: {
            OR: [
              { sku: { contains: target, mode: "insensitive" } },
              { name: { contains: target, mode: "insensitive" } }
            ]
          },
          take: 5
        });

        if (candidates.length > 0) {
          console.log(`[Product Search] ${candidates.length} candidato(s) encontrado(s) en BD para "${target}"`);
          candidates.sort((a, b) => {
            const aExact = a.sku.toLowerCase() === target.toLowerCase();
            const bExact = b.sku.toLowerCase() === target.toLowerCase();
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;
            return a.sku.length - b.sku.length;
          });
          products = candidates.slice(0, 3);
          break;
        }
      }
    }

    if (products.length === 0) {
      console.warn(`[Product Search] Producto no encontrado en ninguna fuente para "${cleanQuery}" (SKU Token: ${skuToken})`);
      return NextResponse.json({ found: false, queried_sku: skuToken }, { status: 200 });
    }

    // Formatear la respuesta para el agente de Kapso (como objeto plano)
    const responseObj: any = { found: true };

    if (products.length === 1) {
      const p = products[0];
      const tech = getTechnicalData(p.sku);
      const stockCount = typeof p.stock === 'number' ? p.stock : 0;
      const cdmxQty = (typeof p.cdmx_stock === 'number' && p.cdmx_stock > 0) ? p.cdmx_stock : 0;
      const restoPaisQty = (typeof p.resto_pais_stock === 'number' && p.resto_pais_stock > 0) ? p.resto_pais_stock : (stockCount > cdmxQty ? stockCount - cdmxQty : 0);
      const branches = p.branches || null;

      let hasImmediateCdmx = cdmxQty > 0;
      let is24hTransfer = false;
      let stockMsg = "";

      if (branches && (branches.mexico_norte !== undefined || branches.tepotzotlan !== undefined || branches.mexico_sur !== undefined)) {
        const stockNorte = branches.mexico_norte || 0;
        const stockTepo = branches.tepotzotlan || 0;
        const stockSur = branches.mexico_sur || 0;
        const stockProv = branches.provincia || 0;

        if (stockNorte > 0) {
          hasImmediateCdmx = true;
          stockMsg = `✅ Stock disponible de inmediato en almacén local CDMX Norte (${stockNorte} pzas). Recolección en nuestra oficina de Azcapotzalco (Av. Clavería 237) lista en 2 a 4 horas previa cita, o envío local express.`;
        } else if (stockTepo > 0 || stockSur > 0) {
          hasImmediateCdmx = true;
          is24hTransfer = true;
          stockMsg = `🟡 Stock disponible mediante traspaso local (${stockTepo > 0 ? stockTepo + ' pzas en CEDIS Central' : ''}${stockSur > 0 ? ' ' + stockSur + ' pzas en Sucursal Sur' : ''}). Disponible para recolección en oficina Clavería 237 en 24 horas hábiles (al día siguiente hábil).`;
        } else if (stockProv > 0 || stockCount > 0) {
          hasImmediateCdmx = false;
          stockMsg = `📦 Stock en almacén central foráneo (${stockProv || stockCount} pzas). Lo tendríamos disponible bajo pedido para recolección en oficina Clavería 237 en 24 a 72 horas hábiles (previa colocación del pedido en línea, transferencia SPEI o pago en sucursal), o con envío asegurado a domicilio en 2 a 4 días.`;
        } else {
          hasImmediateCdmx = false;
          stockMsg = "❌ Agotado temporalmente sin existencias en almacenes locales ni foráneos.";
        }
      } else if (branches && (branches.azcapotzalco !== undefined || branches.palacio !== undefined || branches.coacalco !== undefined)) {
        // Únicamente DFA (Azcapotzalco), DFC (Coacalco) y DFP (Palacio) son bodegas locales CDMX
        const localCt = (branches.azcapotzalco || 0) + (branches.palacio || 0) + (branches.coacalco || 0);
        if (localCt > 0) {
          hasImmediateCdmx = true;
          stockMsg = `✅ Stock disponible de inmediato en sucursales locales CDMX (${localCt} pzas). Recolección en oficina Clavería 237 lista en 2 a 4 horas previa cita.`;
        } else if (branches.provincia > 0 || stockCount > 0) {
          hasImmediateCdmx = false;
          stockMsg = `📦 Stock en almacén central foráneo (${branches.provincia || stockCount} pzas). Lo tendríamos disponible bajo pedido para recolección en oficina Clavería 237 en 24 a 72 horas hábiles (previa colocación del pedido en línea, transferencia SPEI o pago en sucursal), o con envío directo a domicilio en 2 a 4 días.`;
        } else {
          hasImmediateCdmx = false;
          stockMsg = "❌ Agotado temporalmente sin existencias en almacenes locales ni foráneos.";
        }
      } else {
        if (hasImmediateCdmx) {
          stockMsg = `✅ Disponible de inmediato en almacén local (${cdmxQty} pzas). Recolección en oficina Clavería 237 lista en 2 a 4 horas previa cita, o envío express.`;
        } else if (stockCount > 0) {
          stockMsg = `📦 Disponible en almacén central foráneo (${stockCount} pzas). Lo tendríamos listo bajo pedido en oficina Clavería 237 de 24 a 72 horas hábiles (previa colocación del pedido en línea, transferencia SPEI o pago en sucursal), o con envío nacional en 2 a 4 días.`;
        } else {
          hasImmediateCdmx = false;
          stockMsg = "❌ Agotado temporalmente sin existencias en almacenes locales ni foráneos.";
        }
      }

      // Detectar si el producto es AUDIO-PACK-PRO-S4 (negro agotado) y sugerir AUDIO-PACK-PRO-S4W (blanco con 8 pzas)
      const isAudioPackBlack = p.sku.toUpperCase().includes("AUDIO-PACK-PRO-S4") && !p.sku.toUpperCase().includes("AUDIO-PACK-PRO-S4W");
      if (stockCount === 0 && isAudioPackBlack) {
        stockMsg += " (💡 Nota: Contamos con 8 unidades disponibles para entrega inmediata en color Blanco modelo AUDIO-PACK-PRO-S4W por $24,082.62 MXN).";
      }

      const isOutOfStock = stockCount === 0 && !hasImmediateCdmx;

      responseObj.title = p.name;
      responseObj.sku = p.sku;
      responseObj.price = p.price_mxn > 0 ? `$${p.price_mxn.toFixed(2)} MXN` : "Consultar precio";
      responseObj.vendor = formatBrand(p.brand || tech?.vendor, p.sku);
      responseObj.description = cleanDescription(p.description, 120);
      responseObj.stock = stockMsg;
      responseObj.stock_count = stockCount;
      responseObj.has_cdmx_stock = hasImmediateCdmx;
      responseObj.is_24h_transfer = is24hTransfer;
      responseObj.cdmx_qty = cdmxQty;
      responseObj.resto_pais_qty = restoPaisQty;
      responseObj.branches = branches;
      responseObj.pickup_available = !isOutOfStock;
      responseObj.pickup_branch = isOutOfStock
        ? "Sin disponibilidad física en sucursales"
        : (is24hTransfer ? "CEDIS Central / Sucursal Sur" : "Sucursal Azcapotzalco / Almacén CDMX Norte");
      responseObj.pickup_office_address = "Av. Clavería 237, Int. Oficina 1, Col. Claveria, Azcapotzalco, CDMX (a una cuadra del Parque de la China)";
      responseObj.pickup_prep_time = isOutOfStock
        ? "Equipo agotado. Consultar fecha de reabastecimiento con un asesor."
        : (hasImmediateCdmx && !is24hTransfer
          ? "Almacén local (Azcapotzalco / CDMX Norte): 2 a 4 horas previa cita."
          : (is24hTransfer
            ? "Traspaso local (CEDIS Central / Sucursal Sur): 24 horas hábiles (al siguiente día hábil)."
            : "Almacén central foráneo: bajo pedido de 24 a 72 horas hábiles previa colocación de pedido o transferencia."));
      responseObj.delivery_time = isOutOfStock
        ? "Sujeto a tiempo de resurtido de planta / fabricante"
        : (hasImmediateCdmx && !is24hTransfer
          ? "Entrega local express CDMX mismo día o 2 a 4 días resto del país"
          : "2 a 4 días hábiles vía paquetería asegurada a domicilio");
      responseObj.pickup_policy = isOutOfStock
        ? "Equipo sin existencias para entrega o recolección. Se recomienda consultar al coordinador técnico para verificar fecha de llegada o adquirir variante disponible."
        : (hasImmediateCdmx && !is24hTransfer
          ? "Recolección disponible en oficina Clavería 237 previa cita (2 a 4 horas con stock verificado)."
          : (is24hTransfer
            ? "Recolección disponible en oficina Clavería 237 al siguiente día hábil (traspaso local en 24 horas)."
            : "Artículo en almacén central foráneo. Lo tendríamos disponible en oficina de 24 a 72 horas hábiles previa colocación de pedido en línea, transferencia SPEI o pago en sucursal."));
      responseObj.pickup_payment_accepted = !isOutOfStock;
      responseObj.pickup_payment_methods = "Tarjeta de crédito/débito en terminal bancaria, transferencia SPEI y efectivo en mostrador al recolectar previa cita";
      responseObj.datasheet_url = p.datasheet_url || tech?.datasheet_url || `https://seguridad-avanzada.com/search?q=${encodeURIComponent(p.sku)}`;
      if (tech?.manual_url) responseObj.manual_url = tech.manual_url;
      if (tech?.specs_summary) responseObj.specs = tech.specs_summary;
    } else {
      products.forEach((p, index) => {
        const i = index + 1;
        const tech = getTechnicalData(p.sku);
        const stockCount = typeof p.stock === 'number' ? p.stock : 0;
        const cdmxQty = (typeof p.cdmx_stock === 'number' && p.cdmx_stock > 0) ? p.cdmx_stock : 0;
        const restoPaisQty = (typeof p.resto_pais_stock === 'number' && p.resto_pais_stock > 0) ? p.resto_pais_stock : (stockCount > cdmxQty ? stockCount - cdmxQty : 0);
        const hasCdmxStock = cdmxQty > 0;

        const stockMsg = hasCdmxStock
          ? `CDMX / ZMVM: ${cdmxQty} pzas. Resto del país: ${restoPaisQty} pzas.`
          : `Resto del país: ${stockCount} pzas (Envío 2-4 días o retiro bajo pedido 24-72 hrs).`;

        responseObj[`title${i}`] = p.name;
        responseObj[`sku${i}`] = p.sku;
        responseObj[`price${i}`] = p.price_mxn > 0 ? `$${p.price_mxn.toFixed(2)} MXN` : "Consultar precio";
        responseObj[`stock${i}`] = stockMsg;
        responseObj[`has_cdmx_stock${i}`] = hasCdmxStock;
        responseObj[`cdmx_qty${i}`] = cdmxQty;
        responseObj[`resto_pais_qty${i}`] = restoPaisQty;
        responseObj[`vendor${i}`] = formatBrand(p.brand || tech?.vendor, p.sku);
        responseObj[`datasheet_url${i}`] = p.datasheet_url || tech?.datasheet_url || `https://www.syscom.mx/producto/${encodeURIComponent(p.sku)}.html`;
        if (tech?.manual_url) responseObj[`manual_url${i}`] = tech.manual_url;
        if (tech?.specs_summary) responseObj[`specs${i}`] = tech.specs_summary;
      });
      responseObj.pickup_available = true;
      responseObj.pickup_office_address = "Av. Clavería 237, Int. Oficina 1, Col. Claveria, Azcapotzalco, CDMX (a una cuadra del Parque de la China)";
      responseObj.pickup_policy = "Recolección disponible en nuestra oficina corporativa en Av. Clavería 237 previa cita.";
    }

    return NextResponse.json(responseObj, { status: 200 });

  } catch (error) {
    console.error("Error in Kapso search webhook:", error);
    return NextResponse.json({ found: false, error: "Internal Server Error" }, { status: 500 });
  }
}

async function fetchShopifyProduct(sku: string): Promise<any> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  if (!domain || !token) {
    console.warn("[Product Search] SHOPIFY_STORE_DOMAIN o SHOPIFY_ADMIN_ACCESS_TOKEN no están configurados.");
    return null;
  }
  
  try {
    const escapedSku = sku.replace(/"/g, '\\"');
    const res = await fetch(`https://${domain}/admin/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          query {
            products(first: 5, query: "sku:\\"${escapedSku}\\"") {
              nodes {
                id
                title
                vendor
                tags
                descriptionHtml
                metafieldCdmx: metafield(namespace: "custom", key: "stock_cdmx") { value }
                metafieldCdmxQty: metafield(namespace: "custom", key: "stock_cdmx_qty") { value }
                metafieldBranches: metafield(namespace: "custom", key: "stock_branches_json") { value }
                variants(first: 5) {
                  nodes {
                    id
                    sku
                    price
                    inventoryQuantity
                  }
                }
              }
            }
          }
        `,
      }),
    });
    
    if (!res.ok) return null;
    const data = await res.json();
    const productNodes: any[] = data?.data?.products?.nodes || [];
    if (productNodes.length === 0) return null;

    // Buscar si algún nodo tiene una variante con coincidencia exacta con el SKU consultado
    const targetLower = sku.trim().toLowerCase();
    let selectedProduct: any = null;
    let selectedVariant: any = null;

    for (const node of productNodes) {
      const vMatch = node.variants?.nodes?.find((v: any) => v.sku && v.sku.trim().toLowerCase() === targetLower);
      if (vMatch) {
        selectedProduct = node;
        selectedVariant = vMatch;
        break;
      }
    }

    // Si no hubo coincidencia exacta de variante, ordenar por precio y tomar la primera
    if (!selectedProduct) {
      productNodes.sort((a, b) => {
        const priceA = parseFloat(a.variants?.nodes?.[0]?.price || "0");
        const priceB = parseFloat(b.variants?.nodes?.[0]?.price || "0");
        return priceB - priceA;
      });
      selectedProduct = productNodes[0];
      selectedVariant = selectedProduct.variants?.nodes?.[0];
    }

    const productNode = selectedProduct;
    const variant = selectedVariant;
    let cleanDesc = "";
    if (productNode.descriptionHtml) {
      cleanDesc = productNode.descriptionHtml.replace(/<[^>]*>?/gm, '');
    }

    const totalStock = variant?.inventoryQuantity || 0;
    const isCdmx = productNode.metafieldCdmx?.value === 'true' || productNode.metafieldCdmx?.value === '1';
    const cdmxStock = isCdmx
      ? (parseInt(productNode.metafieldCdmxQty?.value || '0', 10) || totalStock)
      : 0;
    const restoPaisStock = Math.max(0, totalStock - cdmxStock);

    let branchData: any = null;
    if (productNode.metafieldBranches?.value) {
      try {
        branchData = JSON.parse(productNode.metafieldBranches.value);
      } catch (err) {
        // ignore
      }
    }

    return {
      sku: variant?.sku || sku,
      name: productNode.title,
      price_mxn: parseFloat(variant?.price || "0"),
      brand: productNode.vendor || "Seguridad Avanzada",
      description: cleanDescription(cleanDesc, 120),
      stock: totalStock,
      cdmx_stock: cdmxStock,
      resto_pais_stock: restoPaisStock,
      branches: branchData,
      datasheet_url: null,
    };
  } catch (e) {
    console.error("[Product Search] Error en fallback de Shopify API:", e);
  }
  return null;
}

function formatBrand(rawBrand?: string | null, sku?: string): string {
  if (rawBrand && rawBrand.trim() && !/generica/i.test(rawBrand)) {
    return rawBrand.trim();
  }
  if (!sku) return "Seguridad Avanzada";
  const upperSku = sku.toUpperCase();
  if (upperSku.startsWith("EPL") || upperSku.startsWith("EP-")) return "EPCOM Industrial";
  if (upperSku.startsWith("DS-") || upperSku.startsWith("HK")) return "Hikvision";
  if (upperSku.startsWith("RG-") || upperSku.startsWith("EG")) return "Ruijie Networks";
  if (upperSku.startsWith("STI")) return "STI";
  if (upperSku.startsWith("DK") || upperSku.startsWith("2600")) return "DoorKing";
  if (upperSku.startsWith("DH-") || upperSku.startsWith("DAH")) return "Dahua Technology";
  if (upperSku.startsWith("SHELLY")) return "Shelly";
  if (upperSku.startsWith("PROA") || upperSku.startsWith("RE")) return "Resideo / Alula";
  return "Seguridad Avanzada";
}

function cleanDescription(rawDesc?: string | null, maxLength = 120): string {
  if (!rawDesc) return "";
  let text = rawDesc
    .replace(/&comma;/g, ",")
    .replace(/&quote;|&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length <= maxLength) return text;

  let truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");
  if (lastSpace > 30) {
    truncated = truncated.substring(0, lastSpace);
  }
  truncated = truncated.replace(/[\s\.,;:"'\(]+$/, "");
  return truncated + "...";
}
