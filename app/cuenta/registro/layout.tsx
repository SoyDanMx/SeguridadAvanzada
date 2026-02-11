import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Crear cuenta | Seguridad Avanzada",
  description: "Regístrate en Seguridad Avanzada para acceder a cotizaciones y pedidos.",
};

export default function RegistroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
