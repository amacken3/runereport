import requests
from flask import Blueprint, jsonify, request

from services.market_analysis import build_market_analysis, build_top_movers
from services.osrs_api import (
    get_daily_data,
    get_hourly_data,
    get_latest_data,
    get_mapping_data,
    get_timeseries_data
)

market_bp = Blueprint("market_bp", __name__, url_prefix="/market")


@market_bp.get("/mapping")
def get_mapping():
    try:
        data = get_mapping_data()
        return jsonify(data), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch item mapping data."}), 502


@market_bp.get("/latest")
def get_latest_prices():
    try:
        data = get_latest_data()
        return jsonify(data), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch latest price data."}), 502
    

@market_bp.get("/top-movers")
def get_top_movers():
    try:
        mapping_data = get_mapping_data()
        latest_data = get_latest_data()
        hourly_data = get_hourly_data()

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
        data = get_timeseries_data(item_id, timestep)

        return jsonify(data), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch time-series data."}), 502


@market_bp.get("/analysis/<int:item_id>")
def get_market_analysis(item_id):
    try:
        mapping_data = get_mapping_data()
        latest_data = get_latest_data()
        hourly_data = get_hourly_data()
        daily_data = get_daily_data()

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