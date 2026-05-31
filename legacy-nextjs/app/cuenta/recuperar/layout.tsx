import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recuperar contraseña | Seguridad Avanzada",
  description: "Restablece tu contraseña de Seguridad Avanzada.",
};

export default function RecuperarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
