import { NextResponse } from "next/server";
import { getStore } from "@/lib/tiendanube";

export const dynamic = "force-dynamic";

/**
 * GET /api/tiendanube/store
 * Devuelve la tienda actual (nombre, logo, current_theme, idiomas, moneda, etc.).
 * Requiere TIENDANUBE_ACCESS_TOKEN y TIENDANUBE_STORE_ID en .env.local.
 */
export async function GET() {
  try {
    const store = await getStore();
    return NextResponse.json(store);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
