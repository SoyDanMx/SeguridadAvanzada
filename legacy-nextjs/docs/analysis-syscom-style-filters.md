# Análisis: SyscomStyleFilters (componente de otro proyecto)

## Qué hace el componente

Panel de **filtros lateral** (estilo Syscom) con:

| Sección | Función |
|--------|--------|
| **Categorías (jerarquía)** | Rama → subrama con `getHierarchyByCategory(categoryId)` y `getBreadcrumbPath`. Navegación en árbol. |
| **Condición** | Checkbox "Nuevo" (y otros); filtro `condition: string[]`. |
| **Marcas** | Lista de marcas extraídas de `products` (título/descripción) contra lista fija `MARCAS_COMUNES`; búsqueda interna; checkboxes; filtro `brands: string[]`. |
| **Precio** | Inputs min/max; estadísticas desde `products`; filtro `priceRange: { min, max }`. |
| **Chips** | Filtros activos con opción de quitar; contador y "Limpiar". |

**Dependencias del otro proyecto:**

- `@fortawesome/react-fontawesome` y `free-solid-svg-icons`
- `MarketplaceProduct` (tipos Supabase)
- `@/lib/marketplace/hierarchy` (`getHierarchyByCategory`, `getBreadcrumbPath`, `HierarchyLevel1`)

Ese marketplace tiene productos en **Supabase** y una **jerarquía rama/subrama** por categoría; los filtros se aplican en **cliente** sobre el array `products`.

---

## En SeguridadAvanzadaShop

- No hay Supabase ni `MarketplaceProduct`; el catálogo usa **API Syscom** y tipo `ProductWithPricing`.
- No existe `lib/marketplace/hierarchy`; las categorías son **IDs de Syscom** (22, 26, 30, etc.).
- La página `/productos` ya usa `q`, `category` y `page` por URL; no hay filtros por marca ni rango de precio en la API.

Para reutilizar la idea aquí:

1. **Categorías:** lista fija (Videovigilancia, Redes, Energía) que pongan `?category=22|26|30` y recarguen datos.
2. **Marcas y precio:** extraer marcas del listado actual y filtrar por marca y rango de precio **en cliente** sobre los productos de la página (o ampliar la API más adelante).
3. **Condición:** asumir "nuevo" o omitir si no hay dato.
4. **Iconos:** usar **Lucide** en lugar de FontAwesome.

Ver componente adaptado en `components/ProductFilters.tsx`.
