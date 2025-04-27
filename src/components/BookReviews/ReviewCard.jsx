import React from "react";

const ReviewCard = ({ record }) => {
  const { Title, Author, Review, Rating, Tags } = record;

  return (
    <div className="review-card">
      <div className="book-details">
        <h2>{Title}</h2>
        <p className="author">by {Author}</p>
        {Rating && <p className="rating">{"⭐".repeat(Rating)}</p>}
        <p className="review-text">{Review}</p>
        {Tags && (
          <div className="tags">
            {Tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
