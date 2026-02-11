"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

/**
 * Hero con banner HiLook: sistemas de videovigilancia completos, listos para instalarse.
 * Imagen principal + CTA a catálogo.
 */
export function HeroVisual() {
  return (
    <section className="relative flex min-h-[70vh] items-end justify-center overflow-hidden bg-primary-nav">
      {/* Banner HiLook: imagen principal */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero-banner-hilook.png"
          alt="Sistemas de Videovigilancia Completos - Listos para Instalarse. Cableado, Cámaras, Grabador y Fuente de Poder. HiLook by HIKVISION."
          fill
          className="hero-banner-image object-cover object-center"
          priority
          sizes="100vw"
        />
        {/* Overlay suave en la base para legibilidad del CTA */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Título y CTA — móvil: una columna, H1 22–26px, botones 100% ancho */}
      <div className="relative z-10 w-full px-4 pb-10 pt-20 sm:pb-12 md:pb-14">
        <div className="container mx-auto flex flex-col items-stretch gap-4 sm:items-center sm:flex-row sm:gap-4">
          <h1 className="font-bold leading-tight text-white drop-shadow-md md:text-2xl lg:text-3xl" style={{ fontSize: "clamp(1.375rem, 5vw, 1.625rem)" }}>
            Sistemas de Videovigilancia Completos
          </h1>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <Link
              href="/productos"
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-on-accent shadow-lg transition-all duration-300 hover:bg-accent-hover hover:shadow-xl active:scale-[0.98] md:w-auto"
              aria-label="Ver catálogo de productos"
            >
              Ver catálogo
              <ArrowRight className="h-5 w-5" aria-hidden />
            </Link>
            <Link
              href="/contacto"
              className="flex min-h-[44px] w-full items-center justify-center rounded-xl border-2 border-white/80 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white hover:bg-white/20 active:scale-[0.98] md:w-auto"
            >
              Contacto y cotización
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
