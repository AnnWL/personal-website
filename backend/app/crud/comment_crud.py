from psycopg2.extras import RealDictCursor
from app.db.connection import get_connection

# As the Owner, I want to view and moderate all comments (delete/report)
# As a registered user, I want to create/edit/delete my own comments on book reviews
# As a non-registered user, I want to view comments but not interact (no likes/comments/bookmark).

def get_comments_for_book(book_id):
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM comments WHERE book_id = %s;", (book_id,))
            return cur.fetchall()

def get_all_comments():
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT * FROM comments ORDER BY created_at DESC;")
            return cur.fetchall()


def create_comment(user_id, book_id, content):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO comments (user_id, book_id, content)
                VALUES (%s, %s, %s) RETURNING id;
            """, (user_id, book_id, content))
            return cur.fetchone()[0]

def update_comment(comment_id, content):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("UPDATE comments SET content = %s WHERE id = %s", (content, comment_id))
            return cur.rowcount

def delete_comment(comment_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM comments WHERE id = %s", (comment_id,))
            return cur.rowcount
