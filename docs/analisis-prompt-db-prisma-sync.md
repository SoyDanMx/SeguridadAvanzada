# Análisis: prompt "Base de datos propia + Prisma + Sync Syscom"

Evaluación del enfoque propuesto (BD propia, Prisma, script de sincronización y cron) en el contexto de SeguridadAvanzadaShop y de la API real de Syscom.

---

## 1. Resumen del prompt

El prompt propone:

1. **Base de datos propia** (Prisma + Supabase/PostgreSQL o SQLite) en lugar de consultar Syscom en cada petición.
2. **Modelo Prisma** `Product` con campos: id, sku, name, description, price_usd, price_mxn, stock, category, brand, image_url, datasheet_url, last_updated.
3. **Script de sync** `lib/sync-syscom.ts` que llama a `getSyscomProducts()`, recorre los ítems y hace `upsert` por SKU.
4. **Ventajas:** velocidad, búsqueda avanzada, SSL solo en el sync.
5. **Siguiente paso:** Cron (ej. 3:00 AM) para ejecutar el sync automáticamente.

---

## 2. Qué tiene razón el prompt

- **BD propia como estándar:** Tener una copia local de catálogo es habitual: UI rápida, filtros/búsqueda propios, menos dependencia del proveedor en cada carga.
- **Rate limit:** Consultar Syscom en cada vista reparte el límite (60 req/min) entre todos los usuarios; un sync programado concentra las peticiones en una ventana controlada.
- **Velocidad:** Leer desde PostgreSQL/SQLite suele ser más rápido y estable que pasar siempre por la API de Syscom.
- **SSL:** El bypass de certificado se hace solo en el proceso de sync (servidor), no en el navegador.
- **Prisma + Supabase o SQLite:** Opciones válidas y modernas; Prisma funciona bien con ambos.
- **Cron:** Automatizar el sync (p. ej. cada madrugada) es la forma típica de mantener la BD actualizada.

En conjunto, la **dirección** del prompt (sync → BD → UI) es correcta y alineada con tu otro proyecto (Sync Python → Supabase → Marketplace UI).

---

## 3. Correcciones necesarias para que funcione con este proyecto

### 3.1 No existe `getSyscomProducts()` que devuelva “todos” los productos

En **SeguridadAvanzadaShop** el cliente expone:

```ts
getProducts(params?: { category?: string; search?: string; page?: number; limit?: number })
```

La API de Syscom es **paginada** (p. ej. `pagina`, `limit`). No hay un endpoint “dame todos los productos” en una sola llamada.

**Implicación:** El sync debe:

- Recorrer **categorías** (por ejemplo las de `lib/categories.ts`: 22, 26, 30, etc., o las que uses).
- Por cada categoría, **paginando** (`page=1`, 2, … hasta que no haya más).
- Respetar **rate limit** (p. ej. ~1 s entre peticiones) para no superar 60 req/min.

Ejemplo de esqueleto:

```ts
const categories = ['22', '26', '30']; // Videovigilancia, Redes, Energía
for (const cat of categories) {
  let page = 1;
  let hasMore = true;
  while (hasMore) {
    const { products, total } = await getProducts({ category: cat, page, limit: 100 });
    for (const item of products) { /* upsert */ }
    hasMore = products.length === 100 && (page * 100) < (total ?? 0);
    page++;
    await sleep(1100); // rate limit
  }
}
```

### 3.2 Precio: no siempre existe `item.precio_lista` en la raíz

En la API de Syscom, el precio suele venir en **`item.precio`**, que puede ser:

- Un **número**, o
- Un **objeto** `{ precio_lista, precio_especial, precio_1, precio_descuento }`.

El prompt usa `item.precio_lista` directo; con la estructura real eso suele ser `item.precio?.precio_lista` (o lógica equivalente).

**Recomendación:** Reutilizar la misma lógica que en `app/api/products/route.ts` (o en `lib/pricing.ts`): extraer un único “precio base” desde `item.precio` (objeto o número) y luego calcular `price_mxn` con margen y tipo de cambio. Así el sync y la API en vivo usan la misma regla.

### 3.3 Stock / existencia

El prompt usa `item.existencia`. En `SyscomProduct` de este repo no hay un campo estándar `existencia`; la API puede devolverlo con otro nombre (p. ej. `total_existencia`, `stock`). Hay que comprobar la respuesta real de Syscom y mapear al campo que uses en Prisma (ej. `stock`).

### 3.4 Identificador único para upsert

El prompt hace `upsert` por `sku: item.modelo`. En Syscom, `modelo` puede no ser único entre categorías o puede faltar. Es más seguro usar como clave externa el **`producto_id`** de Syscom (en tu otro proyecto lo tienes como `external_code`). En Prisma podrías tener:

- `external_code String? @unique` (producto_id de Syscom), y
- `upsert({ where: { external_code: String(item.producto_id) }, ... })`.

Así evitas duplicados cuando el mismo producto aparece en varias categorías o cuando `modelo` se repite.

### 3.5 Margen y tipo de cambio desde env

El prompt usa valores fijos `margin = 1.30` y `exchangeRate = 18.50`. En este proyecto ya existen `PROFIT_MARGIN` y `EXCHANGE_RATE_USD_MXN` en `.env`. El sync debería leer esas variables para que precios en BD y lógica de la web coincidan.

---

## 4. Modelo Prisma sugerido (ajustes menores)

El modelo del prompt es buena base. Pequeñas mejoras:

- Añadir **`external_code String? @unique`** (ID de Syscom) para upsert y deduplicado.
- **`description`** en tipo `Text` ya está bien para textos largos.
- Opcional: **`category_id`** (string de Syscom) además de `category` (nombre), para filtrar por categoría en la UI.
- **`last_updated`** es útil para depurar y para futuros syncs incrementales.

Ejemplo (sin cambiar la esencia del prompt):

```prisma
model Product {
  id             String   @id @default(cuid())
  external_code  String?  @unique  // producto_id de Syscom
  sku            String   @unique  // modelo de Syscom
  name           String
  description    String?  @db.Text
  price_usd      Float
  price_mxn      Float
  stock          Int      @default(0)
  category       String?
  category_id    String?  // ID categoría Syscom (22, 26, …)
  brand          String?
  image_url      String?
  datasheet_url  String?
  last_updated   DateTime @default(now())
}
```

---

## 5. Cron (tarea programada)

El prompt sugiere ejecutar el sync, por ejemplo, a las 3:00 AM. Opciones en un proyecto Next.js:

- **Vercel Cron Jobs:** Si despliegas en Vercel, puedes definir en `vercel.json` una ruta que se llame con un cron (ej. `0 3 * * *`). Esa ruta (API Route) ejecutaría la función de sync. Debe estar protegida (secret o token) para que solo la pueda llamar el cron.
- **Servicio externo:** Un cron en un VPS, GitHub Actions, o un servicio tipo cron-job.org que haga `GET/POST` a tu API de sync con un token secreto.
- **Script local + cron del SO:** Ejecutar `npx ts-node lib/sync-syscom.ts` (o un script en `package.json`) desde el cron del sistema; solo aplica si el servidor donde corre Next tiene acceso a la misma BD.

En todos los casos, el sync debe poder conectarse a la BD (Supabase/PostgreSQL o SQLite) y tener las variables de entorno (Syscom, margen, tipo de cambio, URL de BD).

---

## 6. Impacto en SeguridadAvanzadaShop

Hoy este repo **no tiene BD de productos**: todo pasa por `/api/products` → Syscom. Adoptar el enfoque del prompt implica:

- Introducir **Prisma** y **Supabase** (o SQLite).
- Añadir el **script de sync** (con la lógica corregida: categorías, paginación, precio, external_code, rate limit).
- Cambiar **`/api/products`** (y opcionalmente la página de detalle) para que lean de la BD en lugar de (o como fallback de) Syscom.
- Configurar **cron** para ejecutar el sync con la frecuencia deseada.

Es un **cambio de arquitectura** relevante: de “todo en vivo desde Syscom” a “sync → BD → UI”, igual que en tu otro proyecto. Las ventajas (velocidad, rate limit, búsqueda) son las que describe el prompt; el coste es mantener sync + BD + cron.

---

## 7. Conclusión

- El **enfoque** del prompt (BD propia + sync + cron) es sólido y está alineado con el estándar de la industria y con tu otro proyecto.
- Para que funcione **con este repo y la API real de Syscom** hay que:
  - Sustituir “getSyscomProducts()” por un bucle por **categorías y páginas** usando `getProducts({ category, page, limit })`.
  - Extraer el **precio** desde `item.precio` (objeto o número) y usar **PROFIT_MARGIN** y **EXCHANGE_RATE_USD_MXN**.
  - Definir **external_code** (producto_id) y usarlo para upsert/deduplicado.
  - Verificar el nombre del campo de **stock** en la respuesta de Syscom.
- Con esas correcciones, el mismo diseño (Prisma + sync + cron) es viable y recomendable si quieres priorizar velocidad y control sobre el catálogo frente a “siempre en vivo desde Syscom”.
