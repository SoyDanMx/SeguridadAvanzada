import { NextResponse } from "next/server";
import { getProducts } from "@/lib/syscom-client";

export const dynamic = "force-dynamic";

/**
 * GET /api/syscom-products-debug
 * Diagnóstico de paginación: compara page=1 vs page=2 para ver si Syscom responde distintos productos.
 */
export async function GET() {
  try {
    let page1: Awaited<ReturnType<typeof getProducts>>;
    let page2: Awaited<ReturnType<typeof getProducts>>;
    try {
      page1 = await getProducts({ category: "22", page: 1, limit: 24 });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: "getProducts page 1 failed", detail: msg });
    }
    try {
      page2 = await getProducts({ category: "22", page: 2, limit: 24 });
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      return NextResponse.json({ error: "getProducts page 2 failed", detail: msg });
    }

    const firstP1 = page1.products[0] as { producto_id?: unknown; modelo?: string } | undefined;
    const firstP2 = page2.products[0] as { producto_id?: unknown; modelo?: string } | undefined;

    return NextResponse.json({
      page1: {
        count: page1.products.length,
        total: page1.total,
        firstProductId: firstP1?.producto_id,
        firstProductModelo: firstP1?.modelo,
      },
      page2: {
        count: page2.products.length,
        total: page2.total,
        firstProductId: firstP2?.producto_id,
        firstProductModelo: firstP2?.modelo,
      },
      sameFirstProduct: firstP1?.producto_id === firstP2?.producto_id,
      hint:
        firstP1?.producto_id === firstP2?.producto_id
          ? "La API devuelve los mismos productos para page 1 y 2. Revisar params (pagina/page) en lib/syscom-client.ts"
          : "Paginación OK: page 1 y 2 devuelven productos distintos",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({
      error: message,
      stack: process.env.NODE_ENV === "development" ? stack : undefined,
    });
  }
}
