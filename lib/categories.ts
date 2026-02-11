/**
 * Categorías de equipos (disciplinas) según syscom.mx.
 * slug: usado en URL /productos?category=<slug>.
 * syscomId: ID de categoría en API Syscom (desde docs Colombia/México).
 */
export const SYSCOM_CATEGORIES = [
  { label: "Audio y Video", slug: "audio-y-video", syscomId: undefined },
  { label: "Automatización e Intrusión", slug: "automatizacion-e-intrusion", syscomId: "32" },
  { label: "Cableado Estructurado", slug: "cableado-estructurado", syscomId: "65811" },
  { label: "Control de Acceso", slug: "control-de-acceso", syscomId: "37" },
  { label: "Detección de Fuego", slug: "deteccion-de-fuego", syscomId: "38" },
  { label: "Energía / Herramientas", slug: "energia-herramientas", syscomId: "30" },
  { label: "IoT / GPS / Telemática y Señalización Audiovisual", slug: "iot-gps-telematica", syscomId: "27" },
  { label: "Radiocomunicación", slug: "radiocomunicacion", syscomId: "25" },
  { label: "Redes e IT", slug: "redes-e-it", syscomId: "26" },
  { label: "Robots e Industrial", slug: "robots-e-industrial", syscomId: undefined },
  { label: "Videovigilancia", slug: "videovigilancia", syscomId: "22" },
] as const;

export type SyscomCategory = (typeof SYSCOM_CATEGORIES)[number];

/** Valor de category para la API: prefiere syscomId si existe, si no slug */
export function getCategoryParam(item: SyscomCategory): string {
  return item.syscomId ?? item.slug;
}

/** Obtiene la categoría por slug (ej. "audio-y-video"). */
export function getCategoryBySlug(slug: string): SyscomCategory | undefined {
  return SYSCOM_CATEGORIES.find((c) => c.slug === slug);
}

/** Indica si el param es un slug de categoría (no numérico / no syscomId). */
export function isCategorySlug(param: string): boolean {
  return SYSCOM_CATEGORIES.some((c) => c.slug === param);
}

/** Enlaces para header/nav: href con category param */
export const CATEGORY_LINKS = SYSCOM_CATEGORIES.map((cat) => ({
  label: cat.label,
  href: `/productos?category=${getCategoryParam(cat)}`,
  categoryParam: getCategoryParam(cat),
}));

/**
 * Orden de subcategorías (categoria de producto) para agrupar y ordenar productos.
 * Syscom devuelve subcategorías como "Cámaras IP", "Discos Duros", etc.
 * Las que coincidan (por prefijo o contains) van primero según este orden.
 */
export const SUBCATEGORY_ORDER: string[] = [
  "Cámaras",
  "DVR",
  "NVR",
  "Accesorios",
  "Discos",
  "Almacenamiento",
  "Cable",
  "Gabinete",
  "Fuente",
  "Switch",
  "Router",
  "Access Point",
  "Software",
  "Herramientas",
  "Energía",
  "Batería",
  "UPS",
  "Solar",
  "Otros",
];

/** Índice de orden para una subcategoría (menor = primero). Las no listadas van al final. */
export function getSubcategoryOrderIndex(categoria: string | undefined): number {
  if (!categoria?.trim()) return 9999;
  const cat = categoria.trim().toLowerCase();
  const idx = SUBCATEGORY_ORDER.findIndex((s) =>
    cat.includes(s.toLowerCase()) || s.toLowerCase().includes(cat)
  );
  return idx >= 0 ? idx : 9999;
}
