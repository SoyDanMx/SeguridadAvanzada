import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** GET /api/health - Verifica que el servidor responde */
export async function GET() {
  return NextResponse.json({ ok: true });
}
