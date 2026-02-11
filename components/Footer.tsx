"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Mail,
  MapPin,
  MessageCircle,
  FileText,
  Lock,
  Info,
  Briefcase,
  ShoppingBag,
  Shield,
  Facebook,
  Linkedin,
  Instagram,
} from "lucide-react";
import { CATEGORY_LINKS } from "@/lib/categories";

const EMAIL = "proyectos@seguridad-avanzada.com";
const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "525636741156";
const WHATSAPP_MESSAGE =
  "Hola, Necesito informacion sobre los servicios de Seguridad Avanzada";
const ADDRESS = "Atenas 1-1, Col. San Álvaro, Azcapotzalco, CDMX";

// Columnas de enlaces (estilo Sumee adaptado a Seguridad Avanzada)
const SEGURIDAD_AVANZADA_LINKS = [
  { href: "/contacto", icon: Info, text: "Sobre Nosotros" },
  { href: "/terminos", icon: FileText, text: "Términos de Servicio" },
  { href: "/aviso-privacidad", icon: Lock, text: "Aviso de Privacidad" },
  { href: "/politica-devolucion", icon: FileText, text: "Política de Devoluciones" },
  { href: "/contacto", icon: Mail, text: "Contáctanos" },
];

const PRODUCTOS_LINKS = [
  { href: "/productos", icon: ShoppingBag, text: "Catálogo" },
  { href: "/categorias", icon: ShoppingBag, text: "Categorías" },
  { href: "/catalogos", icon: FileText, text: "Catálogos PDF" },
  ...CATEGORY_LINKS.map(({ href, label }) => ({ href, icon: Shield, text: label })),
  { href: "/contacto", icon: Info, text: "Cotizaciones" },
];

const EMPRESA_LINKS = [
  { href: "/contacto", icon: Briefcase, text: "Contacto" },
  { href: "/proyectos", icon: Briefcase, text: "Proyectos" },
  { href: "/eventos", icon: Briefcase, text: "Eventos" },
  { href: "/soporte", icon: Info, text: "Soporte" },
];

function LinkColumn({
  title,
  links,
  pathname,
}: {
  title: string;
  links: { href: string; icon: React.ElementType; text: string }[];
  pathname: string;
}) {
  const isActive = (href: string) =>
    href === pathname || (href !== "/" && pathname.startsWith(href));

  return (
    <div>
      {title && (
        <h4 className="mb-4 text-base font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h4>
      )}
      <ul className="space-y-3">
        {links.map(({ href, icon: Icon, text }) => (
          <li key={`${href}-${text}`}>
            <Link
              href={href}
              className={`flex items-center gap-2 text-base transition hover:text-accent ${
                isActive(href) ? "font-semibold text-primary" : "text-foreground-muted"
              }`}
              aria-current={isActive(href) ? "page" : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const pathname = usePathname();
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <footer className="mt-auto bg-background-alt text-foreground">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Izquierda: contacto */}
          <div className="lg:w-2/5 space-y-6">
            <div>
              <h2 className="mb-2 text-2xl font-semibold text-foreground md:text-3xl">
                ¿Quieres saber más de nosotros?
              </h2>
              <p className="mb-6 text-3xl font-bold text-accent md:text-4xl">
                Contáctanos
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-accent px-6 py-3.5 text-lg font-semibold text-on-accent shadow-md transition hover:bg-accent-hover hover:shadow-lg"
              >
                <Mail className="h-5 w-5" />
                e-mail
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-[#25D366] px-6 py-3.5 text-lg font-semibold text-white shadow-md transition hover:bg-[#20C35A] hover:shadow-lg"
              >
                <MessageCircle className="h-5 w-5" />
                55 6367 41156
              </a>
            </div>

            <div className="flex items-start gap-2 text-base text-foreground-muted">
              <MapPin className="h-6 w-6 shrink-0 mt-0.5" />
              <span>{ADDRESS}</span>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted transition hover:text-[#1877F2]"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted transition hover:text-[#0077B5]"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground-muted transition hover:text-[#E4405F]"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>

          </div>

          {/* Derecha: columnas de enlaces */}
          <div className="lg:w-3/5">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12">
              <LinkColumn title="Seguridad Avanzada" links={SEGURIDAD_AVANZADA_LINKS} pathname={pathname} />
              <LinkColumn title="Productos" links={PRODUCTOS_LINKS} pathname={pathname} />
              <LinkColumn title="Empresa" links={EMPRESA_LINKS} pathname={pathname} />
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 border-t border-border pt-8">
          <p className="mb-3 text-base font-medium text-foreground">
            Recibe ofertas y novedades
          </p>
          <form
            className="flex max-w-md gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="tu@correo.com"
              className="flex-1 rounded-lg border border-border px-4 py-3 text-base text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              aria-label="Correo para boletín"
            />
            <button
              type="submit"
              className="rounded-lg bg-primary px-5 py-3 text-base font-semibold text-on-primary transition hover:bg-primary-nav"
            >
              Suscribir
            </button>
          </form>
          <p className="mt-2 text-sm text-foreground-muted">
            Próximamente: suscripción activa.
          </p>
        </div>

        <div className="mt-8 border-t border-border pt-8 text-center">
          <p className="text-base text-foreground-muted">
            © {new Date().getFullYear()} Seguridad Avanzada. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
