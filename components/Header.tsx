"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CATEGORY_LINKS } from "@/lib/categories";
import { HEADER_SCROLL_THRESHOLD } from "@/lib/constants";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { totalItems } = useCart();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const displayName = user?.user_metadata?.nombre ?? user?.email ?? "Mi cuenta";
  const [query, setQuery] = React.useState("");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;
  const currentCategory = pathname.startsWith("/productos") ? searchParams.get("category") ?? null : null;

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > HEADER_SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) window.location.href = `/productos?q=${encodeURIComponent(q)}`;
    else window.location.href = "/productos";
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isTransparent ? "border-b border-white/20 bg-transparent" : "border-b border-border bg-background-alt shadow-sm"
      }`}
    >
      {/* Barra superior oscura: usuario, carrito con badge, MXN, Iniciar sesión */}
      <div className={`text-on-primary ${isTransparent ? "bg-black/30 backdrop-blur-sm" : "bg-primary-nav"}`}>
        <div className="container mx-auto flex flex-wrap items-center justify-end gap-2 px-3 py-2 text-xs sm:px-4 sm:text-sm">
          <div className="flex items-center gap-4">
            <Link
              href="/carrito"
              className="relative flex items-center gap-1.5 rounded p-1.5 text-on-primary/90 hover:text-on-primary"
              aria-label="Carrito"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-on-accent">
                {totalItems}
              </span>
            </Link>
            <span className="text-on-primary/70">MXN</span>
            {!authLoading && (
              user ? (
                <div className="flex items-center gap-2">
                  <span className="max-w-[120px] truncate text-on-primary/90 sm:max-w-[180px]">
                    {displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 font-medium text-on-primary/90 hover:text-on-primary hover:underline"
                    aria-label="Cerrar sesión"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link href="/cuenta/login" className="flex items-center gap-1.5 font-medium text-on-primary/90 hover:text-on-primary hover:underline">
                  Iniciar sesión
                </Link>
              )
            )}
          </div>
        </div>
      </div>

      {/* Barra principal: transparente sobre hero (home) o blanca — mobile-first */}
      <div className={isTransparent ? "bg-transparent" : "bg-background-alt"}>
        <div className="container mx-auto flex min-h-16 items-center gap-2 px-3 py-2 sm:min-h-20 sm:gap-3 sm:px-4 lg:h-24 lg:gap-6">
          <Link
            href="/"
            className="relative flex shrink-0 items-center py-2"
            aria-label="Seguridad Avanzada - Inicio"
          >
            <Image
              src="/images/logo-seguridad-avanzada.png"
              alt="Seguridad Avanzada"
              width={260}
              height={80}
              className="h-14 w-auto object-contain object-left lg:h-16"
              priority
            />
          </Link>

          <form onSubmit={handleSearchSubmit} className="relative min-w-0 flex-1 max-w-2xl">
            <div
              className={`relative flex rounded-full shadow-sm focus-within:ring-2 ${
                isTransparent
                  ? "border border-white/30 bg-white/90 focus-within:border-white focus-within:ring-white/30"
                  : "border border-border bg-background-alt focus-within:border-primary focus-within:ring-primary/20"
              }`}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary sm:left-4 sm:h-5 sm:w-5 md:text-foreground-muted" aria-hidden />
              <Input
                type="search"
                placeholder="Buscar por nombre, SKU..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 min-w-0 rounded-full border-0 bg-transparent pl-10 pr-24 text-sm text-foreground placeholder:text-foreground-muted focus-visible:ring-0 sm:h-14 sm:pl-12 sm:pr-28 sm:text-base"
                aria-label="Buscar productos"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 h-9 -translate-y-1/2 rounded-full bg-primary px-3 text-sm text-on-primary hover:bg-primary-nav sm:right-1.5 sm:h-10 sm:px-5 sm:text-base"
              >
                Buscar
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Barra de categorías — botones que contrastan con el fondo */}
      <div className={isTransparent ? "bg-black/30 backdrop-blur-sm" : "bg-primary-nav"}>
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 px-3 py-2.5 sm:justify-start sm:px-4">
          {CATEGORY_LINKS.map(({ label, href, categoryParam }) => {
            const isActive = currentCategory !== null && currentCategory === categoryParam;
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-lg border px-3 py-2 text-sm font-semibold transition-all touch-manipulation sm:px-4 sm:text-base ${
                  isActive
                    ? "border-accent bg-accent text-on-accent shadow-md"
                    : "border-white/40 bg-white/95 text-primary hover:border-white hover:bg-white hover:text-primary-nav hover:shadow-md"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
