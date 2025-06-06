from flask import Blueprint, request, jsonify, g
from app.middleware.auth_middleware import token_required
from app.crud.review_vote_crud import add_or_update_review_vote, get_review_votes, delete_review_vote

review_vote_bp = Blueprint('review_vote', __name__, url_prefix='/api/books/<int:book_id>')

@review_vote_bp.route('/votes', methods=['GET'])
def get_votes(book_id):
    try:
        votes = get_review_votes(book_id)
        return jsonify(votes), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@review_vote_bp.route('/vote', methods=['POST'])
@token_required
def vote_on_review(book_id):
    data = request.get_json()
    vote = data.get("vote")

    if vote not in (-1, 1):
        return jsonify({"err": "Vote must be -1 or 1"}), 400

    user_id = g.current_user["id"]

    try:
        add_or_update_review_vote(book_id, user_id, vote)
        return jsonify({"msg": "Vote recorded"}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500
    
@review_vote_bp.route('/vote', methods=['DELETE'])
@token_required
def remove_review_vote(book_id):
    user_id = g.user["id"]
    try:
        delete_review_vote(book_id, user_id)
        return jsonify({"msg": "Vote removed"}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500
