"""
Main orchestrator script for Tecnosinergia → Shopify daily synchronization pipeline.
"""

from __future__ import annotations

import argparse

import sys
from datetime import datetime
from tecnosinergia_sync import config
from tecnosinergia_sync.banxico import get_exchange_rate
from tecnosinergia_sync.logger import setup_logger
from tecnosinergia_sync.shopify_sync import (
    ShopifyClient,
    fetch_shopify_skus,
    sync_tecnosinergia_catalog_to_shopify,
)
from tecnosinergia_sync.tecnosinergia import HealthcheckError, fetch_tecnosinergia_catalog


def build_arg_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Tecnosinergia → Shopify Daily Catalog Sync Pipeline (seguridad-avanzada.com)"
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Run pipeline without making write mutations to Shopify.",
    )
    parser.add_argument(
        "--force-v2",
        action="store_true",
        help="Bypass V3 API healthcheck and force usage of Tecnosinergia V2 fallback API.",
    )
    parser.add_argument(
        "--local-csv",
        type=str,
        default=None,
        help="Path to a local Tecnosinergia CSV sample file for offline testing.",
    )
    parser.add_argument(
        "--verbose",
        action="store_true",
        help="Enable DEBUG level verbose logging.",
    )
    return parser


def run_pipeline(
    dry_run: bool = False,
    force_v2: bool = False,
    local_csv: str | None = None,
    verbose: bool = False,
) -> int:
    logger = setup_logger(verbose=verbose)
    start_time = datetime.now()


    logger.info("==========================================================================")
    logger.info(f"STARTING TECNOSINERGIA SYNC PIPELINE - {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
    if dry_run:
        logger.info("*** DRY-RUN MODE ENABLED - No changes will be written to Shopify ***")
    logger.info("==========================================================================")

    # Validate Config
    missing_vars = config.validate_config(require_shopify=not dry_run)
    if missing_vars:
        for msg in missing_vars:
            logger.warning(f"CONFIG WARNING: {msg}")

    skipped_invalid_prices: list[dict] = []

    try:
        # STEP 1: Get Exchange Rate from Banxico
        logger.info("\n--- STEP 1: Banxico SIE FX Rate ---")
        fx_rate, fx_meta = get_exchange_rate()
        logger.info(
            f"Exchange Rate: {fx_rate} MXN/USD | Date: {fx_meta.get('date')} | "
            f"Source: {fx_meta.get('source')} | Fallback: {fx_meta.get('is_fallback')}"
        )

        # STEP 2: Fetch Tecnosinergia Catalog
        logger.info("\n--- STEP 2: Tecnosinergia Catalog Download ---")
        catalog_items, catalog_source = fetch_tecnosinergia_catalog(
            fx_rate=fx_rate,
            skipped_invalid_prices=skipped_invalid_prices,
            force_v2=force_v2,
            local_csv_path=local_csv,
        )

        logger.info(
            f"Catalog fetched from {catalog_source}: {len(catalog_items)} valid records. "
            f"{len(skipped_invalid_prices)} SKUs skipped due to invalid prices."
        )

        # STEP 3: Shopify Connection & Syscom SKU Scan
        logger.info("\n--- STEP 3: Shopify Scan & Syscom Overlap Filtering ---")
        if dry_run and not config.SHOPIFY_ADMIN_ACCESS_TOKEN:
            logger.warning("Dry-run mode without Shopify credentials. Simulating 0 existing Syscom SKUs.")
            syscom_skus: set[str] = set()
            existing_skus_map: dict[str, dict] = {}
            client = None
        else:
            client = ShopifyClient()
            syscom_skus, existing_skus_map = fetch_shopify_skus(client)

        # STEP 4: Shopify Upsert Sync
        logger.info("\n--- STEP 4: Shopify Catalog Upsert ---")
        if dry_run and client is None:
            # Simulated dry-run execution
            sync_stats = {
                "total_items": len(catalog_items),
                "skipped_syscom": 0,
                "created": len(catalog_items),
                "updated": 0,
                "failed": 0,
                "skipped_syscom_skus": [],
                "failed_skus": [],
            }
        else:
            sync_stats = sync_tecnosinergia_catalog_to_shopify(
                client=client,
                items=catalog_items,
                syscom_skus=syscom_skus,
                existing_skus_map=existing_skus_map,
                dry_run=dry_run,
            )

        # STEP 5: Execution Summary Report
        end_time = datetime.now()
        duration_sec = (end_time - start_time).total_seconds()

        logger.info("\n==========================================================================")
        logger.info("EXECUTION SUMMARY REPORT")
        logger.info("==========================================================================")
        logger.info(f"Execution Date:            {start_time.strftime('%Y-%m-%d %H:%M:%S')}")
        logger.info(f"Total Duration:            {duration_sec:.2f} seconds")
        logger.info(f"USD/MXN Exchange Rate:     ${fx_rate:.4f} ({fx_meta.get('source')})")
        logger.info(f"Catalog Source Used:       {catalog_source}")
        logger.info(f"Total Items Fetched:       {len(catalog_items)}")
        logger.info(f"Skipped (Syscom Overlap):  {sync_stats['skipped_syscom']}")
        logger.info(f"Skipped (Invalid Price):   {len(skipped_invalid_prices)}")
        logger.info(f"Created in Shopify:        {sync_stats['created']}")
        logger.info(f"Updated in Shopify:        {sync_stats['updated']}")
        logger.info(f"Failed Upserts:            {sync_stats['failed']}")
        logger.info("==========================================================================")

        if skipped_invalid_prices:
            logger.warning(f"\nSKIPPED INVALID PRICES REPORT ({len(skipped_invalid_prices)} items):")
            for item in skipped_invalid_prices[:10]:
                logger.warning(f"  - SKU: {item['sku']} | Price: '{item['raw_price']}' | Reason: {item['reason']}")
            if len(skipped_invalid_prices) > 10:
                logger.warning(f"  ... and {len(skipped_invalid_prices) - 10} more (see log file for full list).")

        return 0

    except HealthcheckError as err:
        logger.critical(f"PIPELINE ABORTED: {err}")
        return 1
    except Exception as err:
        logger.critical(f"UNHANDLED PIPELINE FAILURE: {err}", exc_info=True)
        return 1


def main():
    parser = build_arg_parser()
    args = parser.parse_args()
    sys.exit(
        run_pipeline(
            dry_run=args.dry_run,
            force_v2=args.force_v2,
            local_csv=args.local_csv,
            verbose=args.verbose,
        )
    )



if __name__ == "__main__":
    main()
