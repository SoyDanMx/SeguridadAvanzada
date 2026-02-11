import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar sesión | Seguridad Avanzada",
  description: "Accede a tu cuenta para ver cotizaciones y pedidos.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
