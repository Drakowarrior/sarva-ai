import { Link, useLocation } from "react-router-dom";
import { FiMoon, FiSun, FiArrowRight, FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useState } from "react";
import "./SeoLayout.css";

const SeoHeader = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Features", path: "/features" },
    { name: "AI Chatbot", path: "/ai-chatbot" },
    { name: "Enterprise AI", path: "/enterprise-ai" },
    { name: "File Analysis", path: "/file-analysis" },
    { name: "Security", path: "/security" },
    { name: "Tech Stack", path: "/technology" },
    { name: "Case Study", path: "/case-study" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="seo-header">
      <div className="seo-header-container">
        {/* Brand Brand */}
        <Link to="/" className="seo-brand">
          <img src="/logo.jpg" alt="SARVA AI Logo" className="seo-brand-logo" />
          <span className="seo-brand-text">SARVA AI</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="seo-nav-desktop">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`seo-nav-link ${location.pathname === link.path ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="seo-actions">
          <button
            onClick={toggleTheme}
            className="seo-theme-toggle"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          <Link
            to={isAuthenticated ? "/chat" : "/auth"}
            className="seo-cta-btn"
          >
            {isAuthenticated ? "Dashboard" : "Try Free"} <FiArrowRight />
          </Link>
          <button
            className="seo-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="seo-mobile-drawer">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`seo-mobile-link ${location.pathname === link.path ? "active" : ""}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default SeoHeader;
