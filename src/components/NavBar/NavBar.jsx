import React from "react";
import { NavLink } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Ann Wei Ling</div>
      <ul className="navbar-list">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/about-me"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            About Me
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/book-reviews"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Book Reviews
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/work-journey"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Work Journey
          </NavLink>
        </li>
        {/* <li>
          <NavLink
            to="/personal-reflections"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Personal Reflections
          </NavLink>
        </li> */}
        {/* 
        <li>
          <NavLink
            to="/book-search"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Book Search
          </NavLink>
        </li> */}
      </ul>
    </nav>
  );
};

export default NavBar;
