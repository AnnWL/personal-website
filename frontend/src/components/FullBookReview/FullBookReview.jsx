import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./FullBookReview.module.css";
import { useBookReview } from "./useBookReview";
import BookDetails from "./BookDetails";
import CommentsSection from "./CommentsSection";

const FullBookReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    book,
    comments,
    newComment,
    editingCommentId,
    userRole,
    isBookmarked,
    setNewComment,
    handleBookmark,
    handleCommentSubmit,
    handleEdit,
    handleDelete,
  } = useBookReview(id);

  if (!book) return <p className={styles.error}>Review not found.</p>;

  return (
    <>
      <BookDetails
        book={book}
        isBookmarked={isBookmarked}
        onBookmark={handleBookmark}
      />
      <CommentsSection
        comments={comments}
        newComment={newComment}
        editingCommentId={editingCommentId}
        userRole={userRole}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onSubmit={handleCommentSubmit}
        onCommentChange={setNewComment}
      />
      <button onClick={() => navigate("/books")} className={styles.backButton}>
        ← Back to Reviews
      </button>
    </>
  );
};

export default FullBookReview;
