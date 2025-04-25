import React, { useState } from "react";

const availableTags = [
  "Fiction",
  "Memoir",
  "Faith",
  "Self-help",
  "Non-fiction",
  "Biography",
  "IVF",
  "Work",
];

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);

  const searchBooks = async () => {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${query}`
    );
    const data = await res.json();
    setResults(data.items || []);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const saveToAirtable = async (book) => {
    const title = book.volumeInfo.title || "";
    const author = book.volumeInfo.authors?.[0] || "";
    const isbn = book.volumeInfo.industryIdentifiers?.[0]?.identifier || "";

    const response = await fetch(
      `https://api.airtable.com/v0/${
        import.meta.env.VITE_AIRTABLE_BASE_ID
      }/${encodeURIComponent(import.meta.env.VITE_AIRTABLE_TABLE_NAME)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_AIRTABLE_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fields: {
            Title: title,
            Author: author,
            ISBN: isbn,
            Review: review,
            Rating: rating,
            Tags: selectedTags,
          },
        }),
      }
    );

    const data = await response.json(); // 👈 process the Airtable response
    console.log("Airtable response:", data); // 👈 view the result in your browser console

    if (response.ok) {
      alert("Saved to Airtable!");
      setReview("");
      setRating(0);
      setSelectedTags([]);
    } else {
      alert(`Error: ${data.error?.message || "Failed to save"}`);
    }
  };

  return (
    <div>
      <h2>Book Search</h2>
      <input
        type="text"
        placeholder="Search for a book"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={searchBooks}>Search</button>

      <ul>
        {results.map((book) => (
          <li key={book.id} style={{ marginBottom: "2.5rem" }}>
            <strong>{book.volumeInfo.title}</strong> by{" "}
            {book.volumeInfo.authors?.join(", ")}
            <br />
            <br />
            <textarea
              placeholder="Write your personal review..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              cols={60}
            />
            <div style={{ marginTop: "0.5rem" }}>
              <label>Rating: </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
              >
                <option value={0}>Select</option>
                {[1, 2, 3, 4, 5].map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ marginTop: "0.5rem" }}>
              <label>Tags: </label>
              {availableTags.map((tag) => (
                <label key={tag} style={{ marginRight: "1rem" }}>
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  {tag}
                </label>
              ))}
            </div>
            <button
              style={{ marginTop: "1rem" }}
              onClick={() => saveToAirtable(book)}
            >
              Save to Airtable
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookSearch;
