function getEnvNumber(key: string, fallback: number): number {
  const v = process.env[key];
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/** Tipo de cambio USD -> MXN (env EXCHANGE_RATE_USD_MXN o 18.5). */
function getUsdToMxn(): number {
  return getEnvNumber("EXCHANGE_RATE_USD_MXN", 18.5);
}

/** Factor de margen sobre costo (env PROFIT_MARGIN: 1.30 = 30%, o 0.3 interno). */
function getMarginFactor(): number {
  const v = process.env.PROFIT_MARGIN;
  if (v == null || v === "") return 0.3;
  const n = Number(v);
  if (!Number.isFinite(n)) return 0.3;
  return n >= 1 ? n - 1 : n; // 1.30 -> 0.30, 0.30 -> 0.30
}

/**
 * Convierte precio en USD a MXN y aplica margen (PROFIT_MARGIN / EXCHANGE_RATE_USD_MXN en .env).
 */
export function usdToMxnWithMargin(usdPrice: number): number {
  const mxn = usdPrice * getUsdToMxn();
  return roundToTwo(mxn * (1 + getMarginFactor()));
}

/**
 * Aplica solo el margen sobre un precio ya en MXN.
 */
export function applyMarginMxn(mxnPrice: number): number {
  return roundToTwo(mxnPrice * (1 + getMarginFactor()));
}

export function getUsdToMxnRate(): number {
  return getUsdToMxn();
}

export function getMargin(): number {
  return getMarginFactor();
}

function roundToTwo(n: number): number {
  return Math.round(n * 100) / 100;
}
