from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, WatchlistItem


watchlist_bp = Blueprint("watchlist_bp", __name__, url_prefix="/watchlist")