import { NextRequest, NextResponse } from "next/server";
import { scrapeAll } from "@/lib/scrapers";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/scrape
 * Ejecuta web scraping de seguridad-avanzada.com y syscom.mx.
 * Opcional: ?save=1 guarda resultados en data/scrape-*.json
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const save = searchParams.get("save") === "1";

    const { seguridadAvanzada, syscom } = await scrapeAll();

    if (save) {
      const dataDir = path.join(process.cwd(), "data");
      await fs.mkdir(dataDir, { recursive: true });
      await Promise.all([
        fs.writeFile(
          path.join(dataDir, "scrape-seguridad-avanzada.json"),
          JSON.stringify(seguridadAvanzada, null, 2),
          "utf-8"
        ),
        fs.writeFile(
          path.join(dataDir, "scrape-syscom.json"),
          JSON.stringify(syscom, null, 2),
          "utf-8"
        ),
      ]);
    }

    return NextResponse.json({
      ok: true,
      seguridadAvanzada: {
        source: seguridadAvanzada.source,
        url: seguridadAvanzada.url,
        scrapedAt: seguridadAvanzada.scrapedAt,
        categoriesCount: seguridadAvanzada.categories.length,
        productsCount: seguridadAvanzada.products.length,
        categories: seguridadAvanzada.categories,
        products: seguridadAvanzada.products,
        raw: seguridadAvanzada.raw,
      },
      syscom: {
        source: syscom.source,
        url: syscom.url,
        scrapedAt: syscom.scrapedAt,
        categoriesCount: syscom.categories.length,
        productsCount: syscom.products.length,
        bannersCount: syscom.banners?.length ?? 0,
        categories: syscom.categories,
        products: syscom.products,
        banners: syscom.banners,
        raw: syscom.raw,
      },
      saved: save,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[scrape]", message);
    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}
