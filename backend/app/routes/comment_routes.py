# app/routes/comment_routes.py

from flask import Blueprint, request, jsonify, g
from app.middleware.auth_middleware import token_required

from app.crud.comment_crud import (
    get_comments_for_book,
    create_comment,
    update_comment,
    delete_comment
)

comment_bp = Blueprint('comment', __name__, url_prefix='/api/books/<int:book_id>/comments')

@comment_bp.route('', methods=['GET'])
def list_comments(book_id):
    try:
        comments = get_comments_for_book(book_id)
        return jsonify(comments), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@comment_bp.route('', methods=['POST'])
@token_required
def add_comment(book_id):
    data = request.get_json()
    user_id = g.user["id"]

    try:
        comment_id = create_comment(user_id, book_id, data["content"])
        return jsonify({"comment_id": comment_id}), 201
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@comment_bp.route('/<int:comment_id>', methods=['PATCH'])
@token_required
def edit_comment(book_id, comment_id): 
    data = request.get_json()
    try:
        rows = update_comment(comment_id, data["content"])
        if rows == 0:
            return jsonify({"err": "Comment not found or not authorized"}), 404
        return jsonify({"updated": rows}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@comment_bp.route('/<int:comment_id>', methods=['DELETE'])
@token_required
def remove_comment(book_id,comment_id):
    user_role = g.user.get("role")
    if user_role != "owner":
        return jsonify({"err": "Only owners can delete comments"}), 403
    try:
        rows = delete_comment(comment_id)
        if rows == 0:
            return jsonify({"err": "Comment not found"}), 404
        return jsonify({"deleted": rows}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500
