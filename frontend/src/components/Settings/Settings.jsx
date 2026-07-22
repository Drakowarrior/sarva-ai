import { useState, useEffect } from "react";
import { FiX, FiMoon, FiSun, FiTrash2, FiDownload, FiGlobe, FiCpu, FiMessageSquare, FiBookmark, FiStar, FiFileText, FiLayers, FiBriefcase, FiFolder, FiUser, FiShield, FiPlus, FiCopy, FiCheckCircle, FiMail } from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useChat } from "../../context/ChatContext";
import { useSession } from "../../context/SessionContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

const MODELS = [
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout (17B) — Latest", desc: "Meta's newest architecture for high quality responses" },
  { id: "qwen/qwen3-32b", name: "Qwen 3 (32B) — High Capacity", desc: "Best for coding and reasoning tasks" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 (8B) — Fast", desc: "Ultra-fast response model" }
];

const LANGUAGES = ["English", "Spanish", "French", "German", "Hindi"];

function Settings({ isOpen, onClose }) {
  const { theme, toggleTheme } = useTheme();
  const { 
    selectedModel, 
    setSelectedModel, 
    selectedLanguage, 
    setSelectedLanguage, 
    messages,
    exportChatAsTXT,
    exportChatAsPDF
  } = useChat();
  const { sessions, currentSession, clearAllSessions } = useSession();
  const { user, checkAuthStatus } = useAuth();

  // Tabs State
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "preferences" | "orgProfile" | "directory"

  // Profile Edit States
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [designation, setDesignation] = useState(user?.designation || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [locationState, setLocationState] = useState(user?.location || "");
  const [timezone, setTimezone] = useState(user?.timezone || "UTC");
  const [avatar, setAvatar] = useState(user?.avatar || "/avatars/default.png");
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Sync profile details when user loads
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhoneNumber(user.phoneNumber || "");
      setDesignation(user.designation || "");
      setBio(user.bio || "");
      setLocationState(user.location || "");
      setTimezone(user.timezone || "UTC");
      setAvatar(user.avatar || "/avatars/default.png");
    }
  }, [user]);

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar("/avatars/default.png");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await api.put("/user/profile", {
        fullName,
        phoneNumber,
        designation,
        bio,
        location: locationState,
        timezone,
        avatar
      });
      if (res.data.success) {
        toast.success("Profile updated successfully!");
        if (checkAuthStatus) {
          await checkAuthStatus();
        }
      } else {
        toast.error(res.data.message || "Failed to update profile.");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Statistics State
  const [stats, setStats] = useState({
    total_sessions: 0,
    total_messages: 0,
    pinned_sessions: 0,
    favorite_sessions: 0
  });

  // Organization Workspace States
  const [orgData, setOrgData] = useState(null);
  const [membersList, setMembersList] = useState([]);
  const [searchMemberQuery, setSearchMemberQuery] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitationResult, setInvitationResult] = useState("");
  const [updatingOrg, setUpdatingOrg] = useState(false);

  // Editable settings local variables
  const [editingOrgName, setEditingOrgName] = useState("");
  const [editingOrgDesc, setEditingOrgDesc] = useState("");
  const [editingOrgIndustry, setEditingOrgIndustry] = useState("");
  const [editingOrgWebsite, setEditingOrgWebsite] = useState("");
  const [editingOrgLogo, setEditingOrgLogo] = useState("");

  const fetchStats = async () => {
    try {
      const res = await api.get("/user/stats");
      if (res.data.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error("Failed to fetch statistics:", error);
    }
  };

  const fetchOrgData = async () => {
    try {
      const res = await api.get("/organizations/my");
      if (res.data.success) {
        const o = res.data.organization;
        setOrgData(o);
        setEditingOrgName(o.organizationName || "");
        setEditingOrgDesc(o.description || "");
        setEditingOrgIndustry(o.industry || "");
        setEditingOrgWebsite(o.website || "");
        setEditingOrgLogo(o.logo || "");
      }
    } catch (err) {
      console.error("Failed to fetch organization data:", err);
    }
  };

  const fetchMembersList = async () => {
    try {
      const res = await api.get("/organizations/members");
      if (res.data.success) {
        setMembersList(res.data.members || []);
      }
    } catch (err) {
      console.error("Failed to fetch members list:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStats();
      if (user && user.accountType === "organization") {
        fetchOrgData();
        fetchMembersList();
      }
    }
  }, [isOpen, messages, sessions, user]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);


  if (!isOpen) return null;

  const activeSessionObj = sessions.find((s) => s.session_id === currentSession);
  const activeTitle = activeSessionObj?.title || "Active Chat";

  const handleClearAll = async () => {
    if (window.confirm("Are you absolutely sure you want to delete all chats? This action is irreversible.")) {
      await clearAllSessions();
      toast.success("All chat sessions deleted!");
      onClose();
    }
  };

  const exportJSON = () => {
    try {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "sarvaai_chats_export.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Chats exported as JSON!");
    } catch (error) {
      toast.error("Export failed.");
    }
  };

  const exportMarkdown = () => {
    if (!currentSession || !messages.length) {
      toast.error("No active conversation found or session is empty.");
      return;
    }
    try {
      let md = `# SARVA AI Session: ${activeTitle}\n\n`;
      messages.forEach((m) => {
        md += `## ${m.role === "user" ? "User" : "Assistant"} (${new Date(m.timestamp).toLocaleTimeString()})\n\n${m.message}\n\n`;
        if (m.files && m.files.length > 0) {
          md += `*Attached files:*\n`;
          m.files.forEach((f) => {
            md += `- [${f.filename}](${f.file_url})\n`;
          });
          md += `\n`;
        }
      });
      const dataStr = "data:text/markdown;charset=utf-8," + encodeURIComponent(md);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${activeTitle.replace(/\s+/g, "_")}_export.md`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Session exported as Markdown!");
    } catch (error) {
      toast.error("Export failed.");
    }
  };

  const handleUpdateRole = async (targetUserId, newRole) => {
    try {
      const res = await api.post(`/organizations/members/${targetUserId}/role`, { role: newRole });
      if (res.data.success) {
        toast.success("Role updated successfully!");
        fetchMembersList();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update role.");
    }
  };

  const handleRemoveMember = async (targetUserId) => {
    if (window.confirm("Are you sure you want to remove this member from the organization?")) {
      try {
        const res = await api.delete(`/organizations/members/${targetUserId}`);
        if (res.data.success) {
          toast.success("Member removed successfully!");
          fetchMembersList();
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to remove member.");
      }
    }
  };

  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    try {
      const res = await api.post("/organizations/invite", { email: inviteEmail.trim() });
      if (res.data.success) {
        toast.success("Invitation generated successfully!");
        setInvitationResult(res.data.inviteCode);
        setInviteEmail("");
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to invite member.");
    }
  };

  const handleSaveOrgSettings = async (e) => {
    e.preventDefault();
    setUpdatingOrg(true);
    try {
      const res = await api.put("/organizations/my", {
        organizationName: editingOrgName,
        description: editingOrgDesc,
        industry: editingOrgIndustry,
        website: editingOrgWebsite,
        logo: editingOrgLogo
      });
      if (res.data.success) {
        toast.success("Organization settings updated!");
        fetchOrgData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update organization.");
    } finally {
      setUpdatingOrg(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="modal-overlay" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          className="modal-content"
          style={{ maxWidth: "580px" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header" style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "stretch", paddingBottom: "10px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 className="modal-title">Preferences & Settings</h3>
              <button className="modal-close-btn" onClick={onClose}>
                <FiX />
              </button>
            </div>
            
            {/* Navigation Tabs */}
            <div style={{ display: "flex", gap: "12px", borderBottom: "1px solid var(--border)", marginTop: "10px", overflowX: "auto", paddingBottom: "2px" }}>
              <button
                type="button"
                onClick={() => { setActiveTab("profile"); setInvitationResult(""); }}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === "profile" ? "2px solid var(--accent)" : "2px solid transparent",
                  color: activeTab === "profile" ? "var(--accent)" : "var(--text-secondary)",
                  padding: "8px 4px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease"
                }}
              >
                My Profile
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab("preferences"); setInvitationResult(""); }}
                style={{
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === "preferences" ? "2px solid var(--accent)" : "2px solid transparent",
                  color: activeTab === "preferences" ? "var(--accent)" : "var(--text-secondary)",
                  padding: "8px 4px",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "all 0.2s ease"
                }}
              >
                Preferences
              </button>
              {user && user.accountType === "organization" && (
                <>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("orgProfile"); setInvitationResult(""); }}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: activeTab === "orgProfile" ? "2px solid var(--accent)" : "2px solid transparent",
                      color: activeTab === "orgProfile" ? "var(--accent)" : "var(--text-secondary)",
                      padding: "8px 4px",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Organization Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => { setActiveTab("directory"); setInvitationResult(""); }}
                    style={{
                      background: "transparent",
                      border: "none",
                      borderBottom: activeTab === "directory" ? "2px solid var(--accent)" : "2px solid transparent",
                      color: activeTab === "directory" ? "var(--accent)" : "var(--text-secondary)",
                      padding: "8px 4px",
                      fontWeight: "600",
                      fontSize: "0.85rem",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "all 0.2s ease"
                    }}
                  >
                    Member Directory
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="modal-body" style={{ maxHeight: "70vh", overflowY: "auto", padding: "16px 24px" }}>
            {activeTab === "profile" && (
              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Profile Picture Upload Section */}
                <div style={{ display: "flex", alignItems: "center", gap: "20px", background: "rgba(0,0,0,0.15)", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)" }}>
                  <div style={{ position: "relative" }}>
                    <img 
                      src={avatar} 
                      alt="Avatar" 
                      style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid var(--accent)" }} 
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>Profile Image</span>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <label style={{
                        background: "var(--accent)",
                        color: "white",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "0.75rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        display: "inline-block"
                      }}>
                        Upload Image
                        <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: "none" }} />
                      </label>
                      {avatar !== "/avatars/default.png" && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          style={{
                            background: "transparent",
                            border: "1px solid var(--border)",
                            color: "var(--danger)",
                            padding: "6px 12px",
                            borderRadius: "6px",
                            fontSize: "0.75rem",
                            fontWeight: "600",
                            cursor: "pointer"
                          }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Supports JPG, PNG, WEBP.</span>
                  </div>
                </div>

                {/* Profile Fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.75rem" }}>Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>

                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.75rem" }}>Email Address</label>
                    <input
                      type="email"
                      value={user?.email || ""}
                      disabled
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        background: "rgba(0,0,0,0.25)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text-secondary)",
                        outline: "none",
                        fontSize: "0.85rem",
                        cursor: "not-allowed"
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.75rem" }}>Phone Number</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 000-0000"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>

                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.75rem" }}>Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Intern, Manager"
                      value={designation}
                      onChange={(e) => setDesignation(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>
                </div>

                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.75rem" }}>Professional Bio</label>
                  <textarea
                    placeholder="Tell us about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "8px 10px",
                      background: "rgba(0,0,0,0.15)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      color: "var(--text-primary)",
                      outline: "none",
                      fontSize: "0.85rem",
                      resize: "none"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.75rem" }}>Location</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={locationState}
                      onChange={(e) => setLocationState(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.85rem"
                      }}
                    />
                  </div>

                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.75rem" }}>Time Zone</label>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 10px",
                        background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.85rem"
                      }}
                    >
                      <option value="UTC">UTC (GMT+0)</option>
                      <option value="EST">EST (GMT-5)</option>
                      <option value="CST">CST (GMT-6)</option>
                      <option value="PST">PST (GMT-8)</option>
                      <option value="IST">IST (GMT+5:30)</option>
                      <option value="BST">BST (GMT+1)</option>
                      <option value="AEST">AEST (GMT+10)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <div>
                    <strong>Organization Role:</strong> {user?.role || "Personal Account"}
                  </div>
                  <div>
                    <strong>Joined Workspace:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={updatingProfile}
                  style={{
                    background: "var(--accent)",
                    color: "white",
                    border: "none",
                    padding: "10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    marginTop: "8px"
                  }}
                >
                  {updatingProfile ? "Saving changes..." : "Save Profile Details"}
                </button>
              </form>
            )}

            {activeTab === "preferences" && (
              <>
                {/* User Statistics Grid */}
                <div className="settings-group">
                  <span className="settings-label">Session Statistics</span>
                  <div className="stats-grid">
                    <div className="stats-card">
                      <div className="stats-icon-wrapper sessions">
                        <FiMessageSquare />
                      </div>
                      <div className="stats-info">
                        <div className="stats-value">{stats.total_sessions}</div>
                        <div className="stats-label-text">Sessions</div>
                      </div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-icon-wrapper messages">
                        <FiFileText />
                      </div>
                      <div className="stats-info">
                        <div className="stats-value">{stats.total_messages}</div>
                        <div className="stats-label-text">Messages</div>
                      </div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-icon-wrapper pinned">
                        <FiBookmark />
                      </div>
                      <div className="stats-info">
                        <div className="stats-value">{stats.pinned_sessions}</div>
                        <div className="stats-label-text">Pinned</div>
                      </div>
                    </div>
                    <div className="stats-card">
                      <div className="stats-icon-wrapper favorites">
                        <FiStar />
                      </div>
                      <div className="stats-info">
                        <div className="stats-value">{stats.favorite_sessions}</div>
                        <div className="stats-label-text">Favorites</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Theme Toggle */}
                <div className="settings-group">
                  <span className="settings-label">App Theme</span>
                  <div className="settings-options-grid">
                    <button
                      className={`settings-option-card ${theme === "dark" ? "active" : ""}`}
                      onClick={() => theme === "light" && toggleTheme()}
                    >
                      <FiMoon style={{ marginRight: "8px", verticalAlign: "middle" }} /> Dark Mode
                    </button>
                    <button
                      className={`settings-option-card ${theme === "light" ? "active" : ""}`}
                      onClick={() => theme === "dark" && toggleTheme()}
                    >
                      <FiSun style={{ marginRight: "8px", verticalAlign: "middle" }} /> Light Mode
                    </button>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="settings-group">
                  <span className="settings-label">AI Completion Model</span>
                  <select
                    className="settings-select"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    {MODELS.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "4px" }}>
                    {MODELS.find((m) => m.id === selectedModel)?.desc}
                  </p>
                </div>

                {/* Language Selection */}
                <div className="settings-group">
                  <span className="settings-label">Target Chat Language</span>
                  <select
                    className="settings-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Operations */}
                <div className="settings-group">
                  <span className="settings-label">Transcript Exports</span>
                  <div className="settings-options-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <button className="settings-btn" onClick={exportMarkdown} disabled={!currentSession}>
                      <FiDownload /> Markdown
                    </button>
                    <button className="settings-btn" onClick={() => exportChatAsTXT(activeTitle)} disabled={!currentSession}>
                      <FiDownload /> Plain Text
                    </button>
                    <button className="settings-btn" onClick={exportChatAsPDF} disabled={!currentSession}>
                      <FiDownload /> Print PDF
                    </button>
                  </div>
                  <div className="settings-action-row" style={{ marginTop: "12px" }}>
                    <button className="settings-btn" onClick={exportJSON} style={{ flex: 1 }}>
                      <FiDownload /> Export All (JSON)
                    </button>
                    <button className="settings-btn danger" onClick={handleClearAll} style={{ flex: 1 }}>
                      <FiTrash2 /> Delete All Chats
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab === "orgProfile" && orgData && (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Org Stats Header */}
                <div style={{
                  background: "rgba(0, 0, 0, 0.15)",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px"
                }}>
                  <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "8px",
                    background: "var(--accent)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "1.2rem"
                  }}>
                    {orgData.organizationName ? orgData.organizationName[0].toUpperCase() : "O"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <h4 style={{ margin: 0, fontSize: "1rem", color: "var(--text-primary)" }}>{orgData.organizationName}</h4>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      Slug: {orgData.slug} | Total Members: {orgData.totalMembers}
                    </span>
                  </div>
                </div>

                {/* Invite Code Clipboard Card */}
                <div style={{
                  background: "rgba(16, 185, 129, 0.08)",
                  border: "1px solid rgba(16, 185, 129, 0.2)",
                  borderRadius: "12px",
                  padding: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <div>
                    <div style={{ color: "var(--success)", fontWeight: "600", fontSize: "0.85rem" }}>
                      Workspace Invite Code
                    </div>
                    <div style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "1px", marginTop: "4px" }}>
                      {orgData.inviteCode}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                      Share this code with teammates so they can register and join!
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(orgData.inviteCode);
                      toast.success("Invite code copied to clipboard!");
                    }}
                    style={{
                      background: "rgba(16, 185, 129, 0.15)",
                      border: "none",
                      color: "var(--success)",
                      cursor: "pointer",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      display: "flex",
                      alignItems: "center",
                      gap: "4px"
                    }}
                  >
                    <FiCopy /> Copy
                  </button>
                </div>

                {/* Edit Org Form (Head roles only) */}
                {user && user.role === "Head" ? (
                  <form onSubmit={handleSaveOrgSettings} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <h4 style={{ borderBottom: "1px solid var(--border)", paddingBottom: "6px", fontSize: "0.9rem", color: "var(--text-primary)" }}>
                      Edit Workspace Settings
                    </h4>
                    
                    <div className="settings-group">
                      <label className="settings-label" style={{ fontSize: "0.75rem" }}>Organization Name</label>
                      <input
                        type="text"
                        value={editingOrgName}
                        onChange={(e) => setEditingOrgName(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          background: "rgba(0,0,0,0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.85rem"
                        }}
                      />
                    </div>

                    <div className="settings-group">
                      <label className="settings-label" style={{ fontSize: "0.75rem" }}>Description</label>
                      <input
                        type="text"
                        value={editingOrgDesc}
                        onChange={(e) => setEditingOrgDesc(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          background: "rgba(0,0,0,0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.85rem"
                        }}
                      />
                    </div>

                    <div className="settings-group">
                      <label className="settings-label" style={{ fontSize: "0.75rem" }}>Industry</label>
                      <input
                        type="text"
                        value={editingOrgIndustry}
                        onChange={(e) => setEditingOrgIndustry(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          background: "rgba(0,0,0,0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.85rem"
                        }}
                      />
                    </div>

                    <div className="settings-group">
                      <label className="settings-label" style={{ fontSize: "0.75rem" }}>Website</label>
                      <input
                        type="text"
                        value={editingOrgWebsite}
                        onChange={(e) => setEditingOrgWebsite(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "8px 10px",
                          background: "rgba(0,0,0,0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.85rem"
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={updatingOrg}
                      style={{
                        background: "var(--accent)",
                        color: "white",
                        border: "none",
                        padding: "10px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        fontSize: "0.85rem",
                        marginTop: "4px"
                      }}
                    >
                      {updatingOrg ? "Saving Changes..." : "Save Workspace Profile"}
                    </button>
                  </form>
                ) : (
                  // Read only metadata for other roles
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <h4 style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--border)", paddingBottom: "4px" }}>Organization Metadata</h4>
                    <div><strong>Description:</strong> {orgData.description || "N/A"}</div>
                    <div><strong>Industry:</strong> {orgData.industry || "N/A"}</div>
                    <div><strong>Website:</strong> {orgData.website || "N/A"}</div>
                    <div><strong>Created By:</strong> {orgData.createdBy}</div>
                    <div><strong>Created Date:</strong> {new Date(orgData.createdDate).toLocaleDateString()}</div>
                    <div><strong>Status:</strong> {orgData.status}</div>
                    <div><strong>Departments:</strong> {orgData.departments?.join(", ") || "None"}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "directory" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                {/* Invite section for Head / HR roles */}
                {user && (user.role === "Head" || user.role === "HR") && (
                  <div style={{
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "14px"
                  }}>
                    <h4 style={{ margin: "0 0 10px 0", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                      Invite New Collaborator
                    </h4>
                    <form onSubmit={handleInviteMember} style={{ display: "flex", gap: "10px" }}>
                      <input
                        type="email"
                        placeholder="collaborator@company.com"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        required
                        style={{
                          flex: 1,
                          padding: "8px 10px",
                          background: "rgba(0,0,0,0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "6px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.85rem"
                        }}
                      />
                      <button
                        type="submit"
                        style={{
                          background: "var(--success)",
                          color: "white",
                          border: "none",
                          padding: "0 14px",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "600",
                          fontSize: "0.85rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <FiPlus /> Invite
                      </button>
                    </form>
                    
                    {invitationResult && (
                      <div style={{
                        background: "rgba(16, 185, 129, 0.12)",
                        border: "1px solid rgba(16, 185, 129, 0.2)",
                        borderRadius: "8px",
                        padding: "10px",
                        marginTop: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                      }}>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-primary)" }}>
                          Invite code generated: <strong style={{ color: "var(--success)", letterSpacing: "1px" }}>{invitationResult}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(invitationResult);
                            toast.success("Code copied!");
                          }}
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "var(--success)",
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            fontWeight: "600"
                          }}
                        >
                          Copy Code
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Directory List */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <h4 style={{ margin: 0, fontSize: "0.9rem", color: "var(--text-primary)" }}>Organization Members</h4>
                    <input
                      type="text"
                      placeholder="Search member..."
                      value={searchMemberQuery}
                      onChange={(e) => setSearchMemberQuery(e.target.value)}
                      style={{
                        padding: "6px 10px",
                        background: "rgba(0,0,0,0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "6px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.8rem",
                        maxWidth: "200px"
                      }}
                    />
                  </div>

                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginTop: "4px"
                  }}>
                    {membersList
                      .filter(m => (m.name || "").toLowerCase().includes(searchMemberQuery.toLowerCase()) || (m.email || "").toLowerCase().includes(searchMemberQuery.toLowerCase()))
                      .map((m) => {
                        const isSelf = m.userId === user?.user_id;
                        return (
                          <div
                            key={m.userId}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "10px 12px",
                              background: "rgba(255, 255, 255, 0.02)",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                              gap: "10px"
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "10px", overflow: "hidden", flex: 1 }}>
                              <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                background: m.role === "Head" ? "var(--success)" : "var(--accent)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: "bold",
                                fontSize: "0.8rem",
                                flexShrink: 0
                              }}>
                                {m.name ? m.name[0].toUpperCase() : "U"}
                              </div>
                              <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                                <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {m.name} {isSelf && <span style={{ color: "var(--accent)", fontSize: "0.75rem" }}>(You)</span>}
                                </span>
                                <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  📂 {m.department} | {m.email}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {/* Role selection for owner/Head */}
                              {user && user.role === "Head" && !isSelf ? (
                                <select
                                  value={m.role}
                                  onChange={(e) => handleUpdateRole(m.userId, e.target.value)}
                                  style={{
                                    padding: "4px 8px",
                                    background: "rgba(0,0,0,0.35)",
                                    border: "1px solid var(--border)",
                                    borderRadius: "4px",
                                    color: "var(--text-primary)",
                                    fontSize: "0.75rem",
                                    outline: "none"
                                  }}
                                >
                                  <option value="Head">Head</option>
                                  <option value="Team Lead">Team Lead</option>
                                  <option value="HR">HR</option>
                                  <option value="Executive">Executive</option>
                                  <option value="Intern">Intern</option>
                                  <option value="Student">Student</option>
                                  <option value="Manager">Manager</option>
                                  <option value="Director">Director</option>
                          <option value="CEO">CEO</option>
                          <option value="CTO">CTO</option>
                          <option value="CFO">CFO</option>
                          <option value="COO">COO</option>
                          <option value="CIO">CIO</option>
                          <option value="CMO">CMO</option>
                          <option value="CSO">CSO</option>
                          <option value="CPO">CPO</option>
                          <option value="CLO">CLO</option>
                          <option value="CRO">CRO</option>
                          <option value="CDO">CDO</option>
                          <option value="CAO">CAO</option>
                          <option value="CCO">CCO</option>
                                </select>
                              ) : (
                                <span style={{
                                  background: m.role === "Head" ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                                  color: m.role === "Head" ? "var(--success)" : "var(--text-primary)",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "0.7rem",
                                  fontWeight: "600"
                                }}>
                                  {m.role}
                                </span>
                              )}

                              {/* Remove member for owner/Head */}
                              {user && user.role === "Head" && !isSelf && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveMember(m.userId)}
                                  style={{
                                    background: "transparent",
                                    border: "none",
                                    color: "var(--text-secondary)",
                                    cursor: "pointer",
                                    padding: "4px",
                                    display: "flex",
                                    alignItems: "center"
                                  }}
                                  title="Remove Member"
                                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
                                >
                                  <FiTrash2 style={{ fontSize: "0.9rem" }} />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default Settings;
