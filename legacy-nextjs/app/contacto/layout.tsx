import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contacto | Seguridad Avanzada",
  description:
    "Contáctanos para cotizaciones, soporte técnico y entregas en CDMX y todo México. Videovigilancia, control de acceso y redes.",
};

export default function ContactoLayout({
  children,
}: { children: React.ReactNode }) {
  return children;
}
