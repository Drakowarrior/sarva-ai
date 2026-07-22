import { Link } from "react-router-dom";
import { FiHome } from "react-icons/fi";
import { motion } from "framer-motion";

function NotFound() {
  return (
    <div
      style={{
        height: "100vh",
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
          padding: "40px",
          borderRadius: "16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "var(--shadow-lg)"
        }}
      >
        <h1 style={{ fontSize: "5rem", fontWeight: "800", color: "var(--accent)", marginBottom: "12px", lineHeight: 1 }}>
          404
        </h1>
        <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "12px" }}>
          Page Not Found
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", marginBottom: "24px", lineHeight: 1.5 }}>
          The page you are looking for doesn't exist or has been moved to another location.
        </p>
        <Link
          to="/chat"
          className="send-btn"
          style={{
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "12px"
          }}
        >
          <FiHome style={{ marginRight: "8px" }} /> Back to Chat
        </Link>
      </motion.div>
    </div>
  );
}

export default NotFound;