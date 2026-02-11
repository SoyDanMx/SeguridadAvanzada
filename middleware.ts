import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware: pass-through para evitar MIDDLEWARE_INVOCATION_FAILED en Vercel Edge.
 * La autenticación Supabase sigue funcionando en cliente vía AuthProvider.
 * El refresh de sesión en middleware falla en Edge; se puede re-activar cuando
 * Supabase/Next.js lo soporten correctamente.
 */
export async function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
