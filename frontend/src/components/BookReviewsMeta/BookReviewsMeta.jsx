import React, { useEffect, useState } from "react";
import ReviewCardMeta from "./ReviewCardMeta";
import styles from "./BookReviewsMeta.module.css";

const BookReviewsMeta = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/books");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setReviews(data);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className={styles.reviewContainer}>
      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className={styles.reviewGrid}>
          {reviews.length > 0 ? (
            reviews.map((record) => (
              <ReviewCardMeta key={record.id} record={record} />
            ))
          ) : (
            <p>No reviews available.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BookReviewsMeta;
