import React from "react";
import { useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";

const AuthButton = ({ userRole }) => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (userRole) {
    return (
      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    );
  }

  if (location.pathname === "/book-reviews") {
    return (
      <button
        onClick={() => (window.location.href = "/login")}
        className={styles.logoutButton}
      >
        Login
      </button>
    );
  }

  return null;
};

export default AuthButton;
