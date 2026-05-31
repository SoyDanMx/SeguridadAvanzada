import https from "https";

/**
 * Agente HTTPS: reutiliza conexiones (keepAlive) para no repetir handshake en cada request.
 * rejectUnauthorized: false solo si Syscom usa certs no confiables.
 */
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  maxSockets: 4,
});

/**
 * Base URL de la API Syscom (URI base: https://developers.syscom.mx/api/v1/).
 * Límite: 60 peticiones por minuto por cliente. Respuestas en JSON.
 * Documentación: https://developers.syscom.mx/docs
 */
const SYSCOM_BASE =
  process.env.SYSCOM_API_BASE?.trim() || "https://developers.syscom.mx";

/**
 * Limpia el valor de una variable de entorno para evitar 401 por caracteres extra.
 * Quita espacios, comillas envolventes, retornos de carro, saltos de línea y caracteres invisibles
 * que suelen colarse al copiar/pegar en Vercel o .env.
 */
function stripEnvValue(v: string | undefined): string {
  if (v == null) return "";
  let s = String(v)
    .replace(/\r\n|\r|\n/g, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Zero-width, BOM
    .trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).replace(/\r\n|\r|\n/g, "").trim();
  }
  return s;
}

function getSyscomCredentials(): { clientId: string; clientSecret: string } {
  const clientId = stripEnvValue(process.env.SYSCOM_CLIENT_ID);
  const clientSecret = stripEnvValue(process.env.SYSCOM_CLIENT_SECRET);
  if (!clientId || !clientSecret) {
    throw new Error(
      "Faltan SYSCOM_CLIENT_ID o SYSCOM_CLIENT_SECRET en .env.local. Obtén credenciales en Syscom."
    );
  }
  return { clientId, clientSecret };
}

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export interface SyscomAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const REQUEST_TIMEOUT_MS = 20000;

const DEFAULT_HEADERS: Record<string, string> = {
  "User-Agent": "SeguridadAvanzadaShop/1.0 (Node.js; integracion Syscom)",
  Accept: "application/json",
};

function httpsRequest<T>(
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {}
): Promise<T> {
  const u = new URL(url);
  const headers = { ...DEFAULT_HEADERS, ...options.headers };
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
              resolve(data as T);
            }
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy();
      reject(new Error(`Timeout después de ${REQUEST_TIMEOUT_MS / 1000}s`));
    });
    if (options.body) req.write(options.body);
    req.end();
  });
}

/**
 * Pide el token a Syscom con POST (usa el mismo agente HTTPS que productos para evitar fallos por certificado).
 */
function requestToken(body: string, headers: Record<string, string> = {}): Promise<SyscomAuthResponse> {
  const tokenUrl = `${SYSCOM_BASE.replace(/\/$/, "")}/oauth/token`;
  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/x-www-form-urlencoded",
    "Content-Length": String(Buffer.byteLength(body, "utf8")),
  };
  return httpsRequest<SyscomAuthResponse>(tokenUrl, {
    method: "POST",
    headers: { ...defaultHeaders, ...headers },
    body,
  });
}

/**
 * Obtiene token OAuth2 de Syscom. Cachea el token hasta cerca del vencimiento.
 * Usa el mismo HTTPS agent que productos (rejectUnauthorized: false) para evitar errores de certificado.
 * Prueba primero con credenciales en el body (estándar); si falla 401, usa Basic Auth.
 */
export async function getAuthToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && tokenExpiresAt > now + 60_000) {
    return cachedToken;
  }

  const { clientId, clientSecret } = getSyscomCredentials();
  const body = new URLSearchParams({
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
  }).toString();

  try {
    const data = await requestToken(body);
    cachedToken = data.access_token;
    tokenExpiresAt = now + (data.expires_in ?? 31536000) * 1000;
    return data.access_token;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("401")) {
      const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
      try {
        const dataBasic = await requestToken("grant_type=client_credentials", {
          Authorization: `Basic ${basicAuth}`,
        });
        cachedToken = dataBasic.access_token;
        tokenExpiresAt = now + (dataBasic.expires_in ?? 31536000) * 1000;
        return dataBasic.access_token;
      } catch (e2) {
        throw new Error(`Syscom: autenticación fallida. Revisa SYSCOM_CLIENT_ID y SYSCOM_CLIENT_SECRET en .env.local. ${msg}`);
      }
    }
    throw e;
  }
}

/**
 * Formato de producto según la API de Syscom (compatible con el script Python).
 * La API puede devolver: producto_id, titulo, modelo, descripcion, img_portada,
 * imagenes[], precio (objeto con precio_lista, precio_especial, precio_1), caracteristicas[].
 */
export interface SyscomProduct {
  producto_id?: string | number;
  sku?: string;
  modelo?: string;
  titulo?: string;
  descripcion?: string;
  /** Precio (objeto o número). Syscom suele usar "precios" (plural) con precio_especial, precio_1, precio_lista (valores string o number). */
  precio?: number | { precio_lista?: number; precio_especial?: number; precio_1?: number; precio_descuento?: number };
  precios?: Record<string, unknown>;
  moneda?: string;
  categoria?: string;
  img_portada?: string;
  imagen?: string;
  imagenes?: Array<{ url?: string } | string>;
  datasheet?: string;
  caracteristicas?: string[];
  especificaciones?: Record<string, string>;
  [key: string]: unknown;
}

export interface GetProductsParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface SyscomCategory {
  id: string | number;
  nombre: string;
  nivel?: number;
}

/**
 * Obtiene las categorías de primer nivel desde la API Syscom.
 * Útil para validar IDs en lib/categories.ts.
 */
export async function getCategories(): Promise<SyscomCategory[]> {
  if (!cachedToken || tokenExpiresAt <= Date.now() + 60_000) {
    await getAuthToken();
  }
  const url = `${SYSCOM_BASE.replace(/\/$/, "")}/api/v1/categorias`;
  const data = await httpsRequest<unknown>(url, {
    headers: {
      Authorization: `Bearer ${cachedToken}`,
      "Content-Type": "application/json",
    },
  });
  const arr = Array.isArray(data) ? data : (data as { data?: unknown[] })?.data;
  if (!Array.isArray(arr)) return [];
  return arr.map((item) => {
    const o = item as { id?: string | number; nombre?: string; nivel?: number };
    return { id: o.id ?? "", nombre: o.nombre ?? "", nivel: o.nivel };
  });
}

const PRODUCTS_CACHE_TTL_MS = 60_000; // 1 minuto
const productsCache = new Map<
  string,
  { data: { products: SyscomProduct[]; total?: number }; expires: number }
>();

function getProductsCacheKey(params: GetProductsParams): string {
  return [
    params.category ?? "",
    params.search ?? "",
    String(params.page ?? 1),
    String(params.limit ?? 24),
  ].join("|");
}

/**
 * Trae productos de Syscom con filtrado técnico (categoría, búsqueda).
 * Usar desde API Routes de Next.js para evitar CORS y SSL en cliente.
 * Cachea respuestas 1 minuto para la misma combinación de parámetros.
 * Si recibe 401, invalida el token y reintenta una vez.
 */
export async function getProducts(
  params: GetProductsParams = {},
  retrying = false
): Promise<{ products: SyscomProduct[]; total?: number }> {
  const key = getProductsCacheKey(params);
  const now = Date.now();
  const hit = productsCache.get(key);
  if (hit && hit.expires > now) {
    return hit.data;
  }

  if (!cachedToken || tokenExpiresAt <= now + 60_000) {
    await getAuthToken();
  }

  const search = new URLSearchParams();
  if (params.category) search.set("categoria", params.category);
  if (params.search?.trim()) {
    search.set("busqueda", params.search.trim()); // Syscom usa "busqueda", no "q"
  }
  const pageNum = typeof params.page === "number" && params.page >= 1 ? params.page : 1;
  const limitNum = typeof params.limit === "number" && params.limit >= 10 ? params.limit : 24;
  const itemsPerPage = Math.min(60, Math.max(10, limitNum));
  // Syscom México (syscom-integration.md): pagina = ítems por página (10-60), page = número de página
  search.set("pagina", String(itemsPerPage));
  search.set("page", String(pageNum));

  const productsPath = SYSCOM_BASE.includes("developers.syscom") ? "/api/v1/productos" : "/productos";
  const url = `${SYSCOM_BASE.replace(/\/$/, "")}${productsPath}?${search.toString()}`;

  try {
    const data = await httpsRequest<Record<string, unknown>>(url, {
      headers: {
        Authorization: `Bearer ${cachedToken}`,
        "Content-Type": "application/json",
      },
    });
    return parseProductsResponse(data, key, now);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("401") && !retrying) {
      cachedToken = null;
      tokenExpiresAt = 0;
      await getAuthToken();
      return getProducts(params, true);
    }
    throw e;
  }
}

function parseProductsResponse(
  data: Record<string, unknown>,
  cacheKey: string,
  now: number
): { products: SyscomProduct[]; total?: number } {

  const productosArray =
    (data.productos as SyscomProduct[] | undefined) ??
    (data.data as SyscomProduct[] | undefined) ??
    (data.items as SyscomProduct[] | undefined) ??
    [];
  const products = Array.isArray(productosArray) ? productosArray : [];
  const total =
    (data.total as number | undefined) ??
    (data.cantidad as number | undefined) ??
    (data.todo as number | undefined) ??
    (data.total_productos as number | undefined) ??
    products.length;
  const result = { products, total };
  productsCache.set(cacheKey, { data: result, expires: now + PRODUCTS_CACHE_TTL_MS });
  return result;
}
