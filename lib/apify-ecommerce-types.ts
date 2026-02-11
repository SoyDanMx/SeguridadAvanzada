/**
 * Tipos del output del Actor "E-commerce Scraping Tool" de Apify.
 * Referencia: docs/samples/apify-ecommerce-output-sample.json
 */

export interface ApifyEcommerceOffers {
  price: string | null;
  priceCurrency: string | null;
}

export interface ApifyEcommerceBrand {
  slogan: string | null;
}

export interface ApifyEcommerceAdditionalProperties {
  currencyRaw?: string;
  sku?: string;
  [key: string]: unknown;
}

export interface ApifyEcommerceItem {
  url: string;
  name: string;
  image: string | null;
  offers: ApifyEcommerceOffers;
  brand: ApifyEcommerceBrand;
  description: string;
  additionalProperties?: ApifyEcommerceAdditionalProperties;
}

export type ApifyEcommerceDataset = ApifyEcommerceItem[];
