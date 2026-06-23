from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from models import db, Position


positions_bp = Blueprint("positions_bp", __name__, url_prefix="/positions")

@positions_bp.get("")
@jwt_required()
def get_positions():
    user_id = int(get_jwt_identity())

    positions = Position.query.filter_by(user_id=user_id).all()

    return jsonify([position.to_dict() for position in positions]), 200


@positions_bp.post("")
@jwt_required()
def create_position():
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    item_id = data.get("item_id")
    item_name = data.get("item_name")
    quantity = data.get("quantity")
    buy_price = data.get("buy_price")
    notes = data.get("notes")

    if item_id is None or not item_name or quantity is None or buy_price is None:
        return jsonify({
            "error": "item_id, item_name, quantity, and buy_price are required."
        }), 400
    
    position = Position(
            item_id=item_id,
            item_name=item_name,
            quantity=quantity,
            buy_price=buy_price,
            notes=notes,
            user_id=user_id
        )

    db.session.add(position)
    db.session.commit()

    return jsonify(position.to_dict()), 201