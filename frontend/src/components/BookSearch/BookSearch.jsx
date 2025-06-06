import React, { useState } from "react";

const BookSearchAdmin = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const searchBooks = async () => {
    try {
      const res = await fetch(`/api/books?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error("Failed to fetch books:", err);
    }
  };

  const updateBookField = (id, field, value) => {
    setResults((prev) =>
      prev.map((book) => (book.id === id ? { ...book, [field]: value } : book))
    );
  };

  const saveToDatabase = async (book) => {
    const method = book.id ? "PATCH" : "POST";
    const url = book.id ? `/api/books/${book.id}` : "/api/books";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(book),
      });

      if (!res.ok) throw new Error("Failed to save book");

      alert("Book saved successfully");
      searchBooks();
    } catch (err) {
      alert("Error saving book: " + err.message);
    }
  };

  const createEmptyBook = () => {
    setResults((prev) => [
      {
        id: null,
        title: "",
        author: "",
        isbn: "",
        review: "",
        rating: 0,
        cover_image_url: "",
        is_pinned: false,
      },
      ...prev,
    ]);
  };

  return (
    <div>
      <h2>Admin Book Editor</h2>
      <input
        type="text"
        placeholder="Search by title"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchBooks}>Search</button>
      <button onClick={createEmptyBook}>+ New Book</button>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {results.map((book) => (
          <li
            key={book.id || Math.random()}
            style={{
              marginBottom: "2.5rem",
              borderBottom: "1px solid #ccc",
              paddingBottom: "2rem",
            }}
          >
            <input
              type="text"
              placeholder="Title"
              value={book.title}
              onChange={(e) =>
                updateBookField(book.id, "title", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="Author"
              value={book.author}
              onChange={(e) =>
                updateBookField(book.id, "author", e.target.value)
              }
            />
            <input
              type="text"
              placeholder="ISBN"
              value={book.isbn}
              onChange={(e) => updateBookField(book.id, "isbn", e.target.value)}
            />
            <textarea
              placeholder="Review"
              value={book.review}
              onChange={(e) =>
                updateBookField(book.id, "review", e.target.value)
              }
              rows={3}
            />
            <input
              type="number"
              placeholder="Rating"
              value={book.rating}
              min={1}
              max={5}
              onChange={(e) =>
                updateBookField(book.id, "rating", Number(e.target.value))
              }
            />
            <input
              type="text"
              placeholder="Cover Image URL"
              value={book.cover_image_url}
              onChange={(e) =>
                updateBookField(book.id, "cover_image_url", e.target.value)
              }
            />
            <button onClick={() => saveToDatabase(book)}>
              {book.id ? "Update" : "Create"} Book
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSearchAdmin;
