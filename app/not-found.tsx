import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold text-primary">404</h1>
      <p className="mt-2 text-foreground-muted">
        No encontramos la página que buscas.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-accent px-6 py-3 font-medium text-on-accent hover:bg-accent-hover"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
