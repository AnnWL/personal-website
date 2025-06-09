import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./NavBar.module.css";

const NavItem = ({ to, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      isActive ? styles.activeNavLink : styles.navLink
    }
  >
    {label}
  </NavLink>
);

export default NavItem;
