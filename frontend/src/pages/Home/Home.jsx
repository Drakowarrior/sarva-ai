import { Link } from "react-router-dom";
import { FiArrowRight, FiCpu, FiDatabase, FiFileText, FiLayers, FiShield, FiCode, FiMoon, FiSun } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Home() {
  const { isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-container">
      {/* Background radial glow */}
      <div className="landing-glow" />

      {/* Landing Navbar */}
      <header className="landing-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img 
            src="/logo.jpg" 
            alt="SARVA AI Logo" 
            style={{ 
              width: "32px", 
              height: "32px", 
              borderRadius: "8px", 
              border: "1px solid var(--border)"
            }} 
          />
          <span style={{
            fontSize: "1.4rem",
            fontWeight: "800",
            background: "linear-gradient(135deg, var(--accent), #f472b6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            SARVA AI
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <button
            onClick={toggleTheme}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              cursor: "pointer",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.1rem",
              transition: "all 0.2s ease"
            }}
            aria-label="Toggle theme"
          >
            {theme === "light" ? <FiMoon /> : <FiSun />}
          </button>
          <Link
            to={isAuthenticated ? "/chat" : "/auth"}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "600",
              background: "rgba(255, 255, 255, 0.03)",
              backdropFilter: "blur(10px)"
            }}
          >
            {isAuthenticated ? "Dashboard" : "Sign In"}
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="landing-hero">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="badge-pill"
        >
          ✨ Introducing SARVA AI Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="landing-title"
        >
          The Premium AI Assistant <br />
          For Next-Gen Teams
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="landing-description"
        >
          Experience lightning fast reasoning, seamless multi-format document analysis,
          and dynamic session memory wrapped in a gorgeous glassmorphic interface.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <Link to={isAuthenticated ? "/chat" : "/auth"} className="landing-cta-btn">
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"} <FiArrowRight style={{ marginLeft: "8px", verticalAlign: "middle" }} />
          </Link>
        </motion.div>
      </section>

      {/* Feature Section */}
      <section className="landing-features">
        <motion.div
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="feature-icon"><FiCpu /></div>
          <h3>Advanced LLM Models</h3>
          <p>Switch dynamically between Llama 3.3, Llama 3.2 Vision, Mixtral, and Gemma models for any developer query or vision task.</p>
        </motion.div>

        <motion.div
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="feature-icon"><FiFileText /></div>
          <h3>Document Comprehension</h3>
          <p>Upload PDFs, Word documents, text files, and images. Extract summaries, explanations, resume feedback, and code notes instantly.</p>
        </motion.div>

        <motion.div
          className="feature-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="feature-icon"><FiLayers /></div>
          <h3>Persistent Memory</h3>
          <p>Organize chats into sessions. Rename, search, and delete chats inline. Sessions automatically persist inside MongoDB Atlas and restore on refresh.</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "40px 24px",
        fontSize: "0.85rem",
        color: "var(--text-secondary)",
        borderTop: "1px solid var(--border)",
        marginTop: "80px",
        background: "rgba(255,255,255,0.01)"
      }}>
        © 2026 SARVA AI • Made by Karan Garg (Intern at IGT Solutions)
      </footer>
    </div>
  );
}

export default Home;