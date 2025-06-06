from app.db.connection import get_connection
import psycopg2.extras
from psycopg2.extras import RealDictCursor

def get_user_by_username(username):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("SELECT * FROM users WHERE username = %s;", (username,))
            return cur.fetchone()

def create_user(username, email, password_hash):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO users (username, email, password_hash)
                VALUES (%s, %s, %s)
                RETURNING id, username;
            """, (username, email, password_hash))
            return cur.fetchone()
        
# As the Owner, I want to promote or demote registered users
def update_user_role(user_id, new_role):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET role = %s WHERE id = %s", (new_role, user_id))
            return cur.rowcount
        
# As a registered user, I want to have a profile page showing my comments and bookmarks.
def get_user_comments(user_id):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT c.id, c.content, c.created_at, b.title AS book_title
                FROM comments c
                JOIN books b ON c.book_id = b.id
                WHERE c.user_id = %s
                ORDER BY c.created_at DESC;
            """, (user_id,))
            return cur.fetchall()

def get_user_bookmarks(user_id):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT b.id, b.title, b.author, b.review, b.cover_image_url, bm.created_at
                FROM bookmarks bm
                JOIN books b ON bm.book_id = b.id
                WHERE bm.user_id = %s
                ORDER BY bm.created_at DESC;
            """, (user_id,))
            return cur.fetchall()
        
