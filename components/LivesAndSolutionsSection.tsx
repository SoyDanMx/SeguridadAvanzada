import Link from "next/link";
import { ChevronRight } from "lucide-react";

/**
 * Sección estilo syscom.mx: Lives + Nuevas Soluciones.
 * Layout de 2 columnas: título, botones VER LIVES (rojo) / VER SOLUCIONES (azul), área de contenido.
 * Sin embed de Firework; placeholders con enlaces a eventos y productos.
 */
export function LivesAndSolutionsSection() {
  return (
    <section className="w-full py-4">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Columna Lives (en desktop va a la izquierda) */}
          <div className="order-2 hidden md:order-1 md:block">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-2xl font-bold text-foreground">Lives</p>
              <Link
                href="/eventos?s=webinars_fw"
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-600"
              >
                VER LIVES
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="h-[400px] overflow-hidden rounded-lg bg-border-subtle">
              <Link
                href="/eventos"
                className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center transition hover:bg-border/80"
              >
                <span className="text-base font-medium text-foreground-muted">
                  Webinars y transmisiones en vivo
                </span>
                <span className="text-primary text-base font-semibold underline">
                  Ver eventos y certificaciones →
                </span>
              </Link>
            </div>
          </div>

          {/* Columna Nuevas Soluciones (en desktop va a la derecha) */}
          <div className="order-1 md:order-2">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-2xl font-bold text-foreground">Nuevas Soluciones</p>
              <div className="flex gap-2">
                <Link
                  href="/eventos?s=webinars_fw"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-red-600 md:hidden"
                >
                  VER LIVES
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/productos"
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700"
                >
                  VER SOLUCIONES
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="h-[400px] overflow-hidden rounded-lg bg-border-subtle">
              <Link
                href="/productos"
                className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center transition hover:bg-border/80"
              >
                <span className="text-base font-medium text-foreground-muted">
                  Videovigilancia, control de acceso y redes
                </span>
                <span className="text-primary text-base font-semibold underline">
                  Ver catálogo de productos →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
