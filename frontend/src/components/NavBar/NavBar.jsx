import styles from "./NavBar.module.css";
import useUserRole from "./useUserRole";
import NavItem from "./NavItem";
import AuthButton from "./AuthButton";

const NavBar = () => {
  const userRole = useUserRole();

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>Ann Wei Ling</div>
      <ul className={styles.navbarList}>
        <li>
          <NavItem to="/" label="Home" />
        </li>
        <li>
          <NavItem to="/about-me" label="About Me" />
        </li>
        <li>
          <NavItem to="/book-reviews" label="Book Reviews" />
        </li>
        <li>
          <NavItem to="/work-journey" label="Work Journey" />
        </li>
        {userRole === "owner" && (
          <li>
            <NavItem to="/admin" label="Admin Panel" />
          </li>
        )}
        <li>
          <AuthButton userRole={userRole} />
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
