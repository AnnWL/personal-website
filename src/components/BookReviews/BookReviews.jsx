import React, { useEffect, useState } from "react";
import "./BookReviews.css";

const BookReviews = ({
  filterTag,
  setFilterTag,
  filterRating,
  setFilterRating,
  currentPage,
  setCurrentPage,
}) => {
  const [reviews, setReviews] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 6;

  const fetchReviews = async () => {
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
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filtered = reviews.filter((record) => {
    const rating = record.fields.Rating;
    const tags = record.fields.Tags || [];

    return (
      (filterRating ? rating === parseInt(filterRating) : true) &&
      (filterTag ? tags.includes(filterTag) : true)
    );
  });

  const paginated = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );
  const totalPages = Math.ceil(filtered.length / perPage);

  return (
    <div className="reviews-container">
      <h1>My Book Reviews</h1>

      <div className="filters">
        <select
          onChange={(e) => setFilterTag(e.target.value)}
          value={filterTag}
        >
          <option value="">Filter by tag</option>
          {Array.from(new Set(reviews.flatMap((r) => r.fields.Tags || []))).map(
            (tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            )
          )}
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

      <div className="review-grid">
        {paginated.map((record) => {
          const { Title, Author, Review, Rating, Tags, ISBN } = record.fields;
          const cover = ISBN
            ? `https://covers.openlibrary.org/b/isbn/${ISBN}-M.jpg`
            : null;

          return (
            <div key={record.id} className="review-card">
              {cover && <img src={cover} alt={Title} className="book-cover" />}
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

      {totalPages > 1 && (
        <div className="pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookReviews;
