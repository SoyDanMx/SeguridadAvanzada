# Usar Apify para web scraping de Syscom y Seguridad Avanzada

[Apify](https://apify.com/) es una plataforma de web scraping y automatización. Puedes usarla para extraer datos de [Syscom](https://www.syscom.mx/) y [Seguridad Avanzada](https://www.seguridad-avanzada.com/) sin mantener servidores ni preocuparte por bloqueos (proxies, anti-bot).

**Consola de Apify (Home, runs recientes, Actors sugeridos):**

![Consola de Apify](/images/apify-console-screenshot.png)

## 1. Cuenta y API Token

1. Regístrate en [apify.com](https://apify.com/) (plan gratuito con créditos mensuales).
2. Ve a **Settings → API & Integrations → API** y copia tu token (o usa **Manage tokens** para crear uno).
3. En este proyecto, añade en `.env.local`:
   ```env
   APIFY_TOKEN="apify_api_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   ```

**Configuración de API en Apify (token y referencia):**

![API de Apify - Token y endpoints](/images/apify-api-settings-screenshot.png)

En esa pantalla también tienes el enlace a la **API reference** (documentación completa) y ejemplos como *Get public user data* y *Get private user data*. **No compartas las URLs que incluyen tu token** con terceros.

## 2. Dos formas de scrapear

### Opción A: E-commerce Scraping Tool (productos y precios)

Ideal para **productos, precios, categorías** en tiendas.

- **Actor:** [apify/e-commerce-scraping-tool](https://apify.com/apify/e-commerce-scraping-tool)
- **Input:** URLs de **página de categoría** o de **producto**.
- **Output:** nombre, precio, URL, imagen, SKU, etc.

**Desde la consola de Apify:**

1. Ve a [E-commerce Scraping Tool](https://console.apify.com/actors/2APbAvDfNDOWXbkWf).
2. En **Start URLs** (o Product/Category URLs según el input del Actor) añade, por ejemplo:
   - `https://www.syscom.mx/` (o una URL de categoría como `https://www.syscom.mx/categories/476`)
   - `https://www.seguridad-avanzada.com/` (o `https://www.seguridad-avanzada.com/productos/`)
3. Ajusta **Max pages** o límites si quieres.
4. Pulsa **Start** y luego revisa el **Dataset** en la pestaña Output.

**Desde API (curl):**

```bash
curl -X POST "https://api.apify.com/v2/acts/apify~e-commerce-scraping-tool/runs?token=TU_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startUrls": [
      { "url": "https://www.syscom.mx/" },
      { "url": "https://www.seguridad-avanzada.com/" }
    ],
    "maxRequestsPerCrawl": 50
  }'
```

La respuesta incluye `id` del run. Luego obtienes el dataset con:

```bash
# Reemplaza RUN_ID por el id del run anterior
curl "https://api.apify.com/v2/actor-runs/RUN_ID/dataset/items?token=TU_APIFY_TOKEN"
```

### Opción B: Website Content Crawler (contenido en texto/Markdown)

Ideal para **todo el contenido** de las páginas (texto, estructura) para IA, RAG o análisis.

- **Actor:** [apify/website-content-crawler](https://apify.com/apify/website-content-crawler)
- **Input:** **Start URLs** (página principal o secciones).
- **Output:** por cada URL: `text`, `markdown`, `metadata` (title, description, etc.).

**Desde la consola de Apify:**

1. Ve a [Website Content Crawler](https://console.apify.com/actors/aYG0l9s7dbB7j3gbS).
2. En **Start URLs** añade:
   - `https://www.syscom.mx/`
   - `https://www.seguridad-avanzada.com/`
3. Opcional: **Max crawl pages** (ej. 100).
4. **Start** y revisa el Dataset.

**Desde API (curl):**

```bash
curl -X POST "https://api.apify.com/v2/acts/apify~website-content-crawler/runs?token=TU_APIFY_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "startUrls": [
      { "url": "https://www.syscom.mx/" },
      { "url": "https://www.seguridad-avanzada.com/" }
    ],
    "maxCrawlPages": 50
  }'
```

## 3. Uso desde este proyecto

Puedes lanzar un scrape desde la app con `GET` o `POST` a:

- **GET /api/apify-scrape?actor=ecommerce** – Ejecuta E-commerce Scraping Tool con las URLs de Syscom y Seguridad Avanzada (requiere `APIFY_TOKEN`).
- **GET /api/apify-scrape?actor=website** – Ejecuta Website Content Crawler con las mismas URLs.

El endpoint inicia el run en Apify y, cuando termina, devuelve los items del dataset (o un resumen). Ver código en `app/api/apify-scrape/route.ts`.

## 4. Dónde encontrar el data sheet (datos scrapeados)

Cuando un run termina (por ejemplo del E-commerce Scraping Tool), el **data sheet** es el dataset de resultados. Lo encuentras así:

![Output del E-commerce Scraping Tool en Apify](/images/apify-ecommerce-output-screenshot.png)

1. **Pestaña Output** — En la página del run, abre la pestaña **Output**. Ahí ves la tabla con **Product Details** (URL, Name, Image, Offers, Brand, Description).
2. **Botón Export** — Arriba a la derecha, el botón azul **Export** permite descargar todo el dataset en **JSON, CSV, Excel o XML**. Ese archivo es tu data sheet descargable.
3. **Vista JSON** — Encima de la tabla hay **Table** y **JSON**; en **JSON** ves la estructura cruda de los datos.
4. **Otras pestañas del Output** — **Product Reviews**, **Seller Info**, **All fields**, etc., tienen más datos si el Actor los extrajo.

### Estructura del output (E-commerce Scraping Tool)

Cada item del dataset tiene esta forma (ejemplo con Syscom y Seguridad Avanzada):

| Campo | Tipo | Ejemplo |
|-------|------|--------|
| `url` | string | `https://www.seguridad-avanzada.com/` |
| `name` | string | `KIT de CCTV TurboHD 1080p de 4 camaras` |
| `image` | string \| null | URL de imagen o `null` |
| `offers.price` | string \| null | `"4500.0"` |
| `offers.priceCurrency` | string \| null | `"MXN"` |
| `brand.slogan` | string \| null | `"HiLook by HIKVISION"` |
| `description` | string | Descripción corta |
| `additionalProperties.sku` | string | `"HL24LQKITS-M/1TB"` |
| `additionalProperties.currencyRaw` | string | `"MXN"` |

Ejemplo completo en el repo: **[docs/samples/apify-ecommerce-output-sample.json](samples/apify-ecommerce-output-sample.json)**.

### Obtener items por API (URL del dataset)

Puedes leer el data sheet directamente desde la API de Apify con la URL del dataset:

```
https://api.apify.com/v2/datasets/{datasetId}/items?format=json&view=details&clean=true
```

- **`{datasetId}`** — Lo ves en la página del run (Output) o en la respuesta al lanzar el Actor (p. ej. `jydUlXkeacOhExzF5`).
- **`format=json`** — Devuelve JSON.
- **`view=details`** — Vista con todos los campos.
- **`clean=true`** — Excluye metadatos internos.

Si el dataset es **privado**, añade tu token:  
`https://api.apify.com/v2/datasets/{datasetId}/items?format=json&view=details&clean=true&token=TU_APIFY_TOKEN`

**Ejemplo (dataset de E-commerce Scraping Tool):**  
[api.apify.com/v2/datasets/jydUlXkeacOhExzF5/items?format=json&view=details&clean=true](https://api.apify.com/v2/datasets/jydUlXkeacOhExzF5/items?format=json&view=details&clean=true)

Desde este proyecto puedes usar **GET /api/apify-dataset?dataset=ID** (con `APIFY_TOKEN` en `.env.local`) para obtener los items sin exponer el token en el cliente.

## 5. Referencias

- [Apify Store – E-commerce](https://apify.com/store/categories/ecommerce)
- [E-commerce Scraping Tool – API](https://apify.com/apify/e-commerce-scraping-tool/api)
- [Website Content Crawler – API](https://apify.com/apify/website-content-crawler/api)
- [Apify API Reference](https://docs.apify.com/api/v2)
