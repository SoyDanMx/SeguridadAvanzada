import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getProducts as getSyscomProducts } from "@/lib/syscom-client";
import { sanitizeQuery } from "@/lib/query-sanitizer";

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
    console.log(`[Product Search] Búsqueda iniciada. Raw: "${rawQuery}" -> Cleaned: "${cleanQuery}"`);

    // 1. Intentar coincidencia exacta de SKU (case-insensitive)
    const exactMatch = await prisma.product.findFirst({
      where: {
        sku: { equals: cleanQuery, mode: "insensitive" }
      }
    });

    let products: any[] = [];

    if (exactMatch) {
      console.log(`[Product Search] Coincidencia exacta encontrada en BD: ${exactMatch.sku}`);
      products.push(exactMatch);
    } else {
      // 2. Coincidencia parcial con ordenamiento inteligente (el SKU más corto/cercano va primero)
      const candidates = await prisma.product.findMany({
        where: {
          OR: [
            { sku: { contains: cleanQuery, mode: "insensitive" } },
            { name: { contains: cleanQuery, mode: "insensitive" } }
          ]
        },
        take: 10
      });

      if (candidates.length > 0) {
        candidates.sort((a, b) => {
          const aExact = a.sku.toLowerCase() === cleanQuery.toLowerCase();
          const bExact = b.sku.toLowerCase() === cleanQuery.toLowerCase();
          if (aExact && !bExact) return -1;
          if (!aExact && bExact) return 1;

          const aStarts = a.sku.toLowerCase().startsWith(cleanQuery.toLowerCase());
          const bStarts = b.sku.toLowerCase().startsWith(cleanQuery.toLowerCase());
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;

          return a.sku.length - b.sku.length;
        });

        products = candidates.slice(0, 3);
      }
    }

    // 3. Fallback: Si no se encuentra en Prisma, consultar la API en vivo de Syscom
    if (products.length === 0) {
      try {
        console.log(`[Product Search] No encontrado en BD Prisma. Consultando API de Syscom en vivo para "${cleanQuery}"...`);
        const syscomRes = await getSyscomProducts({ search: cleanQuery, limit: 3 });
        if (syscomRes && syscomRes.products && syscomRes.products.length > 0) {
          console.log(`[Product Search] ${syscomRes.products.length} producto(s) encontrado(s) en Syscom para "${cleanQuery}"`);
          for (const sp of syscomRes.products) {
            const skuVal = (sp.modelo || sp.sku || cleanQuery).toString();
            const titleVal = (sp.titulo || sp.modelo || skuVal).toString();

            let priceNum = 0;
            if (typeof sp.precio === 'number') {
              priceNum = sp.precio;
            } else if (typeof sp.precio === 'object' && sp.precio !== null) {
              priceNum = sp.precio.precio_1 || sp.precio.precio_especial || sp.precio.precio_lista || 0;
            } else if (sp.precios && typeof sp.precios === 'object') {
              priceNum = (sp.precios.precio_1 as number) || (sp.precios.precio_especial as number) || 0;
            }

            const vendorVal = (typeof sp.marca === 'string' ? sp.marca : (sp.marca as any)?.nombre) || 'Generica';
            const descVal = sp.descripcion || (sp.caracteristicas ? sp.caracteristicas.join(', ') : '');

            products.push({
              sku: skuVal,
              name: titleVal,
              price_mxn: priceNum,
              brand: vendorVal,
              description: descVal
            });
          }
        }
      } catch (sysErr) {
        console.error("[Product Search] Error en fallback de Syscom API:", sysErr);
      }
    }

    if (products.length === 0) {
      console.warn(`[Product Search] Producto no encontrado en ninguna fuente para "${cleanQuery}"`);
      return NextResponse.json({ found: false }, { status: 200 });
    }

    // Formatear la respuesta para el agente de Kapso (como objeto plano)
    const responseObj: any = { found: true };

    if (products.length === 1) {
      const p = products[0];
      responseObj.title = p.name;
      responseObj.sku = p.sku;
      responseObj.price = p.price_mxn > 0 ? `$${p.price_mxn.toFixed(2)} MXN` : "Consultar precio";
      responseObj.vendor = p.brand || 'Generica';
      responseObj.description = p.description?.substring(0, 100) || '';
    } else {
      products.forEach((p, index) => {
        const i = index + 1;
        responseObj[`title${i}`] = p.name;
        responseObj[`sku${i}`] = p.sku;
        responseObj[`price${i}`] = p.price_mxn > 0 ? `$${p.price_mxn.toFixed(2)} MXN` : "Consultar precio";
      });
    }

    return NextResponse.json(responseObj, { status: 200 });

  } catch (error) {
    console.error("Error in Kapso search webhook:", error);
    return NextResponse.json({ found: false, error: "Internal Server Error" }, { status: 500 });
  }
}
