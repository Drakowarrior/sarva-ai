import { motion } from "framer-motion";

function Loader({ fullScreen = false }) {
  const containerStyle = fullScreen
    ? {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)",
        zIndex: 9999
      }
    : {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        width: "100%"
      };

  return (
    <div style={containerStyle}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid var(--border)",
            borderTopColor: "var(--accent)"
          }}
        />
        {fullScreen && (
          <span style={{ fontSize: "0.9rem", color: "var(--text-secondary)", fontWeight: "500" }}>
            Loading SARVA AI...
          </span>
        )}
      </div>
    </div>
  );
}

export default Loader;
