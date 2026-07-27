/**
 * Módulo Centralizado de Precios (PricingService)
 * Encargado de limpiar datos de entrada sucios de la IA y calcular el desglose de IVA con precisión.
 */

export class PricingService {
  /**
   * Extrae un número limpio a partir de cualquier string alucinado por la IA.
   * Ejemplos soportados: "$313.83 MXN", "313,83", "313.83", "$ 313"
   */
  static parseAgentPrice(rawPrice: any): number {
    if (typeof rawPrice === "number") {
      return rawPrice;
    }
    
    if (typeof rawPrice !== "string") {
      return 0;
    }

    // Remover caracteres no numéricos excepto el punto y la coma
    const cleaned = rawPrice.replace(/[^\d.,]/g, '');
    
    // En México (es-MX), la coma ',' se usa para miles (1,200.50) y el punto '.' para decimales.
    // Simplemente eliminamos todas las comas y parseamos el float.
    const normalized = cleaned.replace(/,/g, '');

    const parsed = parseFloat(normalized);
    return isNaN(parsed) ? 0 : parsed;
  }

  /**
   * Recibe el precio público (CON IVA) y extrae el Unitario, el IVA y el Total.
   * Por defecto, la tasa es 16% (0.16) para México.
   */
  static breakdownTax(priceWithTax: number, taxRate: number = 0.16) {
    const total = priceWithTax;
    const subtotal = total / (1 + taxRate);
    const tax = total - subtotal;
    
    return {
      subtotal,
      tax,
      total
    };
  }

  /**
   * Calcula los totales para un carrito de compras entero (lista de items).
   * Devuelve los totales exactos desglosados y los items modificados con su unitPrice sin IVA.
   */
  static calculateCartTotals(items: any[], taxRate: number = 0.16) {
    let cartTotal = 0;
    
    const processedItems = items.map(item => {
      // Limpiar el precio sucio que envía el agente (éste es el precio público CON IVA)
      const publicPrice = this.parseAgentPrice(item.unitPrice || 0);
      const qty = parseInt(item.quantity) || 1;
      
      const itemBreakdown = this.breakdownTax(publicPrice, taxRate);
      
      cartTotal += publicPrice * qty;

      return {
        ...item,
        quantity: qty,
        unitPrice: itemBreakdown.subtotal, // Guardar el unitario SIN IVA para el PDF
        amount: itemBreakdown.subtotal * qty
      };
    });

    const finalBreakdown = this.breakdownTax(cartTotal, taxRate);

    return {
      items: processedItems,
      subtotal: finalBreakdown.subtotal,
      tax: finalBreakdown.tax,
      total: finalBreakdown.total
    };
  }
}
