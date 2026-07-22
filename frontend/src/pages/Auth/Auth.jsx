import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiUser, FiArrowLeft, FiLoader, FiKey, FiCheckCircle, FiLayers, FiBriefcase, FiFolder, FiShield, FiEye, FiEyeOff } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";

function Auth() {
  const [authMode, setAuthMode] = useState("login"); // "login" | "register" | "forgot" | "reset"
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [demoToken, setDemoToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Workspace Collaboration States
  const [accountType, setAccountType] = useState("personal"); // "personal" | "organization"
  const [orgFlow, setOrgFlow] = useState("create"); // "create" | "join"
  const [fullName, setFullName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [orgDescription, setOrgDescription] = useState("");
  const [orgIndustry, setOrgIndustry] = useState("");
  const [department, setDepartment] = useState("");
  const [role, setRole] = useState("Student");
  const [inviteCode, setInviteCode] = useState("");

  const { login, register, isAuthenticated, checkingAuth } = useAuth();
  const navigate = useNavigate();


  // Redirect if already logged in
  useEffect(() => {
    if (!checkingAuth && isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, checkingAuth, navigate]);

  // Auto sync role state based on orgFlow selection
  useEffect(() => {
    if (accountType === "organization") {
      if (orgFlow === "create") {
        setRole("Head");
      } else {
        setRole("Student");
      }
    }
  }, [accountType, orgFlow]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (authMode === "login") {
      if (!email.trim() || !password) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setError(res.error);
      }
    } else if (authMode === "register") {
      // Validate workspace fields
      if (accountType === "personal") {
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
          setError("All fields are required.");
          setLoading(false);
          return;
        }
      } else {
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword || !department.trim()) {
          setError("All fields are required.");
          setLoading(false);
          return;
        }
        if (orgFlow === "create" && !organizationName.trim()) {
          setError("Organization Name is required to create a workspace.");
          setLoading(false);
          return;
        }
        if (orgFlow === "join" && !inviteCode.trim()) {
          setError("Invite code is required to join a workspace.");
          setLoading(false);
          return;
        }
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        setLoading(false);
        return;
      }

      const payload = {
        fullName: fullName.trim(),
        username: fullName.trim().toLowerCase().replace(/\s+/g, "_"),
        email: email.trim(),
        password: password,
        accountType: accountType,
        orgFlow: accountType === "organization" ? orgFlow : undefined,
        organizationName: (accountType === "organization" && orgFlow === "create") ? organizationName.strip ? organizationName.strip() : organizationName.trim() : undefined,
        description: (accountType === "organization" && orgFlow === "create") ? orgDescription.trim() : undefined,
        industry: (accountType === "organization" && orgFlow === "create") ? orgIndustry.trim() : undefined,
        department: accountType === "organization" ? department.trim() : undefined,
        role: accountType === "organization" ? role : undefined,
        inviteCode: (accountType === "organization" && orgFlow === "join") ? inviteCode.trim() : undefined
      };

      const res = await register(payload);
      if (!res.success) {
        setError(res.error);
      }
    } else if (authMode === "forgot") {
      if (!email.trim()) {
        setError("Email address is required.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.post("/auth/forgot-password", { email });
        if (response.data.success) {
          toast.success("Security reset code generated successfully.");
          setDemoToken(response.data.demo_token || "");
        } else {
          setError(response.data.error || "Failed to generate security code.");
        }
      } catch (err) {
        setError(err.response?.data?.detail || "An error occurred while requesting reset.");
      }
    } else if (authMode === "reset") {
      if (!email.trim() || !resetToken || !newPassword || !confirmNewPassword) {
        setError("All fields are required.");
        setLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setError("Password must be at least 6 characters long.");
        setLoading(false);
        return;
      }
      if (newPassword !== confirmNewPassword) {
        setError("New passwords do not match.");
        setLoading(false);
        return;
      }
      try {
        const response = await api.post("/auth/reset-password", {
          email,
          token: resetToken,
          new_password: newPassword
        });
        if (response.data.success) {
          toast.success("Password reset successfully! Please sign in.");
          setAuthMode("login");
          setResetToken("");
          setNewPassword("");
          setConfirmNewPassword("");
          setDemoToken("");
        } else {
          setError(response.data.error || "Failed to reset password.");
        }
      } catch (err) {
        setError(err.response?.data?.detail || "An error occurred while resetting password.");
      }
    }
    setLoading(false);
  };

  if (checkingAuth) {
    return (
      <div style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-primary)"
      }}>
        <FiLoader className="spin" style={{ fontSize: "2rem", color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div style={{
      position: "relative",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      background: "var(--bg-primary)",
      overflowY: "auto",
      padding: "40px 24px"
    }}>
      {/* Background glow effects */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "15%",
        width: "50vw",
        height: "50vw",
        background: "radial-gradient(circle, rgba(56, 189, 248, 0.07) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />
      <div style={{
        position: "absolute",
        bottom: "10%",
        right: "15%",
        width: "40vw",
        height: "40vw",
        background: "radial-gradient(circle, rgba(244, 114, 182, 0.04) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <Link
        to="/"
        style={{
          position: "absolute",
          top: "24px",
          left: "24px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--text-secondary)",
          textDecoration: "none",
          fontSize: "0.9rem",
          zIndex: 10,
          transition: "color 0.2s ease"
        }}
        onMouseEnter={(e) => e.target.style.color = "var(--text-primary)"}
        onMouseLeave={(e) => e.target.style.color = "var(--text-secondary)"}
      >
        <FiArrowLeft /> Back to Home
      </Link>

      {/* Side-by-Side Flex Layout Grid */}
      <div className="auth-grid-container" style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "64px",
        width: "100%",
        maxWidth: "960px",
        margin: "auto 0",
        zIndex: 5,
        position: "relative"
      }}>
        {/* Waving 3D-feel Assistant Robot */}
        <div className="auth-character-column" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flex: 1,
          maxWidth: "380px"
        }}>
          {/* Animated Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, scale: 0.8, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 15 }}
              transition={{ duration: 0.4, cubicBezier: [0.16, 1, 0.3, 1] }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "20px",
                padding: "16px 20px",
                color: "var(--text-primary)",
                fontSize: "0.95rem",
                fontWeight: "500",
                maxWidth: "300px",
                boxShadow: "var(--shadow-md)",
                marginBottom: "24px",
                position: "relative",
                textAlign: "center"
              }}
            >
              {authMode === "login" && "Welcome back! Sign in to access your secure space. 👋"}
              {authMode === "register" && "Hey! Let's get you set up to start saving secure chats. 🚀"}
              {authMode === "forgot" && "Don't worry! Let's verify your identity and get you back in. 🔑"}
              {authMode === "reset" && "Almost there! Create a strong password you can remember. 🔒"}
              {/* Triangle bubble pointer */}
              <div style={{
                position: "absolute",
                bottom: "-8px",
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)",
                width: "16px",
                height: "16px",
                background: "var(--bg-card)",
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)"
              }} />
            </motion.div>
          </AnimatePresence>

          {/* Interactive SVG Waving Character */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            style={{ width: "320px", height: "320px" }}
          >
            <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="headGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Antenna */}
              <rect x="146" y="10" width="8" height="35" rx="4" fill="#38bdf8" />
              <motion.circle
                cx="150"
                cy="10"
                r="8"
                fill="#38bdf8"
                filter="url(#glow)"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              />

              {/* Neck */}
              <rect x="135" y="130" width="30" height="25" rx="5" fill="#475569" />

              {/* Body */}
              <rect x="90" y="150" width="120" height="110" rx="30" fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="2" />
              
              {/* Chest circular screen */}
              <rect x="110" y="170" width="80" height="70" rx="15" fill="#020617" stroke="rgba(255,255,255,0.05)" />
              <motion.circle
                cx="150"
                cy="205"
                r="20"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="3"
                strokeDasharray="6 4"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                style={{ transformOrigin: "150px 205px" }}
              />
              <circle cx="150" cy="205" r="8" fill="#ec4899" filter="url(#glow)" />

              {/* Head */}
              <rect x="70" y="40" width="160" height="100" rx="35" fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="2.5" />
              <rect x="82" y="52" width="136" height="76" rx="23" fill="#020617" />

              {/* Glowing blinking eyes */}
              <g>
                <motion.ellipse
                  cx="122"
                  cy="90"
                  rx="14"
                  ry="20"
                  fill="url(#eyeGrad)"
                  filter="url(#glow)"
                  animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", repeatDelay: 1 }}
                  style={{ transformOrigin: "122px 90px" }}
                />
                <motion.ellipse
                  cx="178"
                  cy="90"
                  rx="14"
                  ry="20"
                  fill="url(#eyeGrad)"
                  filter="url(#glow)"
                  animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", repeatDelay: 1 }}
                  style={{ transformOrigin: "178px 90px" }}
                />
              </g>

              {/* Left Arm */}
              <rect x="52" y="165" width="26" height="75" rx="13" fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="1.5" />
              <circle cx="65" cy="175" r="8" fill="#475569" />

              {/* Right Arm (Waving!) */}
              <motion.g
                animate={{ rotate: [0, -25, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                style={{ transformOrigin: "235px 175px" }}
              >
                <rect
                  x="222"
                  y="125"
                  width="26"
                  height="75"
                  rx="13"
                  fill="url(#bodyGrad)"
                  stroke="var(--border)"
                  strokeWidth="1.5"
                  style={{ transform: "rotate(-20deg)", transformOrigin: "235px 175px" }}
                />
                <circle cx="235" cy="175" r="8" fill="#475569" />
                <motion.circle
                  cx="246"
                  cy="115"
                  r="6"
                  fill="#38bdf8"
                  filter="url(#glow)"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                />
              </motion.g>

              {/* Base shadow */}
              <motion.ellipse
                cx="150"
                cy="282"
                rx="60"
                ry="8"
                fill="rgba(56, 189, 248, 0.15)"
                filter="url(#glow)"
                animate={{ rx: [50, 65, 50], opacity: [0.6, 0.9, 0.6] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Form Card Column */}
        <div className="auth-card-column" style={{
          flex: 1,
          maxWidth: "460px",
          width: "100%"
        }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass-card"
            style={{
              padding: "40px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              boxShadow: "var(--shadow-lg)"
            }}
          >
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <h2 style={{
                fontSize: "2rem",
                fontWeight: "800",
                marginBottom: "8px",
                background: "linear-gradient(135deg, var(--accent), #f472b6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}>
                {authMode === "login" && "Welcome Back"}
                {authMode === "register" && "Create Account"}
                {authMode === "forgot" && "Forgot Password"}
                {authMode === "reset" && "Reset Password"}
              </h2>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
                {authMode === "login" && "Sign in to access your secure chats"}
                {authMode === "register" && "Register to start private sessions"}
                {authMode === "forgot" && "Verify your email to reset credentials"}
                {authMode === "reset" && "Enter security code and new password"}
              </p>
            </div>

            {/* Switch Tabs / Back Action */}
            {(authMode === "login" || authMode === "register") ? (
              <div style={{
                display: "flex",
                background: "rgba(0, 0, 0, 0.2)",
                padding: "4px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                marginBottom: "24px"
              }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: "6px",
                    background: authMode === "login" ? "var(--accent)" : "transparent",
                    color: authMode === "login" ? "#ffffff" : "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("register"); setError(""); }}
                  style={{
                    flex: 1,
                    padding: "10px",
                    border: "none",
                    borderRadius: "6px",
                    background: authMode === "register" ? "var(--accent)" : "transparent",
                    color: authMode === "register" ? "#ffffff" : "var(--text-secondary)",
                    fontWeight: "600",
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div style={{ marginBottom: "24px" }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setError(""); setDemoToken(""); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "transparent",
                    border: "none",
                    color: "var(--text-secondary)",
                    fontSize: "0.85rem",
                    cursor: "pointer"
                  }}
                >
                  <FiArrowLeft /> Back to Sign In
                </button>
              </div>
            )}

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: "rgba(239, 68, 68, 0.1)",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                    color: "var(--danger)",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    fontSize: "0.85rem",
                    marginBottom: "16px",
                    textAlign: "left"
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Workspace Selection (Register only) */}
              {authMode === "register" && (
                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.8rem", marginBottom: "8px", display: "block" }}>Select Workspace Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "8px" }}>
                    <div 
                      onClick={() => setAccountType("personal")}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        background: accountType === "personal" ? "rgba(56, 189, 248, 0.12)" : "rgba(0, 0, 0, 0.15)",
                        border: accountType === "personal" ? "2px solid var(--accent)" : "1px solid var(--border)",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <FiUser style={{ fontSize: "1.3rem", color: accountType === "personal" ? "var(--accent)" : "var(--text-secondary)", marginBottom: "4px" }} />
                      <div style={{ fontWeight: "600", fontSize: "0.8rem", color: "var(--text-primary)" }}>Personal Workspace</div>
                    </div>
                    <div 
                      onClick={() => setAccountType("organization")}
                      style={{
                        padding: "12px",
                        borderRadius: "10px",
                        background: accountType === "organization" ? "rgba(56, 189, 248, 0.12)" : "rgba(0, 0, 0, 0.15)",
                        border: accountType === "organization" ? "2px solid var(--accent)" : "1px solid var(--border)",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <FiLayers style={{ fontSize: "1.3rem", color: accountType === "organization" ? "var(--accent)" : "var(--text-secondary)", marginBottom: "4px" }} />
                      <div style={{ fontWeight: "600", fontSize: "0.8rem", color: "var(--text-primary)" }}>Organization Workspace</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Workspace Options (Register + Org only) */}
              {authMode === "register" && accountType === "organization" && (
                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.8rem", marginBottom: "8px", display: "block" }}>Organization Mode</label>
                  <div style={{ display: "flex", background: "rgba(0, 0, 0, 0.15)", padding: "4px", borderRadius: "8px", border: "1px solid var(--border)", marginBottom: "8px" }}>
                    <button
                      type="button"
                      onClick={() => { setOrgFlow("create"); setRole("Head"); }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        border: "none",
                        borderRadius: "6px",
                        background: orgFlow === "create" ? "var(--accent)" : "transparent",
                        color: orgFlow === "create" ? "#ffffff" : "var(--text-secondary)",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Create Organization
                    </button>
                    <button
                      type="button"
                      onClick={() => { setOrgFlow("join"); setRole("Student"); }}
                      style={{
                        flex: 1,
                        padding: "8px",
                        border: "none",
                        borderRadius: "6px",
                        background: orgFlow === "join" ? "var(--accent)" : "transparent",
                        color: orgFlow === "join" ? "#ffffff" : "var(--text-secondary)",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      }}
                    >
                      Join Organization
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name Field (Register only) */}
              {authMode === "register" && (
                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.8rem" }}>Full Name</label>
                  <div style={{ position: "relative" }}>
                    <FiUser style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-secondary)"
                    }} />
                    <input
                      type="text"
                      placeholder="Karan Garg"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        background: "rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Create Org Fields */}
              {authMode === "register" && accountType === "organization" && orgFlow === "create" && (
                <>
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.8rem" }}>Organization Name</label>
                    <div style={{ position: "relative" }}>
                      <FiBriefcase style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)"
                      }} />
                      <input
                        type="text"
                        placeholder="e.g. IGT Solutions"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 36px",
                          background: "rgba(0, 0, 0, 0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.9rem"
                        }}
                      />
                    </div>
                  </div>

                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.8rem" }}>Organization Description (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Enterprise AI Services"
                      value={orgDescription}
                      onChange={(e) => setOrgDescription(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>

                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.8rem" }}>Industry (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Technology"
                      value={orgIndustry}
                      onChange={(e) => setOrgIndustry(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        background: "rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                </>
              )}

              {/* Join Org Invite Code Field */}
              {authMode === "register" && accountType === "organization" && orgFlow === "join" && (
                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.8rem" }}>Invitation / Invite Code</label>
                  <div style={{ position: "relative" }}>
                    <FiShield style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-secondary)"
                    }} />
                    <input
                      type="text"
                      placeholder="e.g. INV-ABCDEF"
                      value={inviteCode}
                      onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        background: "rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.9rem",
                        letterSpacing: "1px"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Department & Role Fields (Org Register only) */}
              {authMode === "register" && accountType === "organization" && (
                <>
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.8rem" }}>Department</label>
                    <div style={{ position: "relative" }}>
                      <FiFolder style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)"
                      }} />
                      <input
                        type="text"
                        placeholder="e.g. Artificial Intelligence"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 36px",
                          background: "rgba(0, 0, 0, 0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.9rem"
                        }}
                      />
                    </div>
                  </div>

                  {orgFlow === "create" ? (
                    <div style={{
                      background: "rgba(14, 165, 233, 0.1)",
                      border: "1px solid rgba(14, 165, 233, 0.2)",
                      borderRadius: "8px",
                      padding: "12px 14px",
                      fontSize: "0.85rem",
                      color: "var(--text-primary)",
                      marginBottom: "16px",
                      lineHeight: "1.4"
                    }}>
                      ℹ️ <strong>Head & Organization Owner</strong> will be automatically assigned to your account. This role has full administrative control over the organization.
                    </div>
                  ) : (
                    <div className="settings-group" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <label className="settings-label" style={{ fontSize: "0.8rem" }}>Your Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px",
                          background: "rgba(0, 0, 0, 0.45)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.9rem"
                        }}
                      >
                        <option value="HR">HR</option>
                        <option value="Team Lead">Team Lead</option>
                        <option value="Executive">Executive</option>
                        <option value="Intern">Intern</option>
                        <option value="Student">Student</option>
                      </select>
                      <div style={{
                        background: "rgba(245, 158, 11, 0.08)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        borderRadius: "8px",
                        padding: "12px 14px",
                        fontSize: "0.85rem",
                        color: "var(--text-secondary)",
                        lineHeight: "1.4"
                      }}>
                        ℹ️ Your account will remain pending until it is approved by your organization's Head or HR. You will not be able to access the organization workspace until approval is granted.
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Email (Always show, except Reset screen) */}
              {authMode !== "reset" && (
                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.8rem" }}>Email Address</label>
                  <div style={{ position: "relative" }}>
                    <FiMail style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-secondary)"
                    }} />
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        background: "rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.9rem"
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Password (Login / Register only) */}
              {(authMode === "login" || authMode === "register") && (
                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.8rem" }}>Password</label>
                  <div style={{ position: "relative" }}>
                    <FiLock style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-secondary)"
                    }} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 40px 10px 36px",
                        background: "rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.9rem"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0
                      }}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                  {authMode === "login" && (
                    <div style={{ textAlign: "right", marginTop: "8px" }}>
                      <button
                        type="button"
                        onClick={() => { setAuthMode("forgot"); setError(""); }}
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "var(--accent)",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          textDecoration: "underline",
                          padding: 0
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Confirm Password (Register only) */}
              {authMode === "register" && (
                <div className="settings-group">
                  <label className="settings-label" style={{ fontSize: "0.8rem" }}>Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <FiLock style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--text-secondary)"
                    }} />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "10px 40px 10px 36px",
                        background: "rgba(0, 0, 0, 0.15)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--text-primary)",
                        outline: "none",
                        fontSize: "0.9rem"
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: "none",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: 0
                      }}
                    >
                      {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
              )}

              {/* Demo security token alert box (Forgot screen only) */}
              {authMode === "forgot" && demoToken && (
                <div style={{
                  background: "rgba(168, 85, 247, 0.08)",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                  borderRadius: "12px",
                  padding: "14px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--accent)", fontWeight: "600", fontSize: "0.85rem" }}>
                    <FiCheckCircle /> Demo Security Code Generated
                  </div>
                  <div style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "2px" }}>
                    {demoToken}
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    Copy this code to proceed. In production, this would be sent to your email.
                  </span>
                  <button
                    type="button"
                    onClick={() => setAuthMode("reset")}
                    style={{
                      background: "var(--accent)",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "6px 12px",
                      fontSize: "0.8rem",
                      fontWeight: "600",
                      cursor: "pointer",
                      marginTop: "4px"
                    }}
                  >
                    Proceed to Reset
                  </button>
                </div>
              )}

              {/* Reset Screen Fields */}
              {authMode === "reset" && (
                <>
                  {/* Security Reset Code */}
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.8rem" }}>Security Code</label>
                    <div style={{ position: "relative" }}>
                      <FiKey style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)"
                      }} />
                      <input
                        type="text"
                        placeholder="ENTER CODE"
                        value={resetToken}
                        onChange={(e) => setResetToken(e.target.value.toUpperCase())}
                        required
                        maxLength={6}
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 36px",
                          background: "rgba(0, 0, 0, 0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.9rem",
                          letterSpacing: "1px"
                        }}
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.8rem" }}>New Password</label>
                    <div style={{ position: "relative" }}>
                      <FiLock style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)"
                      }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 36px",
                          background: "rgba(0, 0, 0, 0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.9rem"
                        }}
                      />
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="settings-group">
                    <label className="settings-label" style={{ fontSize: "0.8rem" }}>Confirm New Password</label>
                    <div style={{ position: "relative" }}>
                      <FiLock style={{
                        position: "absolute",
                        left: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "var(--text-secondary)"
                      }} />
                      <input
                        type="password"
                        placeholder="••••••••"
                        value={confirmNewPassword}
                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                        required
                        style={{
                          width: "100%",
                          padding: "10px 12px 10px 36px",
                          background: "rgba(0, 0, 0, 0.15)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          color: "var(--text-primary)",
                          outline: "none",
                          fontSize: "0.9rem"
                        }}
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || (authMode === "forgot" && demoToken)}
                className="new-chat-btn"
                style={{
                  marginTop: "12px",
                  padding: "12px",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "0.9rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  cursor: (loading || (authMode === "forgot" && demoToken)) ? "not-allowed" : "pointer"
                }}
              >
                {loading ? (
                  <>
                    <FiLoader className="spin" />
                    {authMode === "login" && "Signing In..."}
                    {authMode === "register" && "Signing Up..."}
                    {authMode === "forgot" && "Generating Code..."}
                    {authMode === "reset" && "Updating Password..."}
                  </>
                ) : (
                  <>
                    {authMode === "login" && "Sign In"}
                    {authMode === "register" && "Sign Up"}
                    {authMode === "forgot" && "Request Security Code"}
                    {authMode === "reset" && "Update Password"}
                  </>
                )}
              </button>
            </form>

            <div style={{
              textAlign: "center",
              marginTop: "24px",
              fontSize: "0.85rem",
              color: "var(--text-secondary)"
            }}>
              🛡️ Secure authentication powered by end-to-end token encryption.
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
