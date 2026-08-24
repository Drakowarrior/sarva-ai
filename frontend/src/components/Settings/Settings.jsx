import { useState, useEffect, useRef } from "react";
import { 
  FiX, FiMoon, FiSun, FiMonitor, FiTrash2, FiDownload, FiGlobe, 
  FiCpu, FiMessageSquare, FiBookmark, FiStar, FiFileText, FiLayers, 
  FiBriefcase, FiUser, FiShield, FiPlus, FiCopy, FiCheckCircle, 
  FiMail, FiChevronDown, FiLock, FiSearch, FiCamera, FiCheck, FiAlertTriangle 
} from "react-icons/fi";
import { useTheme } from "../../context/ThemeContext";
import { useChat } from "../../context/ChatContext";
import { useSession } from "../../context/SessionContext";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import ImageWithFallback from "../Common/ImageWithFallback";
import "./Settings.css";

const MODELS = [
  { id: "meta-llama/llama-4-scout-17b-16e-instruct", name: "Llama 4 Scout (17B)", version: "Latest", desc: "Meta's newest architecture for high quality responses", status: "Available" },
  { id: "qwen/qwen3-32b", name: "Qwen 3 (32B)", version: "High Capacity", desc: "Best for complex coding, math, and reasoning tasks", status: "Available" },
  { id: "llama-3.1-8b-instant", name: "Llama 3.1 (8B)", version: "Instant", desc: "Ultra-fast response model optimized for speed", status: "Available" }
];

const LANGUAGES = [
  { name: "English", code: "en", flag: "" },
  { name: "Spanish", code: "es", flag: "" },
  { name: "French", code: "fr", flag: "" },
  { name: "German", code: "de", flag: "" },
  { name: "Hindi", code: "hi", flag: "" }
];

function getInitials(name) {
  if (!name) return "S";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getRoleCategory(role) {
  if (!role) return "entry";
  const r = role.toLowerCase();
  if (["head", "team lead", "hr", "director", "ceo", "cto", "cfo", "coo"].some(t => r.includes(t))) {
    return "leadership";
  }
  if (["executive", "manager", "architect", "senior"].some(t => r.includes(t))) {
    return "professional";
  }
  return "entry";
}

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

  // Active Navigation Tab State
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "preferences" | "orgProfile" | "directory"

  // Dropdown States
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

  // Profile Edit States
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || "");
  const [designation, setDesignation] = useState(user?.designation || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [locationState, setLocationState] = useState(user?.location || "");
  const [timezone, setTimezone] = useState(user?.timezone || "UTC");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [updatingProfile, setUpdatingProfile] = useState(false);

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
  const [roleFilter, setRoleFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("All");
  const [inviteEmail, setInviteEmail] = useState("");
  const [invitationResult, setInvitationResult] = useState("");
  const [updatingOrg, setUpdatingOrg] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Editable Organization Local State
  const [editingOrgName, setEditingOrgName] = useState("");
  const [editingOrgDesc, setEditingOrgDesc] = useState("");
  const [editingOrgIndustry, setEditingOrgIndustry] = useState("");
  const [editingOrgWebsite, setEditingOrgWebsite] = useState("");
  const [editingOrgLogo, setEditingOrgLogo] = useState("");
  const [confirmingClearAll, setConfirmingClearAll] = useState(false);

  // File Input Ref
  const fileInputRef = useRef(null);

  // Sync profile details when user updates
  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhoneNumber(user.phoneNumber || "");
      setDesignation(user.designation || "");
      setBio(user.bio || "");
      setLocationState(user.location || "");
      setTimezone(user.timezone || "UTC");
      setAvatar(user.avatar || "");
    }
  }, [user]);

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
      document.body.classList.add("modal-open");
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.classList.remove("modal-open");
    }
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeSessionObj = sessions.find((s) => s.session_id === currentSession);
  const activeTitle = activeSessionObj?.title || "Active Chat";

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        toast.success("Photo selected! Click 'Save Profile' to keep changes.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatar("");
    toast("Photo removed");
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
        toast.success("Profile details saved!");
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

  const handleClearAll = async () => {
    if (!confirmingClearAll) {
      setConfirmingClearAll(true);
      toast("Click 'Confirm Delete All' within 4s to erase history.");
      setTimeout(() => setConfirmingClearAll(false), 4000);
      return;
    }
    await clearAllSessions();
    toast.success("All chat sessions deleted!");
    setConfirmingClearAll(false);
    onClose();
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
        toast.success("Invitation generated!");
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

  // Filter Members
  const filteredMembers = membersList.filter((m) => {
    const matchesSearch = 
      (m.name || "").toLowerCase().includes(searchMemberQuery.toLowerCase()) || 
      (m.email || "").toLowerCase().includes(searchMemberQuery.toLowerCase());
    const matchesRole = roleFilter === "All" || m.role === roleFilter;
    const matchesDept = deptFilter === "All" || m.department === deptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const availableDepts = Array.from(new Set(membersList.map(m => m.department).filter(Boolean)));
  const currentModelObj = MODELS.find(m => m.id === selectedModel) || MODELS[0];

  return (
    <AnimatePresence>
      <div className="sarva-settings-center settings-center-backdrop" onClick={onClose}>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="settings-center-shell"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Settings Shell Header */}
          <div className="settings-center-header">
            <div className="settings-header-left">
              <div className="settings-brand-badge"><FiSettings /></div>
              <div className="settings-header-titles">
                <h2>Settings Center</h2>
                <p>Personalize your SARVA AI experience and manage your workspace.</p>
              </div>
            </div>
            <button className="settings-close-btn" onClick={onClose} aria-label="Close Settings Center" type="button">
              <FiX />
            </button>
          </div>

          {/* 2-Column Command Center Body */}
          <div className="settings-center-body">
            {/* Left Navigation Sidebar */}
            <div className="settings-nav-sidebar">
              <div className="settings-nav-group">
                <span className="settings-nav-label">Personal</span>
                
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`settings-nav-item ${activeTab === "profile" ? "active" : ""}`}
                >
                  <FiUser className="settings-nav-icon" />
                  <span>Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("preferences")}
                  className={`settings-nav-item ${activeTab === "preferences" ? "active" : ""}`}
                >
                  <FiCpu className="settings-nav-icon" />
                  <span>Preferences</span>
                </button>
              </div>

              {user && user.accountType === "organization" && (
                <div className="settings-nav-group">
                  <span className="settings-nav-label">Workspace</span>

                  <button
                    type="button"
                    onClick={() => setActiveTab("orgProfile")}
                    className={`settings-nav-item ${activeTab === "orgProfile" ? "active" : ""}`}
                  >
                    <FiBriefcase className="settings-nav-icon" />
                    <span>Organization</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab("directory")}
                    className={`settings-nav-item ${activeTab === "directory" ? "active" : ""}`}
                  >
                    <FiLayers className="settings-nav-icon" />
                    <span>Members</span>
                  </button>
                </div>
              )}
            </div>

            {/* Right Main Content Panel */}
            <div className="settings-content-panel">
              <div className="settings-content-inner">
                {/* TAB 1: PROFILE PAGE */}
                {activeTab === "profile" && (
                  <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="settings-section-header">
                      <h3>Your Profile</h3>
                      <p>Manage your identity and how teammates see you across SARVA AI.</p>
                    </div>

                    {/* Profile Hero Card */}
                    <div className="profile-hero-card">
                      <div className="profile-avatar-container" onClick={() => fileInputRef.current?.click()}>
                        <ImageWithFallback
                          src={avatar}
                          alt={fullName || user?.fullName}
                          fallbackText={getInitials(fullName || user?.fullName)}
                          className="profile-avatar-img"
                        />
                        <div className="profile-avatar-overlay">
                          <FiCamera />
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          style={{ display: "none" }}
                        />
                      </div>

                      <div className="profile-hero-info">
                        <h4 className="profile-hero-name">{fullName || user?.fullName || "SARVA Member"}</h4>
                        <div className="profile-hero-role-badge">
                          <span className={`role-pill ${getRoleCategory(user?.role)}`}>
                            {user?.role || "Member"}
                          </span>
                          <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                            {designation || "AI Collaborator"}
                          </span>
                        </div>
                        <div className="profile-actions-row">
                          <button
                            type="button"
                            className="btn-secondary-sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            Change photo
                          </button>
                          {avatar && (
                            <button
                              type="button"
                              className="btn-secondary-sm"
                              style={{ color: "var(--danger)" }}
                              onClick={handleRemoveAvatar}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Profile Fields (2-Column Grid) */}
                    <div className="settings-section-header">
                      <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: "700" }}>PROFILE INFORMATION</h4>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="settings-field-group">
                        <label className="settings-field-label">Full Name</label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="settings-field-input"
                          placeholder="Enter full name..."
                          required
                        />
                      </div>

                      <div className="settings-field-group">
                        <label className="settings-field-label">
                          <span>Email Address</span>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", fontWeight: "500" }}>Managed by account</span>
                        </label>
                        <input
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="settings-field-input"
                        />
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                      <div className="settings-field-group">
                        <label className="settings-field-label">Phone Number</label>
                        <input
                          type="text"
                          placeholder="+1 (555) 000-0000"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="settings-field-input"
                        />
                      </div>

                      <div className="settings-field-group">
                        <label className="settings-field-label">Designation</label>
                        <input
                          type="text"
                          placeholder="e.g. AI Researcher, Team Lead"
                          value={designation}
                          onChange={(e) => setDesignation(e.target.value)}
                          className="settings-field-input"
                        />
                      </div>
                    </div>

                    {/* Professional Bio */}
                    <div className="settings-field-group">
                      <label className="settings-field-label">
                        <span>Professional Bio</span>
                        <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>{bio.length} / 500</span>
                      </label>
                      <textarea
                        placeholder="Tell teammates a little about your background, role, or AI projects..."
                        value={bio}
                        onChange={(e) => setBio(e.target.value.slice(0, 500))}
                        rows={3}
                        className="settings-field-input"
                        style={{ resize: "none", height: "auto", minHeight: "100px", padding: "10px 14px" }}
                      />
                    </div>

                    {/* Workspace Membership Card */}
                    <div style={{ padding: "16px 20px", borderRadius: "14px", background: "rgba(0,0,0,0.12)", border: "1px solid var(--border)", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", fontSize: "0.8rem" }}>
                      <div>
                        <span style={{ color: "var(--text-tertiary)", display: "block", fontSize: "0.72rem" }}>ORGANIZATION</span>
                        <strong style={{ color: "var(--text-primary)" }}>{user?.organizationName || "Personal Account"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-tertiary)", display: "block", fontSize: "0.72rem" }}>ROLE</span>
                        <strong style={{ color: "var(--text-primary)" }}>{user?.role || "Member"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-tertiary)", display: "block", fontSize: "0.72rem" }}>JOINED</span>
                        <strong style={{ color: "var(--text-primary)" }}>{user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Jul 2026"}</strong>
                      </div>
                      <div>
                        <span style={{ color: "var(--text-tertiary)", display: "block", fontSize: "0.72rem" }}>DEPARTMENT</span>
                        <strong style={{ color: "var(--text-primary)" }}>{user?.department || "General"}</strong>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={updatingProfile}
                      className="btn-secondary-sm"
                      style={{ background: "var(--accent)", color: "#ffffff", border: "none", padding: "12px 24px", height: "auto", borderRadius: "12px", fontWeight: "750", fontSize: "0.88rem", width: "fit-content" }}
                    >
                      {updatingProfile ? "Saving Profile..." : "Save Profile Details"}
                    </button>
                  </form>
                )}

                {/* TAB 2: PREFERENCES PAGE */}
                {activeTab === "preferences" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="settings-section-header">
                      <h3>Preferences</h3>
                      <p>Control how SARVA AI looks, responds, and performs for you.</p>
                    </div>

                    {/* Activity Overview (4 Compact Mini Cards) */}
                    <div className="settings-field-group">
                      <label className="settings-field-label">ACTIVITY OVERVIEW</label>
                      <div className="activity-stats-grid">
                        <div className="stat-mini-card">
                          <div className="stat-mini-icon cyan"><FiMessageSquare /></div>
                          <div>
                            <div className="stat-mini-num">{stats.total_sessions}</div>
                            <div className="stat-mini-lbl">Sessions</div>
                          </div>
                        </div>
                        <div className="stat-mini-card">
                          <div className="stat-mini-icon purple"><FiFileText /></div>
                          <div>
                            <div className="stat-mini-num">{stats.total_messages}</div>
                            <div className="stat-mini-lbl">Messages</div>
                          </div>
                        </div>
                        <div className="stat-mini-card">
                          <div className="stat-mini-icon amber"><FiBookmark /></div>
                          <div>
                            <div className="stat-mini-num">{stats.pinned_sessions}</div>
                            <div className="stat-mini-lbl">Pinned</div>
                          </div>
                        </div>
                        <div className="stat-mini-card">
                          <div className="stat-mini-icon pink"><FiStar /></div>
                          <div>
                            <div className="stat-mini-num">{stats.favorite_sessions}</div>
                            <div className="stat-mini-lbl">Favorites</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Appearance Control (Segmented Switcher) */}
                    <div className="settings-field-group">
                      <label className="settings-field-label">APPEARANCE</label>
                      <div className="theme-segmented-control">
                        <button
                          type="button"
                          className={`theme-segment-btn ${theme === "light" ? "active" : ""}`}
                          onClick={() => theme !== "light" && toggleTheme()}
                        >
                          <FiSun /> Light
                        </button>
                        <button
                          type="button"
                          className={`theme-segment-btn ${theme === "dark" ? "active" : ""}`}
                          onClick={() => theme !== "dark" && toggleTheme()}
                        >
                          <FiMoon /> Dark
                        </button>
                      </div>
                    </div>

                    {/* AI Model Selector */}
                    <div className="settings-field-group">
                      <label className="settings-field-label">AI COMPLETION MODEL</label>
                      <div className="custom-model-card">
                        <div 
                          className="custom-select-trigger"
                          onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ color: "var(--accent)", display: "flex", alignItems: "center" }}><FiCpu /></span>
                            <span>{currentModelObj.name}</span>
                            <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "6px", background: "rgba(56,189,248,0.15)", color: "var(--accent)", fontWeight: "700" }}>
                              {currentModelObj.version}
                            </span>
                          </div>
                          <FiChevronDown style={{ transform: modelDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                        </div>

                        {modelDropdownOpen && (
                          <div className="custom-select-options">
                            {MODELS.map((m) => (
                              <div
                                key={m.id}
                                className={`custom-option-item ${m.id === selectedModel ? "selected" : ""}`}
                                onClick={() => {
                                  setSelectedModel(m.id);
                                  setModelDropdownOpen(false);
                                  toast.success(`Model switched to ${m.name}`);
                                }}
                              >
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "0.85rem", color: "var(--text-primary)" }}>
                                    {m.id === selectedModel && <FiCheck style={{ color: "var(--accent)" }} />}
                                    {m.name}
                                  </div>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{m.desc}</span>
                                </div>
                                <span style={{ fontSize: "0.68rem", color: "#10b981", fontWeight: "700", background: "rgba(16,185,129,0.12)", padding: "2px 8px", borderRadius: "6px" }}>
                                  ● {m.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Target Chat Language Selector */}
                    <div className="settings-field-group">
                      <label className="settings-field-label">RESPONSE LANGUAGE</label>
                      <div className="custom-select-trigger" onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <FiGlobe style={{ color: "var(--accent)" }} />
                          <span>{selectedLanguage}</span>
                        </div>
                        <FiChevronDown style={{ transform: languageDropdownOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                      </div>

                      {languageDropdownOpen && (
                        <div className="custom-select-options">
                          {LANGUAGES.map((l) => (
                            <div
                              key={l.code}
                              className={`custom-option-item ${l.name === selectedLanguage ? "selected" : ""}`}
                              onClick={() => {
                                setSelectedLanguage(l.name);
                                setLanguageDropdownOpen(false);
                                toast.success(`Language set to ${l.name}`);
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", fontWeight: "600", color: "var(--text-primary)" }}>
                                <span>{l.flag}</span>
                                <span>{l.name}</span>
                              </div>
                              {l.name === selectedLanguage && <FiCheck style={{ color: "var(--accent)" }} />}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Transcript Exports */}
                    <div className="settings-field-group">
                      <label className="settings-field-label">EXPORT CONVERSATIONS</label>
                      <div className="export-cards-grid">
                        <button className="export-card-btn" onClick={exportMarkdown} disabled={!currentSession}>
                          <FiDownload style={{ color: "var(--accent)" }} />
                          <span>↓ Markdown</span>
                        </button>
                        <button className="export-card-btn" onClick={() => exportChatAsTXT(activeTitle)} disabled={!currentSession}>
                          <FiDownload style={{ color: "var(--accent)" }} />
                          <span>↓ Plain Text</span>
                        </button>
                        <button className="export-card-btn" onClick={exportChatAsPDF} disabled={!currentSession}>
                          <FiDownload style={{ color: "var(--accent)" }} />
                          <span>↓ Print PDF</span>
                        </button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="settings-field-group" style={{ marginTop: "10px" }}>
                      <label className="settings-field-label" style={{ color: "var(--danger)" }}>DANGER ZONE</label>
                      <div className="danger-zone-box">
                        <div>
                          <h4 style={{ margin: 0, fontSize: "0.9rem", fontWeight: "750", color: "var(--danger)" }}>Delete Conversation History</h4>
                          <span style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>Permanently remove all saved conversations from backend storage.</span>
                        </div>
                        <button
                          type="button"
                          className="btn-danger"
                          onClick={handleClearAll}
                          style={{ background: confirmingClearAll ? "#dc2626" : undefined }}
                        >
                          {confirmingClearAll ? "Confirm Delete All?" : "Delete all chats"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: ORGANIZATION PROFILE */}
                {activeTab === "orgProfile" && orgData && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div className="settings-section-header">
                      <h3>Organization Workspace</h3>
                      <p>Your workspace identity, invitation parameters, and business metadata.</p>
                    </div>

                    {/* Org Hero Card */}
                    <div className="profile-hero-card">
                      <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "linear-gradient(135deg, #38BDF8 0%, #8B5CF6 100%)", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "800", fontSize: "1.6rem", flexShrink: 0 }}>
                        {orgData.organizationName ? orgData.organizationName[0].toUpperCase() : "O"}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: "750", color: "var(--text-primary)" }}>{orgData.organizationName}</h4>
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Enterprise AI Workspace · {orgData.industry || "Technology"}</span>
                        <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                          <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "6px", background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: "700" }}>
                            ● Active
                          </span>
                          <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "6px", background: "rgba(56,189,248,0.15)", color: "#38bdf8", fontWeight: "700" }}>
                            {orgData.totalMembers || membersList.length} members
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Invite Code Panel */}
                    <div style={{ padding: "18px", borderRadius: "16px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(56, 189, 248, 0.08) 100%)", border: "1px solid rgba(16, 185, 129, 0.25)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <span style={{ fontSize: "0.72rem", fontWeight: "750", color: "var(--success)", textTransform: "uppercase", letterSpacing: "0.5px" }}>WORKSPACE INVITE CODE</span>
                        <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "1.5px", marginTop: "2px" }}>
                          {orgData.inviteCode}
                        </div>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Anyone with this code can register & join according to workspace policies.</span>
                      </div>
                      <button
                        type="button"
                        className="btn-secondary-sm"
                        onClick={() => {
                          navigator.clipboard.writeText(orgData.inviteCode);
                          setCopiedInvite(true);
                          toast.success("Invite code copied!");
                          setTimeout(() => setCopiedInvite(false), 2500);
                        }}
                        style={{ background: "var(--success)", color: "#ffffff", border: "none" }}
                      >
                        {copiedInvite ? "✓ Copied" : "Copy Code"}
                      </button>
                    </div>

                    {/* Edit Org Settings (Head role only) */}
                    {user && user.role === "Head" ? (
                      <form onSubmit={handleSaveOrgSettings} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <label className="settings-field-label">ORGANIZATION DETAILS</label>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                          <div className="settings-field-group">
                            <label className="settings-field-label">Organization Name</label>
                            <input
                              type="text"
                              value={editingOrgName}
                              onChange={(e) => setEditingOrgName(e.target.value)}
                              className="settings-field-input"
                              required
                            />
                          </div>

                          <div className="settings-field-group">
                            <label className="settings-field-label">Industry</label>
                            <input
                              type="text"
                              value={editingOrgIndustry}
                              onChange={(e) => setEditingOrgIndustry(e.target.value)}
                              className="settings-field-input"
                            />
                          </div>
                        </div>

                        <div className="settings-field-group">
                          <label className="settings-field-label">Website URL</label>
                          <input
                            type="text"
                            value={editingOrgWebsite}
                            onChange={(e) => setEditingOrgWebsite(e.target.value)}
                            className="settings-field-input"
                          />
                        </div>

                        <div className="settings-field-group">
                          <label className="settings-field-label">Description</label>
                          <textarea
                            value={editingOrgDesc}
                            onChange={(e) => setEditingOrgDesc(e.target.value)}
                            rows={3}
                            className="settings-field-input"
                            style={{ resize: "none", height: "auto", minHeight: "80px", padding: "10px 14px" }}
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={updatingOrg}
                          className="btn-secondary-sm"
                          style={{ background: "var(--accent)", color: "#ffffff", border: "none", width: "fit-content", padding: "10px 18px", borderRadius: "10px" }}
                        >
                          {updatingOrg ? "Saving..." : "Save Workspace Details"}
                        </button>
                      </form>
                    ) : (
                      /* Read-Only Details Grid */
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                        <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(0,0,0,0.12)", border: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", display: "block" }}>DESCRIPTION</span>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "600" }}>{orgData.description || "Enterprise workspace"}</span>
                        </div>
                        <div style={{ padding: "14px", borderRadius: "12px", background: "rgba(0,0,0,0.12)", border: "1px solid var(--border)" }}>
                          <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)", display: "block" }}>INDUSTRY</span>
                          <span style={{ fontSize: "0.85rem", color: "var(--text-primary)", fontWeight: "600" }}>{orgData.industry || "Artificial Intelligence"}</span>
                        </div>
                      </div>
                    )}

                    {/* Departments Pills */}
                    <div className="settings-field-group">
                      <label className="settings-field-label">DEPARTMENTS</label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {(orgData.departments || ["Artificial Intelligence", "Software Development", "Human Resources", "Research"]).map((dept, idx) => (
                          <span key={idx} style={{ padding: "6px 14px", borderRadius: "10px", background: "rgba(255,255,255,0.05)", border: "1px solid var(--border)", fontSize: "0.8rem", fontWeight: "600", color: "var(--text-primary)" }}>
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: MEMBER DIRECTORY PAGE */}
                {activeTab === "directory" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div className="settings-section-header">
                      <h3>Member Directory</h3>
                      <p>{membersList.length} collaborators in your organization workspace.</p>
                    </div>

                    {/* Invite New Member Form (Head / HR roles) */}
                    {user && (user.role === "Head" || user.role === "HR") && (
                      <form onSubmit={handleInviteMember} style={{ display: "flex", gap: "10px", padding: "16px", borderRadius: "14px", background: "rgba(0,0,0,0.12)", border: "1px solid var(--border)" }}>
                        <input
                          type="email"
                          placeholder="Enter collaborator email..."
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          className="settings-field-input"
                          style={{ flex: 1 }}
                          required
                        />
                        <button
                          type="submit"
                          className="btn-secondary-sm"
                          style={{ background: "var(--accent)", color: "#ffffff", border: "none", padding: "0 18px", borderRadius: "10px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "700" }}
                        >
                          <FiPlus /> Invite
                        </button>
                      </form>
                    )}

                    {/* Search & Filter Toolbar */}
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <FiSearch style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-tertiary)" }} />
                        <input
                          type="text"
                          placeholder="Search members by name or email..."
                          value={searchMemberQuery}
                          onChange={(e) => setSearchMemberQuery(e.target.value)}
                          className="settings-field-input"
                          style={{ paddingLeft: "38px" }}
                        />
                      </div>

                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="settings-field-input"
                        style={{ width: "130px" }}
                      >
                        <option value="All">All Roles</option>
                        <option value="Head">Head</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="HR">HR</option>
                        <option value="Executive">Executive</option>
                        <option value="Intern">Intern</option>
                        <option value="Student">Student</option>
                      </select>
                    </div>

                    {/* Member Directory Cards Grid */}
                    <div className="member-cards-grid">
                      {filteredMembers.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "40px 20px", color: "var(--text-secondary)", borderRadius: "16px", border: "1px dashed var(--border)", background: "rgba(0,0,0,0.1)" }}>
                          <FiUser style={{ fontSize: "2rem", color: "var(--text-tertiary)", marginBottom: "8px" }} />
                          <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text-primary)" }}>No members found</h4>
                          <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem" }}>Try adjusting your search query or filter options.</p>
                        </div>
                      ) : (
                        filteredMembers.map((m) => {
                          const isSelf = m.userId === user?.user_id;
                          return (
                            <div key={m.userId} className="member-directory-card">
                              <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                                <ImageWithFallback
                                  src={m.avatar}
                                  alt={m.name}
                                  fallbackText={getInitials(m.name)}
                                  style={{ width: "42px", height: "42px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
                                />

                                <div style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                    <span style={{ fontSize: "0.9rem", fontWeight: "750", color: "var(--text-primary)" }}>{m.name}</span>
                                    {isSelf && <span style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: "700" }}>(You)</span>}
                                  </div>
                                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                                    {m.department || "General"} · {m.email}
                                  </span>
                                </div>
                              </div>

                              <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
                                {/* Role Selector or Badge */}
                                {user && user.role === "Head" && !isSelf ? (
                                  <select
                                    value={m.role}
                                    onChange={(e) => handleUpdateRole(m.userId, e.target.value)}
                                    className="settings-field-input"
                                    style={{ padding: "4px 8px", fontSize: "0.75rem", width: "110px", height: "32px" }}
                                  >
                                    <option value="Head">Head</option>
                                    <option value="Team Lead">Team Lead</option>
                                    <option value="HR">HR</option>
                                    <option value="Executive">Executive</option>
                                    <option value="Intern">Intern</option>
                                    <option value="Student">Student</option>
                                  </select>
                                ) : (
                                  <span className={`role-pill ${getRoleCategory(m.role)}`}>
                                    {m.role}
                                  </span>
                                )}

                                {user && user.role === "Head" && !isSelf && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMember(m.userId)}
                                    style={{ background: "transparent", border: "none", color: "var(--text-tertiary)", cursor: "pointer", padding: "6px" }}
                                    title="Remove Member"
                                  >
                                    <FiTrash2 style={{ fontSize: "0.95rem" }} />
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default Settings;
