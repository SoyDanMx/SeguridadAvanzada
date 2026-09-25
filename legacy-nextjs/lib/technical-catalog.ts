import fs from "fs";
import path from "path";

interface TechnicalProductData {
  sku: string;
  title: string;
  vendor: string;
  category: string;
  datasheet_url: string | null;
  manual_url: string | null;
  all_pdfs?: string[];
  specs_summary: string | null;
  syscom_page: string;
}

let cachedCatalog: Record<string, TechnicalProductData> | null = null;

function loadTechnicalCatalog(): Record<string, TechnicalProductData> {
  if (cachedCatalog) return cachedCatalog;

  const possiblePaths = [
    path.resolve(process.cwd(), "data/technical_catalog_index.json"),
    path.resolve(process.cwd(), "../data/technical_catalog_index.json"),
    path.resolve(__dirname, "../../../data/technical_catalog_index.json"),
  ];

  for (const filePath of possiblePaths) {
    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf8");
        cachedCatalog = JSON.parse(raw);
        return cachedCatalog!;
      } catch (e) {
        console.error("[Technical Catalog] Error parsing JSON index:", e);
      }
    }
  }

  return {};
}

export function getTechnicalData(sku: string): TechnicalProductData | null {
  if (!sku) return null;
  const catalog = loadTechnicalCatalog();
  const normalized = sku.trim().toUpperCase();

  // 1. Coincidencia directa
  if (catalog[normalized]) {
    return catalog[normalized];
  }

  // 2. Coincidencia sin guiones ni diagonales
  const unhyphenated = normalized.replace(/[\-\/]/g, "");
  if (catalog[unhyphenated]) {
    return catalog[unhyphenated];
  }

  // 3. Fallback canónico con enlace Syscom
  return {
    sku: sku.trim(),
    title: sku.trim(),
    vendor: "Seguridad Avanzada",
    category: "Seguridad Electrónica",
    datasheet_url: `https://www.syscom.mx/producto/${encodeURIComponent(sku.trim())}.html`,
    manual_url: null,
    specs_summary: null,
    syscom_page: `https://www.syscom.mx/producto/${encodeURIComponent(sku.trim())}.html`
  };
}
