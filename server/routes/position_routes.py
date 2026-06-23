import requests
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from models import db, Position
from services.osrs_api import get_mapping_data, get_latest_data
from services.position_analysis import build_position_analysis


positions_bp = Blueprint("positions_bp", __name__, url_prefix="/positions")


def get_current_user_id():
    return int(get_jwt_identity())


def find_user_position(position_id, user_id):
    return Position.query.filter_by(
        id=position_id,
        user_id=user_id
    ).first()


def validate_position_data(data):
    required_fields = ["item_id", "item_name", "quantity", "buy_price"]

    missing_fields = [
        field for field in required_fields
        if data.get(field) is None or data.get(field) == ""
    ]

    if missing_fields:
        return {
            "error": "item_id, item_name, quantity, and buy_price are required."
        }

    return None


@positions_bp.get("")
@jwt_required()
def get_positions():
    user_id = get_current_user_id()

    positions = Position.query.filter_by(user_id=user_id).all()

    return jsonify([position.to_dict() for position in positions]), 200


@positions_bp.post("")
@jwt_required()
def create_position():
    user_id = get_current_user_id()
    data = request.get_json() or {}

    validation_error = validate_position_data(data)

    if validation_error:
        return jsonify(validation_error), 400

    position = Position(
        item_id=data.get("item_id"),
        item_name=data.get("item_name"),
        quantity=data.get("quantity"),
        buy_price=data.get("buy_price"),
        notes=data.get("notes"),
        user_id=user_id
    )

    db.session.add(position)
    db.session.commit()

    return jsonify(position.to_dict()), 201


@positions_bp.get("/<int:position_id>")
@jwt_required()
def get_position(position_id):
    user_id = get_current_user_id()
    position = find_user_position(position_id, user_id)

    if not position:
        return jsonify({"error": "Position not found."}), 404

    return jsonify(position.to_dict()), 200


@positions_bp.get("/<int:position_id>/analysis")
@jwt_required()
def get_position_analysis(position_id):
    user_id = get_current_user_id()
    position = find_user_position(position_id, user_id)

    if not position:
        return jsonify({"error": "Position not found."}), 404

    try:
        mapping_data = get_mapping_data()
        latest_data = get_latest_data()

        analysis = build_position_analysis(
            position=position,
            mapping_data=mapping_data,
            latest_data=latest_data
        )

        if not analysis:
            return jsonify({"error": "Position analysis data not found."}), 404

        return jsonify(analysis), 200

    except requests.RequestException:
        return jsonify({"error": "Unable to fetch position analysis data."}), 502


@positions_bp.patch("/<int:position_id>")
@jwt_required()
def update_position(position_id):
    user_id = get_current_user_id()
    data = request.get_json() or {}

    position = find_user_position(position_id, user_id)

    if not position:
        return jsonify({"error": "Position not found."}), 404

    for field in ["item_id", "item_name", "quantity", "buy_price", "notes"]:
        if field in data:
            setattr(position, field, data[field])

    db.session.commit()

    return jsonify(position.to_dict()), 200


@positions_bp.delete("/<int:position_id>")
@jwt_required()
def delete_position(position_id):
    user_id = get_current_user_id()
    position = find_user_position(position_id, user_id)

    if not position:
        return jsonify({"error": "Position not found."}), 404

    db.session.delete(position)
    db.session.commit()

    return jsonify({"message": "Position deleted successfully."}), 200