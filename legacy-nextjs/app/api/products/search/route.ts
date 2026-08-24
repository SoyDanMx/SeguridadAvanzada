import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getProducts as getSyscomProducts } from "@/lib/syscom-client";
import { sanitizeQuery, extractSkuToken } from "@/lib/query-sanitizer";

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
    
    // Variación 1: Sin guiones ni diagonales (ej. ST1460E)
    const unhyphenated = skuToken.replace(/[\-\/]/g, "");
    if (unhyphenated && unhyphenated !== skuToken) searchTargets.push(unhyphenated);

    // Variación 2: Sin sufijos de letra única final (ej. ST-1460 para ST-1460E)
    const trimmedSuffix = skuToken.replace(/[\-\/]?[A-Za-z]$/, "");
    if (trimmedSuffix && trimmedSuffix !== skuToken && trimmedSuffix.length >= 3) searchTargets.push(trimmedSuffix);

    let products: any[] = [];

    // 1. Coincidencia exacta o parcial en Prisma DB
    for (const target of searchTargets) {
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

      if (target.length >= 3) {
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
        }
      }
    }

    // 2. Fallback: Consultar API Syscom en vivo con los distintos searchTargets
    if (products.length === 0) {
      for (const target of searchTargets) {
        if (products.length > 0 || target.length < 3) continue;

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
              if (typeof sp.total_existencia === 'number') {
                stockNum = sp.total_existencia;
              } else if (typeof sp.existencia === 'number') {
                stockNum = sp.existencia;
              } else if (typeof sp.stock === 'number') {
                stockNum = sp.stock;
              } else if (sp.existencia && typeof sp.existencia === 'object') {
                stockNum = (sp.existencia as any).total || 0;
              }

              let datasheetUrl: string | null = null;
              if (typeof sp.datasheet === 'string' && sp.datasheet.trim()) {
                datasheetUrl = sp.datasheet.trim();
              } else if (typeof sp.link_privado === 'string' && sp.link_privado.trim()) {
                datasheetUrl = sp.link_privado.trim();
              } else if (Array.isArray(sp.recursos) && sp.recursos.length > 0) {
                const rec = (sp.recursos as any[]).find((r: any) => {
                  const name = (r.recurso || r.titulo || '').toLowerCase();
                  return name.includes("ficha") || name.includes("datasheet") || name.includes("especificaci") || name.includes("manual");
                }) || sp.recursos[0];
                if (rec && rec.path) {
                  datasheetUrl = rec.path;
                }
              }

              products.push({
                sku: skuVal,
                name: titleVal,
                price_mxn: priceNum,
                brand: vendorVal,
                description: descVal,
                stock: stockNum,
                datasheet_url: datasheetUrl
              });
            }
          }
        } catch (sysErr) {
          console.error(`[Product Search] Error en fallback de Syscom API para "${target}":`, sysErr);
        }
      }
    }

    // 3. Fallback final: Consultar API GraphQL de Shopify
    if (products.length === 0) {
      for (const target of searchTargets) {
        if (products.length > 0) continue;
        
        console.log(`[Product Search] Consultando API Shopify GraphQL para "${target}"...`);
        const shopifyProd = await fetchShopifyProduct(target);
        if (shopifyProd) {
          console.log(`[Product Search] Producto encontrado en Shopify para "${target}"`);
          products.push(shopifyProd);
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
      const stockCount = typeof p.stock === 'number' ? p.stock : 0;
      const stockMsg = stockCount > 0
        ? `Disponible para envío inmediato (${stockCount} unidades en stock)`
        : "Disponible bajo pedido (consultar tiempo de entrega)";

      responseObj.title = p.name;
      responseObj.sku = p.sku;
      responseObj.price = p.price_mxn > 0 ? `$${p.price_mxn.toFixed(2)} MXN` : "Consultar precio";
      responseObj.vendor = formatBrand(p.brand, p.sku);
      responseObj.description = cleanDescription(p.description, 120);
      responseObj.stock = stockMsg;
      responseObj.stock_count = stockCount;
      responseObj.datasheet_url = p.datasheet_url || null;
    } else {
      products.forEach((p, index) => {
        const i = index + 1;
        const stockCount = typeof p.stock === 'number' ? p.stock : 0;
        const stockMsg = stockCount > 0
          ? `Disponible (${stockCount} en stock)`
          : "Bajo pedido";

        responseObj[`title${i}`] = p.name;
        responseObj[`sku${i}`] = p.sku;
        responseObj[`price${i}`] = p.price_mxn > 0 ? `$${p.price_mxn.toFixed(2)} MXN` : "Consultar precio";
        responseObj[`stock${i}`] = stockMsg;
        responseObj[`vendor${i}`] = formatBrand(p.brand, p.sku);
        responseObj[`datasheet_url${i}`] = p.datasheet_url || null;
      });
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
    const res = await fetch(`https://${domain}/admin/api/2024-07/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": token,
      },
      body: JSON.stringify({
        query: `
          query {
            products(first: 1, query: "sku:'${sku}'") {
              nodes {
                id
                title
                vendor
                descriptionHtml
                variants(first: 1) {
                  nodes {
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
    const productNode = data?.data?.products?.nodes?.[0];
    
    if (productNode) {
      const variant = productNode.variants?.nodes?.[0];
      let cleanDesc = "";
      if (productNode.descriptionHtml) {
        cleanDesc = productNode.descriptionHtml.replace(/<[^>]*>?/gm, '');
      }
      return {
        sku: variant?.sku || sku,
        name: productNode.title,
        price_mxn: parseFloat(variant?.price || "0"),
        brand: productNode.vendor || "Seguridad Avanzada",
        description: cleanDescription(cleanDesc, 120),
        stock: variant?.inventoryQuantity || 0,
        datasheet_url: null,
      };
    }
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
