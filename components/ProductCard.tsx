"use client";

import Image from "next/image";
import Link from "next/link";
import { Package, MessageCircle, ShoppingCart } from "lucide-react";
import type { ProductWithPricing } from "@/lib/catalog-types";
import { productImageUrl, canUseNextImage } from "@/lib/product-image";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525636741156";

function safeRender(val: unknown): string {
  if (val == null) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (typeof val === "object" && val !== null && "nombre" in val) {
    const n = (val as { nombre?: string }).nombre;
    return typeof n === "string" ? n : "";
  }
  return "";
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function buildWhatsAppMessage(product: ProductWithPricing): string {
  const nombre = product.descripcion ?? product.titulo ?? product.sku;
  const precio =
    product.precioConMargenMxn != null
      ? formatPrice(product.precioConMargenMxn)
      : "consultar";
  return `Deseo adquirir el ${nombre} SKU: ${product.sku} con precio de ${precio}`;
}

export function ProductCard({ product }: { product: ProductWithPricing }) {
  const { addItem } = useCart();
  const title = product.descripcion ?? product.sku ?? "Sin nombre";
  const priceMxn = product.precioConMargenMxn;
  const imgUrl = productImageUrl(product.imagen);
  const useNextImg = canUseNextImage(imgUrl);

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      <Link href={`/productos/${encodeURIComponent(product.sku)}`} className="flex flex-col flex-1">
        {product.marca && (
          <span className="mx-2 mt-2 inline-block w-fit rounded-md bg-red-600 px-2 py-0.5 text-xs font-bold text-white">
            {safeRender(product.marca)}
          </span>
        )}
        <div className="relative aspect-square w-full bg-white">
          {imgUrl ? (
            useNextImg ? (
              <Image
                src={imgUrl}
                alt={title}
                fill
                className="product-image-responsive object-contain p-2"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={imgUrl}
                alt={title}
                className="product-image-responsive h-full w-full object-contain p-2"
              />
            )
          ) : (
            <div className="flex h-full w-full items-center justify-center text-foreground-muted">
              <Package className="h-12 w-12" />
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <p className="line-clamp-2 text-base font-semibold text-slate-800">
            {title}
          </p>
          <p className="text-xs text-slate-500">SKU: {product.sku}</p>
          <div className="flex flex-wrap gap-1.5">
            <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground-muted shadow-sm">
              <span className="mr-1 text-foreground-muted/70">SKU:</span> {product.sku}
            </span>
            {product.marca && (
              <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground-muted shadow-sm">
                <span className="mr-1 text-foreground-muted/70">Marca:</span> {safeRender(product.marca)}
              </span>
            )}
            {product.categoria && (
              <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground-muted shadow-sm">
                <span className="mr-1 text-foreground-muted/70">Categoría:</span> {safeRender(product.categoria)}
              </span>
            )}
            {product.garantia != null && safeRender(product.garantia) && (
              <span className="inline-flex items-center rounded-md border border-border bg-background px-2 py-1 text-xs font-medium text-foreground-muted shadow-sm">
                <span className="mr-1 text-foreground-muted/70">Garantía:</span> {safeRender(product.garantia)}
              </span>
            )}
            {product.existencia != null && product.existencia > 0 && (
              <span className="inline-flex items-center rounded-md border border-success/30 bg-success-bg px-2 py-1 text-xs font-medium text-success shadow-sm">
                En stock: {product.existencia}
              </span>
            )}
          </div>
          {priceMxn != null && (
            <p className="pt-1 text-xl font-bold text-syscom-accent">
              {formatPrice(priceMxn)}
            </p>
          )}
        </div>
      </Link>
      <div className="mx-4 mb-4 flex flex-col gap-2 sm:flex-row" onClick={(e) => e.stopPropagation()}>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2"
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
        >
          <ShoppingCart className="h-4 w-4" />
          Agregar
        </Button>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(product))}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1"
        >
          <span className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#25D366] bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#20C35A]">
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </span>
        </a>
      </div>
    </article>
  );
}
