# app/routes/auth_routes.py

from flask import Blueprint, request, jsonify, g
import jwt
from dotenv import load_dotenv
load_dotenv()
import os
import bcrypt
from app.crud.auth_crud import (
    get_user_by_username,
    create_user,
    update_user_role,
    get_user_comments,
    get_user_bookmarks
)
from app.middleware.auth_middleware import token_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/sign-up', methods=['POST'])
def sign_up():
    try:
        new_user_data = request.get_json()
        existing_user = get_user_by_username(new_user_data["username"])
        if existing_user:
            return jsonify({"err": "Username already taken"}), 400

        hashed_password = bcrypt.hashpw(bytes(new_user_data["password"], 'utf-8'), bcrypt.gensalt())
        created_user = create_user(
            new_user_data["username"],
            new_user_data["email"],
            hashed_password.decode('utf-8')
        )

        payload = {"username": created_user["username"], "id": created_user["id"]}
        token = jwt.encode({"payload": payload}, os.getenv('JWT_SECRET'))
        return jsonify({"token": token}), 201
    except Exception as err:
        return jsonify({"err": str(err)}), 401

@auth_bp.route('/sign-in', methods=["POST"])
def sign_in():
    try:
        sign_in_form_data = request.get_json()
        existing_user = get_user_by_username(sign_in_form_data["username"])
        if existing_user is None:
            return jsonify({"err": "Invalid credentials."}), 401

        password_is_valid = bcrypt.checkpw(
            sign_in_form_data["password"].encode('utf-8'),
            existing_user["password_hash"].encode('utf-8')
        )
        if not password_is_valid:
            return jsonify({"err": "Invalid credentials."}), 401

        payload = {"username": existing_user["username"], "id": existing_user["id"], "role": existing_user["role"]}
        token = jwt.encode({"payload": payload}, os.getenv('JWT_SECRET'))
        return jsonify({"token": token}), 200
    except Exception as err:
        return jsonify({"err": str(err)}), 500

@auth_bp.route('/role/<int:user_id>', methods=['PATCH'])
@token_required
def promote_demote_user(user_id):
    if g.user.get("role") != "owner":
        return jsonify({"err": "Unauthorized: Only owners can update user roles."}), 403

    data = request.get_json()
    new_role = data.get("role")
    if new_role not in ["owner", "registered"]:
        return jsonify({"err": "Invalid role value."}), 400

    rows = update_user_role(user_id, new_role)
    if rows == 0:
        return jsonify({"err": "User not found or role unchanged."}), 404
    return jsonify({"updated": rows}), 200

# @auth_bp.route('/logout', methods=['POST'])
# @token_required
# def logout():
#     return jsonify({"msg": "Logout successful. Please delete your token on the client."}), 200

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_my_account():
    user_id = g.user["id"]
    try:
        comments = get_user_comments(user_id)
        bookmarks = get_user_bookmarks(user_id)
        return jsonify({
            "comments": comments,
            "bookmarks": bookmarks
        }), 200
    except Exception as err:
        return jsonify({"err": str(err)}), 500
