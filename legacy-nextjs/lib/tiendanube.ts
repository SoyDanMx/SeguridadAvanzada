/**
 * Cliente Tiendanube: intercambio de código por access token y API de tienda/diseño.
 * Docs: https://tiendanube.github.io/api-documentation/
 */

const TOKEN_URL = "https://www.tiendanube.com/apps/authorize/token";
const API_BASE = "https://api.tiendanube.com/v1";

export interface TiendanubeTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  user_id: string; // Este es el store_id para las llamadas a la API
}

/**
 * Intercambia el código de autorización (one-time) por access token.
 * El código expira en 5 minutos. Tras instalación/reautorización obtienes uno nuevo en la URL de redirect (?code=xxx).
 */
export async function exchangeCodeForToken(code: string): Promise<TiendanubeTokenResponse> {
  const clientId = process.env.TIENDANUBE_CLIENT_ID || process.env.TIENDANUBE_USER_ID;
  const clientSecret = process.env.TIENDANUBE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      "Faltan TIENDANUBE_CLIENT_ID y TIENDANUBE_CLIENT_SECRET (o TIENDANUBE_USER_ID y TIENDANUBE_CLIENT_SECRET) en .env.local"
    );
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: String(clientId),
      client_secret: clientSecret.trim(),
      grant_type: "authorization_code",
      code: code.trim(),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tiendanube token: ${res.status} ${text}`);
  }

  const data = (await res.json()) as TiendanubeTokenResponse;
  if (!data.access_token) {
    throw new Error("Tiendanube no devolvió access_token");
  }
  return data;
}

function getAccessToken(): string {
  const token = process.env.TIENDANUBE_ACCESS_TOKEN;
  if (!token) {
    throw new Error(
      "Falta TIENDANUBE_ACCESS_TOKEN en .env.local. Usa POST /api/tiendanube/token con el code para obtenerlo."
    );
  }
  return token.trim();
}

function getStoreId(): string {
  const id = process.env.TIENDANUBE_STORE_ID || process.env.TIENDANUBE_USER_ID;
  if (!id) {
    throw new Error(
      "Falta TIENDANUBE_STORE_ID (o TIENDANUBE_USER_ID) en .env.local. Es el user_id que devuelve el token."
    );
  }
  return String(id).trim();
}

/**
 * Llama a la API de Tiendanube. Header requerido: Authentication: bearer {token} (bearer en minúscula).
 */
async function apiRequest<T>(
  storeId: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  const url = `${API_BASE}/${storeId}${path}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authentication: `bearer ${token}`,
      "User-Agent": "SeguridadAvanzadaShop (contacto@tu-dominio.com)",
      ...options.headers,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Tiendanube API ${path}: ${res.status} ${text}`);
  }

  return res.json() as Promise<T>;
}

export interface TiendanubeStore {
  id: number;
  name: Record<string, string>;
  description?: Record<string, string>;
  type?: string;
  email?: string;
  logo?: string | null;
  contact_email?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  address?: string | null;
  phone?: string | null;
  whatsapp_phone_number?: string | null;
  country?: string;
  domains?: string[];
  original_domain?: string;
  current_theme?: string;
  main_language?: string;
  main_currency?: string;
  admin_language?: string;
  plan_name?: string;
  features?: string[];
  created_at?: string;
  [key: string]: unknown;
}

/**
 * Obtiene la tienda actual: nombre, logo, current_theme, idiomas, moneda, etc.
 * Incluye datos de “diseño” (tema actual, dominio, logo).
 */
export async function getStore(storeId?: string): Promise<TiendanubeStore> {
  const id = storeId || getStoreId();
  return apiRequest<TiendanubeStore>(id, "/store");
}

/**
 * Resumen de “diseño” de la tienda para migrar o replicar: tema, logo, nombre, dominio.
 */
export interface StoreDesignSummary {
  store_id: string;
  name: Record<string, string>;
  current_theme: string | null;
  logo: string | null;
  main_language: string | null;
  main_currency: string | null;
  domains: string[];
  original_domain: string | null;
}

export async function getStoreDesign(storeId?: string): Promise<StoreDesignSummary> {
  const store = await getStore(storeId);
  return {
    store_id: String(store.id),
    name: store.name ?? {},
    current_theme: store.current_theme ?? null,
    logo: store.logo ?? null,
    main_language: store.main_language ?? null,
    main_currency: store.main_currency ?? null,
    domains: store.domains ?? [],
    original_domain: store.original_domain ?? null,
  };
}
