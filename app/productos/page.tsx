"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, Package } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductosBreadcrumbs } from "@/components/Breadcrumbs";
import ProductFilters, {
  type ProductFiltersState,
} from "@/components/ProductFilters";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ProductWithPricing } from "@/lib/catalog-types";
import { PRODUCTS_PAGE_LIMIT } from "@/lib/constants";
import { SYSCOM_CATEGORIES, getCategoryParam } from "@/lib/categories";

const defaultFilters: ProductFiltersState = {
  brands: [],
  priceRange: { min: null, max: null },
  condition: [],
};

function applyFilters(
  products: ProductWithPricing[],
  filters: ProductFiltersState
): ProductWithPricing[] {
  return products.filter((p) => {
    if (filters.brands.length > 0) {
      const text = `${(p.descripcion ?? "").toUpperCase()} ${(p.sku ?? "").toUpperCase()}`;
      const hasBrand = filters.brands.some((brand) => {
        const re = new RegExp(
          `\\b${brand.toUpperCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "i"
        );
        return re.test(text);
      });
      if (!hasBrand) return false;
    }
    const price = p.precioConMargenMxn ?? p.precio ?? 0;
    if (price > 0) {
      if (filters.priceRange.min !== null && price < filters.priceRange.min)
        return false;
      if (filters.priceRange.max !== null && price > filters.priceRange.max)
        return false;
    }
    return true;
  });
}

function ProductosContent() {
  const searchParams = useSearchParams();
  const urlQ = searchParams.get("q") ?? searchParams.get("search") ?? "";
  const [q, setQ] = React.useState(urlQ);
  const [submittedQ, setSubmittedQ] = React.useState(urlQ);
  const [filters, setFilters] = React.useState<ProductFiltersState>(defaultFilters);
  const rawPage = Number(searchParams.get("page")) || 1;
  const requestedPage = Math.max(1, rawPage);
  const category = searchParams.get("category") ?? undefined;

  React.useEffect(() => {
    setQ(urlQ);
    setSubmittedQ(urlQ);
  }, [urlQ]);

  const { data, isLoading, error } = useQuery<{
    products: ProductWithPricing[];
    total: number;
  }>({
    queryKey: ["products", submittedQ, category ?? "22", requestedPage, PRODUCTS_PAGE_LIMIT],
    queryFn: async ({ signal }) => {
      const params: Record<string, string> = {
        page: String(requestedPage),
        limit: String(PRODUCTS_PAGE_LIMIT),
        category: category ?? "22",
      };
      if (submittedQ) params.q = submittedQ;
      const res = await fetch(
        `/api/products?${new URLSearchParams(params).toString()}`,
        { signal }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? res.statusText);
      return json;
    },
    staleTime: 60_000,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedQ(q.trim());
    const url = new URL(window.location.href);
    if (q.trim()) url.searchParams.set("q", q.trim());
    else url.searchParams.delete("q");
    url.searchParams.delete("page");
    window.history.replaceState({}, "", url.toString());
  };

  const total = data?.total ?? 0;
  const products = React.useMemo(() => data?.products ?? [], [data?.products]);
  const filteredProducts = React.useMemo(
    () => applyFilters(products, filters),
    [products, filters]
  );
  const hasActiveFilters =
    filters.brands.length > 0 ||
    filters.priceRange.min !== null ||
    filters.priceRange.max !== null ||
    filters.condition.length > 0;

  const totalPages = Math.ceil(total / PRODUCTS_PAGE_LIMIT) || 1;
  const page =
    totalPages > 0
      ? Math.max(1, Math.min(rawPage, totalPages))
      : Math.max(1, rawPage);

  // Actualizar URL si el usuario pidió una página fuera de rango
  React.useEffect(() => {
    if (totalPages > 0 && rawPage !== page) {
      const url = new URL(window.location.href);
      url.searchParams.set("page", String(page));
      window.history.replaceState({}, "", url.toString());
    }
  }, [totalPages, rawPage, page]);

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  const categoryLabel = category
    ? SYSCOM_CATEGORIES.find((c) => getCategoryParam(c) === category)?.label ?? null
    : null;

  return (
    <div className="space-y-6">
      <ProductosBreadcrumbs category={category} categoryLabel={categoryLabel} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-primary sm:text-3xl">
          Catálogo de Productos
        </h1>
        <form onSubmit={handleSearch} className="flex w-full min-w-0 gap-2 sm:w-auto">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" aria-hidden />
            <Input
              type="search"
              placeholder="Buscar por SKU, modelo..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="min-w-0 pl-9"
              aria-label="Buscar en catálogo"
            />
          </div>
          <Button type="submit" variant="accent" className="shrink-0 touch-manipulation">
            Buscar
          </Button>
        </form>
      </div>

      {error && (
        <div className="rounded-lg border border-error/30 bg-error-bg p-4 text-error">
          <p className="font-medium">No se pudo cargar el catálogo.</p>
          <p className="mt-1 text-sm">
            {error instanceof Error
              ? error.message
              : "Revisa SYSCOM_CLIENT_ID y SYSCOM_CLIENT_SECRET en .env.local."}
          </p>
        </div>
      )}

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-syscom-accent" />
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="flex flex-col gap-4 lg:flex-row lg:gap-6">
          <ProductFilters
            products={products}
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={() => setFilters(defaultFilters)}
          />
          <div className="min-w-0 flex-1 space-y-4">
            <p className="text-sm text-foreground-muted sm:text-base">
              {hasActiveFilters
                ? `${filteredProducts.length} de ${products.length} en esta página`
                : `${total} producto${total !== 1 ? "s" : ""} encontrado${total !== 1 ? "s" : ""}`}
            </p>
            {filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background-alt py-12 text-center sm:py-16">
                <Package className="h-12 w-12 text-foreground-muted sm:h-14 sm:w-14" />
                <p className="mt-2 text-base font-medium text-primary sm:text-lg">
                  Ningún producto coincide con los filtros
                </p>
                <p className="mt-1 text-sm text-foreground-muted sm:text-base">
                  Ajusta o limpia los filtros para ver resultados.
                </p>
              </div>
            ) : (
              <>
                <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredProducts.map((p) => (
                    <li key={p.sku}>
                      <ProductCard product={p} />
                    </li>
                  ))}
                </ul>
                {totalPages > 1 && (
                  <nav
                    className="flex items-center justify-center gap-2 pt-4"
                    aria-label="Paginación"
                  >
                    <Link
                      href={
                        hasPrev
                          ? `/productos?${new URLSearchParams({
                              ...(submittedQ && { q: submittedQ }),
                              category: category ?? "22",
                              page: String(page - 1),
                            } as Record<string, string>).toString()}`
                          : "#"
                      }
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        !hasPrev && "pointer-events-none opacity-50"
                      )}
                      aria-disabled={!hasPrev}
                    >
                      Anterior
                    </Link>
                    <span className="text-xs text-foreground-muted sm:text-sm">
                      Página {page} de {totalPages}
                    </span>
                    <Link
                      href={
                        hasNext
                          ? `/productos?${new URLSearchParams({
                              ...(submittedQ && { q: submittedQ }),
                              category: category ?? "22",
                              page: String(page + 1),
                            } as Record<string, string>).toString()}`
                          : "#"
                      }
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        !hasNext && "pointer-events-none opacity-50"
                      )}
                      aria-disabled={!hasNext}
                    >
                      Siguiente
                    </Link>
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-background-alt py-12 text-center sm:py-16">
          <Package className="h-12 w-12 text-foreground-muted" />
          <p className="mt-2 font-medium text-primary">
            No hay productos que coincidan
          </p>
          <p className="mt-1 text-sm text-foreground-muted">
            Prueba otro término de búsqueda o categoría.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProductosPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex items-center justify-center py-12 sm:py-16">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      }
    >
      <ProductosContent />
    </React.Suspense>
  );
}
