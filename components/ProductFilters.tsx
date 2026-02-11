"use client";

import React, { useState, useMemo } from "react";
import {
  ChevronDown,
  ChevronUp,
  X,
  Search,
  Filter,
  Check,
} from "lucide-react";
import { ProductWithPricing } from "@/lib/catalog-types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SYSCOM_CATEGORIES, getCategoryParam } from "@/lib/categories";

export interface ProductFiltersState {
  brands: string[];
  priceRange: { min: number | null; max: number | null };
  condition: string[];
}

const MARCAS_COMUNES = [
  "HIKVISION",
  "DAHUA",
  "TP-LINK",
  "CISCO",
  "ASUS",
  "APPLE",
  "SAMSUNG",
  "LG",
  "SONY",
  "DELL",
  "HP",
  "LENOVO",
  "ACER",
  "MSI",
  "GIGABYTE",
  "INTEL",
  "AMD",
  "NVIDIA",
  "WESTERN DIGITAL",
  "SEAGATE",
  "KINGSTON",
  "CORSAIR",
  "LOGITECH",
  "RAZER",
  "ARLO",
  "RING",
  "NEST",
  "ECOBEE",
  "PHILIPS HUE",
  "SMART THINGS",
  "SCHNEIDER",
  "SIEMENS",
  "ABB",
  "LEGRAND",
  "PANDUIT",
  "BELDEN",
  "AXIS",
  "VIVOTEK",
  "BOSCH",
  "HONEYWELL",
  "JOHNSON CONTROLS",
  "AUFIT",
  "AX PRO",
  "CONDUMEX",
  "AMAZON",
  "VICTRON",
  "SUNGROW",
  "GOODWE",
  "SOLAREDGE",
  "ENPHASE",
];

const CATEGORIAS_SYSCOM: { id: string; name: string }[] = SYSCOM_CATEGORIES.map(
  (cat) => ({ id: getCategoryParam(cat), name: cat.label })
);

function extractBrands(products: ProductWithPricing[]): string[] {
  const brandsFound = new Set<string>();
  if (!products?.length) return [];

  products.forEach((product) => {
    const desc = (product.descripcion ?? "").toUpperCase();
    const sku = (product.sku ?? "").toUpperCase();
    const text = `${desc} ${sku}`;

    MARCAS_COMUNES.forEach((brand) => {
      const brandUpper = brand.toUpperCase();
      const brandRegex = new RegExp(
        `\\b${brandUpper.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
        "i"
      );
      if (
        brandRegex.test(text) ||
        desc.startsWith(brandUpper) ||
        desc.includes(` ${brandUpper} `) ||
        desc.endsWith(` ${brandUpper}`) ||
        sku.includes(brandUpper)
      ) {
        brandsFound.add(brand);
      }
    });
  });

  return Array.from(brandsFound).sort();
}

interface ProductFiltersProps {
  products: ProductWithPricing[];
  filters: ProductFiltersState;
  onFiltersChange: (filters: ProductFiltersState) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  products,
  filters,
  onFiltersChange,
  onClearFilters,
}: ProductFiltersProps) {
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") ?? undefined;

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    category: true,
    condition: false,
    brands: false,
    price: false,
  });
  const [brandSearchQuery, setBrandSearchQuery] = useState("");

  const availableBrands = useMemo(() => extractBrands(products), [products]);
  const filteredBrands = useMemo(() => {
    if (!brandSearchQuery) return availableBrands;
    const q = brandSearchQuery.toUpperCase();
    return availableBrands.filter((b) => b.toUpperCase().includes(q));
  }, [availableBrands, brandSearchQuery]);

  const priceStats = useMemo(() => {
    const prices = products
      .map((p) => p.precioConMargenMxn ?? p.precio ?? 0)
      .filter((n) => n > 0)
      .sort((a, b) => a - b);
    if (prices.length === 0) return { min: 0, max: 0, avg: 0 };
    return {
      min: prices[0],
      max: prices[prices.length - 1],
      avg: prices.reduce((a, b) => a + b, 0) / prices.length,
    };
  }, [products]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.brands.length > 0) count += filters.brands.length;
    if (filters.priceRange.min !== null || filters.priceRange.max !== null)
      count++;
    if (filters.condition.length > 0) count += filters.condition.length;
    return count;
  }, [filters]);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleConditionToggle = (condition: string) => {
    const next = filters.condition.includes(condition)
      ? filters.condition.filter((c) => c !== condition)
      : [...filters.condition, condition];
    onFiltersChange({ ...filters, condition: next });
  };

  const handleBrandToggle = (brand: string) => {
    const next = filters.brands.includes(brand)
      ? filters.brands.filter((b) => b !== brand)
      : [...filters.brands, brand];
    onFiltersChange({ ...filters, brands: next });
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const num = value === "" ? null : parseInt(value, 10);
    onFiltersChange({
      ...filters,
      priceRange: { ...filters.priceRange, [type]: num },
    });
  };

  const activeFilterChips = useMemo(() => {
    const chips: Array<{ label: string; onRemove: () => void }> = [];
    filters.condition.forEach((c) => {
      chips.push({
        label: c === "nuevo" ? "Nuevo" : c,
        onRemove: () => handleConditionToggle(c),
      });
    });
    filters.brands.forEach((brand) => {
      chips.push({
        label: brand,
        onRemove: () => handleBrandToggle(brand),
      });
    });
    if (
      filters.priceRange.min !== null ||
      filters.priceRange.max !== null
    ) {
      const min = filters.priceRange.min ?? priceStats.min;
      const max = filters.priceRange.max ?? priceStats.max;
      chips.push({
        label: `$${min.toLocaleString("es-MX")} - $${max.toLocaleString("es-MX")}`,
        onRemove: () =>
          onFiltersChange({
            ...filters,
            priceRange: { min: null, max: null },
          }),
      });
    }
    return chips;
  }, [filters, priceStats]);

  return (
    <div className="w-full flex-shrink-0 lg:w-72">
      <div className="rounded-lg border border-border bg-background-alt shadow-sm lg:sticky lg:top-24">
        <div className="flex items-center justify-between border-b border-border bg-background px-4 py-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold text-foreground">Filtros</h3>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">
                {activeFiltersCount}
              </span>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-sm font-medium text-primary hover:text-primary-nav"
              title="Limpiar todos los filtros"
            >
              Limpiar
            </button>
          )}
        </div>

        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap gap-2 border-b border-border bg-background px-4 py-3">
            {activeFilterChips.map((chip, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-sm font-medium text-primary"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="rounded-full p-0.5 transition-colors hover:bg-primary/20"
                  title="Eliminar filtro"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="divide-y divide-syscom-border">
          {/* Categorías (links a URL) */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("category")}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-background"
              aria-expanded={expandedSections.category}
              aria-controls="filters-category"
            >
              <span className="text-base font-medium text-foreground">
                Categoría
              </span>
              {expandedSections.category ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </button>
            {expandedSections.category && (
              <div id="filters-category" className="space-y-1 px-4 pb-4" role="region" aria-label="Categorías">
                {CATEGORIAS_SYSCOM.map((cat) => {
                  const isActive = currentCategory === cat.id;
                  return (
                    <Link
                      key={cat.id}
                      href={
                        isActive ? "/productos" : `/productos?category=${cat.id}`
                      }
                      className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-base transition-colors ${
                        isActive
                          ? "bg-primary/10 font-medium text-primary"
                          : "text-foreground hover:bg-background"
                      }`}
                    >
                      {cat.name}
                      {isActive && <Check className="h-4 w-4 text-primary" />}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Condición */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("condition")}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-background"
              aria-expanded={expandedSections.condition}
              aria-controls="filters-condition"
            >
              <span className="text-base font-medium text-foreground">
                Condición
              </span>
              {expandedSections.condition ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </button>
            {expandedSections.condition && (
              <div id="filters-condition" className="px-4 pb-4" role="region" aria-label="Condición">
                <label className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-base text-foreground transition-colors hover:bg-background">
                  <input
                    type="checkbox"
                    checked={filters.condition.includes("nuevo")}
                    onChange={() => handleConditionToggle("nuevo")}
                    className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="flex-1">Nuevo</span>
                  {filters.condition.includes("nuevo") && (
                    <Check className="h-4 w-4 text-primary" />
                  )}
                </label>
              </div>
            )}
          </div>

          {/* Marcas */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("brands")}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-background"
              aria-expanded={expandedSections.brands}
              aria-controls="filters-brands"
            >
              <div className="flex items-center gap-2">
                <span className="text-base font-medium text-foreground">Marcas</span>
                {filters.brands.length > 0 && (
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-xs text-white">
                    {filters.brands.length}
                  </span>
                )}
              </div>
              {expandedSections.brands ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </button>
            {expandedSections.brands && (
              <div id="filters-brands" className="px-4 pb-4" role="region" aria-label="Marcas">
                {availableBrands.length > 0 ? (
                  <>
                    <div className="relative mb-3">
                      <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground-muted" />
                      <input
                        type="text"
                        placeholder="Buscar marca..."
                        value={brandSearchQuery}
                        onChange={(e) => setBrandSearchQuery(e.target.value)}
                        className="w-full rounded-md border border-border py-2 pl-8 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="max-h-64 space-y-1 overflow-y-auto">
                      {filteredBrands.length > 0 ? (
                        filteredBrands.map((brand) => (
                          <label
                            key={brand}
                            className="flex cursor-pointer items-center gap-2 rounded-md px-3 py-1.5 text-base text-foreground transition-colors hover:bg-background"
                          >
                            <input
                              type="checkbox"
                              checked={filters.brands.includes(brand)}
                              onChange={() => handleBrandToggle(brand)}
                              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                            />
                            <span className="flex-1 text-sm">{brand}</span>
                            {filters.brands.includes(brand) && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </label>
                        ))
                      ) : (
                        <p className="py-2 text-center text-sm text-foreground-muted">
                          No se encontraron marcas
                        </p>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="py-2 text-center text-sm text-foreground-muted">
                    No hay marcas disponibles
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Precio */}
          <div>
            <button
              type="button"
              onClick={() => toggleSection("price")}
              className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-background"
              aria-expanded={expandedSections.price}
              aria-controls="filters-price"
            >
              <span className="text-base font-medium text-foreground">Precio</span>
              {expandedSections.price ? (
                <ChevronUp className="h-4 w-4 text-foreground-muted" />
              ) : (
                <ChevronDown className="h-4 w-4 text-foreground-muted" />
              )}
            </button>
            {expandedSections.price && (
              <div id="filters-price" className="space-y-3 px-4 pb-4" role="region" aria-label="Precio">
                {priceStats.max > 0 ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="mb-1 block text-sm text-foreground-muted">
                          Mínimo
                        </label>
                        <input
                          type="number"
                          placeholder="Mín"
                          value={filters.priceRange.min ?? ""}
                          onChange={(e) =>
                            handlePriceChange("min", e.target.value)
                          }
                          min={priceStats.min}
                          max={priceStats.max}
                          className="w-full rounded-md border border-border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm text-foreground-muted">
                          Máximo
                        </label>
                        <input
                          type="number"
                          placeholder="Máx"
                          value={filters.priceRange.max ?? ""}
                          onChange={(e) =>
                            handlePriceChange("max", e.target.value)
                          }
                          min={priceStats.min}
                          max={priceStats.max}
                          className="w-full rounded-md border border-border px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <p className="text-center text-sm text-foreground-muted">
                      Rango: $
                      {priceStats.min.toLocaleString("es-MX")} - $
                      {priceStats.max.toLocaleString("es-MX")}
                    </p>
                  </>
                ) : (
                  <p className="py-2 text-center text-sm text-foreground-muted">
                    No hay productos con precio
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
