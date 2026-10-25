import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getProducts as getSyscomProducts } from "@/lib/syscom-client";
import { sanitizeQuery, extractSkuToken } from "@/lib/query-sanitizer";
import { getTechnicalData } from "@/lib/technical-catalog";
import { calculatePvpMxn } from "@/lib/pricing";

const prisma = new PrismaClient();

function extractSyscomPvp(sp: any): number {
  let cost = 0;
  if (typeof sp.precio === 'number' && sp.precio > 0) {
    cost = sp.precio;
  } else if (typeof sp.precio === 'object' && sp.precio !== null) {
    cost = parseFloat(sp.precio.precio_descuento || sp.precio.precio_especial || sp.precio.precio_1 || sp.precio.precio_lista || 0);
  } else if (sp.precios && typeof sp.precios === 'object') {
    cost = parseFloat(sp.precios.precio_descuento || sp.precios.precio_especial || sp.precios.precio_1 || sp.precios.precio_lista || 0);
  }
  const mapPrice = parseFloat(sp.precios?.precio_map || sp.precio?.precio_map || 0);
  const currency = (sp.moneda || "USD").toString().toUpperCase() === "MXN" ? "MXN" : "USD";
  return cost > 0 ? calculatePvpMxn(cost, currency, mapPrice) : 0;
}

function getPrismaPvp(p: any): number {
  if (p.price_usd && p.price_usd > 0) {
    return calculatePvpMxn(p.price_usd, "USD");
  }
  return typeof p.price_mxn === "number" ? p.price_mxn : parseFloat(p.price_mxn || "0");
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawSku = searchParams.get("sku");

  if (!rawSku) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  const sku = sanitizeQuery(rawSku);

  try {
    let product: any = null;

    // 1. PRIORIDAD 1: Catálogo en vivo de Shopify (tienda activa, CT Internacional y productos sincronizados con Banxico FIX)
    try {
      const shopifyProd = await fetchShopifyProduct(sku, true);
      if (shopifyProd) {
        product = {
          sku: shopifyProd.sku || sku,
          name: shopifyProd.name,
          price_mxn: shopifyProd.price_mxn
        };
      }
    } catch (e) {
      console.error("[GET Search] Error consultando Shopify fallback:", e);
    }

    // 2. PRIORIDAD 2: Syscom API en vivo (con cálculo canónico de PVP: Costo USD x Tipo de Cambio Banxico FIX x 1.48)
    if (!product) {
      try {
        const syscomRes = await getSyscomProducts({ search: sku, limit: 5 });
        if (syscomRes && syscomRes.products && syscomRes.products.length > 0) {
          const targetLower = sku.trim().toLowerCase();
          const cleanTarget = sku.replace(/[\-\/\s]/g, "").toLowerCase();

          // Buscar coincidencia exacta o normalizada por SKU/modelo
          const sp = syscomRes.products.find((p: any) => {
            const m = (p.modelo || p.sku || "").toString().trim().toLowerCase();
            const cleanM = m.replace(/[\-\/\s]/g, "");
            return m === targetLower || cleanM === cleanTarget;
          }) || syscomRes.products[0];

          if (sp) {
            const calculatedPvp = extractSyscomPvp(sp);
            product = {
              sku: sp.modelo || sp.sku || sku,
              name: sp.titulo || sp.modelo || sku,
              price_mxn: calculatedPvp
            };
          }
        }
      } catch (e) {
        console.error("[GET Search] Error fetching product by SKU from Syscom API fallback:", e);
      }
    }

    // 3. PRIORIDAD 3: Respaldo en Base de Datos Prisma (solo si no se encontró en APIs en vivo)
    if (!product) {
      try {
        const dbProduct = await prisma.product.findFirst({
          where: {
            sku: { equals: sku, mode: "insensitive" }
          },
          select: {
            sku: true,
            name: true,
            price_usd: true,
            price_mxn: true,
          }
        });

        if (dbProduct) {
          product = {
            sku: dbProduct.sku,
            name: dbProduct.name,
            price_mxn: getPrismaPvp(dbProduct)
          };
        }
      } catch (e) {
        console.error("[GET Search] Error consultando Prisma DB:", e);
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
          exactMatch.price_mxn = getPrismaPvp(exactMatch);
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
              const priceNum = extractSyscomPvp(exactSyscom);

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
              const priceNum = extractSyscomPvp(sp);

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
          products = candidates.slice(0, 3).map((c: any) => ({
            ...c,
            price_mxn: getPrismaPvp(c)
          }));
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
        const stockOtrasSucursales = (branches.tepotzotlan || 0) + (branches.mexico_sur || 0) + (branches.provincia || 0);

        if (stockNorte > 0) {
          hasImmediateCdmx = true;
          is24hTransfer = false;
          stockMsg = `🟢 Stock disponible de inmediato en Sucursal México Norte (${stockNorte} pzas). Recolección en oficina Av. Clavería 237 de 2 a 4 horas.`;
        } else if (stockOtrasSucursales > 0 || stockCount > 0) {
          hasImmediateCdmx = false;
          is24hTransfer = true;
          stockMsg = `🟡 Bajo pedido de 24 a 72 horas hábiles (${stockOtrasSucursales || stockCount} pzas en otras sucursales). Recolección en oficina Av. Clavería 237 o con envío asegurado a domicilio.`;
        } else {
          hasImmediateCdmx = false;
          stockMsg = "🔴 Equipos sin existencia en almacenes locales ni foráneos.";
        }
      } else if (branches && (branches.azcapotzalco !== undefined || branches.palacio !== undefined || branches.coacalco !== undefined || branches.tlalnepantla !== undefined)) {
        // Bodegas locales CDMX/ZMVM: DFA (Azcapotzalco), DFT (Tlalnepantla), DFC (Coacalco) y DFP (Palacio)
        const localCt = (branches.azcapotzalco || 0) + (branches.tlalnepantla || 0) + (branches.palacio || 0) + (branches.coacalco || 0);
        if (localCt > 0) {
          hasImmediateCdmx = true;
          stockMsg = `✅ Stock disponible de inmediato en sucursales locales CDMX/ZMVM (${localCt} pzas). Recolección en oficina Clavería 237 lista en 2 a 4 horas previa cita.`;
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
      const productUrl = p.handle
        ? `https://seguridad-avanzada.com/products/${p.handle}`
        : `https://seguridad-avanzada.com/search?q=${encodeURIComponent(p.sku)}`;

      responseObj.datasheet_url = sanitizeDatasheetUrl(p.datasheet_url) || sanitizeDatasheetUrl(tech?.datasheet_url);
      responseObj.product_url = productUrl;
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

        const itemProductUrl = p.handle
          ? `https://seguridad-avanzada.com/products/${p.handle}`
          : `https://seguridad-avanzada.com/search?q=${encodeURIComponent(p.sku)}`;

        responseObj[`title${i}`] = p.name;
        responseObj[`sku${i}`] = p.sku;
        responseObj[`price${i}`] = p.price_mxn > 0 ? `$${p.price_mxn.toFixed(2)} MXN` : "Consultar precio";
        responseObj[`stock${i}`] = stockMsg;
        responseObj[`has_cdmx_stock${i}`] = hasCdmxStock;
        responseObj[`cdmx_qty${i}`] = cdmxQty;
        responseObj[`resto_pais_qty${i}`] = restoPaisQty;
        responseObj[`vendor${i}`] = formatBrand(p.brand || tech?.vendor, p.sku);
        responseObj[`datasheet_url${i}`] = sanitizeDatasheetUrl(p.datasheet_url) || sanitizeDatasheetUrl(tech?.datasheet_url);
        responseObj[`product_url${i}`] = itemProductUrl;
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

function sanitizeDatasheetUrl(url?: string | null): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed || trimmed.toLowerCase() === 'null') return null;
  if (trimmed.includes('productos-info.com')) return trimmed;
  if (trimmed.includes('syscom.mx/producto/') || trimmed.endsWith('.html')) return null;
  return trimmed;
}

async function fetchShopifyProduct(sku: string, exactOnly = false): Promise<any> {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  
  if (!domain || !token) {
    console.warn("[Product Search] SHOPIFY_STORE_DOMAIN o SHOPIFY_ADMIN_ACCESS_TOKEN no están configurados.");
    return null;
  }
  
  try {
    const cleanSku = sku.trim();
    const escapedSku = cleanSku.replace(/["\\]/g, "");
    const res = await fetch(`https://${domain}/admin/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          query {
            productVariants(first: 10, query: "sku:${escapedSku}") {
              nodes {
                id
                sku
                price
                inventoryQuantity
                product {
                  id
                  title
                  handle
                  vendor
                  tags
                  descriptionHtml
                  metafieldCdmx: metafield(namespace: "custom", key: "stock_cdmx") { value }
                  metafieldCdmxQty: metafield(namespace: "custom", key: "stock_cdmx_qty") { value }
                  metafieldBranches: metafield(namespace: "custom", key: "stock_branches_json") { value }
                }
              }
            }
            products(first: 5, query: "sku:${escapedSku}") {
              nodes {
                id
                title
                handle
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
    const variantNodes: any[] = data?.data?.productVariants?.nodes || [];
    const productNodes: any[] = data?.data?.products?.nodes || [];

    const targetLower = cleanSku.toLowerCase();
    const targetNormalized = targetLower.replace(/[\-\/\s]/g, "");

    let selectedProduct: any = null;
    let selectedVariant: any = null;

    // 1. Buscar coincidencia exacta en variantNodes
    for (const v of variantNodes) {
      const vSku = (v.sku || "").trim().toLowerCase();
      if (vSku === targetLower) {
        selectedVariant = v;
        selectedProduct = v.product;
        break;
      }
    }

    // 2. Si no hubo coincidencia, buscar en productNodes
    if (!selectedVariant) {
      for (const node of productNodes) {
        const vMatch = node.variants?.nodes?.find((v: any) => {
          const vSku = (v.sku || "").trim().toLowerCase();
          return vSku === targetLower;
        });
        if (vMatch) {
          selectedProduct = node;
          selectedVariant = vMatch;
          break;
        }
      }
    }

    // 3. Buscar coincidencia normalizada (sin guiones/diagonales) si no se encontró exacta
    if (!selectedVariant) {
      for (const v of variantNodes) {
        const vNorm = (v.sku || "").trim().toLowerCase().replace(/[\-\/\s]/g, "");
        if (vNorm === targetNormalized) {
          selectedVariant = v;
          selectedProduct = v.product;
          break;
        }
      }
    }

    // Si es búsqueda estricta para el cotizador y no coincidió el SKU, no retornar producto falso
    if (!selectedVariant || !selectedProduct) {
      if (exactOnly) return null;
      if (productNodes.length > 0) {
        selectedProduct = productNodes[0];
        selectedVariant = selectedProduct.variants?.nodes?.[0];
      }
    }

    if (!selectedVariant || !selectedProduct) return null;

    let cleanDesc = "";
    if (selectedProduct.descriptionHtml) {
      cleanDesc = selectedProduct.descriptionHtml.replace(/<[^>]*>?/gm, '');
    }

    const totalStock = selectedVariant.inventoryQuantity || 0;
    const isCdmx = selectedProduct.metafieldCdmx?.value === 'true' || selectedProduct.metafieldCdmx?.value === '1';
    const cdmxStock = isCdmx
      ? (parseInt(selectedProduct.metafieldCdmxQty?.value || '0', 10) || totalStock)
      : 0;
    const restoPaisStock = Math.max(0, totalStock - cdmxStock);

    let branchData: any = null;
    if (selectedProduct.metafieldBranches?.value) {
      try {
        branchData = JSON.parse(selectedProduct.metafieldBranches.value);
      } catch (err) {
        // ignore
      }
    }

    return {
      sku: selectedVariant.sku || sku,
      name: selectedProduct.title,
      handle: selectedProduct.handle || null,
      price_mxn: parseFloat(selectedVariant.price || "0"),
      brand: selectedProduct.vendor || "Seguridad Avanzada",
      description: cleanDescription(cleanDesc, 120),
      stock: totalStock,
      cdmx_stock: cdmxStock,
      resto_pais_stock: restoPaisStock,
      branches: branchData,
      datasheet_url: null,
    };
  } catch (e) {
    console.error("[Product Search] Error en fetchShopifyProduct:", e);
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
