"""
Shopify GraphQL Admin API integration module.
Handles fetching existing Syscom product SKUs for exclusion,
managing rate limits (throttling), and upserting products idempotently.
"""

from __future__ import annotations

from datetime import datetime, timezone
import logging
import time
import requests

from tecnosinergia_sync.config import (
    SHOPIFY_ADMIN_ACCESS_TOKEN,
    SHOPIFY_API_VERSION,
    SHOPIFY_STORE_DOMAIN,
    SYSCOM_TAG,
    SYSCOM_VENDOR_NAME,
    TECNOSINERGIA_TAG,
)
from tecnosinergia_sync.tecnosinergia import TecnosinergiaItem

logger = logging.getLogger("tecnosinergia_sync.shopify")


class ShopifyAPIError(Exception):
    pass


class ShopifyClient:
    def __init__(
        self,
        domain: str | None = None,
        access_token: str | None = None,
        api_version: str | None = None,
    ):
        self.domain = domain or SHOPIFY_STORE_DOMAIN
        self.access_token = access_token or SHOPIFY_ADMIN_ACCESS_TOKEN
        self.api_version = api_version or SHOPIFY_API_VERSION
        self.graphql_url = f"https://{self.domain}/admin/api/{self.api_version}/graphql.json"

        if not self.access_token or not self.domain:
            raise ValueError("Shopify domain and admin access token are required.")

        self.headers = {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
        self.primary_location_id: str | None = None

    def execute_graphql(self, query: str, variables: dict | None = None) -> dict:
        """
        Executes a GraphQL query/mutation against Shopify Admin API.
        Handles GraphQL rate-limiting (throttling) automatically.
        """
        payload = {"query": query, "variables": variables or {}}
        max_retries = 3

        for attempt in range(1, max_retries + 1):
            try:
                response = requests.post(
                    self.graphql_url, json=payload, headers=self.headers, timeout=30
                )

                if response.status_code == 429:  # Too Many Requests
                    retry_after = float(response.headers.get("Retry-After", 2.0))
                    logger.warning(f"Shopify 429 Rate Limit hit. Retrying in {retry_after}s...")
                    time.sleep(retry_after)
                    continue

                if response.status_code != 200:
                    raise ShopifyAPIError(
                        f"Shopify GraphQL returned HTTP {response.status_code}: {response.text}"
                    )

                res_json = response.json()

                # Handle Throttling status in extensions
                cost = res_json.get("extensions", {}).get("cost", {})
                throttle = cost.get("throttleStatus", {})
                currently_available = throttle.get("currentlyAvailable")
                restore_rate = throttle.get("restoreRate", 100.0)

                if currently_available is not None and currently_available < 150:
                    sleep_time = (150.0 - currently_available) / restore_rate
                    logger.debug(f"Shopify points low ({currently_available}). Sleeping for {sleep_time:.2f}s...")
                    time.sleep(max(0.5, sleep_time))

                # Check for top-level GraphQL errors
                if "errors" in res_json:
                    err_msg = "; ".join([e.get("message", "") for e in res_json["errors"]])
                    raise ShopifyAPIError(f"GraphQL execution error: {err_msg}")

                return res_json.get("data", {})

            except (requests.RequestException, ShopifyAPIError) as err:
                if attempt == max_retries:
                    raise
                logger.warning(f"Shopify GraphQL request attempt {attempt} failed: {err}. Retrying...")
                time.sleep(attempt * 2)

        raise ShopifyAPIError("Failed to execute GraphQL query after maximum retries.")

    def get_primary_location_id(self) -> str | None:
        """Fetches and caches the primary location ID for inventory updates."""
        if self.primary_location_id:
            return self.primary_location_id

        query = """
        query getLocations {
            locations(first: 5) {
                nodes {
                    id
                }
            }
        }
        """
        try:
            data = self.execute_graphql(query)
            locations = data.get("locations", {}).get("nodes", [])
            if locations:
                self.primary_location_id = locations[0]["id"]
                logger.info(f"Using Shopify location ID: {self.primary_location_id}")
                return self.primary_location_id
        except Exception as e:
            logger.warning(f"Could not fetch primary location ID (read_locations scope missing): {e}")

        return None


    def get_syscom_and_existing_skus() -> tuple[set[str], dict[str, dict]]:
        """
        Queries existing products in Shopify to extract:
        1. Set of SKUs coming from Syscom (tagged with 'proveedor:syscom' or vendor 'Syscom').
        2. Dictionary mapping existing SKU -> {product_id, variant_id, current_price, current_stock}
        """
        pass  # Implemented on class instance method below


def fetch_shopify_skus(client: ShopifyClient) -> tuple[set[str], dict[str, dict]]:
    """
    Queries Shopify products to build:
    1. syscom_skus: set of SKUs coming from Syscom (to enforce rule #1 precedence).
    2. existing_skus_map: dict of existing Shopify SKUs mapped to Product ID & Variant info.
    """
    syscom_skus: set[str] = set()
    existing_skus_map: dict[str, dict] = {}

    query = """
    query getProductsPage($cursor: String) {
        products(first: 250, after: $cursor, query: "tag:'proveedor:syscom' OR vendor:'Syscom' OR tag:'proveedor:tecnosinergia'") {
            pageInfo {
                hasNextPage
                endCursor
            }
            nodes {
                id
                tags
                vendor
                variants(first: 10) {
                    nodes {
                        id
                        sku
                        price
                    }
                }
            }
        }
    }
    """


    cursor = None
    has_next = True
    page_count = 0

    logger.info("Scanning Shopify store for existing SKUs and Syscom catalog overlap...")

    while has_next:
        page_count += 1
        data = client.execute_graphql(query, {"cursor": cursor})
        products_data = data.get("products", {})
        nodes = products_data.get("nodes", [])
        page_info = products_data.get("pageInfo", {})

        for p in nodes:
            tags = [t.lower() for t in p.get("tags", [])]
            vendor = (p.get("vendor") or "").strip().lower()
            is_syscom = (SYSCOM_TAG.lower() in tags) or (SYSCOM_VENDOR_NAME.lower() in vendor)

            for v in p.get("variants", {}).get("nodes", []):
                v_sku = (v.get("sku") or "").strip()
                if not v_sku:
                    continue

                if is_syscom:
                    syscom_skus.add(v_sku)

                existing_skus_map[v_sku] = {
                    "product_id": p["id"],
                    "variant_id": v["id"],
                    "price": v.get("price"),
                }

        has_next = page_info.get("hasNextPage", False)
        cursor = page_info.get("endCursor")
        logger.debug(f"Page {page_count} scanned. Total SKUs mapped so far: {len(existing_skus_map)}, Syscom SKUs: {len(syscom_skus)}")

    logger.info(
        f"Shopify scan completed: {len(existing_skus_map)} total SKUs found in store, "
        f"{len(syscom_skus)} identified as Syscom products."
    )
    return syscom_skus, existing_skus_map


def build_tags_list(item: TecnosinergiaItem) -> list[str]:
    """Generates clean tags list combining category, line, subcategory, brand, and provider tag."""
    tags = {TECNOSINERGIA_TAG}

    if item.brand:
        tags.add(item.brand)
    if item.category:
        tags.add(item.category)
    if item.line:
        tags.add(item.line)
    if item.parent_subcategory:
        tags.add(item.parent_subcategory)

    # Sanitize tags (Shopify tags cannot contain commas)
    clean_tags = [t.replace(",", " ").strip() for t in tags if t and t.strip()]
    return clean_tags


STORE_COLLECTIONS = {
    "videovigilancia": "gid://shopify/Collection/659995394180",
    "cámaras": "gid://shopify/Collection/659995394180",
    "cámara": "gid://shopify/Collection/659995394180",
    "cctv": "gid://shopify/Collection/659995394180",
    "dvr": "gid://shopify/Collection/659995394180",
    "nvr": "gid://shopify/Collection/659995394180",
    "control de acceso": "gid://shopify/Collection/659995263108",
    "biométrico": "gid://shopify/Collection/659995263108",
    "automatización": "gid://shopify/Collection/659995164804",
    "intrusión": "gid://shopify/Collection/659995164804",
    "alarma": "gid://shopify/Collection/659995164804",
    "relevador": "gid://shopify/Collection/659995164804",
    "detección de fuego": "gid://shopify/Collection/659995295876",
    "incendio": "gid://shopify/Collection/659995295876",
    "redes": "gid://shopify/Collection/659995361412",
    "it": "gid://shopify/Collection/659995361412",
    "cableado": "gid://shopify/Collection/659995197572",
    "energía": "gid://shopify/Collection/659995328644",
    "herramientas": "gid://shopify/Collection/659995328644",
    "audio": "gid://shopify/Collection/659995132036",
}


def assign_item_to_collection(client: ShopifyClient, product_id: str, item: TecnosinergiaItem) -> None:
    """Assigns product to the matching primary store collection."""
    text_search = f"{item.category} {item.name} {item.line}".lower()
    target_col_id = None

    for kw, col_id in STORE_COLLECTIONS.items():
        if kw in text_search:
            target_col_id = col_id
            break

    if target_col_id:
        mutation = """
        mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
          collectionAddProducts(id: $id, productIds: $productIds) {
            userErrors {
              message
            }
          }
        }
        """
        try:
            client.execute_graphql(mutation, {"id": target_col_id, "productIds": [product_id]})
        except Exception as err:
            logger.debug(f"Could not assign product {product_id} to collection {target_col_id}: {err}")


def upsert_product_set(
    client: ShopifyClient,
    location_id: str | None,
    item: TecnosinergiaItem,
    existing_info: dict | None = None,
) -> str:
    """
    Upserts a product using standard Shopify GraphQL `productSet`.
    Returns action status: 'created' or 'updated'.
    """
    mutation = """
    mutation prodSet($synchronous: Boolean!, $input: ProductSetInput!) {
        productSet(synchronous: $synchronous, input: $input) {
            product {
                id
                title
                status
                variants(first: 5) {
                    nodes {
                        id
                        sku
                        price
                        inventoryItem {
                            id
                        }
                    }
                }
            }
            userErrors {
                field
                message
            }
        }
    }
    """

    status = "ACTIVE" if item.is_active else "DRAFT"

    variant_input = {
        "sku": item.sku,
        "barcode": item.ean if item.ean else None,
        "price": str(item.regular_price_mxn),
        "optionValues": [
            {
                "name": "Default Title",
                "optionName": "Title",
            }
        ],
    }

    input_payload = {
        "title": item.name,
        "productType": item.category or "Seguridad Electrónica",
        "vendor": item.brand or "Tecnosinergia",
        "descriptionHtml": f"<p>{item.description or item.name}</p>",
        "status": status,
        "tags": build_tags_list(item),
        "productOptions": [
            {
                "name": "Title",
                "values": [{"name": "Default Title"}],
            }
        ],
        "variants": [variant_input],
    }

    if existing_info and existing_info.get("product_id"):

        input_payload["id"] = existing_info["product_id"]
        action = "updated"
    else:
        action = "created"

    valid_img_exts = (".jpg", ".jpeg", ".png", ".webp", ".gif", ".svg", ".bmp")
    is_image_url = (
        item.image
        and item.image.startswith("http")
        and any(item.image.lower().split("?")[0].endswith(ext) for ext in valid_img_exts)
    )
    if is_image_url:
        input_payload["files"] = [{"originalSource": item.image, "alt": item.name}]



    data = client.execute_graphql(mutation, {"synchronous": True, "input": input_payload})
    res_data = data.get("productSet", {})
    user_errors = res_data.get("userErrors", [])

    if user_errors:
        err_msg = "; ".join([f"{e.get('field')}: {e.get('message')}" for e in user_errors])
        raise ShopifyAPIError(f"productSet userErrors for SKU '{item.sku}': {err_msg}")

    product_obj = res_data.get("product", {})
    product_id = product_obj.get("id") if product_obj else None
    variants = product_obj.get("variants", {}).get("nodes", []) if product_obj else []

    # Assign product to store collection
    if product_id:
        assign_item_to_collection(client, product_id, item)

    if variants and location_id and not location_id.startswith("gid://shopify/Location/dryrun"):
        inventory_item_id = variants[0].get("inventoryItem", {}).get("id")
        if inventory_item_id:
            inv_mutation = """
            mutation inventorySetQuantities($input: InventorySetQuantitiesInput!) {
                inventorySetQuantities(input: $input) {
                    userErrors {
                        field
                        message
                    }
                }
            }
            """
            inv_input = {
                "name": "available",
                "reason": "correction",
                "ignoreCompareQuantity": True,
                "quantities": [
                    {
                        "inventoryItemId": inventory_item_id,
                        "locationId": location_id,
                        "quantity": item.total_stock,
                    }
                ],
            }
            try:
                client.execute_graphql(inv_mutation, {"input": inv_input})
            except Exception as inv_err:
                logger.warning(f"Could not update inventory quantity for SKU '{item.sku}': {inv_err}")

    return action





def sync_tecnosinergia_catalog_to_shopify(
    client: ShopifyClient,
    items: list[TecnosinergiaItem],
    syscom_skus: set[str],
    existing_skus_map: dict[str, dict],
    dry_run: bool = False,
) -> dict:
    """
    Executes the sync pipeline for Tecnosinergia items to Shopify:
    - Filters out items matching Syscom SKUs (Rule #1).
    - Upserts items to Shopify.
    - Tracks execution stats.
    """
    location_id = client.get_primary_location_id() if not dry_run else "gid://shopify/Location/dryrun"

    stats = {
        "total_items": len(items),
        "skipped_syscom": 0,
        "created": 0,
        "updated": 0,
        "failed": 0,
        "skipped_syscom_skus": [],
        "failed_skus": [],
    }

    logger.info(f"Starting Shopify catalog sync for {len(items)} items (Dry-run: {dry_run})...")

    for idx, item in enumerate(items, start=1):
        # Rule #1: Omit item if SKU is present in Syscom catalog
        if item.sku in syscom_skus:
            logger.info(f"[{idx}/{len(items)}] OMITTING SKU '{item.sku}' - Preceded by Syscom catalog.")
            stats["skipped_syscom"] += 1
            stats["skipped_syscom_skus"].append(item.sku)
            continue

        is_update = item.sku in existing_skus_map

        if dry_run:
            action_name = "UPDATE (dry-run)" if is_update else "CREATE (dry-run)"
            logger.info(
                f"[{idx}/{len(items)}] {action_name} SKU: '{item.sku}', Name: '{item.name[:40]}...', "
                f"Price MXN: ${item.regular_price_mxn}, Stock: {item.total_stock}, Active: {item.is_active}"
            )
            if is_update:
                stats["updated"] += 1
            else:
                stats["created"] += 1
            continue

        try:
            existing_info = existing_skus_map.get(item.sku)
            action = upsert_product_set(client, location_id, item, existing_info=existing_info)
            if action == "updated":
                stats["updated"] += 1
                logger.info(f"[{idx}/{len(items)}] UPDATED SKU '{item.sku}' (${item.regular_price_mxn} MXN, stock {item.total_stock})")
            else:
                stats["created"] += 1
                logger.info(f"[{idx}/{len(items)}] CREATED SKU '{item.sku}' (${item.regular_price_mxn} MXN, stock {item.total_stock})")
        except Exception as err:
            logger.error(f"[{idx}/{len(items)}] Failed to upsert SKU '{item.sku}': {err}")
            stats["failed"] += 1
            stats["failed_skus"].append({"sku": item.sku, "error": str(err)})


    return stats
