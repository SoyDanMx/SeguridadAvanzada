import fs from "fs";
import path from "path";

function getCachedExchangeRate(): number | null {
  try {
    const cachePath = path.resolve(process.cwd(), "../ecommerce-sync/data/cache/exchange-rate.json");
    if (fs.existsSync(cachePath)) {
      const data = JSON.parse(fs.readFileSync(cachePath, "utf-8"));
      if (typeof data.rate === "number" && data.rate > 10 && data.rate < 35) {
        return data.rate;
      }
    }
  } catch {
    // ignore
  }
  return null;
}

function getEnvNumber(key: string, fallback: number): number {
  const v = process.env[key];
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

/**
 * Tipo de cambio USD -> MXN oficial (Banxico FIX / cache persistente o env).
 * Fallback canónico: 18.7005.
 */
export function getUsdToMxn(): number {
  const cached = getCachedExchangeRate();
  if (cached) return cached;
  return getEnvNumber("EXCHANGE_RATE_USD_MXN", 18.7005);
}

/**
 * Multiplicador Canónico Oficial de Seguridad Avanzada: 1.48
 * Ecuación: Math.ceil(costoNetoMXN * 1.48)
 * Incorpora IVA 16% y margen bruto sobre venta del 21.62%
 */
export const CANONICAL_MULTIPLIER = 1.48;

/**
 * Calcula el PVP canónico en MXN (con IVA) a partir del costo neto del distribuidor en USD o MXN.
 */
export function calculatePvpMxn(cost: number, currency: "USD" | "MXN" = "USD", mapPrice?: number): number {
  const fx = getUsdToMxn();
  const costNetoMxn = currency === "USD" ? cost * fx : cost;
  let pvp = Math.ceil(costNetoMxn * CANONICAL_MULTIPLIER);

  if (mapPrice && mapPrice > 0) {
    const mapMxn = currency === "USD" ? mapPrice * fx * 1.16 : mapPrice * 1.16;
    if (mapMxn > pvp) {
      pvp = Math.ceil(mapMxn);
    }
  }

  return pvp;
}

/**
 * Convierte precio en USD a MXN y aplica margen canónico.
 */
export function usdToMxnWithMargin(usdPrice: number): number {
  return calculatePvpMxn(usdPrice, "USD");
}

/**
 * Aplica solo el margen canónico sobre un precio ya en MXN.
 */
export function applyMarginMxn(mxnPrice: number): number {
  return calculatePvpMxn(mxnPrice, "MXN");
}

export function getUsdToMxnRate(): number {
  return getUsdToMxn();
}

export function getMargin(): number {
  return 0.48;
}

function roundToTwo(n: number): number {
  return Math.round(n * 100) / 100;
}

