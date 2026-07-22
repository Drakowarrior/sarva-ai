import { useState, useEffect, useRef } from "react";
import { FiX, FiSearch, FiCheck, FiSend, FiLoader, FiUser, FiLayers, FiBriefcase, FiFolder, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import "./ShareModal.css";


function ShareModal({ isOpen, onClose, sessionId }) {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  
  const modalRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Focus trap and escape listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      modalRef.current?.focus();
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Clean suggestions and input when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSuggestions([]);
      setSelectedUsers([]);
    }
  }, [isOpen]);

  // Debounced user search
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    const query = value.trim();
    if (!query) {
      setSuggestions([]);
      setSearching(false);
      return;
    }

    setSearching(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await api.post("/users/search", { query });
        setSuggestions(response.data || []);
      } catch (err) {
        console.error("Failed to search users:", err);
      } finally {
        setSearching(false);
      }
    }, 400); // 400ms debounce
  };

  const handleToggleUser = (u) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((x) => x.userId === u.userId);
      if (exists) {
        return prev.filter((x) => x.userId !== u.userId);
      } else {
        return [...prev, u];
      }
    });
  };

  const handleRemoveChip = (userId) => {
    setSelectedUsers((prev) => prev.filter((x) => x.userId !== userId));
  };

  const handleShareSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!selectedUsers.length || submitting || !sessionId || !user) return;

    setSubmitting(true);
    try {
      const payload = {
        sessionId: sessionId,
        sharedBy: user.user_id,
        shareWith: selectedUsers.map((u) => u.userId),
        shareType: "copy",
        permission: "read_write",
        timestamp: new Date().toISOString()
      };

      const response = await api.post("/share", payload);
      if (response.data.success) {
        toast.success(response.data.message || "Chat shared successfully.");
        onClose();
      } else {
        toast.error(response.data.error || "Failed to share chat.");
      }
    } catch (err) {
      const errMsg = err.response?.data?.detail || "An error occurred while sharing the chat.";
      toast.error(errMsg);
      console.error("Share error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="share-modal-overlay" onClick={onClose}>
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 15 }}
          className="share-modal-card"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label="Share chat conversation"
        >
          <div className="share-modal-header">
            <h3>Share Chat</h3>
            <button
              className="share-modal-close-btn"
              onClick={onClose}
              aria-label="Close modal"
            >
              <FiX />
            </button>
          </div>

          <form onSubmit={handleShareSubmit} className="share-modal-body">
            <p className="share-modal-intro">
              Search and select registered users by email or name to share an independent copy of this conversation.
            </p>

            <div className="share-search-wrapper">
              <FiSearch className="share-search-icon" />
              <input
                type="text"
                placeholder="Search user by email or name..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="share-search-input"
                autoFocus
              />
              {searching && <FiLoader className="share-loader-spin spin" />}
            </div>

            {/* Selected users chips UI */}
            {selectedUsers.length > 0 && (
              <div className="share-chips-container">
                {selectedUsers.map((u) => (
                  <div key={u.userId} className="share-chip">
                    <span className="share-chip-name">{u.name || u.email}</span>
                    <button
                      type="button"
                      className="share-chip-remove"
                      onClick={() => handleRemoveChip(u.userId)}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Suggestions list checklist */}
            <div className="share-suggestions-container" style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "320px", overflowY: "auto", paddingRight: "4px" }}>
              {suggestions.length > 0 ? (
                suggestions.map((u) => {
                  const isSelected = selectedUsers.some((x) => x.userId === u.userId);
                  return (
                    <div
                      key={u.userId}
                      className={`share-user-item ${isSelected ? "selected" : ""}`}
                      onClick={() => handleToggleUser(u)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "12px",
                        background: isSelected ? "rgba(56, 189, 248, 0.08)" : "rgba(255, 255, 255, 0.02)",
                        border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border)",
                        borderRadius: "10px",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="share-checkbox"
                        style={{ marginTop: "3px", transform: "scale(1.1)", cursor: "pointer" }}
                      />
                      <div className="share-user-avatar" style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: u.isOrgMember ? "var(--success)" : "var(--accent)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        flexShrink: 0
                      }}>
                        {u.name ? u.name[0].toUpperCase() : "U"}
                      </div>
                      <div className="share-user-info" style={{ display: "flex", flexDirection: "column", gap: "4px", width: "100%", overflow: "hidden" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "6px" }}>
                          <span className="share-user-name" style={{ fontWeight: "600", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                            👤 {u.name}
                          </span>
                          
                          {/* Priority / Connection Badges */}
                          <div style={{ display: "flex", gap: "4px" }}>
                            {u.isOrgMember && (
                              <span style={{
                                background: "rgba(16, 185, 129, 0.12)",
                                color: "var(--success)",
                                fontSize: "0.65rem",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "600"
                              }}>Org Member</span>
                            )}
                            {u.isSameDept && (
                              <span style={{
                                background: "rgba(56, 189, 248, 0.12)",
                                color: "var(--accent)",
                                fontSize: "0.65rem",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "600"
                              }}>Same Dept</span>
                            )}
                            {u.isRecentlyShared && (
                              <span style={{
                                background: "rgba(245, 158, 11, 0.12)",
                                color: "#f59e0b",
                                fontSize: "0.65rem",
                                padding: "2px 6px",
                                borderRadius: "4px",
                                fontWeight: "600"
                              }}>Recent</span>
                            )}
                          </div>
                        </div>

                        {/* Member Details */}
                        {u.accountType === "organization" && u.organizationName ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FiLayers style={{ flexShrink: 0 }} /> <span>🏢 {u.organizationName}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FiBriefcase style={{ flexShrink: 0 }} /> <span>💼 {u.role}</span>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <FiFolder style={{ flexShrink: 0 }} /> <span>📂 {u.department}</span>
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                            <span>Personal Workspace</span>
                          </div>
                        )}
                        
                        <span className="share-user-email" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", opacity: 0.8, marginTop: "2px" }}>
                          {u.email}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : searchQuery.trim().length > 0 && !searching ? (
                <div className="share-empty-state" style={{ padding: "20px", textAlign: "center", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
                  No users found matching "{searchQuery}"
                </div>
              ) : null}
            </div>

            {/* Actions */}
            <div className="share-modal-actions">
              <button
                type="submit"
                className="share-submit-btn"
                disabled={!selectedUsers.length || submitting}
              >
                {submitting ? (
                  <>
                    <FiLoader className="spin" style={{ marginRight: "6px" }} />
                    Sharing...
                  </>
                ) : (
                  <>
                    <FiSend style={{ marginRight: "6px" }} />
                    Share Chat
                  </>
                )}
              </button>
              <button
                type="button"
                className="share-cancel-btn"
                onClick={onClose}
                disabled={submitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ShareModal;
