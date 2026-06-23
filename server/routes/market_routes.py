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
    

@market_bp.get("/top-movers")
def get_top_movers():
    try:
        latest_data = get_cached_data("latest", "/latest", ttl_seconds=60)
        hourly_data = get_cached_data("1h", "/1h", ttl_seconds=60)

        mapping_data = get_cached_data("mapping", "/mapping", ttl_seconds=86400)
        item_lookup = {str(item["id"]): item for item in mapping_data}

        latest_prices = latest_data.get("data", {})
        hourly_prices = hourly_data.get("data", {})

        movers = []

        for item_id, hourly_item in hourly_prices.items():
            latest_item = latest_prices.get(item_id)

            if not latest_item:
                continue

            item_info = item_lookup.get(item_id)

            if not item_info:
                continue

            current_price = latest_item.get("high") or latest_item.get("low")
            average_price = hourly_item.get("avgHighPrice") or hourly_item.get("avgLowPrice")

            volume = (hourly_item.get("highPriceVolume", 0) + hourly_item.get("lowPriceVolume", 0))


            if not current_price or not average_price:
                continue
            
            if average_price < 1000 or current_price < 1000:
                continue

            if volume < 50:
                continue

            price_change = current_price - average_price
            percent_change = (price_change / average_price) * 100

            movers.append({
                "item_id": int(item_id),
                "item_name": item_info.get("name"),
                "icon": item_info.get("icon"),
                "current_price": current_price,
                "average_price": average_price,
                "price_change": price_change,
                "percent_change": round(percent_change, 2),
                "volume": volume
            })

        top_gainers = sorted(
            movers,
            key=lambda item: item["price_change"],
            reverse=True
        )[:10]

        top_losers = sorted(
            movers,
            key=lambda item: item["price_change"]
        )[:10]

        return jsonify({
            "top_gainers": top_gainers,
            "top_losers": top_losers
        }), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch top mover data."}), 502