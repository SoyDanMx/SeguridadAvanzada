# Diseño mobile-first — Seguridad Avanzada

**Prioridad:** El mayor tráfico de usuarios es en **celulares**. Todo el diseño debe ser responsive y optimizado primero para móvil.

---

## 1. Principios

- **Mobile-first:** Estilos base para pantallas pequeñas; usar prefijos `sm:`, `md:`, `lg:` para añadir o sobrescribir en pantallas mayores.
- **Touch-first:** Áreas clicables mínimo **44×44px** (WCAG 2.5.5); separación suficiente entre enlaces/botones para evitar toques accidentales.
- **Contenido primero:** En móvil no esconder contenido crítico detrás de hover; menús y filtros accesibles con un tap.
- **Performance:** Imágenes responsivas (`sizes`), fuentes con `display: swap`, evitar layout shifts (anchura/altura explícitas donde aplique).

---

## 2. Breakpoints (Tailwind por defecto)

| Prefijo | Min width | Uso típico |
|---------|-----------|-------------|
| *(base)* | &lt; 640px | **Móvil** — diseño principal |
| `sm:` | 640px | Móvil grande / phablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Desktop ancho |

Escribir estilos en este orden: base (móvil) → `sm:` → `md:` → `lg:` → `xl:`.

---

## 3. Viewport y meta

- **Viewport:** `width=device-width, initial-scale=1` (definido en `layout.tsx`).
- No usar `maximum-scale=1` ni `user-scalable=no`; perjudica accesibilidad.
- Opcional: `viewport-fit=cover` para dispositivos con notch/safe area.

---

## 4. Patrones por componente

- **Header:** En móvil, barra superior puede colapsar o reducir texto; menú hamburguesa para navegación; búsqueda siempre accesible (barra compacta o icono que abre campo).
- **Sidebars (categorías, filtros):** En móvil, off-canvas (drawer) o bloque colapsable encima del contenido; en desktop, columna fija.
- **Grids de productos:** Base 1 columna; `sm:grid-cols-2`; `lg:grid-cols-3` o `xl:grid-cols-4`.
- **Footer:** Apilar columnas en móvil (`flex-col`); en desktop `lg:flex-row`.
- **Tablas:** En móvil considerar cards o lista; si se mantiene tabla, scroll horizontal con `overflow-x-auto` y `min-w-*` en celdas.
- **Formularios:** Labels encima de inputs en móvil; botones a ancho completo si hay uno principal.

---

## 5. Espaciado y tipografía en móvil

- **Padding de página:** Mínimo `px-4` (16px) en móvil; `lg:px-6` o más en desktop.
- **Contenedor:** `container mx-auto px-4 sm:px-6 lg:px-8` para márgenes laterales consistentes.
- **Títulos:** En móvil no bajar de 1.25rem (20px) para H1; cuerpo 1rem (16px) para legibilidad y evitar zoom en iOS.
- **Línea de texto:** No más de ~70–80 caracteres en desktop; en móvil el ancho lo define la pantalla.

---

## 6. Validación

- Probar en viewport 320px, 375px, 414px (móviles) y 768px, 1024px (tablet/desktop).
- Comprobar que no haya scroll horizontal en ninguna resolución.
- Comprobar que filtros, menús y CTAs sean usables con el dedo (tamaño y distancia).

---

*Referencia para todo nuevo desarrollo: priorizar siempre la experiencia en celulares.*
