import { NextResponse } from "next/server";
import { getStoreDesign } from "@/lib/tiendanube";

export const dynamic = "force-dynamic";

/**
 * GET /api/tiendanube/design
 * Devuelve un resumen del “diseño” de la tienda: tema actual, logo, nombre, dominio, moneda.
 * Útil para replicar o migrar el look de tu Tiendanube actual.
 * Requiere TIENDANUBE_ACCESS_TOKEN y TIENDANUBE_STORE_ID en .env.local.
 */
export async function GET() {
  try {
    const design = await getStoreDesign();
    return NextResponse.json(design);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
