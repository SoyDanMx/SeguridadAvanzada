import { NextRequest, NextResponse } from "next/server";
import {
  runActorAndGetDataset,
  ecommerceInput,
  websiteContentInput,
} from "@/lib/apify-client";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

const ACTORS = {
  ecommerce: {
    id: "apify/e-commerce-scraping-tool",
    input: () => ecommerceInput(),
  },
  website: {
    id: "apify/website-content-crawler",
    input: () => websiteContentInput(undefined, 30),
  },
} as const;

/**
 * GET /api/apify-scrape?actor=ecommerce
 * GET /api/apify-scrape?actor=website
 *
 * Ejecuta un Actor de Apify para scrapear Syscom y Seguridad Avanzada.
 * Requiere APIFY_TOKEN en .env.local.
 *
 * - actor=ecommerce → E-commerce Scraping Tool (productos, precios).
 * - actor=website   → Website Content Crawler (texto/Markdown de páginas).
 *
 * Espera hasta ~2 min a que termine el run y devuelve los items del dataset.
 * Si tarda más, puedes usar el runId en la consola de Apify para ver el resultado.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const actorKey = (searchParams.get("actor") ?? "ecommerce").toLowerCase();
    const config = ACTORS[actorKey as keyof typeof ACTORS];

    if (!config) {
      return NextResponse.json(
        { error: `actor debe ser "ecommerce" o "website". Recibido: ${actorKey}` },
        { status: 400 }
      );
    }

    const { runId, datasetId, items } = await runActorAndGetDataset(
      config.id,
      config.input(),
      { waitSec: 15, maxWaitSec: 100 }
    );

    return NextResponse.json({
      ok: true,
      actor: config.id,
      runId,
      datasetId,
      itemsCount: items.length,
      items: items.slice(0, 100),
      message:
        items.length > 100
          ? "Se devolvieron los primeros 100 items. Descarga el dataset completo desde Apify Console."
          : undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
