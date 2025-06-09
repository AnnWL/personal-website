import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./FullBookReview.module.css";

const FullBookReview = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Review not found");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        checkIfBookmarked(data.id);
      })
      .catch((err) => {
        console.error(err);
        setBook(null);
      });

    fetch(`/api/books/${id}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .catch((err) => console.error("Failed to load comments:", err));

    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.payload?.role);
    }
  }, [id]);

  const checkIfBookmarked = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("/api/bookmarks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bookmarks = await res.json();
      const isMarked = bookmarks.some((b) => b.id === bookId);
      setIsBookmarked(isMarked);
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
    }
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token || !book) return;

    const method = isBookmarked ? "DELETE" : "POST";
    try {
      const res = await fetch("/api/bookmarks", {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ book_id: book.id }),
      });

      if (res.ok) {
        setIsBookmarked(!isBookmarked);
      } else {
        const error = await res.json();
        console.error(error.err);
      }
    } catch (err) {
      console.error("Bookmark toggle failed:", err);
    }
  };

  const handleCommentSubmit = async () => {
    const method = editingCommentId ? "PATCH" : "POST";
    const url = editingCommentId
      ? `/api/books/${id}/comments/${editingCommentId}`
      : `/api/books/${id}/comments`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (res.ok) {
      setNewComment("");
      setEditingCommentId(null);
      const updated = await fetch(`/api/books/${id}/comments`).then((r) =>
        r.json()
      );
      setComments(updated);
    }
  };

  const handleEdit = (commentId, content) => {
    setEditingCommentId(commentId);
    setNewComment(content);
  };

  const handleDelete = async (commentId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmed) return;

    const res = await fetch(`/api/books/${id}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const updated = await fetch(`/api/books/${id}/comments`).then((r) =>
        r.json()
      );
      setComments(updated);
    }
  };

  if (!book) return <p className={styles.error}>Review not found.</p>;

  const {
    title,
    author,
    cover_image_url,
    rating,
    review,
    created_at,
    is_pinned,
  } = book;

  return (
    <div
      className={`${styles.fullReviewWrapper} ${
        is_pinned ? styles.pinned : ""
      }`}
    >
      <div className={styles.fullReviewCard}>
        <div className={styles.headerRow}>
          <div className={styles.coverWrapper}>
            {cover_image_url && (
              <img
                src={cover_image_url}
                alt={`Cover of ${title}`}
                className={styles.coverImage}
              />
            )}
          </div>
          <div className={styles.reviewDetails}>
            <h2>{title}</h2>
            <span className={styles.author}>by {author}</span>
            {rating > 0 && (
              <span className={styles.rating}> {"⭐".repeat(rating)}</span>
            )}
            <span className={styles.date}>
              Reviewed on: {new Date(created_at).toLocaleDateString()}
            </span>
            <button onClick={handleBookmark} className={styles.bookmarkButton}>
              {isBookmarked ? "Remove Bookmark" : "Bookmark"}
            </button>
          </div>
        </div>
        <p className={styles.reviewText}>{review}</p>
      </div>

      <div className={styles.commentsContainer}>
        <h3>Comments</h3>
        <ul className={styles.commentList}>
          {comments.map((c) => (
            <li key={c.id} className={styles.commentItem}>
              <p>{c.content}</p>
              <div className={styles.commentActions}>
                <button onClick={() => handleEdit(c.id, c.content)}>
                  Edit
                </button>
                {userRole === "owner" && (
                  <button onClick={() => handleDelete(c.id)}>Delete</button>
                )}
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.commentInputWrapper}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className={styles.commentInput}
          />
        </div>
        <button onClick={handleCommentSubmit} className={styles.submitButton}>
          {editingCommentId ? "Update Comment" : "Post Comment"}
        </button>
      </div>
    </div>
  );
};

export default FullBookReview;
