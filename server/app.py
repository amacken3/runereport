from flask import Flask, jsonify
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import Config
from models import db, bcrypt

app = Flask(__name__)
app.config.from_object(Config)

CORS(app)
db.init_app(app)
bcrypt.init_app(app)

migrate = Migrate(app, db)
jwt = JWTManager(app)


@app.get("/")
def index():
    return jsonify({"message": "RuneReport API is running"}), 200

from routes.auth_routes import auth_bp
from routes.position_routes import positions_bp
from routes.watchlist_routes import watchlist_bp

app.register_blueprint(auth_bp)
app.register_blueprint(positions_bp)
app.register_blueprint(watchlist_bp)