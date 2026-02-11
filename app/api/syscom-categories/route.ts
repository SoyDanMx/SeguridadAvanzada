import { NextResponse } from "next/server";
import { getCategories } from "@/lib/syscom-client";

export const dynamic = "force-dynamic";

/**
 * GET /api/syscom-categories
 * Obtiene categorías de primer nivel desde Syscom.
 * Sirve para validar los syscomId en lib/categories.ts.
 */
export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
