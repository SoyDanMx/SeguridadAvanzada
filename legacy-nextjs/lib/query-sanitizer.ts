/**
 * Desinfecta y limpia cadenas de búsqueda de SKU y productos.
 * Remueve prefijos "SKU:", espacios sobrantes, saltos de línea, timestamps y signos de puntuación.
 */
export function extractSkuToken(rawQuery: string): string {
  if (!rawQuery) return "";

  // 1. Si incluye "SKU:" o "sku:" en cualquier parte, extraer el token inmediatamente después
  const explicitSkuMatch = rawQuery.match(/sku:\s*([A-Za-z0-9\-\/]+)/i);
  if (explicitSkuMatch && explicitSkuMatch[1]) {
    return explicitSkuMatch[1].trim();
  }

  // 2. Limpiar marcas de tiempo de WhatsApp tipo "11:00 a.m.", "11:00am", "11:00"
  let clean = rawQuery.replace(/\b\d{1,2}:\d{2}\s*(?:a\.?m\.?|p\.?m\.?)?/gi, "").trim();

  // 3. Buscar patrón técnico de modelo con guion/diagonal (ej. 2600-858, DS-2CD2043G0-I, ST-1460E, DK-9300)
  const skuMatch = clean.match(/\b([A-Za-z0-9]+[\-\/][A-Za-z0-9\-\/]+)\b/);
  if (skuMatch && skuMatch[1]) {
    return skuMatch[1].trim();
  }

  // 4. Buscar token precedido por palabras clave (modelo, equipo, código, etc.)
  const keywordMatch = clean.match(/(?:modelo|equipo|código|codigo)\s*:?\s*([A-Za-z0-9\-\/]+)/i);
  if (keywordMatch && keywordMatch[1]) {
    return keywordMatch[1].trim();
  }

  return sanitizeQuery(clean);
}

export function sanitizeQuery(rawQuery: string): string {
  if (!rawQuery) return "";

  // Limpiar horas/timestamps
  let clean = rawQuery.replace(/\b\d{1,2}:\d{2}\s*(?:a\.?m\.?|p\.?m\.?)?/gi, "").trim();

  // Remover prefijo SKU
  clean = clean.replace(/^sku:\s*/i, "").trim();

  // Remover puntuación al inicio y final
  clean = clean.replace(/^[^\w\d\-\/]+|[^\w\d\-\/]+$/g, "").trim();
  return clean;
}


