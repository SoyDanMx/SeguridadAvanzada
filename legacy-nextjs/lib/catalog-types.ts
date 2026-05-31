/**
 * Tipos compartidos para el catálogo (API de productos y componentes).
 */

export interface ProductWithPricing {
  sku: string;
  descripcion?: string;
  titulo?: string;
  precio?: number;
  moneda?: string;
  categoria?: string;
  imagen?: string;
  imagenes?: string[];
  datasheet?: string;
  especificaciones?: Record<string, string>;
  /** Precio original (costo) en la moneda de Syscom. */
  precioOriginal: number | null;
  /** Precio de venta en MXN con margen aplicado. */
  precioConMargenMxn: number | null;
  /** Campos adicionales de Syscom */
  marca?: string;
  garantia?: string;
  existencia?: number;
  total_existencia?: number;
  link?: string;
  peso?: string | number;
  alto?: string | number;
  largo?: string | number;
  ancho?: string | number;
  unidad_de_medida?: string;
  caracteristicas?: string[];
  /** Array de categorías (Syscom puede devolver array con nombre, id, etc.) */
  categorias?: string[];
  [key: string]: unknown;
}
