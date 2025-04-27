import React, { useEffect, useState } from "react";
import Filters from "./Filters";
import PaginationControls from "./PaginationControls";
import ReviewCard from "./ReviewCard";
import "./BookReviews.css";

const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME;
const AIRTABLE_TOKEN = import.meta.env.VITE_AIRTABLE_TOKEN;

const REVIEWS_PER_PAGE = 4;

const BookReviews = ({
  filterTag,
  setFilterTag,
  filterRating,
  setFilterRating,
}) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetched, setFetched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (fetched) return;

    const fetchReviews = async () => {
      try {
        const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${AIRTABLE_TOKEN}`,
          },
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        setReviews(data.records || []);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
        setFetched(true);
      }
    };

    fetchReviews();
  }, [fetched]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterTag, filterRating]);

  const filteredReviews = getFilteredReviews(reviews, filterTag, filterRating);
  const paginatedReviews = paginateReviews(
    filteredReviews,
    currentPage,
    REVIEWS_PER_PAGE
  );
  const totalPages = Math.ceil(filteredReviews.length / REVIEWS_PER_PAGE);

  const uniqueTags = Array.from(
    new Set(reviews.flatMap((record) => record.fields.Tags || []))
  );

  return (
    <div className="reviews-container">
      <h1 className="section-title">My Book Reviews</h1>

      <Filters
        uniqueTags={uniqueTags}
        filterTag={filterTag}
        setFilterTag={setFilterTag}
        filterRating={filterRating}
        setFilterRating={setFilterRating}
      />

      {loading ? (
        <p>Loading reviews...</p>
      ) : (
        <>
          <div className="review-grid">
            {paginatedReviews.length > 0 ? (
              paginatedReviews.map((record) => (
                <ReviewCard key={record.id} record={record.fields} />
              ))
            ) : (
              <p>No reviews match the filters.</p>
            )}
          </div>

          {filteredReviews.length > REVIEWS_PER_PAGE && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          )}
        </>
      )}
    </div>
  );
};

const getFilteredReviews = (reviews, filterTag, filterRating) => {
  return reviews.filter((record) => {
    const rating = record.fields.Rating;
    const tags = record.fields.Tags || [];
    return (
      (filterRating ? rating === parseInt(filterRating) : true) &&
      (filterTag ? tags.includes(filterTag) : true)
    );
  });
};

const paginateReviews = (filteredReviews, currentPage, perPage) => {
  const startIndex = (currentPage - 1) * perPage;
  return filteredReviews.slice(startIndex, startIndex + perPage);
};

export default BookReviews;
