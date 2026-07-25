"use client";

import React, { useEffect, useState } from "react";
import { Video, Tag, ShieldCheck, ExternalLink, Facebook } from "lucide-react";

export function FacebookCommunity() {
  const [isLoaded, setIsLoaded] = useState(false);
  const facebookUrl = "https://www.facebook.com/seguridadavanzadacdmx/";

  useEffect(() => {
    // Lazy load Facebook SDK with IntersectionObserver
    const element = document.getElementById("fb-community-section");
    if (!element) return;

    const loadSDK = () => {
      if ((window as any).FB) {
        (window as any).FB.XFBML.parse(element);
        setIsLoaded(true);
        return;
      }

      if (!document.getElementById("facebook-jssdk")) {
        const js = document.createElement("script");
        js.id = "facebook-jssdk";
        js.src = "https://connect.facebook.net/es_LA/sdk.js#xfbml=1&version=v19.0";
        js.async = true;
        js.defer = true;
        js.onload = () => setIsLoaded(true);
        document.body.appendChild(js);
      } else {
        setTimeout(() => {
          if ((window as any).FB) (window as any).FB.XFBML.parse(element);
          setIsLoaded(true);
        }, 800);
      }
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadSDK();
              observer.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "200px 0px" }
      );
      observer.observe(element);
    } else {
      loadSDK();
    }
  }, []);

  return (
    <section
      id="fb-community-section"
      className="relative overflow-hidden bg-gradient-to-br from-[#0b1329] via-[#152238] to-[#0d1b2a] py-16 text-white"
    >
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* Left Column: Info */}
          <div className="flex flex-col items-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400 backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              Nuestra Comunidad Principal
            </div>

            <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Únete a la red de Seguridad Avanzada en Facebook
            </h2>

            <p className="mb-8 text-base text-slate-400 sm:text-lg">
              Sigue nuestra página oficial de Facebook para recibir en tiempo real pruebas de equipos, lanzamientos y promociones:
            </p>

            <div className="mb-8 flex w-full flex-col gap-4">
              <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-500/50 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <Video className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">Videos & Pruebas en Vivo</h4>
                  <p className="text-sm text-slate-400">
                    Demostraciones en tiempo real de cámaras CCTV, control de acceso y novedades tecnológicas.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-500/50 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">Ofertas & Promociones Exclusivas</h4>
                  <p className="text-sm text-slate-400">
                    Descuentos directos y lanzamientos publicados en nuestra red antes que en cualquier otro lugar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-blue-500/50 hover:bg-white/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white shadow-lg shadow-blue-500/30">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-100">Casos de Éxito & Asesoría</h4>
                  <p className="text-sm text-slate-400">
                    Proyectos reales de instalación y atención personalizada de nuestros ingenieros.
                  </p>
                </div>
              </div>
            </div>

            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3.5 text-base font-bold text-white shadow-lg shadow-blue-600/40 transition hover:scale-[1.02] hover:from-blue-500 hover:to-blue-600"
            >
              <Facebook className="h-5 w-5 fill-current" />
              <span>Seguir en Facebook</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>

          {/* Right Column: Facebook Page Player */}
          <div className="flex justify-center">
            <div className="w-full max-w-[500px] rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
                <Facebook className="h-6 w-6 fill-blue-500 text-blue-500" />
                <span className="font-bold text-slate-200">Comunidad Oficial en Facebook</span>
              </div>

              <div className="relative min-h-[480px] w-full overflow-hidden rounded-xl bg-white">
                {!isLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-slate-900 text-slate-400">
                    <Video className="h-8 w-8 animate-pulse text-blue-500" />
                    <span className="text-sm">Cargando feed y videos de Facebook...</span>
                  </div>
                )}

                <div
                  className="fb-page"
                  data-href={facebookUrl}
                  data-tabs="timeline"
                  data-width="500"
                  data-height="500"
                  data-small-header="false"
                  data-adapt-container-width="true"
                  data-hide-cover="false"
                  data-show-facepile="true"
                >
                  <blockquote cite={facebookUrl} className="fb-xfbml-parse-ignore">
                    <a href={facebookUrl}>Seguridad Avanzada</a>
                  </blockquote>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
