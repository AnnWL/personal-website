import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminPage.module.css";

const AdminPanel = () => {
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [tags, setTags] = useState([]);
  const [comments, setComments] = useState([]);
  const [newTag, setNewTag] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.payload?.role !== "owner") return navigate("/");
    } catch (err) {
      console.error("Invalid token:", err);
      return navigate("/");
    }

    fetchData();
  }, []);

  const fetchSafeJson = async (res) => {
    const text = await res.text();
    return text ? JSON.parse(text) : [];
  };

  const fetchData = async () => {
    try {
      const [booksRes, usersRes, tagsRes, commentsRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/auth/users"),
        fetch("/api/tags"),
        fetch("/api/comments"),
      ]);
      setBooks(await fetchSafeJson(booksRes));
      setUsers(await fetchSafeJson(usersRes));
      setTags(await fetchSafeJson(tagsRes));
      setComments(await fetchSafeJson(commentsRes));
    } catch (err) {
      console.error("Error fetching admin data:", err);
    }
  };

  const deleteBook = async (id) => {
    await fetch(`/api/books/${id}`, { method: "DELETE" });
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const deleteComment = async (id) => {
    await fetch(`/api/books/comments/${id}`, { method: "DELETE" });
    setComments((prev) => prev.filter((c) => c.id !== id));
  };

  const addTag = async () => {
    if (!newTag.trim()) return;
    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newTag }),
    });
    setNewTag("");
    fetchData();
  };

  const promoteDemoteUser = async (id, role) => {
    await fetch(`/api/auth/role/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ role }),
    });
    fetchData();
  };

  return (
    <div className={styles.adminPanel}>
      <h2>Admin Panel</h2>

      <section className={styles.section}>
        <h3>Manage Book Reviews</h3>
        <button onClick={() => navigate("/book-search")}>Add New Book</button>
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              {book.title} —{" "}
              <button onClick={() => deleteBook(book.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Moderate Comments</h3>
        <ul>
          {comments.map((c) => (
            <li key={c.id}>
              {c.content} (Book #{c.book_id}){" "}
              <button onClick={() => deleteComment(c.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Manage Tags</h3>
        <input
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New Tag"
        />
        <button onClick={addTag}>Add Tag</button>
        <ul>
          {tags.map((t) => (
            <li key={t.id}>{t.name}</li>
          ))}
        </ul>
      </section>

      <section className={styles.section}>
        <h3>Promote/Demote Users</h3>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              {u.username} ({u.role}){" "}
              {u.role === "registered" ? (
                <button onClick={() => promoteDemoteUser(u.id, "owner")}>
                  Promote
                </button>
              ) : (
                <button onClick={() => promoteDemoteUser(u.id, "registered")}>
                  Demote
                </button>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
