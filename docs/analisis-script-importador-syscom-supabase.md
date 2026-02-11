# Análisis: script de importación Syscom → Supabase (otro proyecto)

Análisis de viabilidad y correcciones del script Python que importa productos de Syscom a una base Supabase (tabla `marketplace_products`, categoría "sistemas").

---

## 1. Resumen del script

| Aspecto | Detalle |
|---------|---------|
| **Entrada** | API Syscom (categorías 22, 26, 30: Videovigilancia, Redes e IT, Energía/Herramientas). |
| **Salida** | Inserciones en Supabase: tabla `marketplace_products`, categoría con `slug = 'sistemas'`. |
| **Env** | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SYSCOM_CLIENT_ID`, `SYSCOM_CLIENT_SECRET` (desde `.env.local`). |
| **Rate limit** | ~1.1 s entre peticiones (respetando 60/min de Syscom). |
| **Modos** | Dry-run por defecto; `--execute` para escribir en BD. |

---

## 2. Puntos fuertes

- **Token:** Uso correcto de OAuth2 (POST form-urlencoded, cache con margen 1 h).
- **Paginación:** Obtiene todas las páginas por categoría (`todo`/`cantidad`, `paginas`).
- **Reintentos:** Timeouts y errores de conexión con reintentos (3–5) y backoff.
- **Precio:** Soporta precio como objeto (`precio_lista`, `precio_especial`, `precio_1`) y número; omite productos sin precio válido.
- **Duplicados:** Evita reimportar por `external_code` (producto_id Syscom) y por SKU (normalizado a mayúsculas).
- **Batch insert:** Inserciones de 50 en 50 en Supabase; si falla el lote, reintento y luego inserción uno a uno.
- **IDs de categoría:** 22, 26, 30 alineados con este repo (`lib/categories.ts`).

---

## 3. Errores y mejoras

### 3.1 Bug: `batch_buffer` no inicializado

En `import_products`, dentro del `for` se usa:

```python
if 'batch_buffer' not in locals():
    batch_buffer = []
```

En un bucle, `locals()` puede no comportarse como se espera en todas las ejecuciones. Es más seguro inicializar **antes** del `for`:

```python
batch_buffer = []
for idx, syscom_product in enumerate(products, 1):
    ...
    else:
        batch_buffer.append(marketplace_product)
        if len(batch_buffer) >= 50 or idx == len(products):
            ...
            batch_buffer = []
```

### 3.2 SSL / certificado Syscom

Si en el otro proyecto Syscom responde con certificado inválido o expirado, `requests` puede lanzar `SSLError`. Opción recomendada solo para ese entorno:

```python
response = requests.post(..., verify=False)
# y para GET de productos:
response = requests.get(..., verify=False)
```

Y al inicio del script (como en SeguridadAvanzadaShop):

```python
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
```

### 3.3 Token: unidades de tiempo

`token_expiry` se guarda en **milisegundos** y se compara con `time.time() * 1000`. Correcto. Solo asegurarse de no mezclar después `time.time()` en segundos (por ejemplo, si se añade un refresh en segundos).

### 3.4 Llamada al detalle por producto cuando no hay precio

Cuando `precio` viene vacío en el listado, el script hace un GET a `/productos/{producto_id}` por cada producto. Con muchos productos sin precio esto puede:

- Superar el límite de 60 peticiones/minuto.
- Hacer la importación muy lenta.

Recomendación: limitar a un número máximo de peticiones de detalle por categoría (p. ej. 0 o 100) o desactivar esta lógica por defecto y dejar los productos sin precio como omitidos.

### 3.5 Parámetro `limit` en Syscom

La API de Syscom suele aceptar `limit` (productos por página). Si no se envía, puede usar un default (ej. 60). Para controlar tamaño de página y número de peticiones:

```python
params={"categoria": categoria_id, "pagina": pagina, "limit": 60}
```

(Comprobar en la documentación de Syscom el nombre exacto del parámetro.)

### 3.6 Categoría "sistemas"

El script asume que existe una categoría con `slug = 'sistemas'` en `marketplace_categories`. Si en el otro proyecto la categoría tiene otro slug o no existe, hay que crearla o ajustar el slug/nombre.

---

## 4. Viabilidad en SeguridadAvanzadaShop (este repo)

En **SeguridadAvanzadaShop**:

- **No hay Supabase.** El catálogo se sirve en vivo desde la API de Syscom (`/api/products`, `/productos`).
- No existe la tabla `marketplace_products` ni `marketplace_categories`; por tanto el script **no se puede usar tal cual** en este repo.

Opciones si quieres algo similar aquí:

1. **No usar el script** y seguir con catálogo en vivo desde Syscom (como ahora).
2. **Adaptar la idea** para otro destino:
   - Por ejemplo, un script que lea Syscom (mismas categorías y paginación) y envíe productos a **Tiendanube** usando la API de Tiendanube (como en `scripts/sync_syscom_tiendanube.py`), en lugar de Supabase.
3. **Mantener el script solo en el otro proyecto** (el que sí usa Supabase) y aplicar en ese proyecto las correcciones de la sección 3.

---

## 5. Checklist de correcciones (otro proyecto)

- [ ] Inicializar `batch_buffer = []` antes del `for` en `import_products`.
- [ ] Valorar `verify=False` en `requests` si hay fallos de certificado con Syscom (y desactivar warnings con `urllib3`).
- [ ] Limitar o desactivar las peticiones a `/productos/{id}` cuando falta precio en el listado.
- [ ] Añadir `limit` a los params de productos si la API de Syscom lo soporta.
- [ ] Confirmar que la categoría "sistemas" existe en `marketplace_categories` y que el slug es el correcto.

---

## 6. Conclusión

- El script es **viable y está bien planteado** para un proyecto que use **Supabase** y quiera tener una copia de productos Syscom en `marketplace_products`.
- Con las correcciones anteriores (sobre todo `batch_buffer` y manejo de SSL/reintentos) es adecuado para uso en producción en ese otro proyecto.
- En **SeguridadAvanzadaShop** no es viable tal cual porque no hay Supabase; si se quiere importación masiva aquí, habría que orientarla a otro destino (p. ej. Tiendanube) o seguir con el catálogo en vivo desde Syscom.
