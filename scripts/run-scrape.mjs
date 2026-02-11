/**
 * Ejecuta web scraping de seguridad-avanzada.com y syscom.mx.
 * Uso: node scripts/run-scrape.mjs [--save]
 * Con --save escribe data/scrape-seguridad-avanzada.json y data/scrape-syscom.json
 */

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "es-MX,es;q=0.9,en;q=0.8",
    },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return res.text();
}

async function scrapeSeguridadAvanzada() {
  const url = "https://www.seguridad-avanzada.com/";
  const html = await fetchHtml(url);
  const { load } = await import("cheerio");
  const $ = load(html);

  const categories = [];
  const products = [];
  const seenCat = new Set();
  const seenProd = new Set();

  $('a[href*="/videovigilancia/"], a[href*="/alarmas/"], a[href*="/control-de-acceso/"], a[href*="/redes"], a[href*="/automatizacion"], a[href*="/deteccion-de-fuego/"], a[href*="/gamers"], a[href*="/herramientas"], a[href*="/proteccion-civil/"], a[href*="/electronica"], a[href*="/articulos-de-oficina"], a[href*="/computo"], a[href*="/seguridad-privada/"], a[href*="/cableado-estructurado"], a[href*="/redes-y-audio-video"]').each(
    function () {
      const href = $(this).attr("href");
      const name = $(this).text().trim();
      if (!href || !name || name.length > 80) return;
      const fullUrl = href.startsWith("http") ? href : new URL(href, url).href;
      if (seenCat.has(fullUrl)) return;
      seenCat.add(fullUrl);
      categories.push({
        name: name.replace(/\s+/g, " ").slice(0, 120),
        url: fullUrl,
      });
    }
  );

  $('a[href*="/productos/"]').each(function () {
    const href = $(this).attr("href");
    if (!href || href === "/productos/" || href.endsWith("/productos")) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, url).href;
    if (seenProd.has(fullUrl)) return;
    seenProd.add(fullUrl);
    const $el = $(this);
    let name =
      $el.find("h3, h4, .product-title, .name").first().text().trim() ||
      $el.text().trim();
    name = (name || "Producto").replace(/\s+/g, " ").slice(0, 200);
    const priceMatch = $el.text().match(/\$[\d,]+\.?\d*/);
    products.push({
      name,
      url: fullUrl,
      price: priceMatch ? priceMatch[0] : undefined,
    });
  });

  return {
    source: "Seguridad Avanzada",
    url,
    scrapedAt: new Date().toISOString(),
    categories: categories.slice(0, 80),
    products: products.slice(0, 100),
    raw: { title: $("title").text().trim(), linksCount: $("a").length },
  };
}

async function scrapeSyscom() {
  const url = "https://www.syscom.mx/";
  const html = await fetchHtml(url);
  const { load } = await import("cheerio");
  const $ = load(html);

  const categories = [];
  const products = [];
  const banners = [];
  const seenCat = new Set();
  const seenProd = new Set();
  const seenBanner = new Set();

  $('a[href*="/categories/"]').each(function () {
    const href = $(this).attr("href");
    const name = $(this).find("h4, h3").first().text().trim() || $(this).text().trim();
    if (!href) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, url).href;
    if (seenCat.has(fullUrl)) return;
    seenCat.add(fullUrl);
    const clean = name.replace(/\s+/g, " ").trim().slice(0, 120);
    if (clean.length >= 2) categories.push({ name: clean, url: fullUrl });
  });

  $('a[href*="/products/"]').each(function () {
    const href = $(this).attr("href");
    if (!href) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, url).href;
    const idMatch = href.match(/\/products\/(\d+)/);
    if (!idMatch || seenProd.has(fullUrl)) return;
    seenProd.add(fullUrl);
    const $el = $(this);
    let name =
      $el.find("h3, h4, [class*='product']").first().text().trim() ||
      $el.attr("title") ||
      $el.text().trim();
    name = (name || `Producto ${idMatch[1]}`).replace(/\s+/g, " ").slice(0, 200);
    products.push({ name, url: fullUrl, sku: idMatch[1] });
  });

  $('a[href*="/promociones/"]').each(function () {
    const href = $(this).attr("href");
    if (!href) return;
    const fullUrl = href.startsWith("http") ? href : new URL(href, url).href;
    if (seenBanner.has(fullUrl)) return;
    const $a = $(this);
    const $img = $a.find("img[src*='ftp3.syscom.mx']").first();
    const imgSrc = $img.attr("src");
    const name =
      $a.attr("aria-label")?.trim() ||
      $img.attr("alt")?.trim() ||
      $a.find("img").attr("alt")?.trim() ||
      "";
    if (!imgSrc || !name) return;
    seenBanner.add(fullUrl);
    const image = imgSrc.startsWith("http") ? imgSrc : new URL(imgSrc, url).href;
    banners.push({ name: name.slice(0, 120), url: fullUrl, image });
  });

  return {
    source: "SYSCOM",
    url,
    scrapedAt: new Date().toISOString(),
    categories: categories.slice(0, 80),
    products: products.slice(0, 100),
    banners: banners.slice(0, 30),
    raw: { title: $("title").text().trim(), linksCount: $("a").length },
  };
}

const save = process.argv.includes("--save");

async function main() {
  console.log("Scraping https://www.seguridad-avanzada.com/ ...");
  const seguridadAvanzada = await scrapeSeguridadAvanzada();
  console.log(
    `  Categorías: ${seguridadAvanzada.categories.length}, Productos: ${seguridadAvanzada.products.length}`
  );

  console.log("Scraping https://www.syscom.mx/ ...");
  const syscom = await scrapeSyscom();
  console.log(
    `  Categorías: ${syscom.categories.length}, Productos: ${syscom.products.length}, Banners: ${syscom.banners?.length ?? 0}`
  );

  if (save) {
    const dataDir = path.join(projectRoot, "data");
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(
      path.join(dataDir, "scrape-seguridad-avanzada.json"),
      JSON.stringify(seguridadAvanzada, null, 2),
      "utf-8"
    );
    await fs.writeFile(
      path.join(dataDir, "scrape-syscom.json"),
      JSON.stringify(syscom, null, 2),
      "utf-8"
    );
    console.log("Guardado en data/scrape-seguridad-avanzada.json y data/scrape-syscom.json");
  }

  console.log("Listo.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
