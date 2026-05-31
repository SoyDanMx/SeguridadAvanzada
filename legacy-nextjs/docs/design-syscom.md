# Diseño adoptado de syscom.mx

Este proyecto adopta la línea visual de **syscom.mx** (mayorista tecnológico) para una apariencia profesional y coherente con el sector.

## Paleta de colores

| Uso | Color | Código |
|-----|--------|--------|
| Primario (nav, títulos) | Azul oscuro | `#003366` (syscom-primary) |
| Acento / CTAs / Super Precio | Naranja | `#E85D04` (syscom-accent) |
| Fondo general | Blanco | `#FFFFFF` |
| Nav superior e inferior | Azul muy oscuro | `#002244` (nav-dark) |
| Bordes y superficies | Gris claro | `#E5E5E5`, `#F5F5F5` |

## Elementos de interfaz

- **Header (según captura syscom.mx):**
  - **Barra superior (azul oscuro):** Noticias, Especiales a la izquierda; carrito con badge rojo/naranja, MXN, Iniciar sesión a la derecha.
  - **Barra principal (blanca):** Logo (versión oscura), búsqueda central grande con bordes redondeados (rounded-full), ícono de lupa y botón "Buscar" a la derecha dentro del campo.
  - **Nav (fondo gris claro):** Pestañas redondeadas: Productos, Nuevos Productos (activa en azul), Super Precio, Caja abierta, Eventos, Soporte, Apps.
  - **Barra de categorías (azul oscuro):** Videovigilancia, Redes e IT, Energía, etc., como enlaces redondeados.
- **Hero:** Fondo azul oscuro, texto blanco, CTA naranja ("Ver todos los productos", "Ver ofertas").
- **Anuncio:** Franja azul con mensaje de entregas/productos.
- **Categorías destacadas:** Grid de tarjetas con imagen, título y subtítulo (estilo syscom).
- **Footer:** Fondo azul oscuro, columnas (Productos, Empresa, Soporte y legal).
- **Botones:** Primario = naranja (accent), secundario = azul (primary).

## Archivos modificados

- `tailwind.config.ts` – colores syscom (accent #E85D04, background blanco)
- `app/globals.css` – variables CSS
- `components/Header.tsx` – enlaces y etiquetas tipo syscom, Super Precio naranja
- `components/HeroSection.tsx` – mensajes y CTA naranja
- `components/AnnouncementBanner.tsx` – franja azul
- `components/HomeContentSection.tsx` – botón "Ver todos" naranja
- `components/Footer.tsx` – estilo oscuro y copy
- `app/page.tsx` – sección "Categorías destacadas" con grid
