"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-foreground-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="h-4 w-4 shrink-0 text-foreground-muted" aria-hidden />
              )}
              {isLast || !item.href ? (
                <span className="font-medium text-primary" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-primary hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ProductosBreadcrumbs({
  category,
  categoryLabel,
}: {
  category?: string | null;
  categoryLabel?: string | null;
}) {
  const items: BreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
  ];
  if (category) {
    items.push({
      label: categoryLabel ?? category.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    });
  }
  return <Breadcrumbs items={items} />;
}

export function ProductoDetalleBreadcrumbs({ sku, title }: { sku: string; title?: string }) {
  const items: BreadcrumbItem[] = [
    { label: "Inicio", href: "/" },
    { label: "Productos", href: "/productos" },
    { label: title ?? sku },
  ];
  return <Breadcrumbs items={items} />;
}
