import { NextRequest, NextResponse } from "next/server";
import { getDatasetItems } from "@/lib/apify-client";

export const dynamic = "force-dynamic";

/**
 * GET /api/apify-dataset?dataset=ID
 *
 * Obtiene los items de un dataset de Apify por su ID.
 * Requiere APIFY_TOKEN en .env.local (para datasets privados).
 *
 * Ejemplo: GET /api/apify-dataset?dataset=jydUlXkeacOhExzF5
 * Equivalente a: https://api.apify.com/v2/datasets/jydUlXkeacOhExzF5/items?format=json&view=details&clean=true
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const datasetId = searchParams.get("dataset")?.trim();

    if (!datasetId) {
      return NextResponse.json(
        { error: "Falta query 'dataset' (ID del dataset de Apify). Ejemplo: ?dataset=jydUlXkeacOhExzF5" },
        { status: 400 }
      );
    }

    const items = await getDatasetItems(datasetId);

    return NextResponse.json({
      ok: true,
      datasetId,
      itemsCount: items.length,
      items,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = message.includes("401") ? 401 : message.includes("403") ? 403 : message.includes("404") ? 404 : 500;
    return NextResponse.json(
      {
        ok: false,
        error: message,
        hint:
          status === 401
            ? "Revisa APIFY_TOKEN en .env.local (sin comillas extra, sin espacios). Reinicia el servidor (npm run dev)."
            : status === 404
              ? "Dataset no encontrado. Prueba con ?dataset=TU_USER_ID~datasetId (ej. eKRlr79MLjnPFGCuQ~jydUlXkeacOhExzF5)."
              : undefined,
      },
      { status }
    );
  }
}
