/**
 * Motor de sincronización Syscom → Base de datos.
 * Descarga catálogo, calcula precios y hace upsert por SKU.
 */

import { PrismaClient } from "@prisma/client";
import { fetchProducts, type SyscomProductRaw } from "./syscom-api";
import { usdToMxnWithMargin, applyMarginMxn } from "./pricing";
import { SYSCOM_CATEGORIES } from "./categories";

const prisma = new PrismaClient();

const RATE_LIMIT_DELAY_MS = 1100; // ~55 req/min (bajo 60)

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function extractPrecio(p: SyscomProductRaw): number | null {
  const raw = (p as { precios?: unknown; precio?: unknown }).precios ?? p.precio;
  if (raw == null) return null;
  if (typeof raw === "number") return raw > 0 ? raw : null;
  const obj = raw as Record<string, unknown>;
  const v = obj.precio_especial ?? obj.precio_1 ?? obj.precio_descuento ?? obj.precio_lista;
  if (v == null) return null;
  const num = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function extractImagen(p: SyscomProductRaw): string | undefined {
  if (p.img_portada) return p.img_portada;
  if (p.imagen) return p.imagen;
  const imgs = p.imagenes;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    return typeof first === "string" ? first : (first as { url?: string })?.url;
  }
  return undefined;
}

function extractMarca(p: SyscomProductRaw): string | undefined {
  const m = p.marca;
  if (typeof m === "string" && m.trim()) return m.trim();
  if (m && typeof m === "object" && typeof (m as { nombre?: string }).nombre === "string") {
    return (m as { nombre: string }).nombre.trim();
  }
  return undefined;
}

function extractCategoria(p: SyscomProductRaw): string | undefined {
  if (p.categoria) return String(p.categoria);
  const cats = (p as { categorias?: unknown }).categorias;
  if (Array.isArray(cats) && cats.length > 0) {
    const first = cats[0];
    return typeof first === "string" ? first : (first as { nombre?: string })?.nombre ?? String(first);
  }
  return undefined;
}

function extractStock(p: SyscomProductRaw): number {
  if (typeof p.existencia === "number") return p.existencia;
  if (typeof (p as { total_existencia?: number }).total_existencia === "number") {
    return (p as { total_existencia: number }).total_existencia;
  }
  return 0;
}

export interface SyncResult {
  ok: boolean;
  totalProcessed: number;
  totalUpserted: number;
  totalErrors: number;
  categoriesProcessed: number;
  durationMs: number;
  error?: string;
  logs: string[];
}

export async function runSync(): Promise<SyncResult> {
  const start = Date.now();
  const logs: string[] = [];
  let totalProcessed = 0;
  let totalUpserted = 0;
  let totalErrors = 0;

  const log = (msg: string) => {
    logs.push(`[${new Date().toISOString()}] ${msg}`);
    console.log(msg);
  };

  try {
    const categories = SYSCOM_CATEGORIES.filter((c) => c.syscomId);
    if (categories.length === 0) {
      log("No hay categorías con syscomId configurado");
      return {
        ok: false,
        totalProcessed: 0,
        totalUpserted: 0,
        totalErrors: 0,
        categoriesProcessed: 0,
        durationMs: Date.now() - start,
        logs,
      };
    }

    log(`Iniciando sync: ${categories.length} categorías`);

    for (const cat of categories) {
      const catId = cat.syscomId!;
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        try {
          const { products, total } = await fetchProducts({
            category: catId,
            page,
            limit: 60,
          });

          for (const p of products) {
            try {
              const precioUsd = extractPrecio(p);
              if (precioUsd == null) continue;

              const moneda = (p.moneda ?? "USD") as string;
              const priceMxn =
                moneda === "USD"
                  ? usdToMxnWithMargin(precioUsd)
                  : applyMarginMxn(precioUsd);

              const sku =
                (p.sku ?? p.modelo ?? String(p.producto_id ?? "")).trim() || null;
              if (!sku) continue;

              const name = (p.titulo ?? p.descripcion ?? "").trim() || "Sin nombre";
              const description = (p.descripcion ?? p.titulo ?? null)?.trim() ?? null;
              const imageUrl = extractImagen(p) ?? null;
              const brand = extractMarca(p) ?? null;
              const category = extractCategoria(p) ?? null;
              const stock = extractStock(p);

              await prisma.product.upsert({
                where: { sku },
                create: {
                  sku,
                  name,
                  description,
                  price_usd: precioUsd,
                  price_mxn: priceMxn,
                  stock,
                  brand,
                  image_url: imageUrl,
                  category,
                },
                update: {
                  name,
                  description,
                  price_usd: precioUsd,
                  price_mxn: priceMxn,
                  stock,
                  brand,
                  image_url: imageUrl,
                  category,
                },
              });

              totalUpserted++;
            } catch (e) {
              totalErrors++;
              log(`Error upsert ${p.sku ?? p.modelo}: ${e instanceof Error ? e.message : String(e)}`);
            }
            totalProcessed++;
          }

          hasMore = products.length >= 60 && page * 60 < (total ?? 0);
          page++;
          await sleep(RATE_LIMIT_DELAY_MS);
        } catch (e) {
          log(`Error categoría ${cat.label} página ${page}: ${e instanceof Error ? e.message : String(e)}`);
          totalErrors++;
          hasMore = false;
        }
      }

      log(`Categoría ${cat.label} completada`);
    }

    const durationMs = Date.now() - start;
    log(`Sync completado: ${totalUpserted} upserted, ${totalErrors} errores, ${durationMs}ms`);

    return {
      ok: true,
      totalProcessed,
      totalUpserted,
      totalErrors,
      categoriesProcessed: categories.length,
      durationMs,
      logs,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    log(`Sync falló: ${msg}`);
    return {
      ok: false,
      totalProcessed,
      totalUpserted,
      totalErrors,
      categoriesProcessed: 0,
      durationMs: Date.now() - start,
      error: msg,
      logs,
    };
  } finally {
    await prisma.$disconnect();
  }
}
