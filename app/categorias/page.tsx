import Link from "next/link";

export const metadata = {
  title: "Categorías | Seguridad Avanzada",
  description: "Explora nuestras categorías de productos.",
};

export default function CategoriasPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-syscom-primary">Categorías</h1>
      <p className="mt-2 text-slate-600">
        Explora el catálogo por categoría desde la página de{" "}
        <Link href="/productos" className="text-syscom-accent hover:underline">
          Productos
        </Link>
        .
      </p>
    </div>
  );
}
