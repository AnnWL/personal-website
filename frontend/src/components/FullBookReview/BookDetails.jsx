import React from "react";
import styles from "./FullBookReview.module.css";

const BookDetails = ({ book, isBookmarked, onBookmark }) => {
  const {
    title,
    author,
    cover_image_url,
    rating,
    created_at,
    is_pinned,
    review,
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
            <button onClick={onBookmark} className={styles.bookmarkButton}>
              {isBookmarked ? "Remove Bookmark" : "Bookmark"}
            </button>
          </div>
        </div>
        <p className={styles.reviewText}>{review}</p>
      </div>
    </div>
  );
};

export default BookDetails;
