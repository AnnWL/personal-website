import { useEffect, useState } from "react";

export const useBookReview = (id) => {
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Review not found");
        return res.json();
      })
      .then((data) => {
        setBook(data);
        checkIfBookmarked(data.id);
      })
      .catch(() => setBook(null));

    fetch(`/api/books/${id}/comments`)
      .then((res) => res.json())
      .then(setComments);

    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUserRole(payload.payload?.role);
    }
  }, [id]);

  const checkIfBookmarked = async (bookId) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    const res = await fetch("/api/bookmarks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const bookmarks = await res.json();
    setIsBookmarked(bookmarks.some((b) => b.id === bookId));
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem("token");
    if (!token || !book) return;

    const method = isBookmarked ? "DELETE" : "POST";
    const res = await fetch("/api/bookmarks", {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ book_id: book.id }),
    });

    if (res.ok) {
      setIsBookmarked(!isBookmarked);
    }
  };

  const handleCommentSubmit = async () => {
    const method = editingCommentId ? "PATCH" : "POST";
    const url = editingCommentId
      ? `/api/books/${id}/comments/${editingCommentId}`
      : `/api/books/${id}/comments`;

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ content: newComment }),
    });

    if (res.ok) {
      setNewComment("");
      setEditingCommentId(null);
      const updated = await fetch(`/api/books/${id}/comments`).then((r) =>
        r.json()
      );
      setComments(updated);
    }
  };

  const handleEdit = (id, content) => {
    setEditingCommentId(id);
    setNewComment(content);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    const res = await fetch(`/api/books/${id}/comments/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      const updated = await fetch(`/api/books/${id}/comments`).then((r) =>
        r.json()
      );
      setComments(updated);
    }
  };

  return {
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
  };
};
