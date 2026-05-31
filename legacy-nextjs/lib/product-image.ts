const SYSCOM_IMAGE_BASE = "https://api.syscom.mx";

/**
 * Construye la URL absoluta de la imagen de producto (Syscom u otra).
 */
export function productImageUrl(imagen?: string | null): string | null {
  if (!imagen?.trim()) return null;
  if (imagen.startsWith("http")) return imagen;
  const base = SYSCOM_IMAGE_BASE.replace(/\/$/, "");
  const path = imagen.startsWith("/") ? imagen : `/${imagen}`;
  return `${base}${path}`;
}

/** Dominios permitidos para next/image (api.syscom.mx). */
export const SYSCOM_IMAGE_ORIGIN = "https://api.syscom.mx";

/**
 * Indica si la URL puede usarse con next/image (debe estar en remotePatterns de next.config).
 */
export function canUseNextImage(url: string | null): boolean {
  return url?.startsWith(SYSCOM_IMAGE_ORIGIN) ?? false;
}
