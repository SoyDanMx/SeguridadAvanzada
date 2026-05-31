# Sincronización de Inventario Syscom

Sistema que descarga el catálogo de Syscom cada madrugada y lo guarda en PostgreSQL (Supabase). **El catálogo se sirve desde la BD** (no desde Syscom en cada request), lo que evita 401, rate limits y dependencia de la API en tiempo real.

---

## Configuración

### 1. Variables de entorno (.env.local)

```env
# Base de datos (Supabase PostgreSQL)
# Supabase: Project Settings > Database > Connection string
# Usa "Connection pooling" para Serverless (puerto 6543)
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Cron (sincronización)
# Genera: openssl rand -hex 32
CRON_SECRET="tu_secreto_aqui"
```

### 2. Crear tabla Product

**Opción A – SQL en Supabase (recomendado):**

1. Supabase → **SQL Editor** → **New Query**
2. Ejecuta en orden: `supabase/migrations/20260211000000_add_products_table.sql` y luego `20260211000001_add_syscom_category_id.sql`

**Opción B – Prisma:**

```bash
npm run db:generate
npm run db:push
```

---

## Ejecutar sincronización manualmente

```bash
# Con secret en query
curl -X POST "http://localhost:3000/api/cron/sync?secret=TU_CRON_SECRET"

# Con header
curl -X POST "http://localhost:3000/api/cron/sync" \
  -H "Authorization: Bearer TU_CRON_SECRET"
```

---

## Automatización (Vercel Cron)

El archivo `vercel.json` configura un cron diario a las **2:00 AM México** (8:00 UTC):

```json
{
  "crons": [
    {
      "path": "/api/cron/sync",
      "schedule": "0 8 * * *"
    }
  ]
}
```

En Vercel, añade `c` en Project Settings > Environment Variables. Vercel enviará este header automáticamente al invocar el cron.

---

## Fórmula de precio

```
price_mxn = (price_usd * EXCHANGE_RATE_USD_MXN) * (1 + PROFIT_MARGIN)
```

Con `PROFIT_MARGIN=1.30` (30%) y `EXCHANGE_RATE_USD_MXN=18.50`.

---

## Archivos

| Archivo | Propósito |
|---------|-----------|
| `prisma/schema.prisma` | Modelo Product |
| `lib/syscom-api.ts` | Cliente Syscom (OAuth2, bypass SSL) |
| `lib/sync-engine.ts` | Lógica de sync y upsert |
| `lib/products-from-db.ts` | Lectura de catálogo desde BD |
| `app/api/products/route.ts` | Sirve desde BD si hay datos; fallback a Syscom si BD vacía |
| `app/api/cron/sync/route.ts` | Endpoint protegido con CRON_SECRET |
