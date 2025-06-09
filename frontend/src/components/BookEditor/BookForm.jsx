import React, { useState, useEffect } from "react";
import styles from "./BookEditor.module.css";

const BookForm = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    cover_image_url: "",
    review: "",
    rating: 0,
    is_pinned: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        author: initialData.author || "",
        isbn: initialData.isbn || "",
        cover_image_url: initialData.cover_image_url || "",
        review: initialData.review || "",
        rating: initialData.rating || 0,
        is_pinned: initialData.is_pinned || false,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form className={styles.editor} onSubmit={handleSubmit}>
      <h3 className={styles.muted}>
        {initialData ? `Editing: ${initialData.title}` : "New Review"}
      </h3>

      <input
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        name="author"
        placeholder="Author"
        value={formData.author}
        onChange={handleChange}
      />
      <input
        name="isbn"
        placeholder="ISBN"
        value={formData.isbn}
        onChange={handleChange}
      />
      <input
        name="cover_image_url"
        placeholder="Cover Image URL"
        value={formData.cover_image_url}
        onChange={handleChange}
      />
      <textarea
        name="review"
        placeholder="Review"
        value={formData.review}
        onChange={handleChange}
      />

      <label>
        Rating:
        <select name="rating" value={formData.rating} onChange={handleChange}>
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
          name="is_pinned"
          checked={formData.is_pinned}
          onChange={handleChange}
        />
        Pin Review
      </label>

      <button type="submit">{initialData ? "Update" : "Create"}</button>
      <button type="button" onClick={onCancel} className={styles.cancelButton}>
        Cancel
      </button>
    </form>
  );
};

export default BookForm;
