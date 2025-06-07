import React, { useEffect, useState } from "react";
import styles from "./BookEditor.module.css";

const BookEditor = () => {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    cover_image_url: "",
    review: "",
    rating: 0,
    is_pinned: false,
  });
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
    setFormData({
      title: book.title || "",
      author: book.author || "",
      isbn: book.isbn || "",
      cover_image_url: book.cover_image_url || "",
      review: book.review || "",
      rating: book.rating || 0,
      is_pinned: book.is_pinned || false,
    });
    setFeedback(null);
  };

  const startNew = () => {
    setEditingBook(null);
    setCreatingNew(true);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      cover_image_url: "",
      review: "",
      rating: 0,
      is_pinned: false,
    });
    setFeedback(null);
  };

  const cancelEditOrCreate = () => {
    setEditingBook(null);
    setCreatingNew(false);
    setFormData({
      title: "",
      author: "",
      isbn: "",
      cover_image_url: "",
      review: "",
      rating: 0,
      is_pinned: false,
    });
    setFeedback(null);
  };

  const handleSubmit = async () => {
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
        <div className={styles.editor}>
          <h3 className={styles.muted}>
            {editingBook ? `Editing: ${editingBook.title}` : "New Review"}
          </h3>

          <input
            type="text"
            placeholder="Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
          />
          <input
            type="text"
            placeholder="Cover Image URL"
            value={formData.cover_image_url}
            onChange={(e) =>
              setFormData({ ...formData, cover_image_url: e.target.value })
            }
          />
          <textarea
            placeholder="Review"
            value={formData.review}
            onChange={(e) =>
              setFormData({ ...formData, review: e.target.value })
            }
          />
          <label>
            Rating:
            <select
              value={formData.rating}
              onChange={(e) =>
                setFormData({ ...formData, rating: Number(e.target.value) })
              }
            >
              {[0, 1, 2, 3, 4, 5].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label>
            <input
              type="checkbox"
              checked={formData.is_pinned}
              onChange={(e) =>
                setFormData({ ...formData, is_pinned: e.target.checked })
              }
            />
            Pin Review
          </label>
          <button onClick={handleSubmit}>
            {editingBook ? "Update" : "Create"}
          </button>
          <button onClick={cancelEditOrCreate} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      )}

      <ul className={styles.bookList}>
        {books.map((b) => (
          <li key={b.id} className={styles.bookItem}>
            <strong>{b.title}</strong> by {b.author} <br />
            Rating: {b.rating} <br />
            <em>{b.review || "No review provided."}</em>
            <div>
              <button onClick={() => startEdit(b)}>Edit</button>
              <button onClick={() => handleDelete(b.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookEditor;
