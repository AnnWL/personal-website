import React, { useEffect, useState } from "react";
import styles from "./BookEditor.module.css";
import BookForm from "./BookForm";
import BookList from "./BookList";

const BookEditor = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const startEdit = (book) => {
    setCreatingNew(false);
    setEditingBook(book);
  };

  const startNew = () => {
    setEditingBook(null);
    setCreatingNew(true);
  };

  const cancelEditOrCreate = () => {
    setEditingBook(null);
    setCreatingNew(false);
  };

  const handleSubmit = async (formData) => {
    const method = editingBook ? "PATCH" : "POST";
    const url = editingBook ? `/api/books/${editingBook.id}` : "/api/books";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      setFeedback(`✅ Review ${editingBook ? "updated" : "created"}`);
      fetchBooks();
      cancelEditOrCreate();
    } else {
      const err = await res.json();
      setFeedback(`❌ ${err.err || "Submit failed"}`);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this review?");
    if (!confirmDelete) return;

    const res = await fetch(`/api/books/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.ok) {
      setFeedback("✅ Review deleted");
      fetchBooks();
    } else {
      const err = await res.json();
      setFeedback(`❌ ${err.err || "Delete failed"}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Manage Book Reviews</h2>
      {feedback && <p className={styles.feedback}>{feedback}</p>}

      <button onClick={startNew} className={styles.newButton}>
        New Review
      </button>

      {(editingBook || creatingNew) && (
        <BookForm
          initialData={editingBook}
          onSubmit={handleSubmit}
          onCancel={cancelEditOrCreate}
        />
      )}

      <BookList books={books} onEdit={startEdit} onDelete={handleDelete} />
    </div>
  );
};

export default BookEditor;
