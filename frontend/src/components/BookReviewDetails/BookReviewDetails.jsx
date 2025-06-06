import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./ReviewDetail.module.css";

const formatText = (text) => {
  if (!text) return "";
  return text.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
};

const ReviewDetail = () => {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [votes, setVotes] = useState({ upvotes: 0, downvotes: 0 });
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [user, setUser] = useState(null); // Simulated auth

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setReview(data);
      } catch (error) {
        console.error("Failed to fetch review:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchVotes = async () => {
      try {
        const res = await fetch(`/api/books/${id}/votes`);
        if (!res.ok) return;
        const data = await res.json();
        setVotes(data);
      } catch (error) {
        console.error("Failed to fetch votes:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/books/${id}/comments`);
        if (!res.ok) return;
        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Failed to fetch comments:", error);
      }
    };

    fetchReview();
    fetchVotes();
    fetchComments();

    // Simulate user auth context
    setUser({ id: 1, role: "owner", username: "testuser" });
  }, [id]);

  const handleVote = async (vote) => {
    try {
      const res = await fetch(`/api/books/${id}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      });
      if (!res.ok) throw new Error();
      await fetchVotes();
    } catch (err) {
      console.error("Error recording vote");
    }
  };

  const handleRemoveVote = async () => {
    try {
      const res = await fetch(`/api/books/${id}/vote`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      await fetchVotes();
    } catch (err) {
      console.error("Error removing vote");
    }
  };

  const handleSubmitComment = async () => {
    if (!comment.trim()) return;
    try {
      const res = await fetch(`/api/books/${id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          content: comment,
        }),
      });
      if (!res.ok) throw new Error();
      const { comment_id } = await res.json();
      setComment("");
      setComments((prev) => [
        ...prev,
        { id: comment_id, content: comment, user_id: user.id },
      ]);
    } catch (error) {
      console.error("Failed to submit comment");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error();
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment");
    }
  };

  const handleEditComment = async (commentId, newContent) => {
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newContent }),
      });
      if (!res.ok) throw new Error();
      setComments(
        comments.map((c) =>
          c.id === commentId ? { ...c, content: newContent } : c
        )
      );
    } catch (error) {
      console.error("Failed to update comment");
    }
  };

  if (loading) return <p>Loading review...</p>;
  if (!review) return <p>Review not found.</p>;

  const {
    title,
    author,
    review: content,
    rating,
    cover_image_url,
    created_at,
  } = review;

  return (
    <div className={styles.reviewDetailContainer}>
      <Link to="/" className={styles.backButton}>
        ← Back to reviews
      </Link>

      <h1>{title}</h1>
      <p className={styles.author}>by {author}</p>
      {rating && <p className={styles.rating}>{"⭐".repeat(rating)}</p>}
      {cover_image_url && (
        <img
          src={cover_image_url}
          alt={`Cover of ${title}`}
          className={styles.coverImage}
        />
      )}
      <p className={styles.date}>
        Reviewed on {new Date(created_at).toLocaleDateString()}
      </p>

      <div
        className={styles.fullReviewText}
        dangerouslySetInnerHTML={{ __html: formatText(content) }}
      />

      <div className={styles.votesSection}>
        <p>Was this review helpful?</p>
        <button onClick={() => handleVote(1)}>👍</button>
        <button onClick={() => handleVote(-1)}>👎</button>
        <button onClick={handleRemoveVote}>❌ Remove Vote</button>
        <p>
          {votes.upvotes} upvotes, {votes.downvotes} downvotes
        </p>
      </div>

      <div className={styles.commentsSection}>
        <h3>Comments</h3>
        {user ? (
          <>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a comment..."
            />
            <button onClick={handleSubmitComment}>Submit</button>
          </>
        ) : (
          <p>Login to post a comment.</p>
        )}
        <ul>
          {comments.map((c) => (
            <li key={c.id}>
              <p>{c.content}</p>
              {(user?.id === c.user_id || user?.role === "owner") && (
                <div>
                  <button
                    onClick={() => {
                      const newContent = prompt(
                        "Edit your comment:",
                        c.content
                      );
                      if (newContent !== null)
                        handleEditComment(c.id, newContent);
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteComment(c.id)}>
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReviewDetail;
