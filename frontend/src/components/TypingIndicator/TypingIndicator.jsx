import { motion } from "framer-motion";
import { FiCpu } from "react-icons/fi";

function TypingIndicator() {
  return (
    <div className="message-wrapper assistant" style={{ alignItems: "center" }}>
      <div className="avatar assistant">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: "1.2rem", height: "1.2rem", color: "var(--accent)" }}
        >
          <path d="M12 2c-.5 0-.9.3-1.1.7L9.2 7.2 4.7 8.9c-.4.2-.7.6-.7 1.1s.3.9.7 1.1l4.5 1.7 1.7 4.5c.2.4.6.7 1.1.7s.9-.3 1.1-.7l1.7-4.5 4.5-1.7c.4-.2.7-.6.7-1.1s-.3-.9-.7-1.1l-4.5-1.7-1.7-4.5C12.9 2.3 12.5 2 12 2zm6 11c-.3 0-.5.1-.6.4l-.8 2.1-2.1.8c-.3.1-.4.3-.4.6s.1.5.4.6l2.1.8.8 2.1c.1.3.3.4.6.4s.5-.1.6-.4l.8-2.1 2.1-.8c.3-.1.4-.3.4-.6s-.1-.5-.4-.6l-2.1-.8-.8-2.1c-.1-.3-.3-.4-.6-.4z" />
        </svg>
      </div>
      <div className="message-bubble">
        <div className="message-content" style={{ display: "inline-block", width: "fit-content" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center", padding: "4px 8px" }}>
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }}
            />
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.15 }}
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }}
            />
            <motion.span
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: 0.3 }}
              style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TypingIndicator;
