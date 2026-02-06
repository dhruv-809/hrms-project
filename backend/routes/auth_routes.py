from flask import Blueprint, request, jsonify
from database.db import db
from config import JWT_SECRET
import bcrypt
import jwt
import datetime

auth_bp = Blueprint("auth", __name__)

users_collection = db["users"]


# REGISTER (Admin/Employee)
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "employee")  # default employee

    if not name or not email or not password:
        return jsonify({"error": "Name, email and password are required"}), 400

    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        return jsonify({"error": "Email already registered"}), 409

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    user_data = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": role,
        "created_at": datetime.datetime.utcnow()
    }

    users_collection.insert_one(user_data)

    return jsonify({"message": "User registered successfully"}), 201


# LOGIN
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    token = jwt.encode(
        {
            "user_id": str(user["_id"]),
            "email": user["email"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=5)
        },
        JWT_SECRET,
        algorithm="HS256"
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }), 200


# TEST PROTECTED ROUTE
from middleware.auth_middleware import token_required

@auth_bp.route("/profile", methods=["GET"])
@token_required
def profile():
    return jsonify({
        "message": "Protected route accessed",
        "user": request.user
    }), 200
