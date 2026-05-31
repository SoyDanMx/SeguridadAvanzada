# Optimización vista móvil (viewport < 768px)

**Desarrollador Front-end y UX Mobile.** Parámetros aplicados para sitio de seguridad tecnológica: una columna, drawer de categorías, banner adaptable, contraste, regla 60-30-10 e imágenes proporcionales.

---

## 1. Estrategia mobile-first (< 768px)

- **Una sola columna vertical:** Contenido principal en flujo vertical; sidebars (categorías) no ocupan ancho en pantalla.
- **Menú lateral → Drawer:** El menú de categorías es un **drawer lateral colapsable** (hamburguesa). Se abre con el icono de menú (azul #0088D8) y se cierra con overlay o botón X. Iconos claros (Shield por categoría, Menu para abrir, X para cerrar).
- **Breakpoint:** `768px` como límite móvil/desktop. Uso de `@media (max-width: 767px)` en CSS y prefijos `md:` en Tailwind para ≥768px.

---

## 2. Adaptación del banner (hero)

- **Título principal (H1):** Tamaño legible en smartphones **22px–26px** (`clamp(1.375rem, 5vw, 1.625rem)`).
- **Botones "Ver catálogo" y "Contacto":**
  - En **móvil:** apilados verticalmente, **100% del ancho** del contenedor, `min-height: 44px` (touch target).
  - En **desktop:** en fila, ancho automático.
- **Orden en móvil:** H1 → Botón principal (Ver catálogo) → Botón secundario (Contacto).

---

## 3. Contraste y legibilidad

- **Fondo:** En móvil el cuerpo usa **#FFFFFF** para máximo contraste (variable `--color-background` en `@media (max-width: 767px)`).
- **Cuerpo de texto:** **16px** (`1rem`) en toda la vista móvil para evitar zoom automático en iOS y mejorar legibilidad.
- **Buscador sticky:** El **header completo** es `position: sticky; top: 0; z-index: 50`, de modo que la barra con logo y buscador permanece fija al hacer scroll (el buscador queda siempre accesible).

---

## 4. Regla 60-30-10 en móvil

- **60% fondo:** Blanco #FFFFFF.
- **30% identidad:** Azul de marca **#0088D8** (`--color-primary`) para:
  - Iconos de navegación (menú hamburguesa, icono de búsqueda en la barra principal).
  - Enlaces y acentos secundarios en contenido.
- **10% acento:** Naranja **#F2711C** exclusivamente para el **botón de conversión principal** ("Ver catálogo", "Cotizar", "Añadir al carrito"). En móvil se fuerza `--color-accent: #F2711C` en `globals.css` dentro del media query.

---

## 5. Media queries CSS aplicados

```css
/* Vista móvil (viewport < 768px) */
@media (max-width: 767px) {
  :root {
    --color-accent: #F2711C;
    --color-accent-hover: #E06510;
    --text-h1-size: clamp(1.375rem, 5vw, 1.625rem); /* 22px - 26px */
    --text-body-size: 1rem; /* 16px */
  }
  body {
    font-size: 1rem;
    background-color: #FFFFFF;
  }
}

/* Imágenes hero: en móvil contain para no recortar el producto */
@media (max-width: 767px) {
  .hero-banner-image {
    object-fit: contain;
    object-position: center center;
  }
}
```

---

## 6. Optimización de imágenes

- **Banner hero (ej. kit HiLook):**
  - Clase **`.hero-banner-image`**: en desktop `object-fit: cover; object-position: center`; en **móvil** `object-fit: contain; object-position: center` para reescalar proporcionalmente **sin perder el foco en la caja del producto** (no recortar el kit).
- **Fotos de producto (cards, PDP):**
  - Clase **`.product-image-responsive`**: `object-fit: contain; object-position: center` para que la imagen se reescale proporcionalmente y el producto quede centrado y visible.
- **Recomendación general:** Usar `sizes` en `<Image>` para servir resoluciones adecuadas (p. ej. `(max-width: 640px) 100vw` en hero, `50vw` en grid de 2 columnas móvil).

---

## 7. Resumen de recomendaciones de diseño

| Área | Recomendación |
|------|----------------|
| **Layout** | Una columna en móvil; drawer para categorías; header sticky. |
| **Tipografía** | H1 hero 22–26px; body 16px en móvil. |
| **Botones CTA** | 100% ancho en móvil, min-height 44px, color naranja #F2711C. |
| **Navegación** | Iconos en azul #0088D8; menú hamburguesa que abre drawer. |
| **Fondo** | #FFFFFF en móvil para contraste. |
| **Buscador** | Siempre visible gracias a header sticky. |
| **Imágenes** | Hero: contain en móvil; productos: contain + center para foco en el producto. |
| **Accesibilidad** | Touch targets ≥ 44px; contraste AA; sin zoom forzado (font-size ≥ 16px). |

---

## 8. Archivos modificados

- **`app/globals.css`:** Media query &lt;768px (accent, H1, body, fondo blanco), clases `.hero-banner-image` y `.product-image-responsive`.
- **`components/Header.tsx`:** Header `sticky top-0`, icono menú con `text-primary` y `touch-target`, icono búsqueda `text-primary` en móvil.
- **`components/HeroVisual.tsx`:** H1 con tamaño 22–26px, botones en columna y 100% ancho en móvil, clase en imagen hero.
- **`components/ProductCard.tsx`:** Clase `product-image-responsive` en imágenes de producto.

---

*Documento de referencia para vista móvil &lt; 768px. Mantener coherencia con docs/design-mobile-first.md y design-system-palette.md.*
