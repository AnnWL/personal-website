
from flask import Blueprint, request, jsonify, g
from app.middleware.auth_middleware import token_required
from app.crud.review_vote_crud import add_or_update_review_vote, get_review_votes
from app.crud.book_crud import (
    get_book_review,
    list_public_book_reviews,
    create_book_review,
    update_book_review,
    delete_book_review,
    get_book_by_isbn_from_db
)

book_bp = Blueprint('book', __name__, url_prefix='/api/books')

@book_bp.route('', methods=['GET'])
def list_books():
    try:
        limit = int(request.args.get('limit', 20))
        offset = int(request.args.get('offset', 0))
        books = list_public_book_reviews(limit=limit, offset=offset)
        return jsonify(books), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@book_bp.route('/<int:book_id>', methods=['GET'])
def read_book(book_id):
    try:
        book = get_book_review(book_id)
        if not book:
            return jsonify({"err": "Book review not found"}), 404
        return jsonify(book), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@book_bp.route('', methods=['POST'])
@token_required
def create_book():
    data = request.get_json()
    try:
        book_id = create_book_review(
            title=data["title"],
            author=data["author"],
            isbn=data.get("isbn"),
            cover_image_url=data.get("cover_image_url"),
            review=data["review"],
            rating=data["rating"],
            is_pinned=data.get("is_pinned", False)
        )
        return jsonify({"book_id": book_id}), 201
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@book_bp.route('/<int:book_id>', methods=['PATCH'])
@token_required
def update_book(book_id):
    data = request.get_json()
    if not data:
        return jsonify({"err": "No fields provided to update"}), 400
    try:
        rows_affected = update_book_review(book_id, data)
        if rows_affected == 0:
            return jsonify({"err": "Book review not found"}), 404
        return jsonify({"updated": rows_affected}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@book_bp.route('/<int:book_id>', methods=['DELETE'])
@token_required
def delete_book(book_id):
    try:
        rows_affected = delete_book_review(book_id)
        if rows_affected == 0:
            return jsonify({"err": "Book review not found"}), 404
        return jsonify({"deleted": rows_affected}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500
    
@book_bp.route('/<int:book_id>/votes', methods=['GET'])
def get_review_votes_for_book(book_id):
    try:
        votes = get_review_votes(book_id)
        return jsonify(votes), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@book_bp.route('/<int:book_id>/vote', methods=['POST'])
@token_required
def vote_on_book_review(book_id):
    data = request.get_json()
    vote = data.get("vote")
    if vote not in (-1, 1):
        return jsonify({"err": "Vote must be -1 or 1"}), 400

    user_id = g.user["id"]
    try:
        add_or_update_review_vote(book_id, user_id, vote)
        return jsonify({"msg": "Vote recorded"}), 200
    except Exception as e:
        return jsonify({"err": str(e)}), 500

@book_bp.route('/isbn/<string:isbn>', methods=['GET'])
@token_required
def get_book_by_isbn(isbn):
    book = get_book_by_isbn_from_db(isbn)  
    if not book:
        return jsonify({"err": "Book not found"}), 404
    return jsonify(book), 200
