/**
 * Cliente para la API de Apify (https://apify.com/).
 * Permite ejecutar Actors (E-commerce Scraping Tool, Website Content Crawler)
 * y obtener el dataset de resultados.
 */

const API_BASE = "https://api.apify.com/v2";

function getToken(): string {
  const token = process.env.APIFY_TOKEN;
  if (!token?.trim()) {
    throw new Error(
      "Falta APIFY_TOKEN en .env.local. Obtén uno en https://console.apify.com/account/integrations"
    );
  }
  return token.trim();
}

export interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    defaultDatasetId?: string;
  };
}

export interface ApifyDatasetItemsResponse {
  data: unknown[];
}

const SYSCOM_URL = "https://www.syscom.mx/";
const SEGURIDAD_AVANZADA_URL = "https://www.seguridad-avanzada.com/";

/**
 * Ejecuta un Actor de Apify y espera a que termine; devuelve los items del dataset.
 * actorId: "apify/e-commerce-scraping-tool" o "apify/website-content-crawler"
 */
export async function runActorAndGetDataset(
  actorId: string,
  input: Record<string, unknown>,
  options: { waitSec?: number; maxWaitSec?: number } = {}
): Promise<{ runId: string; datasetId: string; items: unknown[] }> {
  const token = getToken();
  const waitSec = options.waitSec ?? 30;
  const maxWaitSec = options.maxWaitSec ?? 300;

  const runRes = await fetch(
    `${API_BASE}/acts/${actorId.replace(/\//g, "~")}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    }
  );

  if (!runRes.ok) {
    const text = await runRes.text();
    throw new Error(`Apify run: ${runRes.status} ${text}`);
  }

  const runData = (await runRes.json()) as ApifyRunResponse;
  const runId = runData.data.id;
  let datasetId = runData.data.defaultDatasetId;

  const start = Date.now();
  while (Date.now() - start < maxWaitSec * 1000) {
    const statusRes = await fetch(
      `${API_BASE}/actor-runs/${runId}?token=${token}`
    );
    if (!statusRes.ok) break;
    const statusData = (await statusRes.json()) as { data: { status: string; defaultDatasetId?: string } };
    datasetId = datasetId ?? statusData.data.defaultDatasetId;
    if (statusData.data.status === "SUCCEEDED") break;
    if (statusData.data.status === "FAILED" || statusData.data.status === "ABORTED") {
      throw new Error(`Apify run ${runId} terminó con estado: ${statusData.data.status}`);
    }
    await new Promise((r) => setTimeout(r, waitSec * 1000));
  }

  if (!datasetId) {
    throw new Error("Apify no devolvió datasetId para el run " + runId);
  }

  const itemsRes = await fetch(
    `${API_BASE}/actor-runs/${runId}/dataset/items?token=${token}`
  );
  if (!itemsRes.ok) {
    const text = await itemsRes.text();
    throw new Error(`Apify dataset: ${itemsRes.status} ${text}`);
  }
  const items = (await itemsRes.json()) as unknown[];

  return { runId, datasetId, items };
}

/**
 * Obtiene los items de un dataset de Apify por su ID.
 * URL equivalente: https://api.apify.com/v2/datasets/{datasetId}/items?format=json&view=details&clean=true&token=...
 * Útil cuando ya tienes un run terminado y el datasetId (p. ej. jydUlXkeacOhExzF5).
 */
export async function getDatasetItems(
  datasetId: string,
  options: { token?: string; format?: "json"; view?: string; clean?: boolean } = {}
): Promise<unknown[]> {
  const token = options.token ?? getToken();
  const format = options.format ?? "json";
  const view = options.view ?? "details";
  const clean = options.clean !== false;

  const params = new URLSearchParams({
    format,
    view,
    clean: String(clean),
    token,
  });
  const url = `${API_BASE}/datasets/${datasetId}/items?${params.toString()}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    const preview = text.length > 300 ? text.slice(0, 300) + "…" : text;
    throw new Error(`Apify dataset ${datasetId}: ${res.status} ${preview}`);
  }
  return (await res.json()) as unknown[];
}

/**
 * Input para E-commerce Scraping Tool (productos/precios).
 */
export function ecommerceInput(startUrls: string[] = [SYSCOM_URL, SEGURIDAD_AVANZADA_URL]) {
  return {
    startUrls: startUrls.map((url) => ({ url })),
    maxRequestsPerCrawl: 50,
  };
}

/**
 * Input para Website Content Crawler (contenido en texto/Markdown).
 */
export function websiteContentInput(
  startUrls: string[] = [SYSCOM_URL, SEGURIDAD_AVANZADA_URL],
  maxCrawlPages = 50
) {
  return {
    startUrls: startUrls.map((url) => ({ url })),
    maxCrawlPages,
  };
}
