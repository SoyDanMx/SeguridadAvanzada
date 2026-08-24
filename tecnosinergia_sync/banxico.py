"""
Banxico SIE API integration module for USD -> MXN Exchange Rate (Serie SF43718 - FIX).
Handles daily fetching, weekend/holiday fallbacks, and local JSON caching.

DOCUMENTATION ON SAT DOF vs BANXICO FIX:
- Banxico FIX (Serie SF43718): Published by Banco de México every business day (~12:30 PM CDMX).
  Reflects the wholesale market exchange rate for that day.
- SAT DOF Rate: Article 20 of the Mexican Federal Tax Code (CFF) dictates that for invoicing and
  official tax purposes in Mexico, transactions in foreign currency must use the exchange rate
  published in the Official Gazette of the Federation (DOF) on the DAY OF PAYMENT/INVOICING,
  which equals the Banxico FIX rate of the PREVIOUS business day.
- Configuration:
  - Default (`USE_SAT_DOF_PREVIOUS_DAY_FX = False`): Uses the latest available FIX rate.
"""

from __future__ import annotations

import json


import logging
from datetime import datetime, timezone
from pathlib import Path
import requests

from tecnosinergia_sync.config import (
    BANXICO_API_URL,
    BANXICO_SIE_TOKEN,
    FX_CACHE_FILE,
    USE_SAT_DOF_PREVIOUS_DAY_FX,
)

logger = logging.getLogger("tecnosinergia_sync.banxico")


def load_cached_rate() -> dict | None:
    """Loads the cached exchange rate from disk if available."""
    if not FX_CACHE_FILE.exists():
        return None
    try:
        with open(FX_CACHE_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data
    except Exception as e:
        logger.warning(f"Failed to read FX cache file {FX_CACHE_FILE}: {e}")
        return None


def save_cached_rate(rate: float, rate_date: str, source: str) -> None:
    """Saves the exchange rate to the local cache file."""
    cache_data = {
        "rate": rate,
        "date": rate_date,
        "source": source,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "series": "SF43718",
    }
    try:
        with open(FX_CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache_data, f, indent=2, ensure_ascii=False)
        logger.info(f"Saved FX rate cache: {rate} MXN/USD (Date: {rate_date})")
    except Exception as e:
        logger.error(f"Failed to write FX cache to {FX_CACHE_FILE}: {e}")


def get_exchange_rate(token: str | None = None) -> tuple[float, dict]:
    """
    Fetches the USD -> MXN exchange rate from Banxico SIE API.
    If the request fails or no new value is published (weekends/holidays),
    falls back to the last cached exchange rate.

    Returns:
        tuple[float, dict]: (exchange_rate_value, metadata_dict)
    """
    api_token = token or BANXICO_SIE_TOKEN

    if not api_token:
        logger.warning("BANXICO_SIE_TOKEN is missing. Attempting to use cached exchange rate...")
        cached = load_cached_rate()
        if cached and "rate" in cached:
            logger.info(f"Using cached FX rate: {cached['rate']} MXN/USD (Date: {cached.get('date', 'Unknown')})")
            return float(cached["rate"]), {**cached, "is_fallback": True}
        raise RuntimeError("BANXICO_SIE_TOKEN is missing and no cached rate is available.")

    headers = {"Bmx-Token": api_token, "Accept": "application/json"}

    # If SAT DOF mode is requested, query last 5 days to extract previous day rate
    if USE_SAT_DOF_PREVIOUS_DAY_FX:
        url = "https://www.banxico.org.mx/SieAPIRest/service/v1/series/SF43718/datos"
    else:
        url = BANXICO_API_URL

    try:
        logger.info(f"Querying Banxico SIE API for Serie SF43718 (SAT DOF mode: {USE_SAT_DOF_PREVIOUS_DAY_FX})...")
        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code == 200:
            res_data = response.json()
            series_list = res_data.get("bmx", {}).get("series", [])

            if series_list and "datos" in series_list[0]:
                datos = series_list[0]["datos"]
                if datos:
                    # In SAT DOF mode, pick the second to last business day if multiple days returned
                    if USE_SAT_DOF_PREVIOUS_DAY_FX and len(datos) >= 2:
                        target_entry = datos[-2]
                        source_type = "Banxico SIE FIX (Previous Business Day - SAT DOF compliant)"
                    else:
                        target_entry = datos[-1]
                        source_type = "Banxico SIE FIX (Current Available)"

                    rate_str = target_entry.get("dato", "").replace(",", "")
                    rate_date = target_entry.get("fecha", "")

                    try:
                        rate_val = float(rate_str)
                        logger.info(f"Banxico FX Rate obtained: {rate_val} MXN/USD (Date: {rate_date}, Source: {source_type})")
                        save_cached_rate(rate_val, rate_date, source_type)
                        return rate_val, {
                            "rate": rate_val,
                            "date": rate_date,
                            "source": source_type,
                            "is_fallback": False,
                        }
                    except ValueError:
                        logger.error(f"Invalid non-numeric rate received from Banxico: '{rate_str}'")

        logger.warning(f"Banxico API response status {response.status_code} or empty payload.")
    except Exception as e:
        logger.warning(f"Error connecting to Banxico SIE API: {e}")

    # Fallback to local cache if API failed or returned invalid data
    cached = load_cached_rate()
    if cached and "rate" in cached:
        logger.warning(
            f"Banxico query fallback activated. Using cached rate {cached['rate']} MXN/USD "
            f"from date {cached.get('date', 'Unknown')}."
        )
        return float(cached["rate"]), {**cached, "is_fallback": True}

    raise RuntimeError("Failed to fetch exchange rate from Banxico SIE API and no cached rate is available.")
