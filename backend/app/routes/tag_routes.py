from flask import Blueprint, request, jsonify, g
from app.middleware.auth_middleware import token_required
from app.crud.tag_crud import create_tag, get_all_tags, update_tag, delete_tag

tag_bp = Blueprint('tag', __name__, url_prefix='/api/tags')

@tag_bp.route('', methods=['GET'])
def list_tags():
    try:
        tags = get_all_tags()
        return jsonify(tags), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@tag_bp.route('', methods=['POST'])
@token_required
def add_tag():
    data = request.get_json()
    user_role = g.user.get("role")
    if user_role != "owner":
        return jsonify({"err": "Only owners can create tags"}), 403
    try:
        tag = create_tag(data["name"])
        if tag:
            return jsonify({"id": tag[0]}), 201
        return jsonify({"msg": "Tag already exists"}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@tag_bp.route('/<int:tag_id>', methods=['PATCH'])
@token_required
def rename_tag(tag_id):
    data = request.get_json()
    user_role = g.user.get("role")
    if user_role != "owner":
        return jsonify({"err": "Only owners can update tags"}), 403
    try:
        tag_id = update_tag(tag_id, data["name"])
        if tag_id is None:
            return jsonify({"err": "Tag not found"}), 404
        return jsonify({"updated": tag_id}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@tag_bp.route('/<int:tag_id>', methods=['DELETE'])
@token_required
def remove_tag(tag_id):
    user_role = g.user.get("role")
    if user_role != "owner":
        return jsonify({"err": "Only owners can delete tags"}), 403
    try:
        rows = delete_tag(tag_id)
        if rows == 0:
            return jsonify({"err": "Tag not found"}), 404
        return jsonify({"deleted": rows}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500
