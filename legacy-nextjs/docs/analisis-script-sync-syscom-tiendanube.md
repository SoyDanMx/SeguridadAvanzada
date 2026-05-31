# Análisis del script Python: Sync Syscom → Tiendanube

Documento de revisión del script de sincronización Syscom–Tiendanube (SeguridadAvanzadaSync).

---

## 1. Resumen del script

- **Autenticación Syscom:** OAuth2 `client_credentials` en `developers.syscom.mx/oauth/token`.
- **Productos Syscom:** GET `developers.syscom.mx/api/v1/productos` con `categoria` opcional.
- **Mapeo a Tiendanube:** Precio con margen 30% y tipo de cambio fijo 18.50; payload con `name`, `description`, `variants`, `images`.
- **Estado:** No hace POST real a Tiendanube; solo imprime “Preparado para subir”.

---

## 2. Seguridad

### 2.1 Credenciales en el código (crítico)

```python
self.syscom_client_id = "ls9DalDKEvdaC2IYbZhTUHsHBWUR----"
self.syscom_client_secret = "gk2EwVDpu4Bo9Suzn6ipqgV0MkkggBsKwxsv----"
self.tn_access_token = "shpat_TU_TOKEN_AQUI"
```

- **Riesgo:** Cualquier copia del script o commit en Git expone client_id, client_secret y token.
- **Recomendación:** Usar variables de entorno (p. ej. `os.environ.get("SYSCOM_CLIENT_ID")`) y un `.env` que no se suba al repo (ya tienes `.env.local` en el proyecto Next.js).

### 2.2 Bypass SSL (`verify=False`)

- **Qué hace:** Desactiva la verificación del certificado HTTPS (útil si Syscom tiene cert expirado o no confiable).
- **Riesgo:** Exposición a ataques man-in-the-middle en redes no confiables.
- **Contexto:** En este proyecto, `lib/syscom-client.ts` también usa `rejectUnauthorized: false` por compatibilidad con Syscom. Si en producción Syscom usa un certificado válido, conviene quitar el bypass.

---

## 3. API Syscom

### 3.1 Formato de respuesta de productos

La API de Syscom puede devolver el precio de dos formas (alineado con `lib/syscom-client.ts` y `app/api/products/route.ts`):

- **Número:** `product["precio"]` es un número.
- **Objeto:** `product["precio"]` es algo como:
  `{ "precio_lista": x, "precio_especial": y, "precio_1": z }`.

En el script:

```python
precio_base = float(product.get('precio_lista', 0))
```

- Si el precio viene dentro de `product["precio"]`, entonces `precio_lista` está en `product["precio"]["precio_lista"]`, no en la raíz. Con eso, `precio_base` quedaría siempre 0 cuando la API envía el objeto.
- **Recomendación:** Extraer el precio de forma unificada, por ejemplo:

```python
def _precio_num(product):
    p = product.get("precio")
    if p is None:
        return 0.0
    if isinstance(p, (int, float)):
        return float(p)
    if isinstance(p, dict):
        return float(p.get("precio_especial") or p.get("precio_1") or p.get("precio_lista") or 0)
    return 0.0
```

Así el script es coherente con el resto del proyecto (donde ya se usa `precio_especial ?? precio_1 ?? precio_lista`).

### 3.2 ID de categoría Videovigilancia

- En el script se usa `category_id=21`.
- En `lib/categories.ts`, Videovigilancia tiene `syscomId: "22"`.
- **Recomendación:** Confirmar en la documentación o en la respuesta de Syscom el ID correcto (21 vs 22) y usar el mismo criterio en Python y en Next (p. ej. 22 si es el oficial).

### 3.3 Paginación

- El script no envía `pagina` ni `limit`. La API de Syscom suele paginar; sin parámetros podrías recibir solo la primera página.
- **Recomendación:** Añadir `params={"categoria": category_id, "pagina": 1, "limit": 100}` (o el límite que permita la API) y, si hace falta, un bucle para varias páginas.

---

## 4. Mapeo a Tiendanube

### 4.1 Estructura del payload

Según la [documentación de Tiendanube (Product)](https://tiendanube.github.io/api-documentation/resources/product):

- **name:** Objeto por idioma, ej. `{"es": "Nombre"}` → correcto en el script.
- **description:** Por idioma; el script usa `{"es": "..."}` → correcto.
- **variants:** Debe incluir al menos `price`; `sku` y `stock` son opcionales pero recomendables. El script los incluye.
- **images:** Array de objetos con `src` (URL). Opcionalmente `position` y `alt`. Si `img_portada` es `None`, no enviar la clave o enviar `[]` para evitar errores.

### 4.2 Precio y moneda

- **Script:** `(precio_base * 1.30) * 18.50` (margen 30% y tipo de cambio fijo).
- **Proyecto Next:** `lib/pricing.ts` usa `EXCHANGE_RATE_USD_MXN` (default 18.5) y `PROFIT_MARGIN` (default 0.3 → 30%). La fórmula es equivalente a: `usd * tipo_cambio * (1 + margen)`.
- **Recomendación:** En el script Python leer tipo de cambio y margen de variables de entorno (p. ej. `EXCHANGE_RATE_USD_MXN`, `PROFIT_MARGIN`) con los mismos valores por defecto que en Next, para que Syscom → Tiendanube y la web muestren los mismos precios.

### 4.3 Stock (`existencia`)

- El script usa `product.get('existencia', 0)`. En la interfaz `SyscomProduct` del proyecto no hay un campo estándar `existencia`; la API podría devolverlo con otro nombre (p. ej. `stock`, `cantidad`).
- **Recomendación:** Revisar una respuesta real de `/productos` de Syscom y usar el nombre de campo correcto, o dejar `stock` en 0 si no existe.

### 4.4 Imagen

- Si `product.get('img_portada')` es `None`, conviene no incluir `"images"` o usar `[]` para no enviar URLs vacías a Tiendanube.
- En el proyecto Next también se usa `img_portada ?? imagen ?? imagenes[0]`; en Python se puede replicar la misma prioridad.

---

## 5. POST real a Tiendanube

El script no llama a la API de Tiendanube. En el proyecto ya existe:

- **Token:** `lib/tiendanube.ts` + `POST /api/tiendanube/token` (intercambio de `code` por `access_token`).
- **Store:** `getStore(storeId)` con `TIENDANUBE_STORE_ID` / `TIENDANUBE_USER_ID` (el `user_id` que devuelve el token).
- **Creación de productos:** La API Tiendanube es `POST https://api.tiendanube.com/v1/{store_id}/products` con header `Authentication: bearer {access_token}`.

Para que el script suba productos:

1. Usar el mismo token y store_id (por env o por archivo de config que no se suba a Git).
2. Por cada producto mapeado, hacer `POST` al endpoint anterior con el payload en JSON.
3. Manejar códigos 4xx/5xx y reintentos/límites de tasa si aplican.

---

## 6. Coherencia con el proyecto Next.js

| Aspecto              | Script Python              | Proyecto Next (referencia)                    |
|----------------------|---------------------------|-----------------------------------------------|
| Credenciales Syscom  | Hardcodeadas              | `SYSCOM_CLIENT_ID`, `SYSCOM_CLIENT_SECRET`     |
| Token Tiendanube     | Hardcodeado               | `TIENDANUBE_ACCESS_TOKEN` (+ token route)     |
| Precio               | `precio_lista` en raíz     | Objeto `precio` con precio_1/precio_especial  |
| Tipo de cambio       | 18.50 fijo                | `EXCHANGE_RATE_USD_MXN` (default 18.5)        |
| Margen               | 30% fijo                  | `PROFIT_MARGIN` (default 0.3)                 |
| Categoría Videovigilancia | 21                    | 22 en `lib/categories.ts`                     |
| Sync real a TN       | No                        | Payload en `POST /api/sync-to-nube` (sin POST a TN) |

---

## 7. Checklist de mejoras recomendadas

- [ ] Mover todas las credenciales y tokens a variables de entorno (y no commitear el `.env`).
- [ ] Extraer precio de Syscom de forma robusta (soportar `precio` numérico y objeto).
- [ ] Usar tipo de cambio y margen desde env (mismos nombres que en Next si es posible).
- [ ] Verificar ID de categoría Videovigilancia (21 vs 22) y unificar.
- [ ] Añadir paginación a `get_products` (pagina, limit y bucle si hace falta).
- [ ] Tratar `img_portada`/imagen nula y no enviar `images` vacías o con `src` vacío.
- [ ] Confirmar nombre del campo de stock en la API Syscom y usarlo en `variants.stock`.
- [ ] Implementar POST a `https://api.tiendanube.com/v1/{store_id}/products` con el payload generado y manejo de errores.
- [ ] (Opcional) Quitar `verify=False` cuando Syscom tenga certificado válido en el entorno que uses.

Si quieres, el siguiente paso puede ser proponer una versión refactorizada del script (por ejemplo `scripts/sync_syscom_tiendanube.py`) usando env y alineada con este análisis y con el proyecto Next.
