from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, WatchlistItem


watchlist_bp = Blueprint("watchlist_bp", __name__, url_prefix="/watchlist")

@watchlist_bp.get("")
@jwt_required()
def get_watchlist_items():
    user_id = int(get_jwt_identity())

    watchlist_items = WatchlistItem.query.filter_by(user_id=user_id).all()

    return jsonify([item.to_dict() for item in watchlist_items]), 200

@watchlist_bp.post("")
@jwt_required()
def create_watchlist_item():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    item_id = data.get("item_id")
    item_name = data.get("item_name")
    notes = data.get("notes")

    if item_id is None or not item_name:
        return jsonify({
            "error": "item_id and item_name are required."
        }), 400

    watchlist_item = WatchlistItem(
        item_id=item_id,
        item_name=item_name,
        notes=notes,
        user_id=user_id
    )

    db.session.add(watchlist_item)
    db.session.commit()

    return jsonify(watchlist_item.to_dict()), 201