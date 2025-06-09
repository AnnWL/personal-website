import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavBar = () => {
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const role = payload.payload?.role;
      setUserRole(role);
    } catch (err) {
      console.error("Invalid token:", err);
      setUserRole(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Ann Wei Ling</div>
      <ul className={styles.navbarList}>
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? styles.activeNavLink : styles.navLink
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about-me"
            className={({ isActive }) =>
              isActive ? styles.activeNavLink : styles.navLink
            }
          >
            About Me
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/book-reviews"
            className={({ isActive }) =>
              isActive ? styles.activeNavLink : styles.navLink
            }
          >
            Book Reviews
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/work-journey"
            className={({ isActive }) =>
              isActive ? styles.activeNavLink : styles.navLink
            }
          >
            Work Journey
          </NavLink>
        </li>

        {userRole === "owner" && (
          <li>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                isActive ? styles.activeNavLink : styles.navLink
              }
            >
              Admin Panel
            </NavLink>
          </li>
        )}

        {userRole ? (
          <li>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </li>
        ) : location.pathname === "/book-reviews" ? (
          <li>
            <button
              onClick={() => (window.location.href = "/login")}
              className={styles.logoutButton}
            >
              Login
            </button>
          </li>
        ) : null}
      </ul>
    </nav>
  );
};

export default NavBar;
