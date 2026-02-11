import { NextRequest, NextResponse } from "next/server";
import type { SyscomProduct } from "@/lib/syscom-client";
import { usdToMxnWithMargin } from "@/lib/pricing";

const TIENDANUBE_APP_ID = 26095;

/**
 * Formato Tiendanube para producto (variants, images, description).
 * Endpoint preparado para enviar producto Syscom a Tiendanube (App ID 26095).
 */
export interface TiendanubeProductPayload {
  name: string;
  description?: string;
  variants: Array<{
    sku?: string;
    price: string;
    stock?: number;
  }>;
  images?: Array<{ src: string; alt?: string }>;
}

/** Syscom devuelve precios en "precios" (plural) o "precio"; valores pueden ser string o number. */
function extractPrecioNum(p: SyscomProduct): number {
  const raw = (p as { precios?: unknown; precio?: unknown }).precios ?? p.precio;
  if (raw == null) return 0;
  if (typeof raw === "number") return raw;
  const obj = raw as Record<string, unknown>;
  const v = obj.precio_especial ?? obj.precio_1 ?? obj.precio_descuento ?? obj.precio_lista;
  if (v == null) return 0;
  const num = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(num) && num > 0 ? num : 0;
}

function mapSyscomToTiendanube(product: SyscomProduct): TiendanubeProductPayload {
  const precio = extractPrecioNum(product);
  const moneda = product.moneda ?? "USD";
  const priceMxn =
    precio > 0 && moneda === "USD"
      ? usdToMxnWithMargin(precio)
      : precio;

  const sku = product.sku ?? product.modelo ?? String(product.producto_id ?? "");
  const name = (product.descripcion ?? product.titulo ?? sku) || "Sin nombre";
  const imagen = product.img_portada ?? product.imagen ?? (Array.isArray(product.imagenes) && product.imagenes[0]
    ? (typeof product.imagenes[0] === "string" ? product.imagenes[0] : (product.imagenes[0] as { url?: string })?.url)
    : undefined);

  return {
    name,
    description: product.descripcion
      ? `${product.descripcion}\n\nSKU: ${sku}`
      : `SKU: ${sku}`,
    variants: [
      {
        sku: sku || undefined,
        price: priceMxn.toFixed(2),
        stock: undefined,
      },
    ],
    images: imagen ? [{ src: imagen, alt: name }] : undefined,
  };
}

/**
 * POST: Recibe un producto Syscom (body) y devuelve el payload formateado para Tiendanube.
 * En producción aquí se haría el POST a la API de Tiendanube con el App ID 26095.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = body as SyscomProduct;

    if (!product.sku) {
      return NextResponse.json(
        { error: "Missing product.sku" },
        { status: 400 }
      );
    }

    const payload = mapSyscomToTiendanube(product);

    return NextResponse.json({
      appId: TIENDANUBE_APP_ID,
      payload,
      message:
        "Payload listo para Tiendanube. En producción aquí se enviaría a la API de Tiendanube.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
