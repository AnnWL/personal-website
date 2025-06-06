import React from "react";
import styles from "./AuthForm.module.css";
import { useNavigate, Link } from "react-router-dom";

const AuthForm = ({ heading, onSubmit, submitLabel, children }) => {
  return (
    <div className={styles.authContainer}>
      <h2>{heading}</h2>
      <form className={styles.authForm} onSubmit={onSubmit}>
        {children}
        <button type="submit" className={styles.submitButton}>
          {submitLabel}
        </button>
      </form>
      {heading === "Login" && (
        <p className={styles.authLink}>
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      )}
    </div>
  );
};

export default AuthForm;
