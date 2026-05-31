import { NextResponse } from "next/server";
import { getAuthToken, getProducts } from "@/lib/syscom-client";

export const dynamic = "force-dynamic";

/**
 * GET /api/syscom-status
 * Diagnóstico: token y primera petición a productos (mismo flujo que /api/products).
 */
export async function GET() {
  try {
    try {
      await getAuthToken();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      const hasId = !!process.env.SYSCOM_CLIENT_ID?.trim();
      const hasSecret = !!process.env.SYSCOM_CLIENT_SECRET?.trim();
      return NextResponse.json({
        ok: false,
        step: "token",
        error: msg,
        env: {
          SYSCOM_CLIENT_ID: hasId ? `set (${process.env.SYSCOM_CLIENT_ID!.trim().length} chars)` : "missing or empty",
          SYSCOM_CLIENT_SECRET: hasSecret ? "set" : "missing or empty",
        },
        hint:
          "Revisa SYSCOM_CLIENT_ID y SYSCOM_CLIENT_SECRET en .env.local. Deben ser las credenciales de developers.syscom.mx (OAuth2 Client ID/Secret). Sin comillas extra ni espacios. Reinicia el servidor (npm run dev) tras cambiar .env.local.",
      });
    }

    const { products, total } = await getProducts({ category: "22", page: 1, limit: 10 });
    const first = products[0] as Record<string, unknown> | undefined;
    return NextResponse.json({
      ok: true,
      step: "products",
      productsCount: products.length,
      total: total ?? products.length,
      firstProductKeys: first ? Object.keys(first) : [],
      hint:
        products.length === 0
          ? "La API puede requerir filtro. Prueba /api/products?category=22 o /productos?q=camara"
          : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({
      ok: false,
      step: "products",
      error: message,
    });
  }
}
