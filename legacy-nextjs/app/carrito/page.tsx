"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { productImageUrl, canUseNextImage } from "@/lib/product-image";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525636741156";

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function buildWhatsAppOrderMessage(items: { descripcion: string; cantidad: number; precioMxn: number }[], subtotal: number): string {
  const lines = items.map(
    (i) => `${i.descripcion} - ${i.cantidad} x ${formatPrice(i.precioMxn)}`
  );
  return `¡Hola! Quiero hacer el siguiente pedido:\n\n${lines.join("\n")}\n\nSubtotal: ${formatPrice(subtotal)}\n\n¡Gracias!`;
}

export default function CarritoPage() {
  const { items, subtotal, increaseQuantity, decreaseQuantity, removeItem, clearCart } = useCart();
  const [removingSku, setRemovingSku] = React.useState<string | null>(null);

  const handleRemoveConfirm = (sku: string) => {
    setRemovingSku(sku);
  };

  const handleRemoveCancel = () => {
    setRemovingSku(null);
  };

  const handleRemoveConfirmYes = () => {
    if (removingSku) {
      removeItem(removingSku);
      setRemovingSku(null);
    }
  };

  const handleWhatsApp = () => {
    const msg = buildWhatsAppOrderMessage(items, subtotal);
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  if (items.length === 0 && !removingSku) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Link href="/productos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background-alt py-16 text-center">
          <ShoppingCart className="h-16 w-16 text-foreground-muted" />
          <h2 className="mt-4 text-xl font-semibold text-foreground">
            Tu carrito está vacío
          </h2>
          <p className="mt-2 text-sm text-foreground-muted">
            Agrega productos desde el catálogo para continuar.
          </p>
          <Link href="/productos" className="mt-6">
            <Button variant="accent" className="gap-2">
              Continuar comprando
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/productos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continuar comprando
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">
          Resumen de mi pedido
        </h1>
      </div>

      <div className="overflow-hidden rounded-lg border border-border bg-background-alt">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="px-4 py-3 font-semibold text-foreground">
                  Producto
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Cantidad
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Precio
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.sku}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md border border-border bg-background">
                        {item.imagen ? (
                          (() => {
                            const url = productImageUrl(item.imagen);
                            return url && canUseNextImage(url) ? (
                              <Image
                                src={url}
                                alt={item.descripcion}
                                fill
                                className="object-contain p-1"
                                sizes="56px"
                              />
                            ) : url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={url}
                                alt={item.descripcion}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : null;
                          })()
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {item.descripcion}
                        </p>
                        <p className="text-xs text-foreground-muted">
                          SKU: {item.sku}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => decreaseQuantity(item.sku)}
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="min-w-[2rem] text-center font-medium">
                        {item.cantidad}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => increaseQuantity(item.sku)}
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-foreground">
                      {formatPrice(item.precioMxn * item.cantidad)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-error hover:bg-error/10 hover:text-error"
                      onClick={() => handleRemoveConfirm(item.sku)}
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-border bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-lg font-bold text-foreground">
            Total a pagar: {formatPrice(subtotal)}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearCart}>
              Vaciar carrito
            </Button>
            <Button
              variant="accent"
              className="gap-2"
              onClick={handleWhatsApp}
            >
              Enviar pedido por WhatsApp
            </Button>
          </div>
        </div>
      </div>

      {/* Modal eliminar producto */}
      {removingSku && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="w-full max-w-sm rounded-lg border border-border bg-background-alt p-6 shadow-xl">
            <h2 id="modal-title" className="text-lg font-semibold text-foreground">
              Eliminar producto
            </h2>
            <p className="mt-2 text-sm text-foreground-muted">
              ¿Estás seguro de eliminar este producto del carrito?
            </p>
            <div className="mt-6 flex gap-2 justify-end">
              <Button variant="outline" onClick={handleRemoveCancel}>
                No
              </Button>
              <Button
                variant="default"
                className="bg-[var(--color-error)] text-white hover:bg-[var(--color-error)]/90"
                onClick={handleRemoveConfirmYes}
              >
                Sí, eliminar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
