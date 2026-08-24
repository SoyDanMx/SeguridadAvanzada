"""
Tecnosinergia API integration module (V3 Primary, V2 Fallback).
Fetches catalog items, validates prices, handles pagination, tolerant UTF-8 parsing,
and normalizes records according to business rules.
"""

from __future__ import annotations

import csv
import io
import logging
import re
from dataclasses import dataclass, field
from pathlib import Path

import requests

from tecnosinergia_sync.config import (
    ACTIVE_STATUS_LIST,
    MAX_LEAD_TIME_DAYS,
    TECNOSINERGIA_API_TOKEN,
    TECNOSINERGIA_PRICE_MULTIPLIER,
    TECNOSINERGIA_V2_CSV_URL_TEMPLATE,
    TECNOSINERGIA_V2_JSON_URL_TEMPLATE,
    TECNOSINERGIA_V2_TOKEN,
    TECNOSINERGIA_V3_CATALOG_URL,
    TECNOSINERGIA_V3_STATUS_URL,
)


logger = logging.getLogger("tecnosinergia_sync.tecnosinergia")


class HealthcheckError(Exception):
    """Raised when Tecnosinergia V3 status check fails."""
    pass


@dataclass
class TecnosinergiaItem:
    code: str
    sku: str
    ean: str
    name: str
    description: str
    brand: str
    regular_price_orig: float
    regular_price_mxn: float
    sale_price: float | None
    currency: str
    status: str
    image: str
    category: str
    line: str
    parent_subcategory: str
    volume: float
    weight_kg: float
    total_stock: int
    is_active: bool
    lead_time_days: int | None = None
    raw_data: dict = field(default_factory=dict)


def clean_str(val: str | None) -> str:
    if not val:
        return ""
    return str(val).strip()


def parse_price(val: float | str | None) -> float:
    """
    Parses price fields into float.
    Handles non-numeric characters (e.g. '*', '$', ',', text) safely.
    Raises ValueError if the price cannot be parsed as a valid positive number.
    """
    if val is None:
        raise ValueError("Price is null")

    if isinstance(val, (int, float)):
        if val <= 0:
            raise ValueError(f"Price must be greater than zero, got {val}")
        return float(val)

    val_str = str(val).strip()
    if not val_str or val_str == "*":
        raise ValueError(f"Invalid price value: '{val_str}'")

    # Remove currency symbols and commas
    cleaned = re.sub(r"[^\d.]", "", val_str.replace(",", ""))
    if not cleaned:
        raise ValueError(f"Non-numeric price string: '{val_str}'")

    parsed = float(cleaned)
    if parsed <= 0:
        raise ValueError(f"Parsed price must be greater than zero, got {parsed} from '{val_str}'")
    return parsed


def parse_int_stock(val: int | float | str | None) -> int:
    """Safely parses stock values to int."""
    if val is None:
        return 0
    try:
        if isinstance(val, str):
            val = val.strip().replace(",", "")
        return max(0, int(float(val)))
    except (ValueError, TypeError):
        return 0


def parse_lead_time(status_str: str) -> int | None:
    """
    Extracts lead time in days from status string (e.g., 'SOBRE PEDIDO 90 DIAS' -> 90).
    """
    if not status_str:
        return None
    match = re.search(r"(\d+)\s*(?:días|dias|day|days)", status_str, re.IGNORECASE)
    if match:
        try:
            return int(match.group(1))
        except ValueError:
            pass
    return None


def run_healthcheck(token: str | None = None) -> bool:
    """
    Calls V3 status healthcheck endpoint.
    Aborts execution if token is invalid, header error is returned, or API is down.
    """
    api_token = token or TECNOSINERGIA_API_TOKEN
    if not api_token:
        logger.warning("No TECNOSINERGIA_API_TOKEN available for V3 healthcheck.")
        return False

    headers = {"api-token": api_token, "Accept": "application/json"}
    try:
        logger.info(f"Running Tecnosinergia V3 healthcheck at {TECNOSINERGIA_V3_STATUS_URL}...")
        resp = requests.get(TECNOSINERGIA_V3_STATUS_URL, headers=headers, timeout=15)
        if resp.status_code == 200:
            res_json = resp.json()
            if isinstance(res_json, dict) and res_json.get("status") is False:
                msg = res_json.get("message") or res_json.get("code") or "Invalid status"
                logger.error(f"Tecnosinergia V3 Healthcheck FAILED: {msg} (Token: '{api_token[:4]}***')")
                return False
            logger.info("Tecnosinergia V3 Healthcheck SUCCESSFUL.")
            return True
        else:
            logger.error(f"Healthcheck failed with HTTP status code {resp.status_code}: {resp.text}")
            return False
    except Exception as e:
        logger.error(f"Healthcheck connection error: {e}")
        return False



def normalize_item_dict(raw: dict, fx_rate: float, skipped_invalid_prices: list[dict]) -> TecnosinergiaItem | None:
    """
    Normalizes raw item dictionary (from V3 or V2 API) into a TecnosinergiaItem object.
    Applies currency conversion (USD -> MXN), price validation, stock and status logic.
    """
    sku = clean_str(raw.get("sku") or raw.get("code") or raw.get("item_code"))
    if not sku:
        logger.warning("Skipping item with missing SKU")
        return None

    # Parse Regular Price (Sales price in Shopify)
    raw_reg_price = raw.get("regular_price") or raw.get("regular_price_USD") or raw.get("price")
    try:
        reg_price_orig = parse_price(raw_reg_price)
    except ValueError as err:
        error_msg = f"Invalid regular_price for SKU '{sku}': {err} (raw value: '{raw_reg_price}')"
        logger.error(error_msg)
        skipped_invalid_prices.append({
            "sku": sku,
            "name": clean_str(raw.get("name")),
            "raw_price": str(raw_reg_price),
            "reason": str(err),
        })
        return None

    # TODO: confirmar con Tecnosinergia qué representa sale_price antes de usarlo para costo/margen
    raw_sale_price = raw.get("sale_price") or raw.get("sale_price_USD")
    sale_price_val = None
    if raw_sale_price:
        try:
            sale_price_val = parse_price(raw_sale_price)
        except ValueError:
            pass

    # Currency conversion & Price Multiplier (16% IVA + 20% Profit = 1.36)
    currency = clean_str(raw.get("currency") or "USD").upper()
    if currency == "USD":
        base_price_mxn = reg_price_orig * fx_rate
    else:
        base_price_mxn = reg_price_orig

    reg_price_mxn = round(base_price_mxn * TECNOSINERGIA_PRICE_MULTIPLIER, 2)


    # Stock
    raw_stock = raw.get("total_stock") or raw.get("stock") or raw.get("stock_total")
    total_stock = parse_int_stock(raw_stock)

    # Status logic
    status_str = clean_str(raw.get("status") or "DE LINEA").upper()
    lead_time = parse_lead_time(status_str)

    # Active status criteria
    is_status_allowed = any(allowed in status_str for allowed in ACTIVE_STATUS_LIST)
    is_lead_time_ok = (lead_time is None) or (lead_time <= MAX_LEAD_TIME_DAYS)
    is_active = is_status_allowed and is_lead_time_ok

    # Weight parsing (comes in KG in Tecnosinergia)
    raw_weight = raw.get("weight") or raw.get("peso") or 0.0
    try:
        weight_kg = float(raw_weight)
    except (ValueError, TypeError):
        weight_kg = 0.0

    # Volume parsing
    raw_volume = raw.get("volume") or raw.get("volumen") or 0.0
    try:
        volume = float(raw_volume)
    except (ValueError, TypeError):
        volume = 0.0

    return TecnosinergiaItem(
        code=clean_str(raw.get("code")),
        sku=sku,
        ean=clean_str(raw.get("ean")),
        name=clean_str(raw.get("name")),
        description=clean_str(raw.get("description")),
        brand=clean_str(raw.get("brand")),
        regular_price_orig=reg_price_orig,
        regular_price_mxn=reg_price_mxn,
        sale_price=sale_price_val,
        currency=currency,
        status=status_str,
        image=clean_str(raw.get("image")),
        category=clean_str(raw.get("category")),
        line=clean_str(raw.get("line")),
        parent_subcategory=clean_str(raw.get("parent_subcategory")),
        volume=volume,
        weight_kg=weight_kg,
        total_stock=total_stock,
        is_active=is_active,
        lead_time_days=lead_time,
        raw_data=raw,
    )


def fetch_v3_catalog(fx_rate: float, skipped_invalid_prices: list[dict], token: str | None = None) -> list[TecnosinergiaItem]:
    """
    Fetches the catalog using V3 REST API with automatic pagination handling.
    """
    api_token = token or TECNOSINERGIA_API_TOKEN
    headers = {"api-token": api_token, "Accept": "application/json"}
    items: list[TecnosinergiaItem] = []
    current_page = 1
    total_pages = 1

    logger.info(f"Fetching Tecnosinergia V3 catalog from {TECNOSINERGIA_V3_CATALOG_URL}...")

    while current_page <= total_pages:
        params = {"page": current_page}
        resp = requests.get(TECNOSINERGIA_V3_CATALOG_URL, headers=headers, params=params, timeout=30)

        if resp.status_code != 200:
            raise RuntimeError(f"V3 catalog API returned status code {resp.status_code}: {resp.text}")

        res_json = resp.json()

        # Handle pagination metadata dynamically
        raw_items = []
        if isinstance(res_json, list):
            raw_items = res_json
            total_pages = 1
        elif isinstance(res_json, dict):
            raw_items = (
                res_json.get("data")
                or res_json.get("items")
                or res_json.get("productos")
                or []
            )
            # Pagination keys inspection
            total_pages = int(
                res_json.get("total_pages")
                or res_json.get("last_page")
                or res_json.get("pages")
                or 1
            )
            has_next = res_json.get("has_more") or res_json.get("next_page_url")
            if not has_next and total_pages == 1:
                total_pages = current_page

        logger.info(f"V3 Catalog page {current_page}/{total_pages} loaded ({len(raw_items)} raw records).")

        for raw in raw_items:
            normalized = normalize_item_dict(raw, fx_rate, skipped_invalid_prices)
            if normalized:
                items.append(normalized)

        current_page += 1

    logger.info(f"Total Tecnosinergia V3 catalog items processed successfully: {len(items)}")
    return items


def fetch_v2_fallback(fx_rate: float, skipped_invalid_prices: list[dict], token: str | None = None) -> list[TecnosinergiaItem]:
    """
    Fallback catalog fetcher using Tecnosinergia V2 JSON or CSV endpoints.
    Uses UTF-8 decoding with `errors='replace'` for corrupt byte tolerance.
    """
    v2_token = token or TECNOSINERGIA_V2_TOKEN
    if not v2_token:
        raise RuntimeError("TECNOSINERGIA_V2_TOKEN is missing for V2 fallback.")

    items: list[TecnosinergiaItem] = []

    # 1. Try V2 JSON
    json_url = TECNOSINERGIA_V2_JSON_URL_TEMPLATE.format(token=v2_token)
    logger.info(f"Attempting V2 JSON fallback fetch from {json_url}...")
    try:
        resp = requests.get(json_url, timeout=45)
        if resp.status_code == 200:
            content_type = resp.headers.get("Content-Type", "")
            if "text/html" in content_type or resp.text.strip().startswith("<!DOCTYPE") or "<html" in resp.text[:100].lower():
                logger.warning(
                    f"V2 JSON URL returned HTML login page instead of JSON. "
                    f"Token '{v2_token[:6]}***' may be expired or unauthenticated."
                )
            else:
                res_json = resp.json()
                raw_items = res_json if isinstance(res_json, list) else res_json.get("productos", [])
                for raw in raw_items:
                    normalized = normalize_item_dict(raw, fx_rate, skipped_invalid_prices)
                    if normalized:
                        items.append(normalized)
                if items:
                    logger.info(f"V2 JSON fallback successfully loaded {len(items)} items.")
                    return items
    except Exception as e:
        logger.warning(f"V2 JSON fallback attempt failed: {e}")

    # 2. Try V2 CSV
    csv_url = TECNOSINERGIA_V2_CSV_URL_TEMPLATE.format(token=v2_token)
    logger.info(f"Attempting V2 CSV fallback fetch from {csv_url}...")
    resp = requests.get(csv_url, timeout=60)
    if resp.status_code != 200:
        raise RuntimeError(f"V2 CSV fallback returned HTTP status {resp.status_code}")

    content_type = resp.headers.get("Content-Type", "")
    if "text/html" in content_type or resp.text.strip().startswith("<!DOCTYPE") or "<html" in resp.text[:100].lower():
        raise RuntimeError(
            f"V2 CSV endpoint returned HTML login page instead of CSV file. "
            f"Token '{v2_token[:6]}***' is invalid or expired on Tecnosinergia portal."
        )

    # Decode bytes tolerantly
    csv_text = resp.content.decode("utf-8", errors="replace")
    csv_file = io.StringIO(csv_text)
    reader = csv.DictReader(csv_file)

    for row in reader:
        normalized = normalize_item_dict(dict(row), fx_rate, skipped_invalid_prices)
        if normalized:
            items.append(normalized)

    logger.info(f"V2 CSV fallback successfully loaded {len(items)} items.")
    return items



def fetch_local_csv(
    csv_file_path: str,
    fx_rate: float,
    skipped_invalid_prices: list[dict],
) -> list[TecnosinergiaItem]:
    """
    Parses a local Tecnosinergia CSV file for offline testing and validation.
    """
    path = Path(csv_file_path)
    if not path.exists():
        raise FileNotFoundError(f"Local CSV file not found at: {csv_file_path}")

    items: list[TecnosinergiaItem] = []
    logger.info(f"Loading catalog from local CSV file: {csv_file_path}...")

    with open(path, "rb") as f:
        content_bytes = f.read()

    csv_text = content_bytes.decode("utf-8", errors="replace")
    csv_file = io.StringIO(csv_text)
    reader = csv.DictReader(csv_file)

    for row in reader:
        normalized = normalize_item_dict(dict(row), fx_rate, skipped_invalid_prices)
        if normalized:
            items.append(normalized)

    logger.info(f"Local CSV catalog successfully loaded {len(items)} items.")
    return items


def fetch_tecnosinergia_catalog(
    fx_rate: float,
    skipped_invalid_prices: list[dict],
    force_v2: bool = False,
    local_csv_path: str | None = None,
) -> tuple[list[TecnosinergiaItem], str]:
    """
    Main catalog fetcher entry point.
    If local_csv_path is provided, loads local file for testing.
    Otherwise attempts V3 API (with healthcheck) first, falling back to V2.

    Returns:
        tuple[list[TecnosinergiaItem], source_name]
    """
    if local_csv_path:
        items = fetch_local_csv(local_csv_path, fx_rate, skipped_invalid_prices)
        return items, f"Local CSV File ({Path(local_csv_path).name})"

    if not force_v2:
        # Run Healthcheck before attempting V3
        if run_healthcheck():
            try:
                items = fetch_v3_catalog(fx_rate, skipped_invalid_prices)
                return items, "Tecnosinergia API V3"
            except Exception as err:
                logger.error(f"V3 Catalog fetch failed after healthcheck passed: {err}. Triggering V2 fallback...")
        else:
            logger.warning("V3 Healthcheck failed or token missing. Aborting V3 and attempting V2 fallback...")
    else:
        logger.info("Force V2 flag is enabled. Bypassing V3 API.")

    # V2 Fallback
    try:
        items = fetch_v2_fallback(fx_rate, skipped_invalid_prices)
        return items, "Tecnosinergia API V2 Fallback"
    except Exception as err:
        logger.error(f"V2 Fallback failed: {err}")
        raise HealthcheckError("Failed to fetch Tecnosinergia catalog from both V3 and V2 sources. Aborting run.")

