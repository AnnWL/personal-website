
from flask import Blueprint, request, jsonify, g
from app.middleware.auth_middleware import token_required
from app.crud.bookmark_crud import get_bookmarks, add_bookmark, remove_bookmark

bookmark_bp = Blueprint('bookmark', __name__, url_prefix='/api/bookmarks')

@bookmark_bp.route('', methods=['GET'])
@token_required
def list_user_bookmarks():
    user_id = g.user["id"]
    try:
        bookmarks = get_bookmarks(user_id)
        return jsonify(bookmarks), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@bookmark_bp.route('', methods=['POST'])
@token_required
def add_user_bookmark():
    data = request.get_json()
    user_id = g.user["id"]
    book_id = data.get("book_id")
    if not book_id:
        return jsonify({"err": "Missing book_id"}), 400
    try:
        add_bookmark(user_id, book_id)
        return jsonify({"msg": "Bookmark added"}), 201
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@bookmark_bp.route('', methods=['DELETE'])
@token_required
def remove_user_bookmark():
    data = request.get_json()
    user_id = g.user["id"]
    book_id = data.get("book_id")
    if not book_id:
        return jsonify({"err": "Missing book_id"}), 400
    try:
        remove_bookmark(user_id, book_id)
        return jsonify({"msg": "Bookmark removed"}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500
