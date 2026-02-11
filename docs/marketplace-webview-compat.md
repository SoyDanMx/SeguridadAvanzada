# Compatibilidad con Marketplace en WebView (estilo Sumee)

## Cómo funciona el marketplace en el otro proyecto (Sumee app)

En la app React Native / Expo **no se llama a la API de Syscom desde el cliente**. El flujo es:

1. **Pantalla nativa**: `MarketplaceScreen` muestra un **WebView**.
2. **URL cargada**: `https://sumeeapp.com/marketplace` (sitio web externo).
3. **Parámetros en la URL**:
   - Listado: `?category=...` y/o `?search=...`
   - Detalle de producto: `/marketplace/product/{productId}`
4. **Quién renderiza Syscom**: El **sitio web** (sumeeapp.com) es el que consume la API de Syscom (o su backend) y pinta el catálogo. La app solo embebe esa web.

Resumen: **el catálogo se renderiza en la web; la app solo muestra esa URL en un WebView** (con header, loading, refresh, “abrir en navegador”).

## Cómo está hecho SeguridadAvanzadaShop

Aquí el catálogo **sí se renderiza en esta app** (Next.js):

- **Listado**: `/productos?q=...&category=...&page=...`
- **Detalle**: `/productos/[sku]`
- Los datos vienen de nuestra API interna `/api/products`, que usa el cliente Syscom.

Para que una app tipo Sumee pueda abrir **este** proyecto en un WebView (en lugar de sumeeapp.com), la URL debe ser la de este sitio desplegado, p. ej.:

- Listado: `https://tu-dominio.com/productos?search=...&category=...`
- Detalle: `https://tu-dominio.com/productos/{sku}`

En este proyecto se acepta **`search`** como alias de **`q`** para alinear con el otro proyecto.

## Contrato de URL (compatible con WebView)

| Uso        | Sumee (ejemplo)                    | SeguridadAvanzadaShop              |
|-----------|-------------------------------------|-------------------------------------|
| Base      | `https://sumeeapp.com/marketplace`  | `https://tu-dominio.com/productos`  |
| Búsqueda  | `?search=...`                       | `?search=...` o `?q=...`            |
| Categoría | `?category=...`                     | `?category=...`                     |
| Detalle   | `/marketplace/product/{productId}`   | `/productos/{sku}`                  |

En ambos, **productId** (Sumee) = **sku** (este proyecto).

## Alineación con el importador Python (Syscom)

En otros proyectos el importador de Syscom (Python) usa:

- **OAuth:** `POST https://developers.syscom.mx/oauth/token` (grant_type, client_id, client_secret).
- **Productos:** `GET https://developers.syscom.mx/api/v1/productos` con query **`pagina`** (no `page`) y **`categoria`**.
- **Respuesta:** `productos[]`, total en **`cantidad`** o **`todo`**, páginas en **`paginas`**.
- **Producto:** `producto_id`, `titulo`, `modelo`, `img_portada`, `imagenes[]`, `precio` (objeto con `precio_lista`, `precio_especial`, `precio_1`).

En este proyecto el cliente Syscom (`lib/syscom-client.ts`) y la ruta `/api/products` están alineados con lo anterior: se envía `pagina`, se lee `cantidad`/`todo` como total y se normaliza precio e imagen al formato del catálogo.
