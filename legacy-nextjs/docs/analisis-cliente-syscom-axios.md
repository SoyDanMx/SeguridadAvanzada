# Análisis: cliente Syscom con Axios (alternativo)

Comparación del cliente de API Syscom basado en **axios** con el cliente actual de este repo (`lib/syscom-client.ts`, que usa `https` + `fetch`/`httpsRequest`).

---

## 1. Resumen del cliente Axios

- **Token:** OAuth2 `client_credentials` en `/oauth/token`, con caché y margen de 1 hora.
- **Productos:** `searchSyscomProducts(query, filters)` usa el parámetro **`busqueda`** (no `q`).
- **Filtros:** `categoria`, `marca`, `precio_min`, `precio_max`, `pagina`, `por_pagina`.
- **Endpoints extra:** `getSyscomProduct(id)`, `getSyscomCategories()`, `getSyscomBrands()`, `searchThermalCameras()`.
- **Rate limit:** Constantes `RATE_LIMIT` y `RATE_WINDOW` definidas pero **no usadas** (no hay throttling real).

---

## 2. Diferencias con `lib/syscom-client.ts` (este repo)

| Aspecto | Cliente Axios (alternativo) | Cliente actual (SeguridadAvanzadaShop) |
|--------|-----------------------------|----------------------------------------|
| HTTP | axios | `https.request` + agente con `rejectUnauthorized: false` |
| Búsqueda | `busqueda` | `q` |
| SSL | Por defecto (verifica cert) | Bypass con `rejectUnauthorized: false` |
| Credenciales | `process.env` directo | `stripEnvValue()` (quita `\r`, `\n`, comillas) |
| Cliente autenticado | Nueva instancia axios por llamada | Mismo token en caché; una petición por request |
| Timeout | No definido en el snippet | 20 s en `httpsRequest` |
| Tipos | `SyscomProduct` con `precio` objeto detallado, `existencia`, `imagenes[]` | `SyscomProduct` más genérico con `precio` número u objeto |
| Rate limit | Constantes sin uso | Cache de respuestas 1 min para productos |

---

## 3. Puntos a corregir o verificar en el cliente Axios

### 3.1 Parámetro de búsqueda: `busqueda` vs `q`

El cliente Axios usa:

```ts
params.append('busqueda', query); // comentario: "Syscom usa 'busqueda' no 'q'"
```

En este repo la documentación y el cliente usan **`q`** para búsqueda en `/api/v1/productos`. Conviene **confirmar en la documentación oficial de Syscom** el nombre del parámetro. Si la API acepta ambos, no hay conflicto; si solo acepta uno, el otro cliente fallará en búsquedas.

### 3.2 SSL / certificado

Axios, por defecto, **verifica el certificado**. Si en tu entorno Syscom responde con certificado expirado o no confiable, las peticiones pueden fallar con `ECONNREFUSED` o error SSL. En ese caso habría que usar un agente con `rejectUnauthorized: false` (como en el cliente actual) o configurar axios con `httpsAgent`:

```ts
import https from 'https';
const agent = new https.Agent({ rejectUnauthorized: false });
// En cada petición axios: httpsAgent: agent
```

### 3.3 Credenciales: limpiar env

No se hace limpieza de `SYSCOM_CLIENT_ID` y `SYSCOM_CLIENT_SECRET`. Si en `.env` hay comillas o saltos de línea, puede dar 401. Recomendable usar una función tipo `stripEnvValue` como en `lib/syscom-client.ts` antes de enviar al OAuth.

### 3.4 Token y creación del cliente

`createAuthenticatedClient()` crea una **nueva** instancia de axios en cada llamada a `searchSyscomProducts`, `getSyscomProduct`, etc. El token se obtiene una vez (con caché), pero si entre `getAccessToken()` y el `client.get()` pasara mucho tiempo o el token expirara, la petición iría con token vencido. Opciones: reutilizar una sola instancia y refrescar el token cuando falle con 401, o interceptar 401 en axios y reintentar con token nuevo.

### 3.5 Rate limit no implementado

`RATE_LIMIT` y `RATE_WINDOW` no se usan. Si se hacen muchas llamadas seguidas se puede superar el límite de 60 req/min. Opciones: cola con delay entre peticiones o, como en este repo, cachear respuestas (p. ej. productos por categoría/página) para reducir llamadas.

### 3.6 Envío del body en POST del token

Se usa `params.toString()` como body y `Content-Type: application/x-www-form-urlencoded`, que es correcto. Asegurarse de no enviar el body como JSON.

---

## 4. Ventajas del cliente Axios

- **Tipos más ricos:** `SyscomProduct` con `precio` tipado como objeto (`precio_lista`, `precio_especial`, `precio_descuento`) o número, `existencia`, `imagenes` con `orden` y `url`, `categoria` como array. Útil para tipar bien en el resto del código.
- **Endpoints adicionales:** categorías, marcas y producto por ID; en este repo solo está el flujo token + productos paginados.
- **searchThermalCameras:** búsqueda por varios términos y deduplicado por `producto_id`; buena idea si la API no tiene un filtro específico para termográficas.
- **Mantenibilidad:** axios suele ser más cómodo para timeouts, interceptors y manejo de errores que el uso directo de `https.request`.

---

## 5. Viabilidad en SeguridadAvanzadaShop

- **Sustituir** el cliente actual por este tal cual no es recomendable sin:
  - Confirmar si la API usa `q` o `busqueda` (y unificar).
  - Añadir bypass SSL si en tu entorno Syscom tiene problemas de certificado.
  - Limpiar credenciales de env.
  - Decidir si se quiere reintento/refresh de token en 401.
- **Reutilizar solo partes** sí tiene sentido:
  - Tipos `SyscomProduct` y `SyscomSearchResponse` para alinear con la API real (y con lo que ya hay en `lib/syscom-client.ts`).
  - Lógica de `searchThermalCameras` (múltiples términos + deduplicado) se podría aplicar en una ruta o función que use el cliente actual con `q` y luego deduplique.
  - Endpoints `/categorias` y `/marcas` se podrían añadir al cliente actual si la documentación de Syscom los expone y los necesitas.

---

## 6. Recomendación

1. **Confirmar en developers.syscom.mx** el nombre del parámetro de búsqueda (`q` vs `busqueda`) y el resto de query params de `/productos`.
2. Si usas el cliente Axios en otro proyecto: añadir limpieza de env, opción de `rejectUnauthorized: false` si hay fallos SSL, y uso real del rate limit o cache.
3. En SeguridadAvanzadaShop: mantener el cliente actual para token y productos; si quieres, incorporar los tipos más detallados del cliente Axios y/o una función tipo `searchThermalCameras` que llame a `getProducts({ search: term })` varias veces y deduplique por `producto_id`.
