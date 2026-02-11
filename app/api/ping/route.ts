import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** GET /api/ping - Prueba simple sin dependencias externas */
export async function GET() {
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
