# Configuración de Supabase

Proyecto: **Seguridad-Avanzada.com**  
URL: `https://lxacjidshxyiqsicgqke.supabase.co`

---

## Pasos para activar

### 1. Obtener las credenciales

1. Entra a [Supabase Dashboard](https://supabase.com/dashboard/project/lxacjidshxyiqsicgqke).
2. Ve a **Project Settings** (ícono engranaje) → **API**.
3. Copia:
   - **Project URL** (ej. `https://lxacjidshxyiqsicgqke.supabase.co`)
   - **anon public** (clave pública, segura para el cliente)

### 2. Configurar `.env.local`

Añade o edita en `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL="https://lxacjidshxyiqsicgqke.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu_anon_key_aquí"
```

### 3. Ejecutar la migración

1. En Supabase: **SQL Editor** → **New Query**.
2. Copia el contenido de `supabase/migrations/20260210000000_initial_schema.sql`.
3. Ejecuta la consulta.

Esto crea las tablas: `profiles`, `carts`, `cart_items`, `orders`, `order_items`.

### 4. Habilitar Auth (para login/registro real)

1. En Supabase: **Authentication** → **Providers**.
2. Activa **Email** (o el proveedor que uses).
3. Opcional: configura **Email templates** para "Confirm signup" y "Reset password".

---

## Uso en el código

```ts
// En componentes cliente (navegador)
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

// En Server Components, API Routes
import { createClient } from "@/lib/supabase/server";
const supabase = await createClient();
```

---

## Próximos pasos

- Integrar Supabase Auth en `/cuenta/login` y `/cuenta/registro`.
- Persistir carrito en `carts` cuando el usuario esté autenticado.
- Guardar pedidos en `orders` al enviar por WhatsApp.
