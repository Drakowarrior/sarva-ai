import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { 
  FiMail, FiLock, FiUser, FiArrowLeft, FiLoader, FiKey, 
  FiCheck, FiCheckCircle, FiLayers, FiBriefcase, FiShield, 
  FiEye, FiEyeOff, FiMoon, FiSun, FiZap, FiArrowRight 
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../services/api";
import toast from "react-hot-toast";
import "./Auth.css";

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
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Robot Mascot Interaction States
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [confetti, setConfetti] = useState([]);

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
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Mouse Parallax Eye Tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2);
      setMousePos({ x: x * 7, y: y * 7 });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Random Robot Blinking Interval (4-7s)
  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 4800);
    return () => clearInterval(interval);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    if (!checkingAuth && isAuthenticated) {
      navigate("/chat");
    }
  }, [isAuthenticated, checkingAuth, navigate]);

  // Auto sync role state based on orgFlow selection
  useEffect(() => {
    if (accountType === "organization") {
      setRole(orgFlow === "create" ? "Head" : "Student");
    }
  }, [accountType, orgFlow]);

  // Trigger Confetti Micro-burst
  const triggerConfetti = () => {
    const colors = ["#38bdf8", "#8b5cf6", "#ec4899", "#10b981", "#f59e0b"];
    const particles = Array.from({ length: 36 }).map((_, i) => ({
      id: i,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      tx: (Math.random() - 0.5) * 600,
      ty: (Math.random() - 0.5) * 600 - 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 1100);
  };

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
        setLoading(false);
      } else {
        setSubmitSuccess(true);
        triggerConfetti();
      }
    } else if (authMode === "register") {
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
        organizationName: (accountType === "organization" && orgFlow === "create") ? organizationName.trim() : undefined,
        description: (accountType === "organization" && orgFlow === "create") ? orgDescription.trim() : undefined,
        industry: (accountType === "organization" && orgFlow === "create") ? orgIndustry.trim() : undefined,
        department: accountType === "organization" ? department.trim() : undefined,
        role: accountType === "organization" ? role : undefined,
        inviteCode: (accountType === "organization" && orgFlow === "join") ? inviteCode.trim() : undefined
      };

      const res = await register(payload);
      if (!res.success) {
        setError(res.error);
        setLoading(false);
      } else {
        setSubmitSuccess(true);
        triggerConfetti();
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
      setLoading(false);
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
      setLoading(false);
    }
  };

  const isEmailValid = email.includes("@") && email.includes(".");

  if (checkingAuth) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
        <FiLoader className="spin" style={{ fontSize: "2.4rem", color: "var(--accent)" }} />
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      {/* Grain texture overlay */}
      <div className="auth-noise-overlay" />

      {/* Animated Drifting Background Gradient Mesh Blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      <div className="auth-blob auth-blob-3" />

      {/* Confetti Micro-Burst Overlay */}
      {confetti.length > 0 && (
        <div className="auth-confetti-container">
          {confetti.map((p) => (
            <div
              key={p.id}
              className="confetti-particle"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                backgroundColor: p.color,
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`
              }}
            />
          ))}
        </div>
      )}

      {/* Top Bar Navigation Actions */}
      <header className="auth-top-nav">
        <Link to="/" className="auth-back-btn">
          <FiArrowLeft /> Back to Home
        </Link>

        <button 
          onClick={toggleTheme} 
          className="auth-theme-toggle"
          aria-label="Toggle Theme Mode"
          title="Toggle Theme Mode"
        >
          {theme === "light" ? <FiMoon /> : <FiSun />}
        </button>
      </header>

      {/* Main Side-by-Side Content */}
      <main className="auth-main-container">
        {/* Robot Mascot Column */}
        <div className="auth-mascot-column">
          {/* Speech Bubble */}
          <AnimatePresence mode="wait">
            <motion.div
              key={authMode}
              initial={{ opacity: 0, scale: 0.7, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.7, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              className="auth-speech-bubble"
            >
              {authMode === "login" && "Let's get you back in 👋"}
              {authMode === "register" && "Let me help you setup your space! 🚀"}
              {authMode === "forgot" && "No worries! Let's verify your identity 🔑"}
              {authMode === "reset" && "Almost done! Create your new password 🔒"}
              <div className="auth-speech-tail" />
            </motion.div>
          </AnimatePresence>

          {/* Interactive SVG Robot Mascot with Cursor Eye Tracking */}
          <motion.div
            animate={{ y: [0, -8, 0], scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
            style={{ width: "300px", height: "300px" }}
          >
            <svg width="100%" height="100%" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
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

              {/* Pulsing Antenna */}
              <rect x="146" y="10" width="8" height="35" rx="4" fill="#38bdf8" />
              <motion.circle
                cx="150"
                cy="10"
                r="8"
                fill="#38bdf8"
                filter="url(#glow)"
                animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              />

              {/* Neck */}
              <rect x="135" y="130" width="30" height="25" rx="5" fill="#475569" />

              {/* Body */}
              <rect x="90" y="150" width="120" height="110" rx="30" fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="2" />
              
              {/* Chest orb */}
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
              <motion.circle
                cx="150"
                cy="205"
                r="8"
                fill="#ec4899"
                filter="url(#glow)"
                animate={{ scale: [0.85, 1.15, 0.85] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />

              {/* Head */}
              <rect x="70" y="40" width="160" height="100" rx="35" fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="2.5" />
              <rect x="82" y="52" width="136" height="76" rx="23" fill="#020617" />

              {/* Cursor Tracking Eyes with Blinking Animation */}
              <g style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}>
                <motion.ellipse
                  cx="122"
                  cy="90"
                  rx="14"
                  ry={submitSuccess ? "4" : isBlinking ? "2" : "20"}
                  fill="url(#eyeGrad)"
                  filter="url(#glow)"
                  transition={{ duration: 0.15 }}
                  style={{ transformOrigin: "122px 90px" }}
                />
                <motion.ellipse
                  cx="178"
                  cy="90"
                  rx="14"
                  ry={submitSuccess ? "4" : isBlinking ? "2" : "20"}
                  fill="url(#eyeGrad)"
                  filter="url(#glow)"
                  transition={{ duration: 0.15 }}
                  style={{ transformOrigin: "178px 90px" }}
                />
              </g>

              {/* Left Arm */}
              <rect x="52" y="165" width="26" height="75" rx="13" fill="url(#bodyGrad)" stroke="var(--border)" strokeWidth="1.5" />

              {/* Right Arm (Waving on success or idle wave) */}
              <motion.g
                animate={submitSuccess ? { rotate: [-10, -45, -10] } : { rotate: [0, -20, 0] }}
                transition={submitSuccess ? { repeat: 4, duration: 0.4 } : { repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
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
              </motion.g>

              {/* Base shadow */}
              <motion.ellipse
                cx="150"
                cy="282"
                rx="60"
                ry="8"
                fill="rgba(56, 189, 248, 0.15)"
                filter="url(#glow)"
                animate={{ rx: [50, 65, 50], opacity: [0.5, 0.85, 0.5] }}
                transition={{ repeat: Infinity, duration: 3.2, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </div>

        {/* Glassmorphism Auth Card Column */}
        <div className="auth-card-column">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="auth-glass-card"
          >
            {/* Header */}
            <div>
              <h2 className="auth-gradient-title">
                {authMode === "login" && "Welcome Back"}
                {authMode === "register" && "Create Account"}
                {authMode === "forgot" && "Forgot Password"}
                {authMode === "reset" && "Reset Password"}
              </h2>
              <p className="auth-subtitle">
                {authMode === "login" && "Sign in to access your secure AI sessions"}
                {authMode === "register" && "Register to unlock unlimited features"}
                {authMode === "forgot" && "Verify your email to reset credentials"}
                {authMode === "reset" && "Enter security code and new password"}
              </p>
            </div>

            {/* Sliding Pill Tab Switcher */}
            {(authMode === "login" || authMode === "register") ? (
              <div className={`auth-tab-switcher ${authMode === "register" ? "register-mode" : ""}`}>
                <div className="auth-pill-indicator" />
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setError(""); }}
                  className={`auth-tab-btn ${authMode === "login" ? "active" : ""}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("register"); setError(""); }}
                  className={`auth-tab-btn ${authMode === "register" ? "active" : ""}`}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div style={{ margin: "20px 0 10px" }}>
                <button
                  type="button"
                  onClick={() => { setAuthMode("login"); setError(""); setDemoToken(""); }}
                  className="auth-back-btn"
                  style={{ background: "transparent" }}
                >
                  <FiArrowLeft /> Return to Sign In
                </button>
              </div>
            )}

            {/* Error Feedback */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "var(--danger)",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    fontSize: "0.86rem",
                    marginBottom: "16px",
                    textAlign: "left"
                  }}
                >
                  ⚠️ {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* Workspace Selection (Register Mode) */}
              {authMode === "register" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-secondary)", display: "block", marginBottom: "8px" }}>
                    WORKSPACE TYPE
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div 
                      onClick={() => setAccountType("personal")}
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        background: accountType === "personal" ? "rgba(56, 189, 248, 0.14)" : "rgba(0,0,0,0.15)",
                        border: accountType === "personal" ? "2px solid #38bdf8" : "1px solid var(--border)",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <FiUser style={{ color: accountType === "personal" ? "#38bdf8" : "var(--text-secondary)" }} />
                      <div style={{ fontWeight: "600", fontSize: "0.8rem", color: "var(--text-primary)", marginTop: "2px" }}>Personal</div>
                    </div>
                    <div 
                      onClick={() => setAccountType("organization")}
                      style={{
                        padding: "10px",
                        borderRadius: "12px",
                        background: accountType === "organization" ? "rgba(56, 189, 248, 0.14)" : "rgba(0,0,0,0.15)",
                        border: accountType === "organization" ? "2px solid #38bdf8" : "1px solid var(--border)",
                        cursor: "pointer",
                        textAlign: "center"
                      }}
                    >
                      <FiLayers style={{ color: accountType === "organization" ? "#38bdf8" : "var(--text-secondary)" }} />
                      <div style={{ fontWeight: "600", fontSize: "0.8rem", color: "var(--text-primary)", marginTop: "2px" }}>Organization</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Organization Mode Selection */}
              {authMode === "register" && accountType === "organization" && (
                <div style={{ marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      onClick={() => setOrgFlow("create")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: orgFlow === "create" ? "var(--accent)" : "transparent",
                        color: orgFlow === "create" ? "#fff" : "var(--text-secondary)",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      Create Org
                    </button>
                    <button
                      type="button"
                      onClick={() => setOrgFlow("join")}
                      style={{
                        flex: 1,
                        padding: "8px",
                        borderRadius: "8px",
                        border: "1px solid var(--border)",
                        background: orgFlow === "join" ? "var(--accent)" : "transparent",
                        color: orgFlow === "join" ? "#fff" : "var(--text-secondary)",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        cursor: "pointer"
                      }}
                    >
                      Join Org
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name (Register only) */}
              {authMode === "register" && (
                <div className="auth-input-group">
                  <input
                    type="text"
                    id="fullName"
                    className="auth-input-field"
                    placeholder=" "
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                  <label htmlFor="fullName" className="auth-floating-label">Full Name</label>
                  <FiUser className="auth-field-icon" />
                </div>
              )}

              {/* Create Org Fields */}
              {authMode === "register" && accountType === "organization" && orgFlow === "create" && (
                <>
                  <div className="auth-input-group">
                    <input
                      type="text"
                      id="orgName"
                      className="auth-input-field"
                      placeholder=" "
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      required
                    />
                    <label htmlFor="orgName" className="auth-floating-label">Organization Name</label>
                    <FiBriefcase className="auth-field-icon" />
                  </div>
                </>
              )}

              {/* Join Org Invite Code */}
              {authMode === "register" && accountType === "organization" && orgFlow === "join" && (
                <div className="auth-input-group">
                  <input
                    type="text"
                    id="inviteCode"
                    className="auth-input-field"
                    placeholder=" "
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                    required
                  />
                  <label htmlFor="inviteCode" className="auth-floating-label">Invitation Code</label>
                  <FiShield className="auth-field-icon" />
                </div>
              )}

              {/* Department (Register Org) */}
              {authMode === "register" && accountType === "organization" && (
                <div className="auth-input-group">
                  <input
                    type="text"
                    id="department"
                    className="auth-input-field"
                    placeholder=" "
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                  />
                  <label htmlFor="department" className="auth-floating-label">Department Name</label>
                  <FiBriefcase className="auth-field-icon" />
                </div>
              )}

              {/* Email Address */}
              <div className={`auth-input-group ${error && !email ? "shake" : ""}`}>
                <input
                  type="email"
                  id="email"
                  className="auth-input-field"
                  placeholder=" "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="email" className="auth-floating-label">Email Address</label>
                <FiMail className="auth-field-icon" />
                {isEmailValid && <FiCheck className="auth-valid-check" />}
              </div>

              {/* Password Field (Login & Register) */}
              {(authMode === "login" || authMode === "register") && (
                <div className={`auth-input-group ${error && !password ? "shake" : ""}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="auth-input-field"
                    placeholder=" "
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="password" className="auth-floating-label">Password</label>
                  <FiLock className="auth-field-icon" />
                  <button
                    type="button"
                    className="auth-right-icon-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex="-1"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              )}

              {/* Confirm Password (Register) */}
              {authMode === "register" && (
                <div className="auth-input-group">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    className="auth-input-field"
                    placeholder=" "
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="confirmPassword" className="auth-floating-label">Confirm Password</label>
                  <FiLock className="auth-field-icon" />
                  <button
                    type="button"
                    className="auth-right-icon-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              )}

              {/* Reset Password Token & Passwords */}
              {authMode === "reset" && (
                <>
                  <div className="auth-input-group">
                    <input
                      type="text"
                      id="resetToken"
                      className="auth-input-field"
                      placeholder=" "
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      required
                    />
                    <label htmlFor="resetToken" className="auth-floating-label">Security Reset Code</label>
                    <FiKey className="auth-field-icon" />
                  </div>

                  <div className="auth-input-group">
                    <input
                      type="password"
                      id="newPassword"
                      className="auth-input-field"
                      placeholder=" "
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <label htmlFor="newPassword" className="auth-floating-label">New Password</label>
                    <FiLock className="auth-field-icon" />
                  </div>
                </>
              )}

              {/* Forgot password link */}
              {authMode === "login" && (
                <div style={{ textAlign: "right", marginTop: "-8px", marginBottom: "16px" }}>
                  <button
                    type="button"
                    onClick={() => { setAuthMode("forgot"); setError(""); }}
                    style={{ background: "transparent", border: "none", color: "#38bdf8", fontSize: "0.82rem", cursor: "pointer", fontWeight: "600" }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Submit CTA Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                className="auth-submit-btn"
              >
                {loading ? (
                  <FiLoader className="spin" style={{ fontSize: "1.2rem" }} />
                ) : submitSuccess ? (
                  <><FiCheckCircle /> Success!</>
                ) : (
                  <>
                    {authMode === "login" && "Sign In"}
                    {authMode === "register" && "Create Account"}
                    {authMode === "forgot" && "Send Reset Code"}
                    {authMode === "reset" && "Update Password"}
                    <FiArrowRight />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default Auth;
