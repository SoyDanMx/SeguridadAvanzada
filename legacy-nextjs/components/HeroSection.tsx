"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mensajes estilo syscom.mx: profesional, mayorista, CTAs claros
const SLIDES = [
  {
    title: "Donde los profesionales encuentran soluciones",
    subtitle: "Videovigilancia, control de acceso y redes",
    description:
      "Cámaras IP, DVR, NVR, control de acceso y las mejores marcas. Entrega en CDMX y todo México.",
    cta: "Ver todos los productos",
    href: "/productos",
    image: null,
  },
  {
    title: "Cámaras y equipos de videovigilancia",
    subtitle: "Visión día y noche, PoE y AI",
    description:
      "Cámaras IP 4MP, luz dual, detección de persona y vehículo. Equipos profesionales para tu negocio.",
    cta: "Ver cámaras",
    href: "/productos?q=camara",
    image: null,
  },
  {
    title: "Super Precio y ofertas",
    subtitle: "Los mejores precios en seguridad electrónica",
    description:
      "Aprovecha promociones y precios especiales. Contáctanos para cotizaciones a proyecto.",
    cta: "Ver ofertas",
    href: "/productos?ofertas=1",
    image: null,
  },
];

export function HeroSection() {
  const [index, setIndex] = React.useState(0);
  const next = () => setIndex((i) => (i + 1) % SLIDES.length);
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length);

  React.useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, []);

  const slide = SLIDES[index];

  return (
    <section
      className="relative w-full overflow-hidden bg-primary-nav"
      aria-label="Carrusel principal"
    >
      <div className="container relative mx-auto flex min-h-[380px] flex-col lg:min-h-[420px] lg:flex-row lg:items-center">
        {/* Texto izquierda - estilo syscom.mx */}
        <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:py-16">
          <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {slide.title}
          </h2>
          <p className="mt-3 text-2xl font-medium text-white/95">
            {slide.subtitle}
          </p>
          <p className="mt-4 max-w-lg text-lg text-white/90">
            {slide.description}
          </p>
          <Link
            href={slide.href}
            className="mt-6 inline-block w-fit rounded bg-accent px-8 py-4 text-lg font-semibold text-on-accent shadow-syscom-accent hover:bg-accent-hover"
          >
            {slide.cta}
          </Link>
          <div className="mt-8 flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Anterior"
              className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <div className="flex gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente"
              className="rounded-full bg-white/20 p-2 text-white hover:bg-white/30"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Imagen derecha - placeholder o producto */}
        <div className="relative flex flex-1 items-center justify-center px-6 pb-12 lg:pb-0">
          <div className="relative h-56 w-full max-w-md lg:h-72">
            <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/10">
              <div className="rounded-full bg-white/20 p-12">
                <Image
                  src="/images/logo-seguridad-avanzada.png"
                  alt=""
                  width={120}
                  height={80}
                  className="opacity-90"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Siguiente slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-primary shadow hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
