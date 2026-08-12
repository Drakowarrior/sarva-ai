import { Link, useLocation } from "react-router-dom";
import { FiMoon, FiSun, FiArrowRight, FiMenu, FiX, FiChevronDown, FiCpu, FiMessageSquare, FiFileText, FiShield, FiCode, FiLayers, FiInfo, FiMail, FiZap } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useState, useRef, useEffect } from "react";
import "./SeoLayout.css";

const SeoHeader = () => {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  
  const [productsOpen, setProductsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const productsRef = useRef(null);
  const resourcesRef = useRef(null);

  // Close dropdowns on route change or click outside
  useEffect(() => {
    setProductsOpen(false);
    setResourcesOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (productsRef.current && !productsRef.current.contains(e.target)) {
        setProductsOpen(false);
      }
      if (resourcesRef.current && !resourcesRef.current.contains(e.target)) {
        setResourcesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isProductActive = ["/ai-chatbot", "/enterprise-ai", "/file-analysis", "/features"].includes(location.pathname);
  const isResourceActive = ["/technology", "/case-study", "/security", "/about"].includes(location.pathname);

  return (
    <header className="seo-header">
      <div className="seo-header-container">
        {/* Brand Logo & Name */}
        <Link to="/" className="seo-brand">
          <div className="seo-brand-logo-wrapper">
            <img src="/logo.jpg" alt="SARVA AI Logo" className="seo-brand-logo" />
            <span className="seo-brand-glow" />
          </div>
          <span className="seo-brand-text">SARVA AI</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="seo-nav-desktop">
          <Link
            to="/"
            className={`seo-nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            Home
          </Link>

          {/* Products Dropdown */}
          <div className="seo-dropdown-container" ref={productsRef}>
            <button
              onClick={() => {
                setProductsOpen(!productsOpen);
                setResourcesOpen(false);
              }}
              className={`seo-nav-link seo-dropdown-trigger ${isProductActive ? "active" : ""}`}
            >
              Products <FiChevronDown className={`seo-chevron ${productsOpen ? "open" : ""}`} />
            </button>

            {productsOpen && (
              <div className="seo-dropdown-menu">
                <div className="seo-dropdown-header">Platform Capabilities</div>
                <Link to="/ai-chatbot" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#38bdf8" }}><FiMessageSquare /></div>
                  <div>
                    <div className="seo-dropdown-title">AI Chatbot</div>
                    <div className="seo-dropdown-sub">Context-aware multi-turn conversations</div>
                  </div>
                </Link>
                <Link to="/enterprise-ai" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#a855f7" }}><FiCpu /></div>
                  <div>
                    <div className="seo-dropdown-title">Enterprise AI</div>
                    <div className="seo-dropdown-sub">FastAPI backend & cloud infrastructure</div>
                  </div>
                </Link>
                <Link to="/file-analysis" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#ec4899" }}><FiFileText /></div>
                  <div>
                    <div className="seo-dropdown-title">File Analysis</div>
                    <div className="seo-dropdown-sub">PDF reports & resume comprehension</div>
                  </div>
                </Link>
                <Link to="/features" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#10b981" }}><FiZap /></div>
                  <div>
                    <div className="seo-dropdown-title">All Features</div>
                    <div className="seo-dropdown-sub">Explore full conversational suite</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div className="seo-dropdown-container" ref={resourcesRef}>
            <button
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setProductsOpen(false);
              }}
              className={`seo-nav-link seo-dropdown-trigger ${isResourceActive ? "active" : ""}`}
            >
              Resources <FiChevronDown className={`seo-chevron ${resourcesOpen ? "open" : ""}`} />
            </button>

            {resourcesOpen && (
              <div className="seo-dropdown-menu">
                <div className="seo-dropdown-header">Technical Documentation</div>
                <Link to="/blog" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#ec4899" }}><FiBookOpen /></div>
                  <div>
                    <div className="seo-dropdown-title">Engineering Blog</div>
                    <div className="seo-dropdown-sub">Technical guides & tutorials</div>
                  </div>
                </Link>
                <Link to="/technology" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#38bdf8" }}><FiLayers /></div>
                  <div>
                    <div className="seo-dropdown-title">Tech Stack</div>
                    <div className="seo-dropdown-sub">React, FastAPI & MongoDB Atlas</div>
                  </div>
                </Link>
                <Link to="/case-study" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#a855f7" }}><FiCode /></div>
                  <div>
                    <div className="seo-dropdown-title">Engineering Case Study</div>
                    <div className="seo-dropdown-sub">Architecture & technical breakdown</div>
                  </div>
                </Link>
                <Link to="/security" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#10b981" }}><FiShield /></div>
                  <div>
                    <div className="seo-dropdown-title">Security & Privacy</div>
                    <div className="seo-dropdown-sub">JWT auth & session isolation</div>
                  </div>
                </Link>
                <Link to="/about" className="seo-dropdown-item">
                  <div className="seo-dropdown-icon" style={{ color: "#f59e0b" }}><FiInfo /></div>
                  <div>
                    <div className="seo-dropdown-title">About SARVA AI</div>
                    <div className="seo-dropdown-sub">Platform vision & mission</div>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            to="/contact"
            className={`seo-nav-link ${location.pathname === "/contact" ? "active" : ""}`}
          >
            Contact
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="seo-actions">
          <button
            onClick={toggleTheme}
            className="seo-theme-toggle"
            aria-label="Toggle theme"
            title="Toggle theme mode"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>

          <Link
            to={isAuthenticated ? "/chat" : "/auth"}
            className="seo-cta-btn"
          >
            <span>{isAuthenticated ? "Dashboard" : "Launch App"}</span> <FiArrowRight />
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
          <Link to="/" className="seo-mobile-link">Home</Link>
          <div className="seo-mobile-header">Products</div>
          <Link to="/ai-chatbot" className="seo-mobile-link"><FiMessageSquare /> AI Chatbot</Link>
          <Link to="/enterprise-ai" className="seo-mobile-link"><FiCpu /> Enterprise AI</Link>
          <Link to="/file-analysis" className="seo-mobile-link"><FiFileText /> File Analysis</Link>
          <Link to="/features" className="seo-mobile-link"><FiZap /> All Features</Link>
          
          <div className="seo-mobile-header">Resources & Tech</div>
          <Link to="/technology" className="seo-mobile-link"><FiLayers /> Tech Stack</Link>
          <Link to="/case-study" className="seo-mobile-link"><FiCode /> Case Study</Link>
          <Link to="/security" className="seo-mobile-link"><FiShield /> Security</Link>
          <Link to="/about" className="seo-mobile-link"><FiInfo /> About</Link>
          <Link to="/contact" className="seo-mobile-link"><FiMail /> Contact</Link>
        </div>
      )}
    </header>
  );
};

export default SeoHeader;
