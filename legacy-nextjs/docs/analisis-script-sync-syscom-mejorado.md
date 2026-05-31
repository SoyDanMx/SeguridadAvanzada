# Análisis: script mejorado de sincronización Syscom → Supabase

Revisión del script que sincroniza productos de la API de Syscom a Supabase (marketplace_products con categoría "sistemas" y subcategorías).

---

## 1. Resumen

- **Origen:** API Syscom por categoría (IDs en `SYSCOM_MAP`).
- **Destino:** Supabase `marketplace_products` con `category_id` = "sistemas" y `subcategory_id` según slug.
- **Lógica:** Por cada producto, si existe por `external_code` → UPDATE (precio, imágenes, etc.); si no → INSERT. Rate limit ~1.1 s entre páginas.

---

## 2. Bugs críticos

### 2.1 Campo de precio: `precios` vs `precio`

La API de Syscom devuelve el precio en el campo **`precio`** (singular), no `precios`. Puede ser un número o un objeto `{ precio_lista, precio_especial, precio_1, precio_descuento }`.

**En el script actual:**
```python
precios = p.get('precios', {})  # ❌ Siempre {} en respuesta real
if isinstance(precios, dict):
    precio_lista = precios.get('precio_lista')
    precio_especial = precios.get('precio_especial') or precios.get('precio_descuento')
```

Con esto, **nunca** se lee el precio real y todos los productos quedan con `price = 0` u omitidos.

**Corrección:** Usar `precio` y soportar objeto y número, como en el otro importador:

```python
precio_data = p.get('precio')  # ✅ Campo correcto
precio_lista = None
precio_especial = None

if precio_data is None:
    price = 0
elif isinstance(precio_data, dict):
    precio_lista = precio_data.get('precio_lista')
    precio_especial = precio_data.get('precio_especial') or precio_data.get('precio_1') or precio_data.get('precio_descuento')
    if precio_especial and float(precio_especial) > 0:
        price = float(precio_especial)
    elif precio_lista and float(precio_lista) > 0:
        price = float(precio_lista)
    else:
        price = 0
elif isinstance(precio_data, (int, float)):
    price = float(precio_data)
    precio_lista = price
else:
    price = 0
```

---

### 2.2 Argumento `--category` no tiene efecto

En `main()` se filtra el mapeo cuando se pasa `--category`:

```python
syscom_map = SYSCOM_MAP
if args.category:
    if args.category in SYSCOM_MAP:
        syscom_map = {args.category: SYSCOM_MAP[args.category]}
    ...
sync_products(token, sistemas_uuid, subcat_map, seller_id, max_pages=args.max_pages)
```

Pero **`sync_products` no recibe `syscom_map`**: en su interior itera sobre el **global** `SYSCOM_MAP`:

```python
def sync_products(token, sistemas_uuid, subcat_map, seller_id, max_pages=100):
    ...
    for syscom_id, sumee_slug in SYSCOM_MAP.items():  # ❌ Siempre todas las categorías
```

Por tanto, `--category` no limita nada.

**Corrección:** Pasar el mapeo a usar como argumento y iterar sobre él:

```python
def sync_products(token, sistemas_uuid, subcat_map, seller_id, max_pages=100, category_map=None):
    category_map = category_map or SYSCOM_MAP
    ...
    for syscom_id, sumee_slug in category_map.items():
```

Y en `main()`:

```python
sync_products(token, sistemas_uuid, subcat_map, seller_id, max_pages=args.max_pages, category_map=syscom_map)
```

---

### 2.3 `res` no definido si `requests.post` lanza

En `get_access_token()`:

```python
try:
    res = requests.post(...)
    res.raise_for_status()
    ...
except Exception as e:
    print(f"❌ Auth failed: {e}")
    if res:  # ❌ NameError si la excepción fue en requests.post (res no existe)
        print(res.text)
    sys.exit(1)
```

Si la excepción ocurre **antes** de asignar `res` (p. ej. timeout o error de red), `res` no está definido y se produce un `NameError`.

**Corrección:**

```python
except Exception as e:
    print(f"❌ Auth failed: {e}")
    if 'res' in dir() and res is not None:
        print(res.text)
    sys.exit(1)
```

O mejor, capturar la respuesta dentro del `try` y usarla en el `except` solo si existe, o usar `requests.exceptions.RequestException` y comprobar si la excepción tiene `.response` (por ejemplo `getattr(e, 'response', None)` y si tiene, imprimir su texto).

---

## 3. Mejoras recomendadas

### 3.1 Credenciales: limpiar espacios y saltos de línea

Como en SeguridadAvanzadaShop, conviene limpiar valores de env para evitar 401 por caracteres invisibles:

```python
def _clean_env(v):
    if v is None:
        return ""
    s = str(v).replace("\r", "").replace("\n", "").strip()
    if (s.startswith('"') and s.endswith('"')) or (s.startswith("'") and s.endswith("'")):
        s = s[1:-1].strip()
    return s

SYSCOM_CLIENT_ID = _clean_env(os.getenv("SYSCOM_CLIENT_ID")) or os.getenv("SYSCOM_CLIENT_ID")
SYSCOM_CLIENT_SECRET = _clean_env(os.getenv("SYSCOM_CLIENT_SECRET")) or os.getenv("SYSCOM_CLIENT_SECRET")
```

(Usar el valor limpio si no está vacío.)

### 3.2 SSL cuando Syscom tenga certificado problemático

Si en el otro proyecto aparece error de certificado al llamar a Syscom:

```python
res = requests.post(TOKEN_URL, data=data, ..., verify=False)
res = requests.get(url, ..., verify=False)
```

Y al inicio:

```python
import urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
```

### 3.3 Condición de actualización (UPDATE)

Actualmente:

```python
if existing.data.get('price', 0) != price or price > 0:
    supabase.table(...).update(...)
    total_updated += 1
else:
    total_skipped += 1
```

Se actualiza si (precio anterior ≠ precio nuevo) **o** si (precio nuevo > 0). Así, casi siempre se hace UPDATE cuando el producto tiene precio > 0. Si la intención es “solo actualizar cuando el precio cambió”, la condición debería ser solo:

```python
if existing.data.get('price') != price:
```

y opcionalmente “o si antes estaba en 0 y ahora tenemos precio”. Ajustar según regla de negocio deseada.

### 3.4 Parámetro `limit` en la API de productos

Si la documentación de Syscom indica un parámetro `limit` (productos por página), añadirlo para controlar el tamaño de página:

```python
params = {"categoria": syscom_id, "pagina": page, "limit": 60}
```

---

## 4. Mapeo de categorías

`SYSCOM_MAP` incluye IDs que en este repo solo coinciden en parte con `lib/categories.ts`:

| Syscom ID (script) | Slug Sumee   | En SeguridadAvanzadaShop (lib/categories) |
|--------------------|-------------|-------------------------------------------|
| 22                 | videovigilancia | Videovigilancia (22) ✅                 |
| 26                 | redes       | Redes e IT (26) ✅                         |
| 65811              | redes       | No definido (Cableado podría ser otro ID) |
| 25                 | radiocomunicacion | No definido                            |
| 30                 | energia-solar | Energía/Herramientas (30) ✅             |
| 37                 | control-acceso | No definido                             |
| 32                 | domotica    | No definido                               |

Comprobar en el otro proyecto que esos IDs existan en Syscom y que las subcategorías `videovigilancia`, `redes`, `energia-solar`, etc. existan en `marketplace_subcategories` con `category_id` = UUID de "sistemas".

---

## 5. Checklist de correcciones

- [ ] **Crítico:** En `map_syscom_product`, usar `p.get('precio')` (singular) y soportar objeto y número.
- [ ] **Crítico:** Pasar `syscom_map` (o el mapeo filtrado) a `sync_products` y iterar sobre ese diccionario para que `--category` funcione.
- [ ] En `get_access_token`, no usar `res` en el `except` sin asegurarse de que esté definido (o usar `getattr(e, 'response', None)`).
- [ ] Opcional: limpiar `SYSCOM_CLIENT_ID` y `SYSCOM_CLIENT_SECRET` (espacios, `\r`, `\n`).
- [ ] Opcional: `verify=False` en requests si hay fallos de certificado con Syscom.
- [ ] Revisar condición de UPDATE (solo cuando cambió precio vs. siempre que price > 0).
- [ ] Añadir `limit` a los params de productos si la API de Syscom lo soporta.

---

## 6. Conclusión

El script tiene buena estructura (token con caché, subcategorías, insert/update por `external_code`, rate limit), pero **dos bugs importantes**:

1. Uso de **`precios`** en lugar de **`precio`** hace que no se importe el precio real.
2. **`--category`** no tiene efecto porque `sync_products` siempre usa `SYSCOM_MAP`.

Corrigiendo esos dos puntos (y opcionalmente el manejo de `res` en el `except` y la lógica de actualización), el script queda viable para el proyecto con Supabase.
