# Análisis: HeroVisual (Sumee) para Seguridad Avanzada

## Qué hace el componente original

- **Hero a pantalla completa** (`min-h-screen`) con imagen de fondo (`plomeria-hero.svg`), overlay en gradiente y contenido centrado.
- **Badge de confianza:** “+50,000 servicios”, “4.8/5 estrellas” (referido a Sumee).
- **Título en 3 líneas:** “Técnicos” / “Verificados” (azul) / “Para Tu Hogar”.
- **Subtítulo** con promesa “Respuesta en menos de 2 horas”.
- **Estadísticas:** 3 bloques (Profesionales Verificados, Tiempo de Respuesta, Calificación).
- **Dos CTAs:** “Ver Servicios” (primario), “Únete como Profesional” (secundario).
- **Dependencias:** FontAwesome (`faArrowRight`, `faStar`, `faUsers`, `faClock`).
- **Imagen:** `/images/services/plomeria-hero.svg` (no existe en este repo).

## Viabilidad en Seguridad Avanzada

| Aspecto | Viabilidad |
|--------|------------|
| **Estructura** | Alta: hero full-height + overlay + contenido centrado es reutilizable. |
| **Copy** | Adaptar: mensaje para seguridad electrónica, catálogo y contacto. |
| **Estadísticas** | Adaptar o simplificar: aquí no hay “servicios completados” ni “2h respuesta”; se pueden usar “Marcas líderes”, “Entregas nacionales”, “Soporte técnico” o similares. |
| **CTAs** | Cambiar a “Ver catálogo” / “Contacto” o “Cotizar”. |
| **FontAwesome** | Sustituir por **Lucide** (ya usado en el proyecto). |
| **Imagen de fondo** | En este repo no hay `plomeria-hero.svg`. Usar **gradiente** (estilo Syscom) o añadir después una imagen en `/public/images/hero-bg.jpg` (o similar). |

## Recomendación

Crear **HeroVisual** adaptado: mismo layout (full viewport, overlay, badge, título, subtítulo, stats, dos CTAs), con copy y métricas de Seguridad Avanzada, Lucide y sin imagen de fondo (solo gradiente). Opcional: soportar una imagen de hero vía `NEXT_PUBLIC_HERO_IMAGE` o archivo en `public/images/` para activarla cuando exista.
