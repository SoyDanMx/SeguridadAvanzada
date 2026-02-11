# Análisis: MarketplacePage (componente Sumee)

Componente de la **página principal del marketplace** del proyecto Sumee (Supabase, FontAwesome). **No pertenece a SeguridadAvanzadaShop**: este repo no tiene Supabase, ni tipos `MarketplaceProduct`, ni rutas `/marketplace`. El análisis sirve como referencia o para reutilizar ideas.

---

## 1. Qué hace el componente

- **Sin filtros activos:** Carga hasta 200 productos de Supabase (`marketplace_products`), los filtra por imágenes válidas, aplica scoring de “destacados” y muestra 24. Orden inicial por `views_count`; fallback por `created_at`.
- **Con filtros (búsqueda, categoría, precio, condición):** Usa el hook `useMarketplacePagination` para productos paginados y filtrados.
- **UI:** Hero con búsqueda, sección de categorías con conteos desde BD, sidebar de filtros (desktop), drawer de filtros (móvil), grid de productos, modal de detalle, breadcrumbs, SEO y structured data.
- **Estadísticas:** Cuenta total de productos activos con `price > 0` y vendedores únicos; por categoría, cuenta productos para mostrar en cada tarjeta.

---

## 2. Dependencias que no existen en SeguridadAvanzadaShop

| Dependencia | En Sumee | En SeguridadAvanzadaShop |
|-------------|----------|---------------------------|
| Supabase | `@/lib/supabase/client`, tabla `marketplace_products` | No |
| Tipos | `MarketplaceProduct`, `@/types/supabase` | No (hay `ProductWithPricing`, Syscom) |
| Rutas | `/marketplace`, `getCategoryUrl` | `/productos`, categorías Syscom |
| Componentes | `ProductModal`, `HeroSectionV2`, `CategoryFilters`, `ProductGrid`, etc. | No |
| Hooks | `useMarketplacePagination` | No |
| Librerías | FontAwesome | Lucide en algunos componentes |
| Filtros | `MarketplaceFilters`, `applyFilters`, `getFeaturedProducts` | `ProductFiltersState` en `/productos` |

Por tanto **no se puede copiar y pegar** este archivo en SeguridadAvanzadaShop sin añadir Supabase, tipos, componentes e hooks.

---

## 3. Observaciones y posibles mejoras (en el proyecto Sumee)

### 3.1 Conteos por categoría (N+1)

Se hace un `select` por cada categoría para contar productos:

```ts
for (const dbCategory of categoriesData) {
  const { count, error } = await supabase
    .from("marketplace_products")
    .select("*", { count: "exact", head: true })
    .eq("category_id", category.id)
    ...
}
```

Con muchas categorías son muchas peticiones. Alternativa: una sola query que agrupe por `category_id` (p. ej. RPC o vista materializada) o cargar conteos en una sola llamada si Supabase lo permite.

### 3.2 Conteo de vendedores únicos

Se hace un `count` y luego un `select` de `seller_id` para contar únicos en cliente. Si la BD soporta `count(distinct seller_id)` vía RPC o vista, se puede evitar traer todas las filas.

### 3.3 `totalSellers` fallback 456

```ts
totalSellers={totalSellers > 0 ? totalSellers : 456}
```

El valor `456` es arbitrario. Conviene usar algo como `0`, “—” o no mostrar el número hasta que esté cargado, para no confundir con un dato real.

### 3.4 Efecto del click en categoría

```ts
onClick={() => setFilters({ ...filters, categoryId: category.id })}
```

Solo actualiza el estado local; la navegación la hace el `Link` a `getCategoryUrl(category.slug)`. Si la página de categoría lee la URL y no el estado, está bien; si en algún momento se espera que el estado y la URL estén siempre sincronizados, habría que derivar `categoryId` de la URL (p. ej. con `useSearchParams` o `useParams`).

### 3.5 Console.log en producción

Hay `console.log` de debug (`[MARKETPLACE]`, `[PRODUCTOS DESTACADOS]`, etc.). En producción es mejor quitarlos o usar un logger condicional (`process.env.NODE_ENV === 'development'`).

### 3.6 Dependencia del efecto de productos destacados

```ts
}, [shouldUsePagination, featuredProductsDirect.length, loadingDirect]);
```

Si `shouldUsePagination` pasa de `true` a `false` (usuario limpia filtros), se vuelve a ejecutar el efecto; como `featuredProductsDirect.length` ya puede ser > 0, la condición `featuredProductsDirect.length === 0` evita recargar. Correcto. Solo asegurarse de que al limpiar filtros no se resetee `featuredProductsDirect` si no se desea una nueva carga.

---

## 4. Ideas reutilizables para SeguridadAvanzadaShop

- **Debounce de búsqueda:** El patrón de `searchInput` + `useEffect` con `setTimeout` 300 ms para actualizar `filters.searchQuery` se puede usar en `/productos` si la búsqueda actual no tiene debounce.
- **Dos modos (destacados vs filtrados):** En SeguridadAvanzadaShop ya hay algo similar: sin `category` se listan productos de la API; con `category` se filtra. La idea de “sin filtros = lista curada/destacada” podría aplicarse si en el futuro se añade scoring o favoritos.
- **Conteos por categoría:** En `/productos` los conteos por categoría se podrían obtener de la API de Syscom (totales por categoría) si está disponible, para mostrar “X productos” en cada tarjeta de categoría.
- **Breadcrumbs condicionales:** Mostrar breadcrumbs solo cuando hay filtros o búsqueda, como en el componente.

---

## 5. Conclusión

El componente es la **home del marketplace Sumee** (Supabase + filtros + destacados + categorías con conteos). Está bien estructurado; mejoras sugeridas: reducir N+1 en conteos, evitar `console.log` en producción y revisar el fallback de `totalSellers`. Para **SeguridadAvanzadaShop** no es plug-and-play; solo tienen sentido ideas aisladas (debounce, breadcrumbs, conteos) si se implementan sobre la stack actual (Syscom, Next, sin Supabase).
