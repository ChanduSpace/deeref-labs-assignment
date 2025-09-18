import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  console.log("Navbar - user:", user);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="nav-link">
          PDF Annotator
        </Link>
        <button
          className="mobile-menu-toggle"
          onClick={toggleMenu}
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "white",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          ☰
        </button>
      </div>
      <ul className={`navbar-nav ${isMenuOpen ? "mobile-open" : ""}`}>
        {user ? (
          <>
            <li>
              <Link
                to="/"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                My Library
              </Link>
            </li>
            <li>
              <span className="nav-link">Welcome, {user.email}</span>
            </li>
            <li>
              <button onClick={handleLogout} className="nav-link">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                className="nav-link"
                onClick={() => setIsMenuOpen(false)}
              >
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
