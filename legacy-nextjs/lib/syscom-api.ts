/**
 * Cliente de API Syscom para sincronización.
 * OAuth2 + bypass SSL (rejectUnauthorized: false).
 * Usado por lib/sync-engine.ts.
 */

import https from "https";

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  maxSockets: 4,
});

const SYSCOM_BASE =
  process.env.SYSCOM_API_BASE?.trim() || "https://developers.syscom.mx";

function stripEnvValue(v: string | undefined): string {
  if (v == null) return "";
  return String(v)
    .replace(/\r\n|\r|\n/g, "")
    .trim()
    .replace(/^["']|["']$/g, "");
}

function getCredentials(): { clientId: string; clientSecret: string } {
  const clientId = stripEnvValue(process.env.SYSCOM_CLIENT_ID);
  const clientSecret = stripEnvValue(process.env.SYSCOM_CLIENT_SECRET);
  if (!clientId || !clientSecret) {
    throw new Error(
      "Faltan SYSCOM_CLIENT_ID o SYSCOM_CLIENT_SECRET en .env.local"
    );
  }
  return { clientId, clientSecret };
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

interface SyscomAuthResponse {
  access_token: string;
  expires_in: number;
}

async function httpsRequest<T>(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {}
): Promise<T> {
  const u = new URL(url);
  const headers = {
    Accept: "application/json",
    "User-Agent": "SeguridadAvanzadaShop/1.0 (sync)",
    ...options.headers,
  };

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: options.method ?? "GET",
        headers,
        agent: httpsAgent,
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(data) as T);
            } catch {
              reject(new Error(`Invalid JSON: ${data.slice(0, 100)}`));
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error("Timeout 20s"));
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}

/**
 * Obtiene token OAuth2 de Syscom.
 */
export async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60_000) {
    return cachedToken;
  }

  const { clientId, clientSecret } = getCredentials();
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  }).toString();

  try {
    const data = await httpsRequest<SyscomAuthResponse>(
      `${SYSCOM_BASE.replace(/\/$/, "")}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": String(Buffer.byteLength(body, "utf8")),
        },
        body,
      }
    );
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in ?? 31536000) * 1000;
    return cachedToken;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("401")) {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      const data = await httpsRequest<SyscomAuthResponse>(
        `${SYSCOM_BASE.replace(/\/$/, "")}/oauth/token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${basicAuth}`,
          },
          body: "grant_type=client_credentials",
        }
      );
      cachedToken = data.access_token;
      tokenExpiresAt = now + (data.expires_in ?? 31536000) * 1000;
      return cachedToken;
    }
    throw e;
  }
}

export interface SyscomProductRaw {
  producto_id?: string | number;
  sku?: string;
  modelo?: string;
  titulo?: string;
  descripcion?: string;
  precio?: number | { precio_lista?: number; precio_especial?: number; precio_1?: number };
  precios?: Record<string, unknown>;
  moneda?: string;
  categoria?: string;
  img_portada?: string;
  imagen?: string;
  imagenes?: Array<{ url?: string } | string>;
  marca?: string | { nombre?: string };
  existencia?: number;
  total_existencia?: number;
  [key: string]: unknown;
}

export interface FetchProductsResult {
  products: SyscomProductRaw[];
  total: number;
}

/**
 * Obtiene productos de Syscom (sin caché, para sync).
 */
export async function fetchProducts(params: {
  category: string;
  page: number;
  limit?: number;
}): Promise<FetchProductsResult> {
  const token = await getAccessToken();
  const limit = Math.min(60, Math.max(10, params.limit ?? 60));
  const search = new URLSearchParams({
    categoria: params.category,
    pagina: String(limit),
    page: String(params.page),
  });

  const url = `${SYSCOM_BASE.replace(/\/$/, "")}/api/v1/productos?${search.toString()}`;
  const data = await httpsRequest<Record<string, unknown>>(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const productosArray =
    (data.productos as SyscomProductRaw[] | undefined) ??
    (data.data as SyscomProductRaw[] | undefined) ??
    [];
  const products = Array.isArray(productosArray) ? productosArray : [];
  const total =
    (data.total as number) ??
    (data.cantidad as number) ??
    (data.todo as number) ??
    (data.total_productos as number) ??
    products.length;

  return { products, total };
}
