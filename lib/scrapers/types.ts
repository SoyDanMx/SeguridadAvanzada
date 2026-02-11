export interface ScrapedCategory {
  name: string;
  slug?: string;
  url: string;
  parent?: string;
}

export interface ScrapedProduct {
  name: string;
  url: string;
  price?: string;
  priceOriginal?: string;
  category?: string;
  sku?: string;
  image?: string;
}

/** Banner/promo del carrusel (ej. Syscom: div con a[href*="/promociones/"] e img[src*="ftp3.syscom.mx"]). */
export interface ScrapedBanner {
  name: string;
  url: string;
  image: string;
}

export interface ScrapeResult {
  source: string;
  url: string;
  scrapedAt: string;
  categories: ScrapedCategory[];
  products: ScrapedProduct[];
  banners?: ScrapedBanner[];
  raw?: { title?: string; linksCount: number };
}
