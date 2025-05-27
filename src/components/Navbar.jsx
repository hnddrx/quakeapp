import React, { useState } from "react";
import { Link } from "react-router-dom"; // ← add this
import "./navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Guide", path: "/guidelines" },
    { label: "About", path: "/about" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand */}
        <Link to="/" className="navbar-brand" aria-label="Go to home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 6a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>QuakeAlert</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu" role="menu">
          {navItems.map((item) => (
            <li key={item.label} className="navbar-menu-item" role="menuitem">
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="navbar-hamburger"
          aria-label="Toggle menu"
          aria-expanded={isOpen}
        >
          <svg
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`navbar-mobile-menu ${isOpen ? "open" : ""}`}>
        <ul role="menu">
          {navItems.map((item) => (
            <li
              key={item.label}
              className="navbar-menu-item"
              role="menuitem"
              onClick={() => setIsOpen(false)}
            >
              <Link to={item.path}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
