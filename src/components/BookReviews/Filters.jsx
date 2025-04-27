import React from "react";

const Filters = ({
  uniqueTags,
  filterTag,
  setFilterTag,
  filterRating,
  setFilterRating,
}) => {
  return (
    <div className="filters">
      <select onChange={(e) => setFilterTag(e.target.value)} value={filterTag}>
        <option value="">Filter by Tag</option>
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
        <option value="">Filter by Rating</option>
        {[1, 2, 3, 4, 5].map((rating) => (
          <option key={rating} value={rating}>
            {rating} ⭐
          </option>
        ))}
      </select>

      <button
        className="clear-button"
        onClick={() => {
          setFilterTag("");
          setFilterRating("");
        }}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default Filters;
