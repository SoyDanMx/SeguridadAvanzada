/**
 * Desinfecta y limpia cadenas de búsqueda de SKU y productos.
 * Remueve prefijos "SKU:", espacios sobrantes, saltos de línea, timestamps y signos de puntuación.
 */
export function extractSkuToken(rawQuery: string): string {
  if (!rawQuery) return "";

  // 1. Limpiar marcas de tiempo de WhatsApp tipo "11:00 a.m.", "11:00am", "11:00"
  let clean = rawQuery.replace(/\b\d{1,2}:\d{2}\s*(?:a\.?m\.?|p\.?m\.?)?/gi, "").trim();

  // 2. Si incluye "SKU:" o "sku:" en cualquier parte, extraer el token inmediatamente después (incluyendo paréntesis y espacios internos como "MW5G (3-PACK)")
  const explicitSkuMatch = clean.match(/sku:\s*([A-Za-z0-9\-\/\.\s\(\)]+?)(?:\s*(?:[\n\r]|$|\b(?:por|en|de|con|para)\b|[,\.\?!]))/i);
  if (explicitSkuMatch && explicitSkuMatch[1]) {
    let token = explicitSkuMatch[1].trim();
    token = token.replace(/^[^\w\d]+|[^\w\d\)]+$/g, "").trim();
    if (token) return token;
  }

  // 3. Precedido por palabras clave (modelo, equipo, código, etc.)
  const kwMatch = clean.match(/(?:modelo|equipo|código|codigo)\s*:?\s*([A-Za-z0-9\-\/\.\s\(\)]+?)(?:\s*(?:[\n\r]|$|\b(?:por|en|de|con|para)\b|[,\.\?!]))/i);
  if (kwMatch && kwMatch[1]) {
    let token = kwMatch[1].trim();
    token = token.replace(/^[^\w\d]+|[^\w\d\)]+$/g, "").trim();
    if (token) return token;
  }

  // 4. Buscar patrón técnico de modelo con guion/diagonal (ej. 2600-858, DS-2CD2043G0-I, ST-1460E, MX12-3, DK-9300)
  const skuMatch = clean.match(/\b([A-Za-z0-9]+(?:[\-\/][A-Za-z0-9]+)+)\b/);
  if (skuMatch && skuMatch[1]) {
    return skuMatch[1].trim();
  }

  return sanitizeQuery(clean);
}

export function sanitizeQuery(rawQuery: string): string {
  if (!rawQuery) return "";

  // Limpiar horas/timestamps
  let clean = rawQuery.replace(/\b\d{1,2}:\d{2}\s*(?:a\.?m\.?|p\.?m\.?)?/gi, "").trim();

  // Si incluye "sku:", extraer solo lo que sigue a SKU:
  const skuIndex = clean.toLowerCase().indexOf("sku:");
  if (skuIndex !== -1) {
    clean = clean.substring(skuIndex + 4).trim();
  }

  // Remover puntuación al inicio y final pero conservando guiones y paréntesis internos
  clean = clean.replace(/^[^\w\d]+|[^\w\d\)]+$/g, "").trim();
  return clean;
}


