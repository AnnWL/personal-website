import React, { useState } from "react";
import BookReviews from "./BookReviews";

const BookReviewsPage = () => {
  const [filterTag, setFilterTag] = useState("");
  const [filterRating, setFilterRating] = useState("");

  return (
    <BookReviews
      filterTag={filterTag}
      setFilterTag={setFilterTag}
      filterRating={filterRating}
      setFilterRating={setFilterRating}
    />
  );
};

export default BookReviewsPage;
