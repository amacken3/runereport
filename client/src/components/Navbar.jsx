import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import styles from "./Navbar.module.css";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className={styles.navbar}>
      <NavLink to="/" className={styles.brand}>
        RuneReport
      </NavLink>

      <nav className={styles.navLinks}>
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/positions">Positions</NavLink>
            <NavLink to="/watchlist">Watchlist</NavLink>
          </>
        )}

        {!isAuthenticated && (
          <>
            <NavLink to="/login">Log In</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}

        {isAuthenticated && (
          <button
            type="button"
            className={styles.navButton}
            onClick={handleLogout}
          >
            Logout {user?.username ? `(${user.username})` : ""}
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;