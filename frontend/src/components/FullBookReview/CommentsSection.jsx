import React from "react";
import styles from "./FullBookReview.module.css";

const CommentsSection = ({
  comments,
  newComment,
  userRole,
  editingCommentId,
  onEdit,
  onDelete,
  onSubmit,
  onCommentChange,
}) => (
  <div className={styles.commentsContainer}>
    <h3>Comments</h3>
    <ul className={styles.commentList}>
      {comments.map((c) => (
        <li key={c.id} className={styles.commentItem}>
          <p>{c.content}</p>
          <div className={styles.commentActions}>
            <button onClick={() => onEdit(c.id, c.content)}>Edit</button>
            {userRole === "owner" && (
              <button onClick={() => onDelete(c.id)}>Delete</button>
            )}
          </div>
        </li>
      ))}
    </ul>
    <div className={styles.commentInputWrapper}>
      <textarea
        value={newComment}
        onChange={(e) => onCommentChange(e.target.value)}
        placeholder="Write a comment..."
        className={styles.commentInput}
      />
    </div>
    <button onClick={onSubmit} className={styles.submitButton}>
      {editingCommentId ? "Update Comment" : "Post Comment"}
    </button>
  </div>
);

export default CommentsSection;
