import React from "react";
import { Link } from "react-router-dom";
import styles from "./BookReviewsMeta.module.css";

const formatText = (text) => {
  if (!text) return "";
  return text.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
};

const ReviewCardMeta = ({ record }) => {
  const { id, title, author, review, rating, cover_image_url, created_at } =
    record;

  const getStub = (text, limit = 150) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  return (
    <div className={styles.reviewCard}>
      <div className={styles.reviewCardMeta}>
        {cover_image_url && (
          <img
            src={cover_image_url}
            alt={`Cover of ${title}`}
            className={styles.coverImage}
          />
        )}
        <div className={styles.metaDetails}>
          <h2>{title}</h2>
          <p className={styles.author}>by {author}</p>
          {rating && <p className={styles.rating}>{"⭐".repeat(rating)}</p>}
          <p className={styles.date}>
            {new Date(created_at).toLocaleDateString()}
          </p>
          <p
            className={styles.reviewText}
            dangerouslySetInnerHTML={{ __html: formatText(getStub(review)) }}
          />
          {review?.length > 150 && (
            <Link to={`/book-reviews/${id}`}>Read more</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewCardMeta;
