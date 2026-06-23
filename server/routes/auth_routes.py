from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

from models import db, User


auth_bp = Blueprint("auth_bp", __name__, url_prefix="/auth")


@auth_bp.post("/signup")
def signup():
    data = request.get_json() or {}

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Username, email, and password are required."}), 400

    existing_user = User.query.filter(
        (User.username == username) | (User.email == email)
    ).first()

    if existing_user:
        return jsonify({"error": "Username or email already exists."}), 409

    user = User(
        username=username,
        email=email
    )
    user.password = password

    db.session.add(user)
    db.session.commit()

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "user": user.to_dict(),
        "access_token": access_token
    }), 201


@auth_bp.post("/login")
def login():
    data = request.get_json() or {}

    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required."}), 400

    user = User.query.filter_by(username=username).first()

    if not user or not user.authenticate(password):
        return jsonify({"error": "Invalid username or password."}), 401

    access_token = create_access_token(identity=str(user.id))

    return jsonify({
        "user": user.to_dict(),
        "access_token": access_token
    }), 200


@auth_bp.get("/current-user")
@jwt_required()
def current_user():
    user_id = int(get_jwt_identity())
    user = db.session.get(User, user_id)

    if not user:
        return jsonify({"error": "User not found."}), 404

    return jsonify(user.to_dict()), 200
