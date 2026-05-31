import { scrapeSeguridadAvanzada } from "./seguridad-avanzada";
import { scrapeSyscom } from "./syscom";
import type { ScrapeResult } from "./types";

export type { ScrapeResult, ScrapedCategory, ScrapedProduct, ScrapedBanner } from "./types";

export async function scrapeAll(): Promise<{
  seguridadAvanzada: ScrapeResult;
  syscom: ScrapeResult;
}> {
  const [seguridadAvanzada, syscom] = await Promise.all([
    scrapeSeguridadAvanzada("https://www.seguridad-avanzada.com/"),
    scrapeSyscom("https://www.syscom.mx/"),
  ]);
  return { seguridadAvanzada, syscom };
}

export { scrapeSeguridadAvanzada, scrapeSyscom };
