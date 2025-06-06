from psycopg2.extras import RealDictCursor
from psycopg2 import sql
from app.db.connection import get_connection

# As a registered user, I want to upvote/downvote reviews.
def add_or_update_review_vote(book_id: int, user_id: int, vote: int):
    assert vote in (-1, 1), "Vote must be either -1 or 1"
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO review_votes (book_id, user_id, vote)
            VALUES (%s, %s, %s)
            ON CONFLICT (book_id, user_id)
            DO UPDATE SET vote = EXCLUDED.vote, created_at = CURRENT_TIMESTAMP;
        """, (book_id, user_id, vote))
        conn.commit()
        print("✅ Review vote recorded or updated.")
    except Exception as e:
        print("❌ Failed to vote on review:", e)
    finally:
        cur.close()
        conn.close()

def get_review_votes(book_id: int) -> dict:
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT
                SUM(CASE WHEN vote = 1 THEN 1 ELSE 0 END) AS upvotes,
                SUM(CASE WHEN vote = -1 THEN 1 ELSE 0 END) AS downvotes
            FROM review_votes
            WHERE book_id = %s;
        """, (book_id,))
        result = cur.fetchone()
        return {"upvotes": result[0] or 0, "downvotes": result[1] or 0}
    except Exception as e:
        print("❌ Error retrieving review votes:", e)
        return {"upvotes": 0, "downvotes": 0}
    finally:
        cur.close()
        conn.close()

def delete_review_vote(book_id: int, user_id: int):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM review_votes WHERE book_id = %s AND user_id = %s;", (book_id, user_id))
        conn.commit()
    except Exception as e:
        print("❌ Error deleting review vote:", e)
        raise
    finally:
        cur.close()
        conn.close()
