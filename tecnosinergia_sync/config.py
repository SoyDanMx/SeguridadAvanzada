"""
Configuration module for Tecnosinergia → Shopify synchronization pipeline.
Handles environment variables loading, API endpoints, and business rule constants.
"""

from __future__ import annotations

import os

from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or current directory
BASE_DIR = Path(__file__).resolve().parent.parent
ENV_PATH = BASE_DIR / ".env"
load_dotenv(dotenv_path=ENV_PATH)

# API Credentials & Tokens
BANXICO_SIE_TOKEN = os.getenv("BANXICO_SIE_TOKEN", "")
TECNOSINERGIA_API_TOKEN = os.getenv("TECNOSINERGIA_API_TOKEN", "")
TECNOSINERGIA_V2_TOKEN = os.getenv("TECNOSINERGIA_V2_TOKEN", "")

# Shopify Credentials
SHOPIFY_ADMIN_ACCESS_TOKEN = os.getenv("SHOPIFY_ADMIN_ACCESS_TOKEN", "")
_raw_domain = os.getenv("SHOPIFY_STORE_DOMAIN", "seguridad-avanzada.myshopify.com")
SHOPIFY_STORE_DOMAIN = _raw_domain.replace("https://", "").replace("http://", "").strip("/")
SHOPIFY_API_VERSION = os.getenv("SHOPIFY_API_VERSION", "2024-07")

# Endpoints
BANXICO_API_URL = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos/oportuno"
TECNOSINERGIA_V3_STATUS_URL = "https://api.tecnosinergia.info/v3/status"
TECNOSINERGIA_V3_CATALOG_URL = "https://api.tecnosinergia.info/v3/item/list"
TECNOSINERGIA_V2_JSON_URL_TEMPLATE = "https://tecnosinergia.com/jsonproductosv2/{token}"
TECNOSINERGIA_V2_CSV_URL_TEMPLATE = "https://tecnosinergia.com/csvproductosv2/{token}"

# Paths
DATA_DIR = BASE_DIR / "data"
LOGS_DIR = BASE_DIR / "logs"
FX_CACHE_FILE = DATA_DIR / "fx_rate_cache.json"

# Business Rules Constants

# 1. SAT DOF vs Banxico FIX Flag
# Set to True if SAT DOF compliance (previous business day rate) is required for invoicing.
# Default False uses Banxico FIX rate of the current day.
USE_SAT_DOF_PREVIOUS_DAY_FX = os.getenv("USE_SAT_DOF_PREVIOUS_DAY_FX", "false").lower() == "true"

# 2. Maximum lead time allowed for special order items before setting to DRAFT status or skipping (in days)
MAX_LEAD_TIME_DAYS = int(os.getenv("MAX_LEAD_TIME_DAYS", "60"))

# 3. Allowed active status strings from Tecnosinergia
ACTIVE_STATUS_LIST = {"DE LINEA", "ULTIMAS PIEZAS"}

# 4. Price Multiplier: 16% IVA + 20% Profit = 1.36 multiplier
TECNOSINERGIA_PRICE_MULTIPLIER = float(os.getenv("TECNOSINERGIA_PRICE_MULTIPLIER", "1.36"))

# 5. Tags
TECNOSINERGIA_TAG = "proveedor:tecnosinergia"
SYSCOM_TAG = "proveedor:syscom"
SYSCOM_VENDOR_NAME = "Syscom"


# Ensure directories exist
DATA_DIR.mkdir(parents=True, exist_ok=True)
LOGS_DIR.mkdir(parents=True, exist_ok=True)


def validate_config(require_shopify: bool = True) -> list[str]:
    """
    Validates required environment variables and returns a list of missing configuration warnings.
    """
    missing = []
    if not BANXICO_SIE_TOKEN:
        missing.append("BANXICO_SIE_TOKEN is not set.")
    if not TECNOSINERGIA_API_TOKEN and not TECNOSINERGIA_V2_TOKEN:
        missing.append("Neither TECNOSINERGIA_API_TOKEN nor TECNOSINERGIA_V2_TOKEN is set.")
    if require_shopify:
        if not SHOPIFY_ADMIN_ACCESS_TOKEN:
            missing.append("SHOPIFY_ADMIN_ACCESS_TOKEN is not set.")
        if not SHOPIFY_STORE_DOMAIN:
            missing.append("SHOPIFY_STORE_DOMAIN is not set.")
    return missing
