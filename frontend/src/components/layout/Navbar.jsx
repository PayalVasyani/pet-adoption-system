import { Link, useLocation } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar__logo">
        <span className="navbar__logo-icon">🐾</span>
        PetAdopt
      </Link>

      <button 
        className="navbar__toggle" 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`navbar__toggle-line ${mobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`navbar__toggle-line ${mobileMenuOpen ? 'active' : ''}`}></span>
        <span className={`navbar__toggle-line ${mobileMenuOpen ? 'active' : ''}`}></span>
      </button>

      <div className={`navbar__menu ${mobileMenuOpen ? 'active' : ''}`}>
        {!user && (
          <Link 
            to="/login" 
            className={`navbar__link ${isActive("/login") ? 'active' : ''}`}
            onClick={handleNavClick}
          >
            Login
          </Link>
        )}

        {user && (
          <>
            <Link 
              to="/" 
              className={`navbar__link ${isActive("/") ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              Home
            </Link>
            {user?.role === "admin" && (
              <Link 
                to="/admin" 
                className={`navbar__link ${isActive("/admin") ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                Adoption Requests
              </Link>
            )}
            {user?.role === 'user' && (
              <Link 
                to="/dashboard" 
                className={`navbar__link ${isActive("/dashboard") ? 'active' : ''}`}
                onClick={handleNavClick}
              >
                My Applications
              </Link>
            )}
            <button 
              onClick={() => {
                logout();
                handleNavClick();
              }} 
              className="navbar__link navbar__logout"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
