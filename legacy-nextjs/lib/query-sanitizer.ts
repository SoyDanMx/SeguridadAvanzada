/**
 * Desinfecta y limpia cadenas de búsqueda de SKU y productos.
 * Remueve prefijos "SKU:", espacios sobrantes, saltos de línea y signos de puntuación.
 */
export function sanitizeQuery(rawQuery: string): string {
  if (!rawQuery) return "";
  let clean = rawQuery.replace(/^sku:\s*/i, "").trim();
  clean = clean.replace(/^[^\w\d\-\/]+|[^\w\d\-\/]+$/g, "").trim();
  return clean;
}
