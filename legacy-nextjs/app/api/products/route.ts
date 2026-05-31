import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/syscom-client";
import type { SyscomProduct } from "@/lib/syscom-client";
import { usdToMxnWithMargin, applyMarginMxn } from "@/lib/pricing";
import type { ProductWithPricing } from "@/lib/catalog-types";
import { getCategoryBySlug, getSubcategoryOrderIndex } from "@/lib/categories";
import { getProductsFromDb, getProductCount, getProductBySku } from "@/lib/products-from-db";

export type { ProductWithPricing };

/** Syscom devuelve precios en "precios" (plural) o "precio", y los valores pueden ser string o number. */
function extractPrecio(p: SyscomProduct): number | null {
  const raw = (p as { precios?: unknown; precio?: unknown }).precios ?? p.precio;
  if (raw == null) return null;
  if (typeof raw === "number") return raw > 0 ? raw : null;
  const obj = raw as Record<string, unknown>;
  const v = obj.precio_especial ?? obj.precio_1 ?? obj.precio_descuento ?? obj.precio_lista;
  if (v == null) return null;
  const num = typeof v === "string" ? parseFloat(v) : Number(v);
  return Number.isFinite(num) && num > 0 ? num : null;
}

function extractImagen(p: SyscomProduct): string | undefined {
  if (p.img_portada) return p.img_portada;
  if (p.imagen) return p.imagen;
  const imgs = p.imagenes;
  if (Array.isArray(imgs) && imgs.length > 0) {
    const first = imgs[0];
    return typeof first === "string" ? first : (first as { url?: string })?.url;
  }
  return undefined;
}

/** Extrae todas las URLs de imágenes del producto. */
function extractImagenes(p: SyscomProduct): string[] {
  const urls: string[] = [];
  if (p.img_portada) urls.push(p.img_portada);
  if (p.imagen && !urls.includes(p.imagen)) urls.push(p.imagen);
  const imgs = p.imagenes;
  if (Array.isArray(imgs)) {
    imgs.forEach((item) => {
      const url = typeof item === "string" ? item : (item as { url?: string })?.url;
      if (url && !urls.includes(url)) urls.push(url);
    });
  }
  return urls;
}

/** Extrae categoria como string (Syscom puede devolver categorias como array). */
function extractCategoria(p: SyscomProduct): string | undefined {
  if (p.categoria) return String(p.categoria);
  const cats = (p as { categorias?: unknown }).categorias;
  if (Array.isArray(cats) && cats.length > 0) {
    const first = cats[0];
    return typeof first === "string" ? first : (first as { nombre?: string })?.nombre ?? String(first);
  }
  if (typeof cats === "string") return cats;
  return undefined;
}

/** Extrae categorias como array de strings (Syscom puede devolver objetos con nombre). */
function extractCategorias(p: SyscomProduct): string[] {
  const cats = (p as { categorias?: unknown }).categorias;
  if (!Array.isArray(cats)) return [];
  return cats
    .map((c) => (typeof c === "string" ? c : (c as { nombre?: string })?.nombre ?? String(c)))
    .filter(Boolean);
}

/** Extrae valor numérico o string de un campo (Syscom puede devolver número o string). */
function extractDimension(
  p: SyscomProduct,
  key: "peso" | "alto" | "largo" | "ancho"
): string | number | undefined {
  const raw = (p as Record<string, unknown>)[key];
  if (raw == null) return undefined;
  if (typeof raw === "number") return raw;
  const s = String(raw).trim();
  return s ? s : undefined;
}

/** Normaliza caracteristicas: items objeto ({nombre, etc}) → string. */
function normalizeCaracteristicas(arr: unknown[] | undefined): string[] | undefined {
  if (!Array.isArray(arr)) return undefined;
  const out: string[] = [];
  for (const item of arr) {
    if (typeof item === "string" && item.trim()) out.push(item.trim());
    else if (typeof item === "number") out.push(String(item));
    else if (item && typeof item === "object" && "nombre" in item) {
      const n = (item as { nombre?: string }).nombre;
      if (typeof n === "string" && n.trim()) out.push(n.trim());
    }
  }
  return out.length > 0 ? out : undefined;
}

/** Normaliza especificaciones: valores objeto ({nombre, codigo_unidad, etc}) → string. */
function normalizeEspecificaciones(
  spec: Record<string, unknown> | undefined
): Record<string, string> | undefined {
  if (!spec || typeof spec !== "object") return undefined;
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(spec)) {
    if (v == null) continue;
    if (typeof v === "string") out[k] = v;
    else if (typeof v === "number") out[k] = String(v);
    else if (typeof v === "object" && "nombre" in v) {
      const n = (v as { nombre?: string }).nombre;
      if (typeof n === "string") out[k] = n;
    } else if (typeof v === "object" && "codigo_unidad" in v) {
      const c = (v as { codigo_unidad?: string }).codigo_unidad;
      if (typeof c === "string") out[k] = c;
    }
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/** Extrae unidad_de_medida como string (Syscom puede devolver objeto con codigo_unidad, nombre, clave_unidad_sat). */
function extractUnidadDeMedida(p: SyscomProduct): string | undefined {
  const u = (p as { unidad_de_medida?: string | { nombre?: string; codigo_unidad?: string } }).unidad_de_medida;
  if (typeof u === "string" && u.trim()) return u.trim();
  if (u && typeof u === "object") {
    const n = (u as { nombre?: string }).nombre;
    const c = (u as { codigo_unidad?: string }).codigo_unidad;
    if (typeof n === "string" && n.trim()) return n.trim();
    if (typeof c === "string" && c.trim()) return c.trim();
  }
  return undefined;
}

/** Extrae marca (Syscom puede devolver string o objeto). */
function extractMarca(p: SyscomProduct): string | undefined {
  const m = (p as { marca?: string | { nombre?: string } }).marca;
  if (typeof m === "string" && m.trim()) return m.trim();
  if (m && typeof m === "object" && typeof (m as { nombre?: string }).nombre === "string") {
    return (m as { nombre: string }).nombre.trim();
  }
  return undefined;
}

/** Resuelve el param de categoría (slug o ID) al valor que entiende Syscom. Devuelve ID numérico. */
function resolveCategoryParam(param: string): string | undefined {
  const bySlug = getCategoryBySlug(param);
  if (bySlug?.syscomId) return bySlug.syscomId;
  // Si el param es ya un ID numérico (ej. "22" desde /productos?category=22), usarlo
  if (/^\d+$/.test(param.trim())) return param.trim();
  return undefined;
}

/**
 * API de productos: lee de BD (sincronizada en la madrugada) o fallback a Syscom si BD vacía.
 * La BD se actualiza por cron /api/cron/sync a las 8:00 UTC.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryRaw = searchParams.get("category") ?? undefined;
    const userSearch = searchParams.get("q") ?? undefined;
    const rawPage = Number(searchParams.get("page") ?? 1);
    const page = Number.isFinite(rawPage) && rawPage >= 1 ? rawPage : 1;
    const rawLimit = Number(searchParams.get("limit") ?? 24);
    const limit = Number.isFinite(rawLimit)
      ? Math.max(10, Math.min(60, rawLimit))
      : 24;

    // Preferir BD (actualizada por cron en la madrugada)
    const dbCount = await getProductCount();
    if (dbCount > 0) {
      // Optimización: búsqueda por SKU exacto (p. ej. página de detalle)
      if (userSearch && !categoryRaw && limit === 1 && !userSearch.includes(" ")) {
        const bySku = await getProductBySku(userSearch);
        if (bySku) {
          return NextResponse.json({ products: [bySku], total: 1 });
        }
      }
      const { products, total } = await getProductsFromDb({
        category: categoryRaw,
        q: userSearch,
        page,
        limit,
      });
      return NextResponse.json({ products, total });
    }

    // Fallback a Syscom si BD vacía (antes del primer sync)
    const catBySlug = categoryRaw ? getCategoryBySlug(categoryRaw) : null;
    const category = categoryRaw ? resolveCategoryParam(categoryRaw) : "22";
    const search =
      userSearch?.trim() ||
      (catBySlug && !catBySlug.syscomId ? catBySlug.label : undefined);

    const apiCategory = category || (search ? undefined : "22");
    const apiSearch = search || undefined;
    let result = await getProducts({
      category: apiCategory,
      search: apiSearch,
      page,
      limit,
    });

    // Fallback: si usamos busqueda por label y Syscom devuelve vacío, filtrar por categoria en respuesta
    if (
      catBySlug &&
      !catBySlug.syscomId &&
      (result.products.length === 0 || result.total === 0)
    ) {
      const bySearch = await getProducts({
        search: catBySlug.label,
        page,
        limit,
      });
      const labelLower = catBySlug.label.toLowerCase();
      const filtered = (bySearch.products ?? []).filter((p) => {
        const cat = (p.categoria ?? "").toLowerCase();
        return cat.includes(labelLower) || labelLower.includes(cat);
      });
      const start = (page - 1) * limit;
      result = {
        products: filtered.slice(start, start + limit),
        total: filtered.length,
      };
    }

    let { products, total } = result;

    // Si Syscom devuelve total = productos de la página (ej. 24), inferir que hay más páginas
    if (products.length === limit && (total == null || total <= products.length)) {
      total = Math.max(total ?? 0, page * limit + 1);
    }

    // Ordenar por subcategoría según SUBCATEGORY_ORDER (cámaras, DVRs, accesorios, etc.)
    const sortedProducts = [...products].sort((a, b) => {
      const idxA = getSubcategoryOrderIndex(extractCategoria(a));
      const idxB = getSubcategoryOrderIndex(extractCategoria(b));
      if (idxA !== idxB) return idxA - idxB;
      const catA = (a.categoria ?? "").toLowerCase();
      const catB = (b.categoria ?? "").toLowerCase();
      return catA.localeCompare(catB);
    });

    const withPricing: ProductWithPricing[] = sortedProducts.map((p) => {
      const precio = extractPrecio(p);
      const moneda = (p.moneda ?? "USD") as string;
      let precioConMargenMxn: number | null = null;
      if (precio != null) {
        precioConMargenMxn =
          moneda === "USD" ? usdToMxnWithMargin(precio) : applyMarginMxn(precio);
      }
      const existenciaNum =
        typeof p.existencia === "number" ? p.existencia
        : typeof (p as { total_existencia?: number }).total_existencia === "number"
          ? (p as { total_existencia: number }).total_existencia
          : undefined;
      const imgs = extractImagenes(p);
      const cats = extractCategorias(p);
      return {
        sku: (p.sku ?? p.modelo ?? String(p.producto_id ?? "")).trim() || "—",
        descripcion: p.descripcion ?? p.titulo ?? "",
        precio: precio ?? undefined,
        moneda: p.moneda,
        categoria: extractCategoria(p),
        imagen: extractImagen(p),
        imagenes: imgs.length > 0 ? imgs : undefined,
        datasheet: p.datasheet,
        especificaciones: normalizeEspecificaciones(p.especificaciones),
        precioOriginal: precio,
        precioConMargenMxn,
        producto_id: p.producto_id,
        titulo: p.titulo,
        marca: extractMarca(p),
        garantia: (p as { garantia?: string }).garantia,
        existencia: existenciaNum,
        total_existencia: (p as { total_existencia?: number }).total_existencia,
        link: (p as { link?: string }).link,
        peso: extractDimension(p, "peso"),
        alto: extractDimension(p, "alto"),
        largo: extractDimension(p, "largo"),
        ancho: extractDimension(p, "ancho"),
        unidad_de_medida: extractUnidadDeMedida(p),
        caracteristicas: normalizeCaracteristicas(p.caracteristicas),
        categorias: cats.length > 0 ? cats : undefined,
      };
    });

    return NextResponse.json({
      products: withPricing,
      total: total ?? withPricing.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const status =
      message.includes("401") || message.includes("Unauthorized")
        ? 401
        : message.includes("403") || message.includes("Forbidden")
          ? 403
          : 500;
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
