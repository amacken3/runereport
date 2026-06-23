from flask import Blueprint, jsonify

market_bp = Blueprint("market_bp", __name__, url_prefix="/market")