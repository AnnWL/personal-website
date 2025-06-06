from psycopg2 import sql
from app.db.connection import get_connection

# As the Owner, I want to create, edit and delete specific book reviews. I also want to get book review with analytics
# As a non-registered user, I want to browse all public book reviews.

def get_book_review(book_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, title, author, isbn, cover_image_url, review, rating, is_pinned, created_at
                FROM books
                WHERE id = %s;
            """, (book_id,))
            result = cur.fetchone()
            if result:
                return {
                    "id": result[0],
                    "title": result[1],
                    "author": result[2],
                    "isbn": result[3],
                    "cover_image_url": result[4],
                    "review": result[5],
                    "rating": result[6],
                    "is_pinned": result[7],
                    "created_at": result[8]
                }
            return None

def list_public_book_reviews(limit=20, offset=0):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, title, author, cover_image_url, rating, created_at
                FROM books
                ORDER BY created_at DESC
                LIMIT %s OFFSET %s;
            """, (limit, offset))
            rows = cur.fetchall()
            return [
                {
                    "id": row[0],
                    "title": row[1],
                    "author": row[2],
                    "cover_image_url": row[3],
                    "rating": row[4],
                    "created_at": row[5]
                }
                for row in rows
            ]

def create_book_review(title, author, isbn, cover_image_url, review, rating, is_pinned=False):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO books (title, author, isbn, cover_image_url, review, rating, is_pinned)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (title, author, isbn, cover_image_url, review,  rating, is_pinned))
            return cur.fetchone()[0]

def update_book_review(book_id, updated_fields):
    with get_connection() as conn:
        with conn.cursor() as cur:
            keys = updated_fields.keys()
            values = list(updated_fields.values()) + [book_id]
            query = sql.SQL("UPDATE books SET " + ", ".join(f"{k} = %s" for k in keys) + " WHERE id = %s")
            cur.execute(query, values)
            return cur.rowcount

def delete_book_review(book_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM books WHERE id = %s", (book_id,))
            return cur.rowcount

# def get_book_review_with_analytics(book_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            # Get main review details
            cur.execute("""
                SELECT id, title, author, isbn, cover_image_url, review, user_id, rating, is_pinned, created_at
                FROM books
                WHERE id = %s;
            """, (book_id,))
            review = cur.fetchone()

            if not review:
                return None

            review_data = {
                "id": review[0],
                "title": review[1],
                "author": review[2],
                "isbn": review[3],
                "cover_image_url": review[4],
                "review": review[5],
                "user_id": review[6],
                "rating": review[7],
                "is_pinned": review[8],
                "created_at": review[9],
            }

            # Get vote counts
            cur.execute("""
                SELECT 
                    SUM(CASE WHEN vote_type = 'up' THEN 1 ELSE 0 END) AS upvotes,
                    SUM(CASE WHEN vote_type = 'down' THEN 1 ELSE 0 END) AS downvotes
                FROM review_votes
                WHERE book_id = %s;
            """, (book_id,))
            votes = cur.fetchone()
            review_data["upvotes"] = votes[0] or 0
            review_data["downvotes"] = votes[1] or 0

            # Get comment count
            cur.execute("""
                SELECT COUNT(*) FROM comments WHERE book_id = %s;
            """, (book_id,))
            comment_count = cur.fetchone()[0]
            review_data["comment_count"] = comment_count

            # Optional: include recent comments
            cur.execute("""
                SELECT user_id, content, created_at
                FROM comments
                WHERE book_id = %s
                ORDER BY created_at DESC
                LIMIT 5;
            """, (book_id,))
            comments = cur.fetchall()
            review_data["recent_comments"] = [
                {
                    "user_id": c[0],
                    "content": c[1],
                    "created_at": c[2]
                } for c in comments
            ]

            return review_data