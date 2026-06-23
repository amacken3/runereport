from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, WatchlistItem
from schemas import watchlist_schema, watchlists_schema


watchlist_bp = Blueprint("watchlist_bp", __name__, url_prefix="/watchlist")


@watchlist_bp.get("")
@jwt_required()
def get_watchlist_items():
    user_id = int(get_jwt_identity())

    watchlist_items = WatchlistItem.query.filter_by(user_id=user_id).all()

    return jsonify(watchlists_schema.dump(watchlist_items)), 200


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

    return jsonify(watchlist_schema.dump(watchlist_item)), 201


@watchlist_bp.get("/<int:watchlist_item_id>")
@jwt_required()
def get_watchlist_item(watchlist_item_id):
    user_id = int(get_jwt_identity())

    watchlist_item = WatchlistItem.query.filter_by(
        id=watchlist_item_id,
        user_id=user_id
    ).first()

    if not watchlist_item:
        return jsonify({"error": "Watchlist item not found."}), 404

    return jsonify(watchlist_schema.dump(watchlist_item)), 200


@watchlist_bp.patch("/<int:watchlist_item_id>")
@jwt_required()
def update_watchlist_item(watchlist_item_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    watchlist_item = WatchlistItem.query.filter_by(
        id=watchlist_item_id,
        user_id=user_id
    ).first()

    if not watchlist_item:
        return jsonify({"error": "Watchlist item not found."}), 404

    if "item_id" in data:
        watchlist_item.item_id = data["item_id"]

    if "item_name" in data:
        watchlist_item.item_name = data["item_name"]

    if "notes" in data:
        watchlist_item.notes = data["notes"]

    db.session.commit()

    return jsonify(watchlist_schema.dump(watchlist_item)), 200


@watchlist_bp.delete("/<int:watchlist_item_id>")
@jwt_required()
def delete_watchlist_item(watchlist_item_id):
    user_id = int(get_jwt_identity())

    watchlist_item = WatchlistItem.query.filter_by(
        id=watchlist_item_id,
        user_id=user_id
    ).first()

    if not watchlist_item:
        return jsonify({"error": "Watchlist item not found."}), 404

    db.session.delete(watchlist_item)
    db.session.commit()

    return jsonify({"message": "Watchlist item deleted successfully."}), 200