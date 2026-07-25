import Link from "next/link";
import Image from "next/image";
import { HeroVisual } from "@/components/HeroVisual";
import { HomeContentSection } from "@/components/HomeContentSection";
import { FacebookCommunity } from "@/components/FacebookCommunity";
import { SYSCOM_CATEGORIES, getCategoryParam } from "@/lib/categories";

const SUBTITLES: Record<string, string> = {
  Videovigilancia: "Cámaras IP, DVR y NVR",
  "Redes e IT": "Conectividad y cableado",
  "Energía / Herramientas": "Respaldo y herramientas",
  "Control de Acceso": "Biometría y control de personal",
};

const DESTACADAS_SLUGS = ["videovigilancia", "redes-e-it", "energia-herramientas", "control-de-acceso"] as const;

/** Imágenes por slug de categoría (en public/images); puedes sustituirlas cuando quieras. */
const CATEGORIA_IMAGES: Record<string, string> = {
  "control-de-acceso": "/images/categoria-control-acceso.png",
  "energia-herramientas": "/images/categoria-energia-herramientas.png",
  "redes-e-it": "/images/categoria-redes-e-it.png",
  videovigilancia: "/images/categoria-videovigilancia.png",
};

const CATEGORIAS_DESTACADAS = SYSCOM_CATEGORIES.filter((c) =>
  (DESTACADAS_SLUGS as readonly string[]).includes(c.slug)
).map((cat) => ({
  title: cat.label,
  subtitle: SUBTITLES[cat.label] ?? cat.label,
  href: `/productos?category=${getCategoryParam(cat)}`,
  image: CATEGORIA_IMAGES[cat.slug] ?? "/images/logo-seguridad-avanzada.png",
}));

export default function HomePage() {
  return (
    <div className="space-y-0">
      <HeroVisual />
      <HomeContentSection />

      <section className="border-t border-border bg-background-alt py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="mb-4 text-2xl font-bold text-primary sm:mb-6 sm:text-3xl">
            Categorías destacadas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
            {CATEGORIAS_DESTACADAS.map(({ title, subtitle, href, image }) => (
              <Link
                key={href}
                href={href}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-background transition hover:border-accent hover:shadow-syscom-accent touch-manipulation active:opacity-90"
              >
                <div className="relative aspect-square w-full bg-background-alt">
                  <Image
                    src={image}
                    alt={`Ir a ${title}`}
                    fill
                    className="object-contain p-4 opacity-90 group-hover:opacity-100"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                </div>
                <div className="border-t border-border bg-background-alt p-4">
                  <h3 className="text-base font-semibold text-primary sm:text-lg">{title}</h3>
                  <p className="mt-1 text-sm text-foreground-muted sm:text-base">{subtitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      <FacebookCommunity />
    </div>
  );
}
