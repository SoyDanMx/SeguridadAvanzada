/**
 * Lee productos desde la base de datos (sincronizados por cron en la madrugada).
 * Evita depender de Syscom API en cada request.
 */

import { PrismaClient } from "@prisma/client";
import type { ProductWithPricing } from "./catalog-types";
import { getCategoryBySlug, getSubcategoryOrderIndex } from "./categories";

const prisma = new PrismaClient();

export interface GetProductsFromDbParams {
  category?: string;
  q?: string;
  page?: number;
  limit?: number;
}

/**
 * Resuelve el param de categoría (slug o ID) para filtrar en BD.
 * - Si tiene syscomId: filtra por syscom_category_id
 * - Si es slug sin syscomId (audio-y-video): filtra por category contiene label
 */
function buildCategoryFilter(
  param: string
): { syscom_category_id?: string; category?: { contains: string; mode: "insensitive" } } | undefined {
  const bySlug = getCategoryBySlug(param);
  if (bySlug?.syscomId) return { syscom_category_id: bySlug.syscomId };
  if (bySlug) return { category: { contains: bySlug.label, mode: "insensitive" } };
  if (/^\d+$/.test(param.trim())) return { syscom_category_id: param.trim() };
  return undefined;
}

/**
 * Obtiene productos desde la BD con filtros y paginación.
 */
export async function getProductsFromDb(
  params: GetProductsFromDbParams = {}
): Promise<{ products: ProductWithPricing[]; total: number }> {
  const { category, q, page = 1, limit = 24 } = params;
  const skip = (page - 1) * limit;
  const take = Math.min(60, Math.max(10, limit));

  const andClauses: Record<string, unknown>[] = [];

  const catFilter = category ? buildCategoryFilter(category) : undefined;
  if (catFilter) {
    andClauses.push(catFilter);
  }

  const search = q?.trim();
  if (search) {
    andClauses.push({
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { brand: { contains: search, mode: "insensitive" } },
      ],
    });
  }

  const where = andClauses.length > 0 ? { AND: andClauses } : {};

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take,
      orderBy: { last_updated: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  // Ordenar por subcategoría (category) según SUBCATEGORY_ORDER
  const sorted = [...products].sort((a, b) => {
    const idxA = getSubcategoryOrderIndex(a.category ?? undefined);
    const idxB = getSubcategoryOrderIndex(b.category ?? undefined);
    if (idxA !== idxB) return idxA - idxB;
    const catA = (a.category ?? "").toLowerCase();
    const catB = (b.category ?? "").toLowerCase();
    return catA.localeCompare(catB);
  });

  const withPricing: ProductWithPricing[] = sorted.map((p) => ({
    sku: p.sku,
    descripcion: p.name,
    titulo: p.name,
    precio: p.price_usd,
    precioOriginal: p.price_usd,
    precioConMargenMxn: p.price_mxn,
    imagen: p.image_url ?? undefined,
    categoria: p.category ?? undefined,
    marca: p.brand ?? undefined,
    existencia: p.stock,
    total_existencia: p.stock,
    categorias: p.category ? [p.category] : undefined,
  }));

  return { products: withPricing, total };
}

/**
 * Cuenta productos en BD. Útil para saber si hay datos o hacer fallback a Syscom.
 */
export async function getProductCount(): Promise<number> {
  return prisma.product.count();
}

/**
 * Obtiene un producto por SKU. Útil para la página de detalle.
 */
export async function getProductBySku(sku: string): Promise<ProductWithPricing | null> {
  const p = await prisma.product.findUnique({ where: { sku: sku.trim() } });
  if (!p) return null;
  return {
    sku: p.sku,
    descripcion: p.name,
    titulo: p.name,
    precio: p.price_usd,
    precioOriginal: p.price_usd,
    precioConMargenMxn: p.price_mxn,
    imagen: p.image_url ?? undefined,
    categoria: p.category ?? undefined,
    marca: p.brand ?? undefined,
    existencia: p.stock,
    total_existencia: p.stock,
    categorias: p.category ? [p.category] : undefined,
  };
}
