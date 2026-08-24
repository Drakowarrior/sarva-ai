import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiSettings, FiCpu, FiSearch, FiX, FiShare2, FiDownload, FiBriefcase } from "react-icons/fi";
import { useSession } from "../../context/SessionContext";
import { useChat } from "../../context/ChatContext";
import { useAuth } from "../../context/AuthContext";

const MODEL_LABELS = {
  "meta-llama/llama-4-scout-17b-16e-instruct": "Llama 4 Scout (17B)",
  "qwen/qwen3-32b": "Qwen 3 (32B)",
  "llama-3.1-8b-instant": "Llama 3.1 (8B)",
  "llama-3.2-11b-vision-preview": "Llama 3.2 Vision",
  "mixtral-8x7b-32768": "Mixtral 8x7B",
  "gemma2-9b-it": "Gemma 2 (9B)"
};

function Navbar({ onToggleSidebar, onOpenSettings, onOpenShare }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentSession, sessions } = useSession();
  const { 
    selectedModel, 
    messageSearchQuery, 
    setMessageSearchQuery, 
    exportChatAsPDF,
    exportChatAsMarkdown,
    exportChatAsJSON,
    exportChatAsTXT
  } = useChat();
  const [searchOpen, setSearchOpen] = useState(false);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const activeSession = sessions.find(s => s.session_id === currentSession);
  const activeTitle = activeSession ? activeSession.title : "SARVA AI Chat";

  const toggleSearch = () => {
    if (searchOpen) {
      setMessageSearchQuery(""); // Clear search on close
    }
    setSearchOpen(!searchOpen);
  };

  return (
    <nav className="navbar">
      <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
        <button
          className="menu-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          title="Toggle Sidebar"
        >
          <FiMenu />
        </button>
        
        {!searchOpen ? (
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
            <span style={{
              fontSize: "0.92rem",
              fontWeight: "600",
              color: "var(--text-primary)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>
              {activeTitle}
            </span>
            <span style={{
              fontSize: "0.72rem",
              color: "var(--text-secondary)",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              marginTop: "2px"
            }}>
              <span className="model-status-dot" />
              <FiCpu style={{ fontSize: "0.8rem" }} />
              {MODEL_LABELS[selectedModel] || selectedModel}
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", width: "100%", maxWidth: "320px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search in chat..."
              value={messageSearchQuery}
              onChange={(e) => setMessageSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "var(--bg-primary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--sarva-radius-sm)",
                padding: "6px 32px 6px 12px",
                color: "var(--text-primary)",
                fontSize: "0.85rem",
                outline: "none",
                transition: "border-color 0.2s ease"
              }}
              autoFocus
              onFocus={(e) => { e.target.style.borderColor = "var(--border-accent)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--border)"; }}
            />
            {messageSearchQuery && (
              <button
                onClick={() => setMessageSearchQuery("")}
                style={{
                  position: "absolute",
                  right: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-secondary)",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <FiX style={{ fontSize: "0.8rem" }} />
              </button>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {currentSession && (
          <>
            <button
              className="chat-input-action-btn"
              onClick={onOpenShare}
              title="Share Chat"
            >
              <FiShare2 style={{ fontSize: "1.1rem" }} />
            </button>
            
            <div style={{ position: "relative" }}>
              <button
                className="chat-input-action-btn"
                onClick={() => setDownloadMenuOpen(!downloadMenuOpen)}
                title="Download / Export Chat"
                style={{ color: downloadMenuOpen ? "var(--accent)" : undefined }}
              >
                <FiDownload style={{ fontSize: "1.1rem" }} />
              </button>
              {downloadMenuOpen && (
                <div style={{
                  position: "absolute",
                  top: "100%",
                  right: 0,
                  marginTop: "6px",
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--sarva-radius-md)",
                  boxShadow: "var(--shadow-lg)",
                  zIndex: 100,
                  width: "170px",
                  padding: "4px",
                  display: "flex",
                  flexDirection: "column"
                }}>
                  {[
                    { label: "Export as PDF", handler: () => exportChatAsPDF() },
                    { label: "Export Markdown", handler: () => exportChatAsMarkdown(activeTitle) },
                    { label: "Export JSON", handler: () => exportChatAsJSON(activeTitle) },
                    { label: "Export Plain Text", handler: () => exportChatAsTXT(activeTitle) }
                  ].map(({ label, handler }) => (
                    <button
                      key={label}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-primary)",
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "var(--sarva-radius-sm)",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        transition: "background 0.15s ease"
                      }}
                      onClick={() => { handler(); setDownloadMenuOpen(false); }}
                      onMouseEnter={(e) => e.currentTarget.style.background = "var(--sarva-surface-hover)"}
                      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button
              className={`chat-input-action-btn ${searchOpen ? "active" : ""}`}
              onClick={toggleSearch}
              title="Search Messages"
            >
              {searchOpen ? <FiX style={{ fontSize: "1.1rem" }} /> : <FiSearch style={{ fontSize: "1.1rem" }} />}
            </button>
          </>
        )}
          
        {user && user.accountType === "organization" && (
          <button
            className="chat-input-action-btn"
            onClick={() => navigate("/org-dashboard")}
            title="Organization Dashboard"
            style={{ color: "var(--accent)" }}
          >
            <FiBriefcase style={{ fontSize: "1.1rem" }} />
          </button>
        )}

        <button
          className="chat-input-action-btn"
          onClick={onOpenSettings}
          title="Settings & Preferences"
        >
          <FiSettings style={{ fontSize: "1.1rem" }} />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;