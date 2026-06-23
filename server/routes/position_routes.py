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


@positions_bp.get("/<int:position_id>")
@jwt_required()
def get_position(position_id):
    user_id = int(get_jwt_identity())

    position = Position.query.filter_by(
        id=position_id,
        user_id=user_id
    ).first()

    if not position:
        return jsonify({"error": "Position not found."}), 404

    return jsonify(position.to_dict()), 200


@positions_bp.patch("/<int:position_id>")
@jwt_required()
def update_position(position_id):
    user_id = int(get_jwt_identity())
    data = request.get_json() or {}

    position = Position.query.filter_by(
        id=position_id,
        user_id=user_id
    ).first()

    if not position:
        return jsonify({"error": "Position not found."}), 404

    if "item_id" in data:
        position.item_id = data["item_id"]

    if "item_name" in data:
        position.item_name = data["item_name"]

    if "quantity" in data:
        position.quantity = data["quantity"]

    if "buy_price" in data:
        position.buy_price = data["buy_price"]

    if "notes" in data:
        position.notes = data["notes"]

    db.session.commit()

    return jsonify(position.to_dict()), 200


@positions_bp.delete("/<int:position_id>")
@jwt_required()
def delete_position(position_id):
    user_id = int(get_jwt_identity())

    position = Position.query.filter_by(
        id=position_id,
        user_id=user_id
    ).first()

    if not position:
        return jsonify({"error": "Position not found."}), 404

    db.session.delete(position)
    db.session.commit()

    return jsonify({"message": "Position deleted successfully."}), 200