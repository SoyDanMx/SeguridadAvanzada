/**
 * Genera slug amigable para URL a partir de modelo y categoría.
 */
export function productSlug(model: string, category?: string): string {
  const base = slugify(model);
  if (category) {
    return `${slugify(category)}/${base}`;
  }
  return base;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export interface MetaProduct {
  modelo: string;
  categoria?: string;
  descripcion?: string;
  sku?: string;
}

/**
 * Meta-tags para página de producto (título y descripción).
 */
export function productMeta(product: MetaProduct): {
  title: string;
  description: string;
} {
  const title = product.categoria
    ? `${product.modelo} | ${product.categoria} | Seguridad Avanzada`
    : `${product.modelo} | Seguridad Avanzada`;
  const description =
    product.descripcion?.slice(0, 155) ||
    `Producto ${product.modelo}${product.sku ? ` (SKU: ${product.sku})` : ""}. Seguridad electrónica.`;
  return { title, description };
}
