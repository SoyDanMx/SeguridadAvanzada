import { load } from "cheerio";
import { fetchHtml } from "./fetch-html";
import type { ScrapeResult, ScrapedCategory, ScrapedProduct } from "./types";

const BASE_URL = "https://www.seguridad-avanzada.com";

export async function scrapeSeguridadAvanzada(
  url: string = `${BASE_URL}/`
): Promise<ScrapeResult> {
  const html = await fetchHtml(url);
  const $ = load(html);

  const categories: ScrapedCategory[] = [];
  const products: ScrapedProduct[] = [];
  const seenCategoryUrls = new Set<string>();
  const seenProductUrls = new Set<string>();

  const title =
    $("title").text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    "";

  $('a[href*="/videovigilancia/"], a[href*="/alarmas/"], a[href*="/control-de-acceso/"], a[href*="/redes"], a[href*="/automatizacion"], a[href*="/deteccion-de-fuego/"], a[href*="/gamers"], a[href*="/herramientas"], a[href*="/proteccion-civil/"], a[href*="/electronica"], a[href*="/articulos-de-oficina"], a[href*="/computo"], a[href*="/seguridad-privada/"], a[href*="/cableado-estructurado"], a[href*="/redes-y-audio-video"]').each(
    function () {
      const href = $(this).attr("href");
      const name = $(this).text().trim();
      if (!href || !name || name.length > 80) return;
      const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
      if (seenCategoryUrls.has(fullUrl)) return;
      seenCategoryUrls.add(fullUrl);
      const slug = href.replace(/^\//, "").replace(/\/$/, "");
      categories.push({
        name: name.replace(/\s+/g, " ").slice(0, 120),
        slug,
        url: fullUrl,
      });
    }
  );

  $('a[href*="/productos/"]').each(function () {
    const href = $(this).attr("href");
    if (!href || href === "/productos/" || href.endsWith("/productos")) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
    if (seenProductUrls.has(fullUrl)) return;
    seenProductUrls.add(fullUrl);

    const $el = $(this);
    let name =
      $el.find("h3, h4, .product-title, .name, [class*='product']").first().text().trim() ||
      $el.text().trim();
    name = name.replace(/\s+/g, " ").slice(0, 200);
    if (!name) name = href.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Producto";

    const priceText = $el.text();
    const priceMatch = priceText.match(/\$[\d,]+\.?\d*/);
    const priceOriginalMatch = priceText.match(/\$[\d,]+\.?\d*\s*\$([\d,]+\.?\d*)/);
    const price = priceMatch ? priceMatch[0] : undefined;
    const priceOriginal = priceOriginalMatch ? priceOriginalMatch[1] : undefined;

    const img = $el.find("img").attr("src");
    const image = img?.startsWith("http") ? img : img ? new URL(img, BASE_URL).href : undefined;

    products.push({
      name,
      url: fullUrl,
      price,
      priceOriginal: priceOriginal ? `$${priceOriginal}` : undefined,
      image,
    });
  });

  return {
    source: "Seguridad Avanzada",
    url,
    scrapedAt: new Date().toISOString(),
    categories: categories.slice(0, 80),
    products: products.slice(0, 100),
    raw: {
      title,
      linksCount: $("a").length,
    },
  };
}
