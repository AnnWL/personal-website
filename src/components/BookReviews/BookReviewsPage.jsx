import React, { useState } from "react";
import BookReviews from "./BookReviews";

const BookReviewsPage = () => {
  const [filterTag, setFilterTag] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <BookReviews
      filterTag={filterTag}
      setFilterTag={setFilterTag}
      filterRating={filterRating}
      setFilterRating={setFilterRating}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
    />
  );
};

export default BookReviewsPage;
