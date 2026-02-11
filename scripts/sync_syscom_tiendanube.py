#!/usr/bin/env python3
"""
Sync productos Syscom → Tiendanube (Seguridad Avanzada).
Usa variables de entorno; no guardes credenciales en el código.

Ejemplo de uso:
  export SYSCOM_CLIENT_ID="..."
  export SYSCOM_CLIENT_SECRET="..."
  export TIENDANUBE_ACCESS_TOKEN="..."
  export TIENDANUBE_STORE_ID="26095"
  python3 scripts/sync_syscom_tiendanube.py

O cargar desde .env.local (si tienes python-dotenv):
  pip install python-dotenv
  # El script intenta cargar .env.local si existe dotenv.
"""

import os
import sys

# Cargar .env.local si existe y está instalado python-dotenv
try:
    from dotenv import load_dotenv
    load_dotenv(".env.local")
except ImportError:
    pass

import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# IDs de categoría Syscom (alineados con lib/categories.ts)
SYSCOM_CATEGORY_VIDEOVIGILANCIA = "22"
SYSCOM_CATEGORY_REDES_IT = "26"
SYSCOM_CATEGORY_ENERGIA_HERRAMIENTAS = "30"


def _precio_num(product: dict) -> float:
    """Extrae precio de un producto Syscom (precio puede ser número u objeto)."""
    p = product.get("precio")
    if p is None:
        return 0.0
    if isinstance(p, (int, float)):
        return float(p)
    if isinstance(p, dict):
        return float(
            p.get("precio_especial")
            or p.get("precio_1")
            or p.get("precio_lista")
            or 0
        )
    return 0.0


def get_exchange_rate() -> float:
    return float(os.environ.get("EXCHANGE_RATE_USD_MXN", "18.5"))


def get_margin_factor() -> float:
    """Margen sobre costo: 0.3 = 30%. Env PROFIT_MARGIN puede ser 0.3 o 1.30."""
    v = os.environ.get("PROFIT_MARGIN", "0.3")
    try:
        n = float(v)
    except ValueError:
        return 0.3
    return n - 1 if n >= 1 else n


class SeguridadAvanzadaSync:
    def __init__(self):
        self.syscom_client_id = os.environ.get("SYSCOM_CLIENT_ID", "").strip()
        self.syscom_client_secret = os.environ.get("SYSCOM_CLIENT_SECRET", "").strip()
        self.tn_access_token = os.environ.get("TIENDANUBE_ACCESS_TOKEN", "").strip()
        self.tn_store_id = os.environ.get("TIENDANUBE_STORE_ID", os.environ.get("TIENDANUBE_USER_ID", "26095")).strip()

        self.syscom_auth_url = os.environ.get("SYSCOM_API_BASE", "https://developers.syscom.mx").rstrip("/") + "/oauth/token"
        self.syscom_api_url = os.environ.get("SYSCOM_API_BASE", "https://developers.syscom.mx").rstrip("/") + "/api/v1"

        self.token = None
        if self.syscom_client_id and self.syscom_client_secret:
            self.token = self._get_syscom_token()
        else:
            print("⚠️ Faltan SYSCOM_CLIENT_ID o SYSCOM_CLIENT_SECRET en el entorno.")

    def _get_syscom_token(self):
        payload = {
            "client_id": self.syscom_client_id,
            "client_secret": self.syscom_client_secret,
            "grant_type": "client_credentials",
        }
        try:
            r = requests.post(self.syscom_auth_url, data=payload, verify=False, timeout=20)
            r.raise_for_status()
            return r.json().get("access_token")
        except Exception as e:
            print(f"❌ Error al autenticar en Syscom: {e}")
            return None

    def get_products(self, category_id=None, page=1, limit=100):
        if not self.token:
            return []
        headers = {"Authorization": f"Bearer {self.token}"}
        params = {"pagina": page, "limit": limit}
        if category_id:
            params["categoria"] = category_id
        try:
            r = requests.get(
                f"{self.syscom_api_url}/productos",
                headers=headers,
                params=params,
                verify=False,
                timeout=20,
            )
            r.raise_for_status()
            data = r.json()
            return data.get("productos", data.get("data", [])) or []
        except Exception as e:
            print(f"❌ Error al obtener productos: {e}")
            return []

    def map_to_tiendanube(self, product: dict) -> dict:
        """Mapea un producto Syscom al payload de Tiendanube."""
        precio_base = _precio_num(product)
        moneda = (product.get("moneda") or "USD").upper()
        if moneda == "USD":
            rate = get_exchange_rate()
            margin = get_margin_factor()
            precio_final = (precio_base * rate) * (1 + margin)
        else:
            margin = get_margin_factor()
            precio_final = precio_base * (1 + margin)
        precio_final = round(precio_final, 2)

        titulo = product.get("titulo") or product.get("descripcion") or ""
        modelo = product.get("modelo") or product.get("sku") or str(product.get("producto_id", ""))
        desc = product.get("descripcion") or ""
        description_es = f"Modelo: {modelo}. {desc}" if desc else f"Modelo: {modelo}. Calidad profesional."

        img = product.get("img_portada") or product.get("imagen")
        if not img and isinstance(product.get("imagenes"), list) and product["imagenes"]:
            first = product["imagenes"][0]
            img = first.get("url") if isinstance(first, dict) else first

        payload = {
            "name": {"es": titulo or modelo or "Sin nombre"},
            "description": {"es": description_es},
            "variants": [
                {
                    "sku": modelo or None,
                    "price": str(precio_final),
                    "stock": int(product.get("existencia", product.get("stock", 0)) or 0),
                }
            ],
        }
        if img:
            payload["images"] = [{"src": img}]
        return payload

    def sync_to_tiendanube(self, product: dict, dry_run=True):
        """Prepara y opcionalmente sube el producto a Tiendanube."""
        payload = self.map_to_tiendanube(product)
        modelo = product.get("modelo") or product.get("sku") or "?"
        precio = payload["variants"][0]["price"]
        if dry_run:
            print(f"✅ [DRY RUN] Preparado: {modelo} - ${precio} MXN")
            return None
        if not self.tn_access_token or not self.tn_store_id:
            print("⚠️ Faltan TIENDANUBE_ACCESS_TOKEN o TIENDANUBE_STORE_ID para subir.")
            return None
        url = f"https://api.tiendanube.com/v1/{self.tn_store_id}/products"
        try:
            r = requests.post(
                url,
                headers={
                    "Content-Type": "application/json",
                    "Authentication": f"bearer {self.tn_access_token}",
                },
                json=payload,
                timeout=30,
            )
            if r.ok:
                print(f"✅ Subido: {modelo} - ${precio} MXN")
                return r.json()
            print(f"❌ Tiendanube {r.status_code}: {r.text[:200]}")
            return None
        except Exception as e:
            print(f"❌ Error al subir {modelo}: {e}")
            return None


def main():
    import json
    print_payload = "--print-payload" in sys.argv or "-p" in sys.argv
    dry_run_env = os.environ.get("SYNC_DRY_RUN", "1")
    dry_run = dry_run_env == "1" and not ("--upload" in sys.argv or "-u" in sys.argv)

    sync = SeguridadAvanzadaSync()
    category_id = os.environ.get("SYSCOM_CATEGORY_ID", SYSCOM_CATEGORY_VIDEOVIGILANCIA)
    limit = int(os.environ.get("SYNC_LIMIT", "5"))

    productos = sync.get_products(category_id=category_id, page=1, limit=limit)
    if not productos:
        print("No se obtuvieron productos. Revisa SYSCOM_CLIENT_ID, SYSCOM_CLIENT_SECRET y categoría.")
        sys.exit(1)

    print(f"Categoría {category_id}, {len(productos)} producto(s), dry_run={dry_run}")
    if print_payload:
        print("\n--- Payload del primer producto (para Tiendanube) ---\n")
        print(json.dumps(sync.map_to_tiendanube(productos[0]), indent=2, ensure_ascii=False))
        print("\n--- Fin payload ---\n")

    for p in productos:
        sync.sync_to_tiendanube(p, dry_run=dry_run)


if __name__ == "__main__":
    main()
