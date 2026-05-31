"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { Search, ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;
  const currentCategory = pathname.startsWith("/productos") ? searchParams.get("category") ?? null : null;

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > HEADER_SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (menuOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    if (q) window.location.href = `/productos?q=${encodeURIComponent(q)}`;
    else window.location.href = "/productos";
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full shrink-0 border-b border-border bg-background-alt shadow-sm transition-all duration-300",
          "pt-[env(safe-area-inset-top)]",
          isTransparent && "md:border-white/20 md:bg-transparent md:shadow-none"
        )}
      >
        {/* Barra superior: en móvil siempre sólido; en desktop transparente sobre hero */}
        <div
          className={cn(
            "text-on-primary bg-primary-nav",
            isTransparent && "md:bg-black/30 md:backdrop-blur-sm"
          )}
        >
          <div className="container mx-auto flex items-center justify-between gap-2 px-3 py-1 text-xs sm:justify-end sm:px-4 sm:py-2 sm:text-sm">
            {/* Móvil: logo + menú hamburguesa + carrito */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-primary hover:bg-white/10"
                aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              >
                {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <Link href="/" className="flex items-center" aria-label="Inicio">
                <Image
                  src="/images/logo-seguridad-avanzada.png"
                  alt=""
                  width={120}
                  height={36}
                  className="h-7 w-auto object-contain"
                />
              </Link>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <Link
                href="/carrito"
                className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-on-primary/90 hover:bg-white/10 sm:h-auto sm:w-auto sm:p-1.5"
                aria-label={`Carrito (${totalItems} items)`}
              >
                <ShoppingCart className="h-5 w-5 sm:h-4 sm:w-4" />
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-xs font-bold text-on-accent">
                  {totalItems}
                </span>
              </Link>
              <span className="hidden text-on-primary/70 sm:inline">MXN</span>
              {!authLoading && (
                user ? (
                  <div className="hidden items-center gap-2 sm:flex">
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
                  <Link href="/cuenta/login" className="hidden font-medium text-on-primary/90 hover:text-on-primary hover:underline sm:flex sm:items-center sm:gap-1.5">
                    Iniciar sesión
                  </Link>
                )
              )}
            </div>
          </div>
        </div>

        {/* Barra principal: logo + buscador — oculta en móvil si ya hay barra compacta */}
        <div className={cn("hidden sm:block", isTransparent ? "bg-transparent" : "bg-background-alt")}>
          <div className="container mx-auto flex min-h-16 items-center gap-3 px-4 py-2 lg:min-h-20 lg:gap-6 lg:py-3">
            <Link href="/" className="relative flex shrink-0 items-center py-2" aria-label="Seguridad Avanzada - Inicio">
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
                className={cn(
                  "relative flex rounded-full shadow-sm focus-within:ring-2",
                  isTransparent
                    ? "border border-white/30 bg-white/90 focus-within:border-white focus-within:ring-white/30"
                    : "border border-border bg-background-alt focus-within:border-primary focus-within:ring-primary/20"
                )}
              >
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-foreground-muted" aria-hidden />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, SKU..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 min-w-0 rounded-full border-0 bg-transparent pl-12 pr-28 text-base text-foreground placeholder:text-foreground-muted focus-visible:ring-0 sm:h-14"
                  aria-label="Buscar productos"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="absolute right-1.5 top-1/2 h-9 -translate-y-1/2 rounded-full bg-primary px-5 text-sm text-on-primary hover:bg-primary-nav sm:h-10"
                >
                  Buscar
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Barra de categorías — visible solo en desktop; móvil usa el drawer */}
        <div className={cn("hidden md:block", isTransparent ? "bg-black/30 backdrop-blur-sm" : "bg-primary-nav")}>
          <div className="container mx-auto flex flex-wrap items-center justify-center gap-2 px-4 py-2.5 sm:justify-start">
            {CATEGORY_LINKS.map(({ label, href, categoryParam }) => {
              const isActive = currentCategory !== null && currentCategory === categoryParam;
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-sm font-semibold transition-all touch-manipulation sm:px-4 sm:text-base",
                    isActive
                      ? "border-accent bg-accent text-on-accent shadow-md"
                      : "border-white/40 bg-white/95 text-primary hover:border-white hover:bg-white hover:text-primary-nav hover:shadow-md"
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Móvil: barra de búsqueda compacta — siempre fondo sólido para visibilidad */}
        <div className="bg-background-alt sm:hidden">
          <div className="container mx-auto px-3 py-1.5">
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex gap-2">
                <div className="relative flex flex-1 rounded-full border border-border bg-background shadow-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
                  <Input
                    type="search"
                    placeholder="Buscar..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="h-9 flex-1 rounded-full border-0 bg-transparent pl-9 pr-4 text-sm focus-visible:ring-0"
                    autoFocus
                  />
                </div>
                <Button type="submit" size="sm" className="shrink-0 rounded-full px-4">
                  Buscar
                </Button>
              </form>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-full border py-2 pl-4 text-left text-sm text-foreground-muted",
                  "border-border bg-background"
                )}
              >
                <Search className="h-4 w-4 shrink-0" />
                Buscar por nombre, SKU...
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Drawer de categorías (móvil) */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={closeMenu}
        aria-hidden={!menuOpen}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] transform border-r border-border bg-background-alt shadow-xl transition-transform duration-200 md:hidden",
          menuOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!menuOpen}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <span className="font-semibold text-primary">Categorías</span>
          <button
            type="button"
            onClick={closeMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-foreground hover:bg-background"
            aria-label="Cerrar menú"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="max-h-[calc(100vh-3.5rem)] overflow-y-auto p-4">
          <ul className="space-y-1">
            {CATEGORY_LINKS.map(({ label, href, categoryParam }) => {
              const isActive = currentCategory !== null && currentCategory === categoryParam;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={closeMenu}
                    className={cn(
                      "flex rounded-lg px-4 py-3 text-base font-medium transition-colors",
                      isActive ? "bg-accent text-on-accent" : "text-primary hover:bg-background"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 border-t border-border pt-4">
            {!authLoading &&
              (user ? (
                <div className="space-y-1">
                  <p className="px-4 py-2 text-sm text-foreground-muted truncate">{displayName}</p>
                  <button
                    type="button"
                    onClick={() => { signOut(); closeMenu(); }}
                    className="flex w-full items-center gap-2 rounded-lg px-4 py-3 text-base font-medium text-primary hover:bg-background"
                  >
                    <LogOut className="h-4 w-4" />
                    Cerrar sesión
                  </button>
                </div>
              ) : (
                <Link
                  href="/cuenta/login"
                  onClick={closeMenu}
                  className="flex rounded-lg px-4 py-3 text-base font-medium text-primary hover:bg-background"
                >
                  Iniciar sesión
                </Link>
              ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
