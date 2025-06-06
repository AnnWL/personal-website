import psycopg2
from psycopg2.extras import execute_values #for bulk inserts
from app.db.connection import get_connection

# Establish connection
conn = get_connection()
cur = conn.cursor()

# 1. Insert users
users = [
    ('owner_user', 'owner@example.com', 'hashed_password_1', 'owner'),
    ('john_doe', 'john@example.com', 'hashed_password_2', 'registered'),
    ('jane_smith', 'jane@example.com', 'hashed_password_3', 'registered')
]
insert_users = """
INSERT INTO users (username, email, password_hash, role)
VALUES %s
ON CONFLICT (username) DO NOTHING;
"""
execute_values(cur, insert_users, users)
print("✅ Inserted users.")

# 2. Insert tags
tags = [('fiction',), ('non-fiction',), ('self-help',), ('IVF',), ('faith',), ('memoir',)]
insert_tags = "INSERT INTO tags (name) VALUES %s ON CONFLICT (name) DO NOTHING;"
execute_values(cur, insert_tags, tags)
print("✅ Inserted tags.")

# 3. Insert books
books = [
    (
        'The Courage to be Disliked',
        'Ichiro Kishimi',
        '9781760638016',
        'http://image.url/gatsby.jpg',
        """
        The Courage to Be Disliked was an insightful read that offered a new lens on identity, purpose, and personal freedom. 
        Rooted in Adlerian psychology, it challenges many assumptions — or outdated beliefs — that I used to hold: that the past defines us, 
        that being liked is essential, and that our worth is tied to external achievement.

        It reminded me that while life comes with its fair share of challenges, we are not powerless. 
        We can shape our narratives, set boundaries, and choose how we live. It’s a book I’ll keep returning to.

        Here are my three key takeaways:

        1. You Choose Your Narrative, Not Your Past.
        Adlerian psychology challenges the idea that past trauma or experiences dictate who we become. 
        Instead, we create our own life narratives by assigning purpose to our behavior. 
        The focus is not on what happened, but on what you make of that experience in the present — and choices we make moving forward.

        2. Self-agency, boundaries, and freedom from external validation.
        Freedom comes from owning your task — not chasing others’ approval. 
        True freedom begins when we stop living for approval and focus on what is ours to do.

        3. Happiness comes from contribution.
        A fulfilling life is one where you feel part of a community and are contributing to others — 
        not dominating them or isolating yourself.
        """,
        4,  # rating
        1,  # user_id
        False  # is_pinned
    ),
    (
        'All Your Perfects',
        'Colleen Hoover',
        '9781398519749',
        'http://image.url/1984.jpg',
        """
        All Your Perfects is a love story about Quinn and Graham — a couple whose seemingly perfect marriage is quietly unraveling 
        under the weight of infertility and unspoken pain. As their communication breaks down and grief builds, 
        the story explores how even the deepest love can be tested by unmet expectations and silence.

        Favorite quote: “If you only shine light on your flaws, all your perfects will dim.”

        This captures the theme that focusing only on what's broken in ourselves or relationships 
        can blind us to what’s still beautiful and worth holding onto.

        One key takeaway for me is to treat IVF as a marathon, not a sprint — 
        and to keep living life as normally as possible, rather than letting it consume or overwhelm us.
        """,
        3,  # rating
        1,  # user_id
        False  # is_pinned
    )
]

insert_books = """
INSERT INTO books (title, author, isbn, cover_image_url, description, review, user_id, is_pinned)
VALUES %s
ON CONFLICT (title) DO NOTHING;
"""
execute_values(cur, insert_books, books)
print("✅ Inserted books.")

# 4. Link books to tags
cur.execute("SELECT id, name FROM tags;")
tag_id_map = {name: tid for tid, name in cur.fetchall()}

cur.execute("SELECT id, title FROM books;")
book_id_map = {title: bid for bid, title in cur.fetchall()}

book_tag_links = [
    (book_id_map['The Courage to be Disliked'], tag_id_map['fiction']),
    (book_id_map['The Courage to be Disliked'], tag_id_map['self-help']),
    (book_id_map['All Your Perfects'], tag_id_map['fiction']),
    (book_id_map['All Your Perfects'], tag_id_map['IVF'])
]

insert_book_tags = """
INSERT INTO book_tags (book_id, tag_id) VALUES %s
ON CONFLICT DO NOTHING;
"""
execute_values(cur, insert_book_tags, book_tag_links)
print("✅ Inserted book-tag relationships.")

# 5. Insert comments
comments = [
    (2, book_id_map['The Courage to be Disliked'], "Loved the insights in this review!"),
    (3, book_id_map['All Your Perfects'], "Thanks for sharing your review."),
]
insert_comments = """
INSERT INTO comments (user_id, book_id, content)
VALUES %s;
"""
execute_values(cur, insert_comments, comments)
print("✅ Inserted comments.")

# 6. Insert comment votes (assumes comment ids are 1-based and follow insert order)
comment_votes = [
    (1, 3, 1),  # comment_id=1, user_id=3, upvote
    (2, 2, -1), # comment_id=2, user_id=2, downvote
]
insert_comment_votes = """
INSERT INTO comment_votes (comment_id, user_id, vote)
VALUES %s;
"""
execute_values(cur, insert_comment_votes, comment_votes)
print("✅ Inserted comment votes.")

# 7. Insert bookmarks (showing off the new feature)
bookmarks = [
    (2, book_id_map['The Courage to be Disliked']),
    (2, book_id_map['All Your Perfects']),
    (3, book_id_map['The Courage to be Disliked']),
]
insert_bookmarks = """
INSERT INTO bookmarks (user_id, book_id)
VALUES %s
ON CONFLICT DO NOTHING;
"""
execute_values(cur, insert_bookmarks, bookmarks)
print("✅ Inserted bookmarks.")

# Finalise
conn.commit()
cur.close()
conn.close()
print("🎉 Seed data complete.")
