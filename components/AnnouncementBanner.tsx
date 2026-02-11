import Link from "next/link";

// Franja superior estilo syscom.mx (anuncio / promoción)
export function AnnouncementBanner() {
  return (
    <div className="w-full bg-primary-nav py-3 text-center text-on-primary">
      <Link
        href="/productos"
        className="inline-flex items-center gap-2 text-base font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-on-primary focus:ring-offset-2 focus:ring-offset-primary-nav rounded"
      >
        Todos los productos disponibles. Entregas en CDMX y todo México.
      </Link>
    </div>
  );
}
