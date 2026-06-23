from datetime import datetime, timedelta, timezone


cache = {}


def get_from_cache(cache_key, ttl_seconds):
    cached_item = cache.get(cache_key)

    if not cached_item:
        return None

    now = datetime.now(timezone.utc)
    is_fresh = now - cached_item["timestamp"] < timedelta(seconds=ttl_seconds)

    if not is_fresh:
        return None

    return cached_item["data"]


def save_to_cache(cache_key, data):
    cache[cache_key] = {
        "timestamp": datetime.now(timezone.utc),
        "data": data
    }

    return data