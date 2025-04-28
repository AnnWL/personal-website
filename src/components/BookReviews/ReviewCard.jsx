import React from "react";

const formatText = (text) => {
  if (!text) return "";
  return text.replace(/\n/g, "<br/>").replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
};

const ReviewCard = ({ record }) => {
  const { Title, Author, Review, Rating, Tags } = record;

  return (
    <div className="review-card">
      <div className="book-details">
        <h2>{Title}</h2>
        <p className="author">by {Author}</p>
        {Rating && <p className="rating">{"⭐".repeat(Rating)}</p>}
        <p
          className="review-text"
          dangerouslySetInnerHTML={{ __html: formatText(Review) }}
        />
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
