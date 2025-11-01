  import React, { useState } from "react";
  import "./Navbar.css";
  import { Link, useNavigate } from "react-router-dom";
  import smartshetilogo from "../../assets/SmartSheti-2.png";
  import { Menu, X } from "lucide-react";
  import { useAuth } from "../../Context/AuthContext";

  const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { isLoggedIn, user, logout } = useAuth();

    const handleLogout = (e) => {
      e.preventDefault();
      logout();
      setIsOpen(false);
      navigate('/');
    };

    return (
      <nav className="navbar-container">
        {/*Logo */}
        <div className="logo-container">
          <img src={smartshetilogo} alt="Smart Sheti Logo" className="logo-img" />
        </div>

        {/*Hamburger Icon */}
        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </div>

    {/*Nav Links */}
    <ul className={`nav-items ${isOpen ? "open" : ""}`}>
          <Link to="/" className="nav-link" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link
            to="/weather"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Weather
          </Link>
          <Link
            to="/soilreport"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Soil Report
          </Link>
          <Link
            to="/cropadvice"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Crop Advice
          </Link>
          <Link
            to="/gov-schemes"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Government Schemes
          </Link>
          <Link
            to="/market"
            className="nav-link"
            onClick={() => setIsOpen(false)}
          >
            Market Price
          </Link>

          {isLoggedIn ? (
            <li className="nav-link profile-wrapper">
              <button className="profile-btn" onClick={() => setIsOpen(false)} aria-haspopup="true" aria-expanded="false">
                {user && user.name ? user.name : 'Profile'}
              </button>
              <div className="profile-menu">
                <Link to="/profile" className="profile-menu-item" onClick={() => setIsOpen(false)}>Profile</Link>
                <Link to="/change-password" className="profile-menu-item" onClick={() => setIsOpen(false)}>Change Password</Link>
                <button className="profile-menu-item signout" onClick={handleLogout}>Sign out</button>
              </div>
            </li>
          ) : (
            <Link
              to="/signin"
              className="nav-link"
              onClick={() => setIsOpen(false)}
            >
              Sign In
            </Link>
          )}
        </ul>
      </nav>
    );
  };

  export default Navbar;
