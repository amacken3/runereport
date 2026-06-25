import { NavLink, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <NavLink to="/" className="brand">
        RuneReport
      </NavLink>

      <nav className="nav-links">
        {isAuthenticated && (
          <>
            <NavLink to="/dashboard">Dashboard</NavLink>
            <NavLink to="/positions">Positions</NavLink>
            <NavLink to="/watchlist">Watchlist</NavLink>
          </>
        )}

        {!isAuthenticated && (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}

        {isAuthenticated && (
          <button type="button" className="nav-button" onClick={handleLogout}>
            Logout {user?.username ? `(${user.username})` : ""}
          </button>
        )}
      </nav>
    </header>
  );
}

export default Navbar;