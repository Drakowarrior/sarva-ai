import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiPlus, FiSearch, FiMessageSquare, FiEdit3, FiTrash, 
  FiCheck, FiX, FiSettings, FiBookmark, FiStar, FiChevronRight, FiShare2, FiCopy
} from "react-icons/fi";
import { useSession } from "../../context/SessionContext";
import { useAuth } from "../../context/AuthContext";
import { FiLogOut, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";

// Helper function to format relative timestamps cleanly
const formatRelativeTime = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

function Sidebar({ isOpen, onClose, onOpenSettings, onOpenShare }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const {
    sessions = [],
    currentSession,
    selectSession,
    createSession,
    deleteSession,
    renameSession,
    togglePinSession,
    toggleFavoriteSession,
    triggerFeedback,
    duplicateSession
  } = useSession();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent"); // 'recent', 'title', 'pinned'
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [renameText, setRenameText] = useState("");

  // Context Menu State
  const [contextMenu, setContextMenu] = useState(null);
  const contextMenuRef = useRef(null);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target)) {
        setContextMenu(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleCreateChat = async () => {
    try {
      const session = await createSession();
      toast.success("New chat created!");
      if (window.innerWidth < 768) {
        onClose();
      }
    } catch (e) {
      toast.error("Failed to create chat");
    }
  };

  const handleSelectSession = (id) => {
    selectSession(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  const startEditing = (session) => {
    setEditingSessionId(session.session_id);
    setRenameText(session.title);
    setContextMenu(null); // Close context menu
  };

  const saveRename = async (e, id) => {
    if (e) e.stopPropagation();
    if (!renameText.trim()) return;
    try {
      await renameSession(id, renameText);
      setEditingSessionId(null);
      toast.success("Chat renamed!");
    } catch (err) {
      toast.error("Rename failed");
    }
  };

  const cancelRename = (e) => {
    if (e) e.stopPropagation();
    setEditingSessionId(null);
  };

  const handleDelete = async (id) => {
    setContextMenu(null);
    if (window.confirm("Delete this chat session?")) {
      try {
        await deleteSession(id);
        toast.success("Chat deleted!");
      } catch (err) {
        toast.error("Failed to delete chat");
      }
    }
  };

  const handleContextMenu = (e, session) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      session: session
    });
  };

  // Filter and sort sessions dynamically
  const sortedSessions = [...sessions]
    .filter((session) =>
      (session.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "title") {
        return (a.title || "").localeCompare(b.title || "");
      }
      if (sortBy === "pinned") {
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
      }
      return new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at);
    });


  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img 
          src="/logo.jpg" 
          alt="SARVA AI Logo" 
          style={{ 
            width: "32px", 
            height: "32px", 
            borderRadius: "8px", 
            border: "1px solid var(--border)",
            boxShadow: "0 2px 8px rgba(14, 165, 233, 0.1)"
          }} 
        />
        <span className="sidebar-logo">SARVA AI</span>
        <button
          className="sidebar-footer-btn"
          style={{ display: window.innerWidth < 768 ? "flex" : "none", marginLeft: "auto" }}
          onClick={onClose}
        >
          <FiX style={{ fontSize: "1.2rem" }} />
        </button>
      </div>

      <div style={{ padding: "16px 20px 0 20px" }}>
        <button className="new-chat-btn" onClick={handleCreateChat}>
          <FiPlus /> New Chat
        </button>
      </div>

      <div className="sidebar-search">
        <div className="search-input-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)"
              }}
            >
              <FiX style={{ fontSize: "0.8rem" }} />
            </button>
          )}
        </div>
      </div>

      <div className="sidebar-sorting" style={{ padding: "0 20px 10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: "500" }}>Sort by</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--accent)",
            fontSize: "0.75rem",
            fontWeight: "600",
            cursor: "pointer",
            outline: "none"
          }}
        >
          <option value="recent" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Recent</option>
          <option value="title" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Name</option>
          <option value="pinned" style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}>Pinned First</option>
        </select>
      </div>

      {/* Sessions list */}
      <div className="sidebar-sessions">
        {sortedSessions.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "20px" }}>
            {searchQuery ? "No matches found" : "No sessions yet"}
          </p>
        ) : (
          sortedSessions.map((session) => {
            const isActive = session.session_id === currentSession;
            const isEditing = session.session_id === editingSessionId;

            return (
              <div
                key={session.session_id}
                className={`session-item ${isActive ? "active" : ""}`}
                onClick={() => !isEditing && handleSelectSession(session.session_id)}
                onContextMenu={(e) => handleContextMenu(e, session)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  gap: "4px",
                  padding: "10px 12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                  <div className="session-title-wrapper" style={{ flex: 1, marginRight: "8px" }}>
                    <FiMessageSquare style={{ flexShrink: 0, fontSize: "0.95rem" }} />
                    {isEditing ? (
                      <input
                        type="text"
                        className="session-rename-input"
                        value={renameText}
                        onChange={(e) => setRenameText(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveRename(e, session.session_id);
                          if (e.key === "Escape") cancelRename(e);
                        }}
                        autoFocus
                      />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px", overflow: "hidden" }}>
                        <span className="session-title" style={{ fontWeight: isActive ? "600" : "400" }}>{session.title}</span>
                        {session.isShared && (
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "2px" }}>
                            <span style={{
                              fontSize: "0.65rem",
                              background: "rgba(168, 85, 247, 0.15)",
                              color: "#c084fc",
                              border: "1px solid rgba(168, 85, 247, 0.3)",
                              padding: "1px 4px",
                              borderRadius: "4px",
                              fontWeight: "600",
                              alignSelf: "flex-start",
                              display: "inline-block"
                            }}>
                              🟣 Shared Copy
                            </span>
                            {session.sharedBy && (
                              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", fontStyle: "italic" }}>
                                Shared by {session.sharedBy}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Badges and actions indicator */}
                  {!isEditing && (
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                      {session.pinned && <FiBookmark style={{ fontSize: "0.8rem", color: "var(--accent)" }} title="Pinned" />}
                      {session.favorite && <FiStar style={{ fontSize: "0.8rem", color: "#f59e0b" }} title="Favorite" />}
                      <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                        {formatRelativeTime(session.updated_at)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Last Message Preview & Relative time */}
                {!isEditing && (
                  <div style={{
                    fontSize: "0.75rem",
                    color: "var(--text-secondary)",
                    paddingLeft: "26px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}>
                    {session.last_message || "No messages yet"}
                  </div>
                )}

                {/* Rename actions row */}
                {isEditing && (
                  <div className="session-actions" style={{ opacity: 1, paddingLeft: "26px" }}>
                    <button
                      className="session-action-btn"
                      onClick={(e) => saveRename(e, session.session_id)}
                      title="Save"
                    >
                      <FiCheck style={{ fontSize: "0.8rem", color: "var(--success)" }} />
                    </button>
                    <button
                      className="session-action-btn"
                      onClick={cancelRename}
                      title="Cancel"
                    >
                      <FiX style={{ fontSize: "0.8rem", color: "var(--danger)" }} />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Floating Context Menu */}
      {contextMenu && (
        <div
          ref={contextMenuRef}
          style={{
            position: "fixed",
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
            zIndex: 1000,
            width: "160px",
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            padding: "4px"
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="session-item"
            style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
            onClick={() => {
              togglePinSession(contextMenu.session.session_id, contextMenu.session.pinned);
              setContextMenu(null);
            }}
          >
            <FiBookmark style={{ fontSize: "0.9rem", color: contextMenu.session.pinned ? "var(--accent)" : "inherit" }} />
            {contextMenu.session.pinned ? "Unpin Session" : "Pin Session"}
          </button>
          <button
            className="session-item"
            style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
            onClick={() => {
              toggleFavoriteSession(contextMenu.session.session_id, contextMenu.session.favorite);
              setContextMenu(null);
            }}
          >
            <FiStar style={{ fontSize: "0.9rem", color: contextMenu.session.favorite ? "#f59e0b" : "inherit" }} />
            {contextMenu.session.favorite ? "Unfavorite" : "Favorite Session"}
          </button>
          <button
            className="session-item"
            style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
            onClick={() => startEditing(contextMenu.session)}
          >
            <FiEdit3 style={{ fontSize: "0.9rem" }} />
            Rename Session
          </button>
          <button
            className="session-item"
            style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
            onClick={() => {
              onOpenShare(contextMenu.session.session_id);
              setContextMenu(null);
            }}
          >
            <FiShare2 style={{ fontSize: "0.9rem" }} />
            Share Chat
          </button>
          <button
            className="session-item"
            style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
            onClick={() => {
              duplicateSession(contextMenu.session.session_id);
              setContextMenu(null);
            }}
          >
            <FiCopy style={{ fontSize: "0.9rem" }} />
            Duplicate Chat
          </button>
          <div style={{ height: "1px", background: "var(--border)", margin: "4px 0" }} />
          <button
            className="session-item delete"
            style={{ width: "100%", textAlign: "left", padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem", color: "var(--danger)" }}
            onClick={() => handleDelete(contextMenu.session.session_id)}
          >
            <FiTrash style={{ fontSize: "0.9rem" }} />
            Delete Session
          </button>
        </div>
      )}

      <div className="sidebar-footer" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch" }}>
        {user && (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(0,0,0,0.15)",
            padding: "8px 12px",
            borderRadius: "8px",
            border: "1px solid var(--border)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", overflow: "hidden", flex: 1 }}>
              <div style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                background: "var(--accent)",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "0.8rem",
                flexShrink: 0
              }}>
                {user.username ? user.username[0].toUpperCase() : "U"}
              </div>
              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.username}
                </span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                triggerFeedback(() => {
                  if (window.confirm("Are you sure you want to sign out?")) {
                    logout();
                  }
                });
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center"
              }}
              title="Sign Out"
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              <FiLogOut style={{ fontSize: "1rem" }} />
            </button>
          </div>
        )}
        {user && user.accountType === "organization" && (
          <button 
            className="new-chat-btn" 
            onClick={() => navigate("/org-dashboard")}
            style={{ 
              background: "rgba(56, 189, 248, 0.1)", 
              border: "1px solid rgba(56, 189, 248, 0.2)",
              color: "var(--accent)",
              marginBottom: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px"
            }}
          >
            🏢 Org Dashboard
          </button>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
            <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              SARVA AI Client v1.1
            </span>
            <button className="sidebar-footer-btn" onClick={onOpenSettings} title="Settings">
              <FiSettings style={{ fontSize: "1.2rem" }} />
            </button>
          </div>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", opacity: 0.8, textAlign: "left" }}>
            Made by Karan Garg (Intern at IGT Solutions)
          </span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;