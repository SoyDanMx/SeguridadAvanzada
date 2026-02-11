"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Package, ExternalLink, MessageCircle, Truck, Calendar, ChevronRight, Shield, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductoDetalleBreadcrumbs } from "@/components/Breadcrumbs";
import type { ProductWithPricing } from "@/lib/catalog-types";
import { useCart } from "@/contexts/CartContext";
import { productImageUrl, canUseNextImage } from "@/lib/product-image";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525636741156";

/** Convierte cualquier valor a string seguro para renderizar (evita objetos como children). */
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

export default function ProductoDetallePage() {
  const params = useParams();
  const sku = typeof params.sku === "string" ? params.sku : "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["product", sku],
    queryFn: async (): Promise<ProductWithPricing | null> => {
      const res = await fetch(`/api/products?q=${encodeURIComponent(sku)}&limit=1`);
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(json.error ?? res.statusText) as Error & { status?: number };
        err.status = res.status;
        throw err;
      }
      const products = json.products ?? [];
      const match = products.find((p: ProductWithPricing) => p.sku === sku);
      return match ?? null;
    },
    enabled: !!sku,
  });

  const product = data ?? null;
  const { addItem } = useCart();
  const allImages = React.useMemo(() => {
    if (product?.imagenes?.length) return product.imagenes;
    if (product?.imagen) return [product.imagen];
    return [];
  }, [product?.imagen, product?.imagenes]);
  const [selectedImgIndex, setSelectedImgIndex] = React.useState(0);
  const mainImgSrc = allImages[selectedImgIndex] ?? product?.imagen;
  const imgUrl = product ? productImageUrl(mainImgSrc ?? product.imagen) : null;
  const useNextImg = canUseNextImage(imgUrl);

  if (!sku) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-800">
        SKU no válido.
      </div>
    );
  }

  if (error) {
    const status = (error as Error & { status?: number }).status;
    const is404 = status === 404;
    const is5xx = status != null && status >= 500;
    return (
      <div className="space-y-4">
        <Link href="/productos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          {is404 && (
            <>
              <p className="font-medium">Recurso no encontrado</p>
              <p className="mt-1 text-sm">La API no está disponible o el producto ya no existe.</p>
            </>
          )}
          {is5xx && (
            <>
              <p className="font-medium">Error del servidor</p>
              <p className="mt-1 text-sm">Vuelve a intentar en unos momentos.</p>
            </>
          )}
          {!is404 && !is5xx && (
            <>
              <p className="font-medium">No se pudo cargar el producto</p>
              <p className="mt-1 text-sm">Revisa las credenciales de Syscom en .env.local.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-syscom-accent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="space-y-4">
        <Link href="/productos">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al catálogo
          </Button>
        </Link>
        <div className="flex flex-col items-center justify-center rounded-xl border border-syscom-border bg-white py-16 text-center">
          <Package className="h-12 w-12 text-slate-400" />
          <p className="mt-2 font-medium text-syscom-primary">
            Producto no encontrado
          </p>
          <p className="text-sm text-slate-500">SKU: {sku}</p>
        </div>
      </div>
    );
  }

  const title = product.descripcion ?? product.sku;

  return (
    <div className="space-y-6">
      <ProductoDetalleBreadcrumbs sku={product.sku} title={title} />
      <Link href="/productos">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al catálogo
        </Button>
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Columna izquierda: imagen y galería (estilo CyberPuerta) */}
        <div className="space-y-4">
          {product.marca && (
            <span className="inline-block rounded-md bg-red-600 px-4 py-1.5 text-sm font-bold text-white shadow-sm">
              {safeRender(product.marca)}
            </span>
          )}
          <div className="relative aspect-square overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {imgUrl ? (
              useNextImg ? (
                <Image
                  src={imgUrl}
                  alt={title}
                  fill
                  className="object-contain p-6"
                  priority
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imgUrl}
                  alt={title}
                  className="h-full w-full object-contain p-6"
                />
              )
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-50 text-slate-400">
                <Package className="h-24 w-24" />
              </div>
            )}
          </div>
          {allImages.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {allImages.slice(0, 5).map((src, i) => {
                const url = productImageUrl(src);
                if (!url) return null;
                const isSelected = i === selectedImgIndex;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImgIndex(i)}
                    className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-all ${
                      isSelected
                        ? "border-syscom-primary shadow-md ring-2 ring-syscom-primary/20"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {canUseNextImage(url) ? (
                      <Image
                        src={url}
                        alt={`${title} - imagen ${i + 1}`}
                        fill
                        className="object-contain p-1"
                        sizes="64px"
                      />
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={url}
                        alt={`${title} - imagen ${i + 1}`}
                        className="h-full w-full object-contain p-1"
                      />
                    )}
                  </button>
                );
              })}
              {allImages.length > 5 && (
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-md border-2 border-dashed border-slate-200 bg-slate-50 text-xs font-medium text-slate-500">
                  +{allImages.length - 5}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: detalles y CTA (estilo CyberPuerta) */}
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-bold leading-tight text-slate-800 sm:text-3xl">
            {title}
          </h1>
          <p className="text-sm text-slate-600">SKU: {product.sku}</p>
          {product.existencia != null && product.existencia > 0 && (
            <p className="text-sm font-medium text-slate-700">
              Solo {product.existencia} pzas. disponibles
            </p>
          )}
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <Truck className="h-4 w-4 text-slate-500" />
              Envío disponible
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-slate-500" />
              Consultar tiempos de entrega
            </span>
          </div>
          {product.precioConMargenMxn != null && (
            <div className="mt-2">
              <p className="text-3xl font-bold text-syscom-accent sm:text-4xl">
                {formatPrice(product.precioConMargenMxn)}
              </p>
            </div>
          )}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button
              variant="default"
              size="lg"
              className="w-full gap-2 rounded-lg px-8 py-6 text-base font-semibold shadow-md sm:w-auto"
              onClick={() => addItem(product)}
            >
              <ShoppingCart className="h-5 w-5" />
              Agregar al carrito
            </Button>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildWhatsAppMessage(product))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto"
            >
              <Button
                variant="accent"
                size="lg"
                className="w-full gap-2 rounded-lg px-8 py-6 text-base font-semibold shadow-md sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" />
                Comprar por WhatsApp
              </Button>
            </a>
          </div>

          {product.garantia != null && safeRender(product.garantia) && (
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    Protege tu inversión con garantía
                  </h3>
                  <p className="mt-1 text-sm text-slate-600">
                    Este producto incluye garantía de {safeRender(product.garantia)}. Contáctanos para más detalles.
                  </p>
                </div>
              </div>
            </div>
          )}

          <section>
            <h2 className="mb-2 text-base font-semibold text-slate-800">
              Descripción
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
              {product.descripcion ?? product.titulo ?? "Sin descripción disponible."}
            </p>
          </section>

          {product.datasheet && (
            <a
              href={product.datasheet}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-syscom-primary hover:underline"
            >
              Ficha técnica
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

          {(product.especificaciones && Object.keys(product.especificaciones).length > 0) ||
          (product.peso != null || product.alto != null || product.largo != null || product.ancho != null) ? (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-800">
                Especificaciones esenciales
              </h2>
              <ul className="space-y-2 text-sm text-slate-700">
                {product.especificaciones &&
                  Object.entries(product.especificaciones).map(([k, v]) => (
                    <li key={k} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-syscom-primary" />
                      <span><span className="font-medium text-slate-600">{k}:</span> {safeRender(v)}</span>
                    </li>
                  ))}
                {product.peso != null && (
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-syscom-primary" />
                    <span>Peso: {String(product.peso)}{safeRender(product.unidad_de_medida) ? ` ${safeRender(product.unidad_de_medida)}` : ""}</span>
                  </li>
                )}
                {product.alto != null && (
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-syscom-primary" />
                    <span>Alto: {String(product.alto)}</span>
                  </li>
                )}
                {product.largo != null && (
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-syscom-primary" />
                    <span>Largo: {String(product.largo)}</span>
                  </li>
                )}
                {product.ancho != null && (
                  <li className="flex items-start gap-2">
                    <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-syscom-primary" />
                    <span>Ancho: {String(product.ancho)}</span>
                  </li>
                )}
              </ul>
            </section>
          ) : null}

          {product.caracteristicas && product.caracteristicas.length > 0 && (
            <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-base font-semibold text-slate-800">
                Características
              </h2>
              <ul className="space-y-2 text-sm text-slate-700">
                {product.caracteristicas
                  .map((c) => safeRender(c))
                  .filter(Boolean)
                  .map((text, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-4 w-4 shrink-0 text-syscom-primary" />
                      <span>{text}</span>
                    </li>
                  ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
