import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  SYSCOM_CATEGORIES,
  getCategoryBySlug,
  getCategoryParam,
} from "@/lib/categories";

const SLUGS = SYSCOM_CATEGORIES.map((c) => c.slug);

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) return { title: "Categoría | Seguridad Avanzada" };
  return {
    title: `${cat.label} | Productos | Seguridad Avanzada`,
    description: `Productos de ${cat.label}. Catálogo de Productos en Seguridad Avanzada.`,
  };
}

export default async function CategoriaProductosPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cat = getCategoryBySlug(slug);
  if (!cat) notFound();
  const param = getCategoryParam(cat);
  redirect(`/productos?category=${encodeURIComponent(param)}`);
}
