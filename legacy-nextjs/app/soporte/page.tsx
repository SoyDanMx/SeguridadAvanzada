export const metadata = {
  title: "Soporte | Seguridad Avanzada",
  description: "Soporte técnico y ayuda.",
};

export default function SoportePage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-syscom-primary">Soporte</h1>
      <p className="mt-2 text-slate-600">
        Para soporte técnico y cotizaciones, contáctanos por{" "}
        <a href="/contacto" className="text-syscom-accent hover:underline">
          Contacto
        </a>
        .
      </p>
    </div>
  );
}
