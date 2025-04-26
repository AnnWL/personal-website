import React, { useEffect, useState } from "react";
import "./BookReviews.css";

const BookReviews = ({
  filterTag,
  setFilterTag,
  filterRating,
  setFilterRating,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch reviews from Airtable
  const fetchReviews = async () => {
    try {
      const res = await fetch(
        `https://api.airtable.com/v0/${import.meta.env.VITE_AIRTABLE_BASE_ID}/${
          import.meta.env.VITE_AIRTABLE_TABLE_NAME
        }`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          },
        }
      );
      const data = await res.json();
      setReviews(data.records || []);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Filter reviews based on selected tag and rating
  const filteredReviews = reviews.filter((record) => {
    const rating = record.fields.Rating;
    const tags = record.fields.Tags || [];

    return (
      (filterRating ? rating === parseInt(filterRating) : true) &&
      (filterTag ? tags.includes(filterTag) : true)
    );
  });

  // Extract unique tags for the filter dropdown
  const uniqueTags = Array.from(
    new Set(reviews.flatMap((r) => r.fields.Tags || []))
  );

  return (
    <div className="reviews-container">
      <h1>My Book Reviews</h1>

      <div className="filters">
        <select
          onChange={(e) => setFilterTag(e.target.value)}
          value={filterTag}
        >
          <option value="">Filter by tag</option>
          {uniqueTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          onChange={(e) => setFilterRating(e.target.value)}
          value={filterRating}
        >
          <option value="">Filter by rating</option>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}⭐
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <div className="review-grid">
          {filteredReviews.map((record) => {
            const { Title, Author, Review, Rating, Tags, ISBN } = record.fields;
            const cover = ISBN
              ? `https://covers.openlibrary.org/b/isbn/${ISBN}-M.jpg`
              : null;

            return (
              <div key={record.id} className="review-card">
                {cover && (
                  <img src={cover} alt={Title} className="book-cover" />
                )}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BookReviews;
