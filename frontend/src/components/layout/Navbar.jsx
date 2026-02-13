import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { pathname } = useLocation();

  const isActive = (path) => {
    if (!path) return false;
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  return (
    <nav className="navbar">
      <Link to="/" className={isActive("/") ? "nav-link active" : "nav-link"}>PetAdopt</Link>

      <div>
        {!user && <Link to="/login" className={isActive("/login") ? "nav-link active" : "nav-link"}>Login</Link>}

        {user && <Link to="/" className={isActive("/") ? "nav-link active" : "nav-link"}>Home</Link>}
         {user?.role === "admin" && <Link to="/admin" className={isActive("/admin") ? "nav-link active" : "nav-link"}>Adoption Requests</Link>}
        {user?.role === 'user' && <Link to="/dashboard" className={isActive("/dashboard") ? "nav-link active" : "nav-link"}>My Applications</Link>}
        {user && <Link as="a" onClick={logout} className="nav-link">Logout</Link>}
      </div>
    </nav>
  );
};

export default Navbar;
