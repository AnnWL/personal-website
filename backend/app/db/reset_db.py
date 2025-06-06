import psycopg2
from app.db.connection import get_connection

def reset_database():
    truncate_sql = """
    TRUNCATE TABLE 
        comment_votes,
        comments,
        book_tags,
        books,
        tags,
        users
    RESTART IDENTITY CASCADE;
    """
    conn = None
    try:
        conn = get_connection()
        conn.autocommit = True
        cur = conn.cursor()
        cur.execute(truncate_sql)
        print("✅ All tables truncated and sequences reset.")
        cur.close()
    except Exception as e:
        print("❌ Error resetting database:", e)
    finally:
        if conn:
            conn.close()

# Usage example:
#if __name__ == "__main__":   
# create_schema()  # call this function only when you want to reset DB
