from datetime import datetime, timedelta, timezone

import requests
from flask import Blueprint, jsonify


market_bp = Blueprint("market_bp", __name__, url_prefix="/market")

BASE_URL = "https://prices.runescape.wiki/api/v1/osrs"

HEADERS = {
    "User-Agent": "RuneReport - OSRS market tracking app - aengus.2000@gmail.com"
}

cache = {}


def get_cached_data(cache_key, endpoint, ttl_seconds=60):
    now = datetime.now(timezone.utc)

    cached_item = cache.get(cache_key)

    if cached_item and now - cached_item["timestamp"] < timedelta(seconds=ttl_seconds):
        return cached_item["data"]

    response = requests.get(
        f"{BASE_URL}{endpoint}",
        headers=HEADERS,
        timeout=10
    )
    response.raise_for_status()

    data = response.json()

    cache[cache_key] = {
        "timestamp": now,
        "data": data
    }

    return data


@market_bp.get("/mapping")
def get_mapping():
    try:
        data = get_cached_data("mapping", "/mapping", ttl_seconds=86400)
        return jsonify(data), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch item mapping data."}), 502


@market_bp.get("/latest")
def get_latest_prices():
    try:
        data = get_cached_data("latest", "/latest", ttl_seconds=60)
        return jsonify(data), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch latest price data."}), 502