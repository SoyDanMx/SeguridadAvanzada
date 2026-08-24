"""
Logger configuration for Tecnosinergia → Shopify synchronization pipeline.
Logs messages to both stdout and timestamped log files in logs/.
"""

import logging
import sys
from datetime import datetime
from tecnosinergia_sync.config import LOGS_DIR


def setup_logger(name: str = "tecnosinergia_sync", verbose: bool = False) -> logging.Logger:
    """
    Sets up a logger with dual stream (console) and file output handlers.
    """
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG if verbose else logging.INFO)

    # Avoid duplicate handlers if logger is initialized multiple times
    if logger.handlers:
        return logger

    # Formatter
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        datefmt="%Y-%m-%d %H:%M:%S"
    )

    # Console Handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(logging.DEBUG if verbose else logging.INFO)
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # Daily File Handler
    today_str = datetime.now().strftime("%Y%m%d")
    log_file_path = LOGS_DIR / f"tecnosinergia_sync_{today_str}.log"
    file_handler = logging.FileHandler(log_file_path, encoding="utf-8")
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(formatter)
    logger.addHandler(file_handler)

    return logger
