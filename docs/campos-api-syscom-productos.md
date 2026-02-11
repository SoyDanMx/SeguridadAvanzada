# Campos que entrega la API de Syscom para productos

Basado en la inspección de respuestas reales de `GET /api/v1/productos`.

## Campos identificados en la respuesta

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `producto_id` | string/number | ID único en Syscom |
| `modelo` | string | Modelo/SKU del producto |
| `titulo` | string | Nombre/título del producto |
| `marca` | string | Marca del fabricante |
| `garantia` | string | Información de garantía |
| `img_portada` | string | URL imagen principal |
| `precios` | object | Objeto con precio_especial, precio_1, precio_lista, precio_descuento (valores string o number) |
| `categorias` | array/string | Categorías del producto |
| `existencia` | number | Stock disponible |
| `total_existencia` | number | Total en existencia |
| `link` | string | Enlace al producto en syscom.mx |
| `link_privado` | string | Enlace privado |
| `peso` | number/string | Peso del producto |
| `alto`, `largo`, `ancho` | number/string | Dimensiones |
| `unidad_de_medida` | string | Unidad (kg, m, etc.) |
| `sat_key`, `sat_description` | string | Clave y descripción SAT (impuestos) |
| `marca_logo` | string | URL del logo de la marca |
| `imagen_360` | string | URL vista 360° |
| `iconos` | array | Iconos adicionales |
| `datasheet` | string | URL ficha técnica (si existe) |
| `caracteristicas` | array | Lista de características |
| `especificaciones` | object | Especificaciones técnicas |
| `descripcion` | string | Descripción larga (en detalle por ID) |

## Campos que actualmente mapeamos en `/api/products`

- `sku` (desde modelo o producto_id)
- `descripcion` (desde titulo si no hay descripcion)
- `titulo`, `precio`, `moneda`, `categoria`, `categorias` (array)
- `imagen` (desde img_portada, imagen o imagenes[0]), `imagenes` (todas)
- `datasheet`, `especificaciones`
- `precioOriginal`, `precioConMargenMxn`
- `producto_id`, `marca`, `garantia`, `existencia`, `total_existencia`, `link`
- `peso`, `alto`, `largo`, `ancho`, `unidad_de_medida`
- `caracteristicas`

## Campos que SÍ mapeamos (extracción robusta)

- `marca` — Marca del producto (string u objeto con nombre)
- `garantia` — Garantía
- `existencia` / `total_existencia` — Stock
- `link` — Enlace a Syscom
- `peso`, `alto`, `largo`, `ancho` — Dimensiones (número o string)
- `caracteristicas` — Lista de características
- `categorias` — Array de categorías (normalizado a string[])
- `imagenes` — Todas las URLs de imágenes (img_portada, imagen, imagenes[])

## Nota sobre endpoint de detalle

La API de listado (`/productos` con categoria/busqueda) puede devolver menos campos que el endpoint de detalle por ID (`/productos/{producto_id}`). La descripción larga y especificaciones completas suelen estar en el detalle.
