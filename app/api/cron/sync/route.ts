import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min para sync largo

async function handleSync(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret?.trim()) {
    return NextResponse.json(
      { error: "CRON_SECRET no configurado en .env.local" },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;
  const querySecret = request.nextUrl.searchParams.get("secret");

  const provided = bearerToken ?? querySecret;
  if (!provided || provided !== secret.trim()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { runSync } = await import("@/lib/sync-engine");
  const result = await runSync();

  return NextResponse.json({
    ok: result.ok,
    totalProcessed: result.totalProcessed,
    totalUpserted: result.totalUpserted,
    totalErrors: result.totalErrors,
    categoriesProcessed: result.categoriesProcessed,
    durationMs: result.durationMs,
    error: result.error,
    logs: result.logs.slice(-20),
  });
}

/**
 * POST /api/cron/sync
 * Ejecuta sincronización Syscom → BD.
 * Requiere CRON_SECRET en header Authorization: Bearer <CRON_SECRET>
 * o en query: ?secret=<CRON_SECRET>
 */
export async function POST(request: NextRequest) {
  try {
    return await handleSync(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({
      error: message,
      stack: process.env.NODE_ENV === "development" ? stack : undefined,
    });
  }
}

/**
 * GET /api/cron/sync
 * Para Vercel Cron (que usa GET).
 */
export async function GET(request: NextRequest) {
  try {
    return await handleSync(request);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json({
      error: message,
      stack: process.env.NODE_ENV === "development" ? stack : undefined,
    });
  }
}
