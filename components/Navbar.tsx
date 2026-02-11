"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, Menu, X, Cpu, Camera, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const SUGGESTED_CATEGORIES = [
  { label: "Cámaras IP", slug: "camaras-ip", icon: Camera },
  { label: "DVR / NVR", slug: "dvr-nvr", icon: Cpu },
  { label: "Control de Acceso", slug: "control-acceso", icon: Shield },
];

export function Navbar() {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    if (q) router.push(`/productos?q=${encodeURIComponent(q)}`);
    else router.push("/productos");
  };

  // Autocompletado: simula sugerencias por categoría/ SKU (luego se conectarán a la API)
  React.useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const mock = [
      `Cámaras IP ${query}`,
      `DVR ${query}`,
      `Hikvision ${query}`,
      `SKU-${query.toUpperCase().slice(0, 6)}`,
    ].filter((s) => s.toLowerCase().includes(query.toLowerCase()));
    setSuggestions(mock.slice(0, 6));
  }, [query]);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background-alt shadow-syscom">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          {/* Logo / Marca */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú de categorías"
              onClick={() => setSidebarOpen((o) => !o)}
              className="rounded-lg p-2 text-primary hover:bg-background lg:hidden"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <Link href="/" className="flex items-center gap-2 font-bold text-primary">
              <Image
                src="/images/logo-seguridad-avanzada.png"
                alt="Seguridad Avanzada"
                width={120}
                height={40}
                className="h-8 w-auto object-contain"
                priority
              />
              <span className="hidden sm:inline">Seguridad Avanzada</span>
            </Link>
          </div>

          {/* Buscador masivo con autocompletado */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-2xl">
            <div className="relative flex">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <Input
                ref={inputRef}
                type="search"
                placeholder="Buscar por SKU, modelo o categoría..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setSearchOpen(true)}
                onBlur={() =>
                  setTimeout(() => setSearchOpen(false), 180)
                }
                className="h-11 pl-10 pr-4 text-base"
                aria-label="Búsqueda masiva de productos"
                aria-autocomplete="list"
                aria-expanded={searchOpen}
                aria-controls="search-suggestions"
                id="main-search"
              />
              <Button
                type="submit"
                variant="accent"
                size="default"
                className="ml-2 shrink-0"
                aria-label="Buscar en catálogo"
              >
                Buscar
              </Button>
            </div>

            {/* Panel de autocompletado */}
            {searchOpen && (
              <div
                id="search-suggestions"
                role="listbox"
                className="absolute left-0 right-0 top-full z-50 mt-1 max-h-80 overflow-auto rounded-lg border border-border bg-background-alt py-2 shadow-lg"
              >
                {suggestions.length > 0 ? (
                  <ul className="divide-y divide-syscom-border">
                    {suggestions.map((s, i) => (
                      <li key={s}>
                        <button
                          type="button"
                          role="option"
                          aria-selected={false}
                          className="w-full px-4 py-3 text-left text-sm hover:bg-background focus:bg-syscom-surface focus:outline-none"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setQuery(s);
                            setSearchOpen(false);
                          }}
                        >
                          <span className="font-medium text-primary">{s}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-3 text-sm text-foreground-muted">
                    Escribe para ver sugerencias (SKU, modelo, categoría).
                  </div>
                )}
              </div>
            )}
          </form>

          <nav className="hidden items-center gap-2 lg:flex">
            <Link href="/productos">
              <Button variant="ghost" size="sm">
                Catálogo
              </Button>
            </Link>
            <Link href="/categorias">
              <Button variant="ghost" size="sm">
                Categorías
              </Button>
            </Link>
            <Link href="/cotizacion">
              <Button variant="outline" size="sm">
                Cotización
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Sidebar de categorías colapsable (móvil / tablet) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-72 border-r border-border bg-background-alt shadow-xl transition-transform duration-200 lg:static lg:translate-x-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-hidden={!sidebarOpen}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4 lg:hidden">
          <span className="font-semibold text-primary">Categorías</span>
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setSidebarOpen(false)}
            className="rounded p-2 hover:bg-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {SUGGESTED_CATEGORIES.map(({ label, slug, icon: Icon }) => (
              <li key={slug}>
                <a
                  href={`/categorias/${slug}`}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-background"
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
