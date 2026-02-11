import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForToken } from "@/lib/tiendanube";

export const dynamic = "force-dynamic";

/**
 * POST /api/tiendanube/token
 * Intercambia el código de autorización por access token.
 *
 * Body: { "code": "a1182e07b7d9f8b11db7b87dfaa1bd2f7e4ab2ac" }
 *
 * Requiere en .env.local:
 *   TIENDANUBE_CLIENT_ID (o TIENDANUBE_USER_ID) = 26095
 *   TIENDANUBE_CLIENT_SECRET = tu client_secret
 *
 * Respuesta: access_token, user_id (store_id). Guarda access_token en TIENDANUBE_ACCESS_TOKEN
 * y user_id en TIENDANUBE_STORE_ID para las demás llamadas.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const code =
      (body.code as string)?.trim() ||
      (request.nextUrl.searchParams.get("code") as string)?.trim();

    if (!code) {
      return NextResponse.json(
        { error: "Falta 'code' en el body o en query (?code=...)" },
        { status: 400 }
      );
    }

    const data = await exchangeCodeForToken(code);

    return NextResponse.json({
      ok: true,
      access_token: data.access_token,
      token_type: data.token_type,
      scope: data.scope,
      user_id: data.user_id,
      message:
        "Guarda en .env.local: TIENDANUBE_ACCESS_TOKEN=" +
        data.access_token +
        " y TIENDANUBE_STORE_ID=" +
        data.user_id,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
