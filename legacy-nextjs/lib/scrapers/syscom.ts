import { load } from "cheerio";
import { fetchHtml } from "./fetch-html";
import type {
  ScrapeResult,
  ScrapedCategory,
  ScrapedProduct,
  ScrapedBanner,
} from "./types";

const BASE_URL = "https://www.syscom.mx";

/**
 * Estructura típica de banner/promo en Syscom (carrusel):
 * <div class="absolute inset-0 ..."><a aria-label="YEALINK" href="/promociones/12439">
 *   <div><img alt="YEALINK" src="https://ftp3.syscom.mx/.../banner-yealink-rgb.jpg" /></div>
 * </a></div>
 */
export async function scrapeSyscom(
  url: string = `${BASE_URL}/`
): Promise<ScrapeResult> {
  const html = await fetchHtml(url);
  const $ = load(html);

  const categories: ScrapedCategory[] = [];
  const products: ScrapedProduct[] = [];
  const banners: ScrapedBanner[] = [];
  const seenCategoryUrls = new Set<string>();
  const seenProductUrls = new Set<string>();
  const seenBannerUrls = new Set<string>();

  const title =
    $("title").text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    "";

  $('a[href*="/categories/"]').each(function () {
    const href = $(this).attr("href");
    const name =
      $(this).find("h4, h3, .category-name").first().text().trim() ||
      $(this).text().trim();
    if (!href) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
    if (seenCategoryUrls.has(fullUrl)) return;
    seenCategoryUrls.add(fullUrl);
    const cleanName = name.replace(/\s+/g, " ").trim().slice(0, 120);
    if (!cleanName || cleanName.length < 2) return;
    categories.push({
      name: cleanName,
      url: fullUrl,
    });
  });

  $('a[href*="/products/"]').each(function () {
    const href = $(this).attr("href");
    if (!href) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
    if (seenProductUrls.has(fullUrl)) return;
    const idMatch = href.match(/\/products\/(\d+)/);
    if (!idMatch) return;
    seenProductUrls.add(fullUrl);

    const $el = $(this);
    let name =
      $el.find("h3, h4, [class*='product'], [class*='title']").first().text().trim() ||
      $el.attr("title") ||
      $el.text().trim();
    name = name.replace(/\s+/g, " ").trim().slice(0, 200);
    if (!name) name = `Producto ${idMatch[1]}`;

    const skuEl = $el.find("[class*='sku'], code, .sku").first();
    const sku = skuEl.length ? skuEl.text().trim() : undefined;

    const img = $el.find("img").attr("src");
    const image = img?.startsWith("http") ? img : img ? new URL(img, BASE_URL).href : undefined;

    products.push({
      name,
      url: fullUrl,
      sku: sku || idMatch[1],
      image,
    });
  });

  // Banners / promos: a[href*="/promociones/"] con img (aria-label o alt, src ftp3.syscom.mx)
  $('a[href*="/promociones/"]').each(function () {
    const href = $(this).attr("href");
    if (!href) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, BASE_URL).href;
    if (seenBannerUrls.has(fullUrl)) return;
    const $a = $(this);
    const $img = $a.find("img[src*='ftp3.syscom.mx']").first();
    const imgSrc = $img.attr("src");
    const name =
      $a.attr("aria-label")?.trim() ||
      $img.attr("alt")?.trim() ||
      $a.find("img").attr("alt")?.trim() ||
      "";
    if (!imgSrc || !name) return;
    seenBannerUrls.add(fullUrl);
    const image = imgSrc.startsWith("http") ? imgSrc : new URL(imgSrc, BASE_URL).href;
    banners.push({ name: name.slice(0, 120), url: fullUrl, image });
  });

  return {
    source: "SYSCOM",
    url,
    scrapedAt: new Date().toISOString(),
    categories: categories.slice(0, 80),
    products: products.slice(0, 100),
    banners: banners.slice(0, 30),
    raw: {
      title,
      linksCount: $("a").length,
    },
  };
}
