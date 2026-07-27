import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sku = searchParams.get("sku");

  if (!sku) {
    return NextResponse.json({ error: "SKU is required" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { sku: sku.trim() },
      select: {
        name: true,
        price_mxn: true,
      }
    });

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
    const query = body.query?.trim();

    if (!query) {
      return NextResponse.json({ found: false, error: "Query is required" }, { status: 400 });
    }

    // Buscar en Prisma (primero coincidencia exacta de SKU, luego aproximada en SKU o Nombre)
    const exactMatch = await prisma.product.findUnique({
      where: { sku: query }
    });

    let products = [];

    if (exactMatch) {
      products.push(exactMatch);
    } else {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { sku: { contains: query, mode: "insensitive" } },
            { name: { contains: query, mode: "insensitive" } }
          ]
        },
        take: 3
      });
    }

    if (products.length === 0) {
      return NextResponse.json({ found: false }, { status: 200 });
    }

    // Formatear la respuesta para el agente de Kapso (como objeto plano)
    const responseObj: any = { found: true };

    if (products.length === 1) {
      const p = products[0];
      responseObj.title = p.name;
      responseObj.sku = p.sku;
      responseObj.price = `$${p.price_mxn.toFixed(2)} MXN`;
      responseObj.vendor = p.brand || 'Generica';
      responseObj.description = p.description?.substring(0, 100) || '';
    } else {
      products.forEach((p, index) => {
        const i = index + 1;
        responseObj[`title${i}`] = p.name;
        responseObj[`sku${i}`] = p.sku;
        responseObj[`price${i}`] = `$${p.price_mxn.toFixed(2)} MXN`;
      });
    }

    return NextResponse.json(responseObj, { status: 200 });

  } catch (error) {
    console.error("Error in Kapso search webhook:", error);
    return NextResponse.json({ found: false, error: "Internal Server Error" }, { status: 500 });
  }
}
