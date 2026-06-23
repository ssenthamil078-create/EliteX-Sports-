"""
rate_limiter.py — Simple in-memory per-IP rate limiter.

For production, replace with a Redis-backed implementation.
"""

import time
from collections import defaultdict
from threading import Lock
from fastapi import HTTPException

# {(ip, action): [timestamp, ...]}
_store: dict = defaultdict(list)
_lock = Lock()


def check_rate_limit(ip: str, action: str, limit: int, window_seconds: int) -> None:
    """
    Raise HTTP 429 if `ip` has made more than `limit` requests
    for `action` within the last `window_seconds`.
    """
    key = (ip, action)
    now = time.time()
    with _lock:
        # Discard timestamps outside the window
        _store[key] = [ts for ts in _store[key] if now - ts < window_seconds]
        if len(_store[key]) >= limit:
            raise HTTPException(
                status_code=429,
                detail=(
                    f"Too many {action} attempts. "
                    f"Please wait {window_seconds // 60} minute(s) before trying again."
                ),
            )
        _store[key].append(now) 