import Link from "next/link";
import { Calendar, Play } from "lucide-react";
import { getCategoryParam, SYSCOM_CATEGORIES } from "@/lib/categories";

const TRAININGS = [
  {
    date: "Viernes 14",
    title: "Soluciones para redes inalámbricas, PoE y gestión en la nube",
  },
  {
    date: "Miércoles 19",
    title: "Control de acceso: productos, app y gestión cloud",
  },
];

export function HomeContentSection() {
  return (
    <section className="border-t border-border bg-background-alt py-10">
      <div className="container mx-auto grid gap-8 px-4 lg:grid-cols-2">
        {/* Columna izquierda: Próximos entrenamientos */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-primary">
              Próximos entrenamientos
            </h2>
            <Link
              href="/eventos"
              className="rounded bg-accent px-5 py-2.5 text-base font-medium text-on-accent hover:bg-accent-hover"
            >
              Ver todos
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {TRAININGS.map((item, i) => (
              <li
                key={i}
                className="flex gap-4 rounded-lg border border-border p-4"
              >
                <div className="flex shrink-0 items-center gap-2 text-base text-primary">
                  <Calendar className="h-6 w-6" />
                  <span className="font-semibold">{item.date}</span>
                </div>
                <p className="text-base text-foreground-muted">{item.title}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Columna derecha: Videos / productos destacados */}
        <div>
          <h2 className="text-2xl font-bold text-primary">
            Productos destacados
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <Link
              href="/productos?q=camara"
              className="group relative overflow-hidden rounded-lg border border-border bg-background aspect-video"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-primary/80 transition group-hover:bg-primary/90">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary">
                  <Play className="h-7 w-7 ml-0.5" />
                </span>
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-base font-medium text-white">
                Cámaras IP y videovigilancia
              </p>
            </Link>
            <Link
              href={`/productos?category=${getCategoryParam(SYSCOM_CATEGORIES.find((c) => c.slug === "control-de-acceso") ?? SYSCOM_CATEGORIES[3])}`}
              className="group relative overflow-hidden rounded-lg border border-border bg-background aspect-video"
            >
              <div className="absolute inset-0 flex items-center justify-center bg-primary-nav/80 transition group-hover:bg-primary-nav/90">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary">
                  <Play className="h-7 w-7 ml-0.5" />
                </span>
              </div>
              <p className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-base font-medium text-white">
                Control de acceso
              </p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
