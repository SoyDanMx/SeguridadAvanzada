# Análisis QA/QC, UX/UI y fundamentos de programación — Opciones de mejora

Documento de análisis exhaustivo del proyecto **Seguridad Avanzada Shop** con recomendaciones visuales, funcionales y de vanguardia tecnológica.

---

## 1. QA/QC (Quality Assurance / Quality Control)

### 1.1 Lo que está bien
- **TypeScript** en todo el proyecto con tipos definidos (`ProductWithPricing`, `ProductFiltersState`, etc.).
- **React Query** para cache y estados de carga/error en productos.
- **Suspense** en la página de productos con fallback de loading.
- **Manejo de errores** explícito en listado (mensaje + sugerencia de credenciales).
- **Validación de formulario** en contacto (required, tipos email/tel).
- **Claves únicas** en listas (key por href, sku, href+text en Footer).
- **Next.js Image** con `priority`/`sizes` donde aplica; fallback a `<img>` para URLs no permitidas en `next.config`.

### 1.2 Gaps y mejoras QA/QC

| Área | Problema | Mejora sugerida |
|------|----------|-----------------|
| **Tests** | No hay tests (unit, integration, e2e). | Añadir Vitest + React Testing Library; al menos tests de `lib/categories`, `lib/pricing`, y un smoke de la home y listado de productos. |
| **Errores de API** | En producto por SKU solo se muestra mensaje genérico. | Diferenciar 404 vs 5xx y mostrar mensaje específico; opcionalmente retry con backoff. |
| **Formulario contacto** | EmailJS sin validación de respuesta (éxito/error). | Ya se maneja en `.then`/`.catch`; añadir timeout y mensaje si la red falla. |
| **Paginación** | `page` desde URL pero sin validación (NaN, &lt;1). | Normalizar con `Math.max(1, Math.min(page, totalPages))` y actualizar URL. |
| **Categorías home** | `cat!` non-null assertion tras `.filter(Boolean)`. | Usar type guard o `SYSCOM_CATEGORIES.filter(c => ['videovigilancia', ...].includes(c.slug))` para evitar `!`. |
| **Env** | Claves EmailJS opcionales; usuario puede no configurarlas. | Ya se informa en UI; documentar en README o .env.example las variables necesarias. |

---

## 2. UX/UI (Experiencia de usuario e interfaz)

### 2.1 Fortalezas actuales
- **Estructura clara**: Header → Announcement → Sidebar + Main → Footer.
- **Jerarquía visual**: Títulos (h1/h2), CTAs destacados (accent), bloques bien separados.
- **Responsive**: Grids adaptativos (sm/md/lg), sidebar colapsable, menú móvil.
- **Estados de carga**: Skeleton/loader en productos y contacto.
- **Feedback en formulario**: Notificaciones success/error con iconos.
- **Accesibilidad básica**: Varios `aria-label`, `role="alert"`, `role="list"`, `aria-label="Paginación"`, focus visible en botones/inputs.

### 2.2 Mejoras UX/UI recomendadas

#### Navegación y wayfinding
- **Skip link**: Añadir “Saltar al contenido” al inicio del body para teclado y lectores de pantalla.
- **Breadcrumbs**: En `/productos` y `/productos/[sku]` para “Inicio > Productos [> Categoría] [> SKU]”.
- **Indicador de página actual**: En Header/Footer no se resalta la ruta activa; usar `usePathname()` y aplicar estilo (ej. subrayado o bold) al link correspondiente.
- **Barra de categorías (Header)**: En móvil muchas categorías generan scroll horizontal; considerar acordeón, “Ver todas” o mega-menú al hacer clic en “Categorías”.

#### Formularios y inputs
- **Newsletter (Footer)**: El submit hace `preventDefault` sin enviar datos; implementar endpoint o integración (Mailchimp, Resend, etc.) o mostrar mensaje “Próximamente”.
- **Placeholder vs label**: En contacto hay ambos; asegurar que ningún input dependa solo del placeholder (ya hay labels).
- **Mensajes de error en campo**: En contacto, errores se muestran en bloque; opcional: errores inline por campo (ej. “Correo no válido”) para UX más clara.

#### Contenido y jerarquía
- **Imágenes de categorías (home)**: Las 4 categorías usan la misma imagen (logo); usar iconos o imágenes por categoría para diferenciación visual.
- **Alt en imágenes**: En “Categorías destacadas” el `alt` está vacío (`alt=""`); usar descripción breve (ej. `alt={title}` o “Ir a {title}”).
- **H1 único por página**: Home tiene h1 en HeroVisual implícito en el diseño; producto tiene h1 con título; contacto tiene h1 en banner. Revisar que no haya dos h1 en la misma vista.

#### Feedback y micro-interacciones
- **Toasts**: Sustituir o complementar el bloque de notificación en contacto por un toast (esquina) que no ocupe flujo del formulario.
- **Estados hover/focus en cards**: ProductCard ya tiene sombra; se puede añadir ligera escala (ej. `hover:scale-[1.02]`) y transición suave.
- **Botón WhatsApp**: Tooltip solo en `md:`; en móvil considerar no tap delay y área táctil ≥ 44px (ya 64px, correcto).

#### Consistencia visual
- **ProductFilters**: Usa `blue-600`/`blue-50` en chips y botones; el resto del sitio usa `syscom-primary` y `syscom-accent`. Unificar con la paleta del proyecto.
- **Footer**: Duplicación de copyright (arriba “© Año” y abajo “© Año. Todos los derechos reservados”); dejar una sola línea.
- **Espaciado del main**: `min-h-[60vh]` evita footer pegado arriba; en pantallas muy altas el main puede quedar con mucho vacío; opcional: `min-h-[calc(100vh - header - footer)]`.

---

## 3. Fundamentos de programación y arquitectura

### 3.1 Buenas prácticas presentes
- **Separación de datos**: `lib/categories.ts` como única fuente de categorías; reutilización en Header, Footer, Sidebar, ProductFilters, Home.
- **Componentes reutilizables**: Button, Input con variantes; ProductCard recibe `product` tipado.
- **Client/Server**: Páginas que necesitan hooks son `"use client"`; metadata en layouts de ruta (contacto).
- **Constantes**: Colores y rutas centralizados en tailwind y lib.

### 3.2 Mejoras de código
- **Duplicación de lógica de imagen**: `productImageUrl` y `canUseNextImage` repetidos en ProductCard y página [sku]; extraer a `lib/product-image.ts` (o similar).
- **Magic numbers**: LIMIT=24, SCROLL_THRESHOLD=50; mover a `lib/constants.ts` o config.
- **Rutas inexistentes**: Enlaces a `/categorias`, `/eventos`, `/soporte`, `/terminos`, etc.; crear páginas stub o eliminar/ocultar hasta tener contenido.
- **HomeContentSection**: Link a `category=26` hardcodeado; usar `getCategoryParam` de categories para “Control de acceso” o la categoría que corresponda.
- **Manejo de productos vacíos**: Cuando la API devuelve `products: []` y `total: 0` está bien manejado; cuando hay error de red (fetch falla) el mensaje es genérico; mejorar mensaje según `res.status`.

---

## 4. Accesibilidad (A11y)

### 4.1 Bien implementado
- `lang="es"` en `<html>`.
- Uso de `aria-label` en iconos de acción (Carrito, Menú, WhatsApp, redes sociales).
- Focus visible en botones e inputs (ring).
- Estructura de encabezados (h1, h2, h3) en contacto y listados.
- `role="alert"` en notificaciones del formulario.
- `aria-disabled` en botones de paginación deshabilitados.

### 4.2 Mejoras A11y
- **Botones de filtro (ProductFilters)**: Los acordeones (Categoría, Condición, Marcas, Precio) no tienen `aria-expanded` ni `aria-controls`; añadirlos para lectores de pantalla.
- **Contraste**: Revisar ratio en “text-white/90” y “text-white/70” sobre fondos oscuros (cumplir WCAG AA).
- **Focus trap en sidebar móvil**: Al abrir el menú lateral, enfocar el primer enlace o botón “Cerrar” y opcionalmente trap de foco hasta cerrar.
- **Anuncios (AnnouncementBanner)**: El enlace es un bloque de texto; asegurar que el foco sea visible (outline/ring).
- **Imagen hero**: Alt largo está bien; en pantallas de solo texto considerar que no sea excesivo (una línea suele bastar).

---

## 5. Rendimiento y vanguardia técnica

### 5.1 Actual
- Next.js 15, React 19, App Router.
- Imágenes con next/image y sizes.
- React Query para cache de productos.
- Fonts con next/font (Geist).

### 5.2 Opciones de mejora (vanguardia)

| Tema | Opción de mejora |
|------|-------------------|
| **Imágenes** | Habilitar `priority` solo en hero y primera pantalla; en ProductCard usar `loading="lazy"` por defecto (next/image ya hace lazy por defecto cuando no hay priority). Revisar `sizes` en grid (ej. (max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw) para 4 columnas. |
| **Core Web Vitals** | Medir LCP (hero, primera card), INP/CLS. Asegurar que el hero no cambie de altura al cargar la imagen (aspect-ratio o min-height). |
| **Bundle** | Revisar que EmailJS se cargue solo en la ruta de contacto (dynamic import con `next/dynamic` para la página de contacto o el formulario). |
| **Rutas dinámicas** | Página [sku] podría usar `generateStaticParams` para SKUs más visitados (si el catálogo es estable) y ISR. |
| **Service Worker / PWA** | Para “vanguardia” y uso en móvil: next-pwa o Workbox para caché de assets y modo offline básico. |
| **Internacionalización** | Si se planea otro idioma: next-intl o similar y estructura de rutas por locale. |
| **Analytics y RUM** | Añadir script de analytics (GA4, Plausible, etc.) y opcionalmente Real User Monitoring (ej. Vercel Analytics). |
| **Dark mode** | Tailwind tiene `darkMode: ["class"]`; no hay implementación. Añadir toggle y clases `dark:` para componentes clave (header, cards, footer) si se desea. |

---

## 6. Resumen de opciones de mejora priorizadas

### Prioridad alta (impacto rápido en calidad y UX)
1. Unificar paleta en ProductFilters (syscom-primary/accent en lugar de blue-*).
2. Añadir skip link “Saltar al contenido”.
3. Corregir `alt` en imágenes de categorías destacadas (home).
4. Añadir `aria-expanded`/`aria-controls` en acordeones de filtros.
5. Extraer `productImageUrl` y constantes (LIMIT, SCROLL_THRESHOLD) a lib.

### Prioridad media
6. Breadcrumbs en productos y detalle.
7. Resaltar link activo en navegación (Header/Footer).
8. Newsletter: implementar envío o mensaje “Próximamente”.
9. Eliminar duplicación de copyright en Footer.
10. HomeContentSection: usar categorías desde lib (slug/param) en lugar de category=26 fijo.

### Prioridad baja / vanguardia
11. Tests unitarios y un smoke e2e.
12. Toast para notificaciones del formulario de contacto.
13. Dynamic import de EmailJS solo en contacto.
14. Revisar LCP/CLS y ajustar sizes/priority de imágenes.
15. Documentar variables de entorno en README/.env.example.

---

## 7. Referencias rápidas

- **WCAG 2.1**: Contraste, focus, labels, estructura.
- **Next.js**: Metadata, Image, dynamic, generateStaticParams.
- **React**: Accesibilidad (react.dev), useId para form labels.
- **Tailwind**: focus-visible, ring, dark mode.

Este documento puede usarse como backlog de mejoras y para alinear prioridades con negocio y recursos disponibles.
