import requests

from services.cache import get_from_cache, save_to_cache


BASE_URL = "https://prices.runescape.wiki/api/v1/osrs"

HEADERS = {
    "User-Agent": "RuneReport - OSRS market tracking app - aengus.2000@gmail.com"
}


def get_cached_data(cache_key, endpoint, ttl_seconds=60):
    cached_data = get_from_cache(cache_key, ttl_seconds)

    if cached_data:
        return cached_data

    response = requests.get(
        f"{BASE_URL}{endpoint}",
        headers=HEADERS,
        timeout=10
    )
    response.raise_for_status()

    data = response.json()

    return save_to_cache(cache_key, data)


def get_mapping_data():
    return get_cached_data(
        cache_key="mapping",
        endpoint="/mapping",
        ttl_seconds=86400
    )


def get_latest_data():
    return get_cached_data(
        cache_key="latest",
        endpoint="/latest",
        ttl_seconds=60
    )


def get_hourly_data():
    return get_cached_data(
        cache_key="1h",
        endpoint="/1h",
        ttl_seconds=60
    )


def get_daily_data():
    return get_cached_data(
        cache_key="24h",
        endpoint="/24h",
        ttl_seconds=300
    )


def get_timeseries_data(item_id, timestep):
    return get_cached_data(
        cache_key=f"timeseries:{item_id}:{timestep}",
        endpoint=f"/timeseries?id={item_id}&timestep={timestep}",
        ttl_seconds=300
    )