import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cuenta | Seguridad Avanzada",
  description: "Iniciar sesión o gestionar tu cuenta en Seguridad Avanzada.",
};

export default function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
