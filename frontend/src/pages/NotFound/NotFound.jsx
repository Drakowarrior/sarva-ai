import { Link } from "react-router-dom";
import { FiHome, FiZap, FiBookOpen, FiMail } from "react-icons/fi";
import { motion } from "framer-motion";
import useSeo from "../../hooks/useSeo";

function NotFound() {
  useSeo({
    title: "404 Page Not Found | SARVA AI",
    description: "The requested page could not be found on the SARVA AI platform.",
    noindex: true
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
        background: "var(--bg-primary)",
        color: "var(--text-primary)",
        textAlign: "center"
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        style={{
          padding: "40px 32px",
          borderRadius: "16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "16px" }}>
          <img src="/logo.jpg" alt="SARVA AI Logo" style={{ width: "36px", height: "36px", borderRadius: "8px" }} />
          <span style={{ fontWeight: "800", fontSize: "1.2rem", letterSpacing: "0.05em", color: "var(--text-primary)" }}>SARVA AI</span>
        </div>

        <h1 style={{ fontSize: "4.5rem", fontWeight: "800", color: "var(--accent)", marginBottom: "8px", lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "12px" }}>
          Page Not Found
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem", marginBottom: "28px", lineHeight: 1.55 }}>
          The path you requested does not exist or may have moved. Explore our platform resources below:
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "20px" }}>
          <Link
            to="/"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "var(--accent)",
              color: "white",
              fontWeight: "600",
              fontSize: "0.88rem"
            }}
          >
            <FiHome /> Homepage
          </Link>

          <Link
            to="/features"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(0, 0, 0, 0.04)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.88rem"
            }}
          >
            <FiZap /> Features
          </Link>

          <Link
            to="/blog"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(0, 0, 0, 0.04)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.88rem"
            }}
          >
            <FiBookOpen /> Blog Hub
          </Link>

          <Link
            to="/contact"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "rgba(0, 0, 0, 0.04)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
              fontWeight: "600",
              fontSize: "0.88rem"
            }}
          >
            <FiMail /> Contact
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default NotFound;