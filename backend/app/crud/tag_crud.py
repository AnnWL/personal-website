from psycopg2.extras import RealDictCursor
from app.db.connection import get_connection

# As the Owner, I want to manage (CRUD) tags.
def create_tag(name):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("INSERT INTO tags (name) VALUES (%s) ON CONFLICT DO NOTHING RETURNING id;", (name,))
            return cur.fetchone()

def get_all_tags():
    with get_connection() as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("SELECT id, name FROM tags ORDER BY name;")
            return cur.fetchall()
        
def update_tag(tag_id, new_name):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE tags
                SET name = %s
                WHERE id = %s
                RETURNING id;
            """, (new_name, tag_id))
            result = cur.fetchone()
            return result[0] if result else None
        
def delete_tag(tag_id):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute("DELETE FROM tags WHERE id = %s", (tag_id,))
            return cur.rowcount