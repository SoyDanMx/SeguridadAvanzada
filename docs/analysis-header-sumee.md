# Análisis: Header Sumee para Seguridad Avanzada

## Qué hace el Header de Sumee

- **Comportamiento al scroll:** Header fijo; al inicio **transparente** con gradiente oscuro y logo/texto blanco; al hacer scroll (>50px) pasa a **fondo sólido blanco**, sombra y logo/texto oscuro.
- **Una sola barra:** Logo + badge “Tu Primera Revisión es Gratis” + selector de **ubicación** (LocationContext + LocationSelectorModal) | Iniciar sesión / Únete como Profesional (o **UserPanelMenu** si hay sesión) + hamburger en móvil.
- **Menú móvil:** Panel lateral derecho (slide-out) con ubicación, enlaces (Únete como Pro, Servicios, Apps, Precios, Técnicos), Iniciar sesión / Mi Panel y Cerrar sesión.
- **Dependencias:** FontAwesome, **useAuth** (AuthContext), **UserPanelMenu**, **useLocation** + **LocationSelectorModal** (dynamic), Supabase para logout.

## Viabilidad en Seguridad Avanzada

| Aspecto | Viabilidad |
|--------|-------------|
| **Scroll (transparente → sólido)** | Alta. Útil en home con HeroVisual: header transparente sobre el hero, sólido al bajar. |
| **Logo blanco / oscuro según scroll** | Alta. Mismo logo con `brightness-0 invert` sobre hero, sin invertir con scroll. |
| **Estructura una sola barra** | Baja para este proyecto. Aquí interesa mantener barra superior + búsqueda + pestañas + categorías (estilo Syscom). |
| **Auth / UserPanelMenu** | No existe en este repo. Sin AuthContext ni Supabase; “Iniciar sesión” puede seguir siendo solo enlace. |
| **LocationContext / LocationSelectorModal** | No existe. Se puede omitir o mostrar texto fijo “Entregas CDMX y todo México”. |
| **Menú móvil tipo Sumee** | Parcial. Ya hay CategorySidebar por la izquierda; se puede mejorar el drawer o dejarlo como está. |
| **FontAwesome** | Sustituir por Lucide. |

## Recomendación

- **Adoptar solo:** Comportamiento al scroll (header con fondo transparente sobre el hero, sólido al hacer scroll) y **cambio de logo** (blanco sobre hero, oscuro con scroll), solo en la **página de inicio** para no afectar producto/categorías.
- **Mantener:** Estructura actual (varias barras, búsqueda, pestañas, categorías) y enlaces (Productos, Eventos, Carrito, Iniciar sesión). No integrar Auth ni Location.
- **Opcional:** Menú móvil tipo Sumee (panel derecho con enlaces) como alternativa al sidebar izquierdo; por ahora se deja el sidebar actual.

Implementación sugerida: usar `usePathname()` para detectar `/` y `useState` + `useEffect` para scroll; aplicar clases condicionales al header (transparente vs sólido) y al logo (invert vs normal).
