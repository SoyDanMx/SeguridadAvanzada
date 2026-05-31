/**
 * Tipos para el carrito de compras.
 * Alineado con ProductWithPricing para items desde Syscom.
 */

export interface CartItem {
  sku: string;
  descripcion: string;
  imagen?: string;
  precioMxn: number;
  cantidad: number;
}

export function cartItemSubtotal(item: CartItem): number {
  return item.precioMxn * item.cantidad;
}
