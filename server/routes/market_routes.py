from datetime import datetime, timedelta, timezone

import requests
from flask import Blueprint, jsonify, request

from services.market_analysis import build_market_analysis, build_top_movers


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
        mapping_data = get_cached_data("mapping", "/mapping", ttl_seconds=86400)
        latest_data = get_cached_data("latest", "/latest", ttl_seconds=60)
        hourly_data = get_cached_data("1h", "/1h", ttl_seconds=60)

        top_movers = build_top_movers(
            mapping_data=mapping_data,
            latest_data=latest_data,
            hourly_data=hourly_data
        )

        return jsonify(top_movers), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch top mover data."}), 502
    
    
@market_bp.get("/timeseries/<int:item_id>")
def get_timeseries(item_id):
    timestep = request.args.get("timestep", "24h")

    allowed_timesteps = {"5m", "1h", "6h", "24h"}

    if timestep not in allowed_timesteps:
        return jsonify({
            "error": "timestep must be one of: 5m, 1h, 6h, 24h."
        }), 400

    try:
        cache_key = f"timeseries:{item_id}:{timestep}"
        endpoint = f"/timeseries?id={item_id}&timestep={timestep}"

        data = get_cached_data(cache_key, endpoint, ttl_seconds=300)

        return jsonify(data), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch time-series data."}), 502


@market_bp.get("/analysis/<int:item_id>")
def get_market_analysis(item_id):
    try:
        mapping_data = get_cached_data("mapping", "/mapping", ttl_seconds=86400)
        latest_data = get_cached_data("latest", "/latest", ttl_seconds=60)
        hourly_data = get_cached_data("1h", "/1h", ttl_seconds=60)
        daily_data = get_cached_data("24h", "/24h", ttl_seconds=300)

        analysis = build_market_analysis(
            item_id=item_id,
            mapping_data=mapping_data,
            latest_data=latest_data,
            hourly_data=hourly_data,
            daily_data=daily_data
        )

        if not analysis:
            return jsonify({"error": "Market analysis data not found for this item."}), 404

        return jsonify(analysis), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch market analysis data."}), 502