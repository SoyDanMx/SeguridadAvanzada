# Seguridad Avanzada Shop

**Tienda en línea de equipos de seguridad electrónica.** Videovigilancia, control de acceso, cableado estructurado, redes e IT, y más. Catálogo en vivo desde Syscom con precios en MXN, carrito, autenticación Supabase y sincronización nocturna a base de datos.

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green)](https://supabase.com/)
[![Syscom](https://img.shields.io/badge/Syscom-API-orange)](https://developers.syscom.mx/)

---

## Características

- **Catálogo Syscom** — Productos en vivo desde la API (cámaras, DVR, NVR, cableado, control de acceso, etc.)
- **Precios en MXN** — Conversión USD→MXN + margen configurable (30% por defecto)
- **Carrito** — Persistencia en `localStorage`, badge en header, página `/carrito`
- **Autenticación** — Login y registro con Supabase Auth
- **Sincronización diaria** — Cron nocturno que descarga el catálogo Syscom a PostgreSQL (Prisma)
- **Integración Tiendanube** — Formateo de productos para sync a Tiendanube (App 26095)
- **Web scraping** — Cheerio local o Apify para catálogos

---

## Stack

| Capa | Tecnología |
|------|------------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS |
| UI | Shadcn/UI style, Lucide-react, diseño mobile-first |
| Estado | TanStack Query, CartContext, AuthContext |
| Backend | API Routes, proxy Syscom con bypass SSL |
| Base de datos | Supabase (PostgreSQL), Prisma ORM |
| Auth | Supabase Auth (email/password) |

---

## Inicio rápido

```bash
# Instalar dependencias
npm install

# Copiar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Generar cliente Prisma (si usas sync)
npm run db:generate

# Desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Estructura del proyecto

```
app/
├── api/                    # API Routes
│   ├── products/           # Proxy Syscom → productos con precios MXN
│   ├── cron/sync/          # Sincronización Syscom → BD (CRON_SECRET)
│   ├── tiendanube/         # Token, store, design
│   └── ...
├── productos/              # Listado, detalle por SKU, por categoría
├── carrito/                # Página del carrito
├── cuenta/                 # Login, registro, recuperar contraseña
└── ...

lib/
├── syscom-client.ts        # Cliente API Syscom (OAuth2, bypass SSL)
├── syscom-api.ts           # Cliente para sync (sin caché)
├── sync-engine.ts          # Motor de sincronización Syscom → Prisma
├── pricing.ts              # USD→MXN, margen
├── supabase/               # Clientes Supabase (browser, server)
└── ...

prisma/
└── schema.prisma           # Modelo Product
```

---

## Variables de entorno

| Variable | Uso |
|----------|-----|
| `SYSCOM_CLIENT_ID`, `SYSCOM_CLIENT_SECRET` | API Syscom. [developers.syscom.mx](https://developers.syscom.mx) |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth y DB |
| `DATABASE_URL` | PostgreSQL (Supabase). Para Prisma y sync. |
| `CRON_SECRET` | Protege `/api/cron/sync` |
| `PROFIT_MARGIN`, `EXCHANGE_RATE_USD_MXN` | Precios y margen en MXN |
| `TIENDANUBE_*` | Sincronización con Tiendanube (App 26095) |
| `APIFY_TOKEN` | Opcional. Scraping con Apify. |

Ver `.env.example` para el listado completo.

---

## Sincronización nocturna (Syscom → BD)

Descarga el catálogo de Syscom cada madrugada y lo guarda en PostgreSQL.

1. Configura `DATABASE_URL` y `CRON_SECRET` en `.env.local`
2. Crea la tabla `Product` en Supabase (ver `supabase/migrations/20260211000000_add_products_table.sql`)
3. Ejecuta manualmente:  
   `curl -X POST "http://localhost:3000/api/cron/sync?secret=TU_CRON_SECRET"`
4. En Vercel: `vercel.json` ya incluye el cron a las 2:00 AM Mexico

Documentación: [docs/sync-syscom-inventario.md](docs/sync-syscom-inventario.md)

---

## Scripts

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:push` | Enviar schema a BD |
| `npm run scrape` | Scraping local (cheerio) |
| `npm run scrape:save` | Scraping local + guardar JSON |

---

## Documentación

- [Integración Syscom](docs/syscom-integration.md)
- [Configuración Supabase](docs/supabase-setup.md)
- [Sync de inventario](docs/sync-syscom-inventario.md)
- [Apify scraping](docs/apify-scraping.md)

---

## Licencia

Proyecto privado — Seguridad Avanzada.
