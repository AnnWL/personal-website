from psycopg2 import sql
from psycopg2.extras import RealDictCursor
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
                SELECT id, title, author, cover_image_url, rating, review, created_at
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
                    "review": row[5],
                    "created_at": row[6]
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
            keys = list(updated_fields.keys())
            values = list(updated_fields.values())

            set_clause = sql.SQL(", ").join(
                sql.Composed([sql.Identifier(k), sql.SQL(" = %s")]) for k in keys
            )

            query = sql.SQL("UPDATE books SET {fields} WHERE id = %s").format(
                fields=set_clause
            )

            cur.execute(query, values + [book_id])
            return cur.rowcount

def delete_book_review(book_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM books WHERE id = %s", (book_id,))
            return cur.rowcount
        
def get_book_by_isbn_from_db(isbn):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM books WHERE isbn = %s;", (isbn,))
            return cur.fetchone()
