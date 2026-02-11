# Selectores HTML/CSS para scraping de Syscom.mx

Referencia de estructuras del DOM de [syscom.mx](https://www.syscom.mx/) usadas en el scraper.

## Banners / promociones (carrusel)

Estructura típica de un ítem del carrusel de la home:

```html
<div class="absolute inset-0 w-full h-full transition-opacity duration-500 opacity-100 z-10">
  <a aria-label="YEALINK" class="block w-full h-full" href="/promociones/12439">
    <div class="relative w-full h-full overflow-hidden flex items-center justify-center">
      <img
        alt="YEALINK"
        loading="lazy"
        width="1920"
        height="345"
        decoding="async"
        data-nimg="1"
        class="w-full h-auto"
        style="color:transparent;object-fit:cover;object-position:center;cursor:pointer"
        src="https://ftp3.syscom.mx/cdn-cgi/image/format=webp,quality=95,width=1920/usuarios/ftp/banners_index/syscom/banner-yealink-rgb.jpg"
      />
    </div>
  </a>
</div>
```

### Selectores usados

| Dato      | Selector / fuente                                      |
|-----------|--------------------------------------------------------|
| Enlace    | `a[href*="/promociones/"]`                             |
| URL promo | `href` del `<a>` (ej. `/promociones/12439`)            |
| Imagen    | `img[src*="ftp3.syscom.mx"]` dentro del `<a>`          |
| Nombre    | `aria-label` del `<a>` o `alt` del `<img>` (ej. YEALINK) |

### Clases CSS relevantes

- Contenedor del slide: `absolute inset-0`, `transition-opacity`, `z-10`
- Enlace: `block w-full h-full`
- Contenedor de la imagen: `relative`, `overflow-hidden`, `flex items-center justify-center`
- Imagen: `w-full h-auto`, `object-fit:cover`, `object-position:center`

### Resultado en el scraper

Cada banner se devuelve como:

```json
{
  "name": "YEALINK",
  "url": "https://www.syscom.mx/promociones/12439",
  "image": "https://ftp3.syscom.mx/cdn-cgi/image/format=webp,quality=95,width=1920/usuarios/ftp/banners_index/syscom/banner-yealink-rgb.jpg"
}
```

El array `banners` está en el resultado de `scrapeSyscom()` y en `GET /api/scrape` (objeto `syscom.banners`).
