from psycopg2.extras import RealDictCursor
from app.db.connection import get_connection

# As a registered user, I want to add/remove/view my own bookmark to reviews.
def get_bookmarks(user_id):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT b.*
                FROM books b
                JOIN bookmarks bm ON b.id = bm.book_id
                WHERE bm.user_id = %s;
            """, (user_id,))
            return cur.fetchall()

def add_bookmark(user_id, book_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO bookmarks (user_id, book_id)
                VALUES (%s, %s)
                ON CONFLICT (user_id, book_id) DO NOTHING;
            """, (user_id, book_id))
        
def remove_bookmark(user_id, book_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                DELETE FROM bookmarks
                WHERE user_id = %s AND book_id = %s;
            """, (user_id, book_id))