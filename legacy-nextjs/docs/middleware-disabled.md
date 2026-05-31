# Middleware deshabilitado

El middleware (Supabase auth) causaba `MIDDLEWARE_INVOCATION_FAILED` en Vercel Edge y se eliminó para que el sitio funcione.

La autenticación **sigue funcionando** en cliente vía `AuthProvider` y `createBrowserClient` en `lib/supabase/client.ts`.

## Para re-activar el middleware en el futuro

Crear `middleware.ts` en la raíz con el contenido de Supabase para Next.js que funcione en Edge, o cuando Vercel/Next.js/Supabase corrijan la incompatibilidad.

El último código que fallaba era:

```ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // ... Supabase cookies getAll/setAll, getUser()
}
```
