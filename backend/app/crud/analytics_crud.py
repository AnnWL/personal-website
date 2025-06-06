from app.db.connection import get_connection

# As the Owner, I want to see analytics (e.g. views, comments per review)
def add_book_view(book_id: int, user_id: int):
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO book_views (book_id, user_id)
            VALUES (%s, %s);
        """, (book_id, user_id))
        conn.commit()
        print("✅ Book view recorded.")
    except Exception as e:
        print("❌ Failed to record book view:", e)
    finally:
        cur.close()
        conn.close()

def get_view_count(book_id: int) -> int:
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("""
            SELECT COUNT(*) FROM book_views WHERE book_id = %s;
        """, (book_id,))
        count = cur.fetchone()[0]
        return count
    except Exception as e:
        print("❌ Error getting view count:", e)
        return 0
    finally:
        cur.close()
        conn.close()

def get_book_review_with_analytics(book_id):
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