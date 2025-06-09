import React from "react";
import styles from "./BookEditor.module.css";

const BookList = ({ books, onEdit, onDelete }) => (
  <ul className={styles.bookList}>
    {books.map((b) => (
      <li key={b.id} className={styles.bookItem}>
        <strong>{b.title}</strong> by {b.author} <br />
        Rating: {b.rating} <br />
        <em>{b.review || "No review provided."}</em>
        <div>
          <button onClick={() => onEdit(b)}>Edit</button>
          <button onClick={() => onDelete(b.id)}>Delete</button>
        </div>
      </li>
    ))}
  </ul>
);

export default BookList;
