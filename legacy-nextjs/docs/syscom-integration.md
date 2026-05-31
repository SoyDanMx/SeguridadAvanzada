# Integración con API de Syscom

> **Nota:** En documentos de *otros* marketplaces puede aparecer "No hay integración activa con la API de Syscom" (p. ej. cuando solo hay Truper por CSV o productos manuales). **En este repositorio (SeguridadAvanzadaShop) sí existe integración activa** con la API de Syscom.

---

## Especificaciones de la API Syscom

| Dato | Valor |
|------|--------|
| **URI base** | `https://developers.syscom.mx/api/v1/` |
| **Límite de llamadas** | 60 peticiones por minuto por cliente |
| **Formato de respuesta** | JSON |

El cliente en `lib/syscom-client.ts` usa esta base, cachea el token y cachea respuestas de productos 1 minuto para reducir peticiones y respetar el límite.

---

## 1. Obtener token de acceso

Con las credenciales (`client_id`, `client_secret`) se obtiene un token con un **POST** a:

**URL:** `https://developers.syscom.mx/oauth/token`

**Cabecera:** `Content-Type: application/x-www-form-urlencoded`

**Cuerpo:** `client_id=ID_CLIENTE&client_secret=SECRETO_CLIENTE&grant_type=client_credentials`

Ejemplo con curl:

```bash
curl --request POST --url https://developers.syscom.mx/oauth/token \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data 'client_id=ID_CLIENTE&client_secret=SECRETO_CLIENTE&grant_type=client_credentials'
```

**Respuesta (JSON):** tipo de token, token y tiempo de expiración. Por defecto los tokens tienen vigencia de **365 días** (31 536 000 segundos).

```json
{
  "token_type": "Bearer",
  "expires_in": 31536000,
  "access_token": "VALOR_DEL_TOKEN"
}
```

En este proyecto, `lib/syscom-client.ts` hace esta petición, guarda `access_token` y `expires_in`, y reutiliza el token hasta cerca del vencimiento.

---

## 2. Solicitar un recurso

Una vez obtenido el token, se debe enviar en **todas** las peticiones a la API en la cabecera:

**Cabecera:** `Authorization: Bearer VALOR_DEL_TOKEN`

Ejemplo con curl (por ejemplo, recurso de productos):

```bash
curl "https://developers.syscom.mx/api/v1/productos" \
  -H "Authorization: Bearer VALOR_DEL_TOKEN"
```

En este proyecto, `getProducts()` y el resto de llamadas a `/api/v1/*` usan `Authorization: Bearer <cachedToken>`.

---

## Estado actual

**✅ Hay integración activa con la API de Syscom**

Este proyecto consume la API de Syscom para el catálogo:

- **OAuth:** `POST https://developers.syscom.mx/oauth/token` (token en caché).
- **Productos:** `GET https://developers.syscom.mx/api/v1/productos` con `categoria`, `busqueda`, `pagina` (ítems por página, 10-60), `page` (número de página).
- **Catálogo en la app:** `/productos` y `/productos/[sku]` (precios con margen, imágenes, SKU).

Credenciales en `.env.local`: `SYSCOM_CLIENT_ID`, `SYSCOM_CLIENT_SECRET`. Documentación: [developers.syscom.mx](https://developers.syscom.mx/docs).

### Si la API no responde (local o producción)

- **No es por falta de certificado SSL en tu servidor.** La petición es *tu servidor → Syscom*; quien tiene certificado es Syscom. El cliente usa `rejectUnauthorized: false` para aceptar el certificado de Syscom.
- **Diagnóstico:** abre `GET /api/syscom-status`. Si falla en "token", la respuesta indica si las variables están definidas y da una pista de corrección.

### 401 "invalid_client" o "Client authentication failed"

Significa que **Syscom está rechazando** el Client ID o el Client Secret. Revisa lo siguiente:

1. **Origen de las credenciales**  
   Deben ser las de **OAuth2 / API** del portal de desarrolladores de Syscom (no usuario/contraseña del sitio web). Entra a [developers.syscom.mx](https://developers.syscom.mx), busca la sección de aplicaciones o clientes API y copia el **Client ID** y el **Client Secret** (a veces el secret solo se muestra una vez al crear el cliente).

2. **Formato de `.env.local`** (en la raíz del proyecto, mismo nivel que `package.json`):
   ```env
   SYSCOM_CLIENT_ID=pega_aqui_el_client_id_sin_espacios
   SYSCOM_CLIENT_SECRET=pega_aqui_el_client_secret_sin_espacios
   ```
   - Sin espacios antes o después del `=`.
   - Sin comillas a menos que el valor las incluya; si usas comillas, que sean normales: `"valor"`.
   - Una sola línea por variable (no partir el valor en varias líneas).
   - Si copiaste desde un correo o web, asegúrate de no haber pegado un salto de línea dentro del valor.

3. **Si usas Vercel** (variables en Project → Settings → Environment Variables):
   - Pega el valor **directamente**, sin espacios al inicio o final.
   - No uses comillas al definir el valor en Vercel (el campo ya es "valor", no "valor con comillas").
   - Tras guardar, haz **Redeploy** (las variables solo aplican en nuevos deployments).
   - Prueba con curl local usando las mismas credenciales; si curl funciona y Vercel no, suele ser formato/copia en el dashboard.

4. **Reiniciar el servidor** (local)  
   Next.js lee `.env.local` al arrancar. Después de cualquier cambio: guarda el archivo, detén el servidor (Ctrl+C) y ejecuta de nuevo `npm run dev`.

5. **Probar las credenciales con curl** (sustituye los valores reales):
   ```bash
   curl -X POST "https://developers.syscom.mx/oauth/token" \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "client_id=TU_CLIENT_ID&client_secret=TU_CLIENT_SECRET&grant_type=client_credentials"
   ```
   - Si la respuesta trae `"access_token": "..."` → las credenciales son correctas; el fallo puede ser de entorno (por ejemplo, que Next no esté leyendo el `.env.local` que editaste, o formato en Vercel).
   - Si la respuesta es `{"error":"invalid_client",...}` → Syscom no acepta ese Client ID o Secret: vuelve al portal de Syscom, verifica que estés usando las credenciales de la API y que el cliente esté activo.

6. **Diagnóstico:** visita `GET /api/syscom-status` en tu app (local o Vercel) para ver si las variables están definidas y el paso en el que falla.

---

## Cómo buscar en el catálogo (incl. termográficas)

### En la web

1. **Búsqueda por texto:**  
   `/productos?q=termografica` o usar el buscador del header (lleva a `/productos?q=...`).

2. **Por categoría:**  
   `/productos?category=ID_CATEGORIA`.  
   Los IDs de categoría son los que devuelve la API de Syscom (ej. en el script Python: `22` Videovigilancia, `26` Redes e IT, `30` Energía/Herramientas).

3. **Combinado:**  
   `/productos?q=termografica&category=22&page=1`

### Por API (desde otro servicio o script)

```bash
# Listado (búsqueda "termografica")
curl "http://localhost:3000/api/products?q=termografica&limit=24"

# Por categoría (ej. 22 = Videovigilancia)
curl "http://localhost:3000/api/products?category=22&page=1&limit=24"
```

Respuesta: `{ "products": [...], "total": N }`. Cada producto incluye `sku`, `descripcion`, `precioConMargenMxn`, `imagen`, `producto_id`, etc.

---

## Si las cámaras termográficas no aparecen

### 1. Comprobar en Syscom web

- Búsqueda: [syscom.mx/search?q=termografica](https://www.syscom.mx/search?q=termografica)
- Revisar categorías: Seguridad y CCTV, Cámaras, Monitoreo, etc.

Si no hay resultados en la web, tampoco los habrá vía API.

### 2. Probar categorías en la API

La API filtra por **ID de categoría** (número). En otros proyectos se usan por ejemplo:

| ID | Nombre           |
|----|------------------|
| 22 | Videovigilancia  |
| 26 | Redes e IT       |
| 30 | Energía / Herramientas |

Probar en la app: `/productos?category=22` y luego buscar en esa página o con `q=termografica`.

### 3. Contactar a Syscom

Si en la web sí hay termográficas pero no aparecen vía API:

- **Email:** soporte@syscom.mx  
- **Teléfono:** +52 55 5000 1000  
- **Web:** https://www.syscom.mx  

Preguntas útiles: categoría o filtros para termográficas en API, si hace falta permiso o credenciales adicionales para ciertos productos.

### 4. Productos manuales o CSV

Para productos que no estén en API:

- Añadirlos manualmente en tu flujo (dashboard, CSV, etc.) y vincular con `external_code` o `sku` de Syscom si lo tengas.
- O usar importación CSV si Syscom te proporciona un export (similar a otros proveedores).

---

## Estructura de datos (catálogo de este proyecto)

### Respuesta de `/api/products`

Cada elemento de `products` tiene forma compatible con el front:

- `sku` – SKU o modelo (normalizado desde `modelo`/`sku` de Syscom).
- `descripcion` – Texto (desde `titulo`/`descripcion`).
- `precioOriginal` – Precio costo (número).
- `precioConMargenMxn` – Precio venta en MXN con margen (PROFIT_MARGIN).
- `imagen` – URL (desde `img_portada` o primer elemento de `imagenes`).
- `producto_id` – ID en Syscom.
- `categoria` – Categoría devuelta por Syscom.

### Variables de negocio (`.env.local`)

- `PROFIT_MARGIN` – Margen (ej. `1.30` = 30%).
- `EXCHANGE_RATE_USD_MXN` – Tipo de cambio para precios en USD.

---

## Scripts y referencias en este repo

- **Cliente Syscom:** `lib/syscom-client.ts` (token, `getProducts`, parámetros `pagina`/`categoria`/`q`).
- **Ruta API:** `app/api/products/route.ts` (normalización de precio e imagen, margen).
- **Páginas:** `app/productos/page.tsx` (listado), `app/productos/[sku]/page.tsx` (detalle).
- **Compatibilidad WebView / importador Python:** [marketplace-webview-compat.md](marketplace-webview-compat.md).
- **Scraping (Apify):** [apify-scraping.md](apify-scraping.md) (alternativa si se necesita datos del sitio web).

---

## Resumen de próximos pasos (termográficas)

1. Probar en la app: `/productos?q=termografica` y `/productos?category=22`.
2. Verificar en [syscom.mx](https://www.syscom.mx) si existen productos de termográficas.
3. Si en web hay y en API no: contactar a Syscom (categoría/filtros/permisos).
4. Si no hay en Syscom: valorar productos manuales, CSV o otros proveedores.

---

## Diferencias con otros marketplaces

En otros proyectos puede aparecer:

- **"No hay integración activa con la API de Syscom"** — aplica a marketplaces que solo usan Truper (CSV), productos manuales o scraping, no a este repo.
- **Scripts como `search_thermal_cameras.py`** — pertenecen a ese otro proyecto (p. ej. con Supabase y tabla `marketplace_products`). Aquí la búsqueda se hace en la web (`/productos?q=termografica`) o vía `GET /api/products?q=termografica`.
- **Estructura `marketplace_products` (external_code, sku, title…)** — es de otra base de datos. En SeguridadAvanzadaShop el catálogo se sirve en vivo desde la API de Syscom (y opcional margen/precios en `/api/products`), sin tabla propia de productos Syscom.

## Contacto Syscom (referencia)

| Canal   | Dato |
|--------|------|
| Email  | soporte@syscom.mx |
| Teléfono | +52 55 5000 1000 |
| Web    | https://www.syscom.mx |

**Preguntas útiles para soporte:** API disponible, categoría/filtros para termográficas, credenciales o permisos adicionales para ciertos productos.

---

## Análisis del script Python de videovigilancia (otro proyecto)

Un script como el que consulta **productos de videovigilancia** en Supabase hace lo siguiente:

| Paso | Qué hace |
|------|----------|
| 1 | Carga `.env.local` y usa `NEXT_PUBLIC_SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY`. |
| 2 | Busca la categoría "Videovigilancia" en `marketplace_categories`. |
| 3 | En `marketplace_products` cuenta: total, activos, con precio > 0, con precio = 0, con `external_code` (Syscom), resto (Truper/otros). |
| 4 | Muestra ejemplos (título, precio, external_code, imágenes) y un análisis (visibles vs ocultos por precio 0). |
| 5 | Sugiere ejecutar `quick_update_prices.py` para actualizar precios desde Syscom. |

**Ese script es de otro proyecto:** usa **Supabase**, tablas `marketplace_categories` y `marketplace_products`, y asume productos ya importados (Syscom vía external_code, Truper, etc.). **SeguridadAvanzadaShop no usa Supabase** ni esas tablas; el catálogo se sirve en vivo desde la API de Syscom.

### Equivalente en SeguridadAvanzadaShop (videovigilancia)

Para ver productos de videovigilancia aquí no hace falta script: la API de Syscom se consulta en tiempo real.

- **En la app:** [http://localhost:3000/productos?category=22](http://localhost:3000/productos?category=22) (22 = Videovigilancia en Syscom).
- **Por API:**  
  `curl "http://localhost:3000/api/products?category=22&limit=50"`  
  La respuesta trae `products` y `total`; cada producto tiene `sku`, `descripcion`, `precioConMargenMxn`, `imagen`, etc.

Si quisieras un “script de verificación” en este repo, podría ser un pequeño script (Node o curl) que llame a `GET /api/products?category=22` y muestre total y unos ejemplos; no hay base de datos local de productos que auditar.
