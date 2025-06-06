import React from "react";
import { Link } from "react-router-dom";

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
    <div className="review-card-meta">
      {cover_image_url && (
        <img
          src={cover_image_url}
          alt={`Cover of ${title}`}
          className="cover-image"
        />
      )}
      <div className="meta-details">
        <h2>{title}</h2>
        <p className="author">by {author}</p>
        {rating && <p className="rating">{"⭐".repeat(rating)}</p>}
        <p className="date">{new Date(created_at).toLocaleDateString()}</p>
        <p
          className="review-text"
          dangerouslySetInnerHTML={{
            __html: formatText(getStub(review)),
          }}
        />
        {review?.length > 150 && <Link to={`/reviews/${id}`}>Read more</Link>}
      </div>
    </div>
  );
};

export default ReviewCardMeta;
