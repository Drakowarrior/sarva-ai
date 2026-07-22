import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { FiRefreshCw, FiLogOut, FiClock, FiAlertTriangle, FiAlertOctagon, FiMessageSquare } from "react-icons/fi";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import { useSession } from "../../context/SessionContext";
import Loader from "../../components/Loader/Loader";

function PendingApproval() {
  const { isAuthenticated, user, checkingAuth, logout, checkAuthStatus } = useAuth();
  const { setIsFeedbackOpen } = useSession();
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  // Poll status every 30 seconds
  useEffect(() => {
    if (!isAuthenticated || (user && user.approvalStatus === "active")) return;
    
    const interval = setInterval(async () => {
      try {
        await checkAuthStatus();
      } catch (err) {
        console.error("Polled checkAuthStatus failed:", err);
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [isAuthenticated, user, checkAuthStatus]);

  if (checkingAuth) {
    return <Loader fullScreen={true} />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  // If approved or personal, redirect back to chat
  if (user && (user.accountType !== "organization" || user.approvalStatus === "active")) {
    return <Navigate to="/chat" replace />;
  }

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await checkAuthStatus();
      toast.success("Status checked successfully.");
    } catch (err) {
      toast.error("Failed to check status. Try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const status = user?.approvalStatus || "pending";

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      padding: "24px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background glow elements */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "15%",
        width: "50vw",
        height: "50vw",
        background: "radial-gradient(circle, rgba(14, 165, 233, 0.08) 0%, rgba(0,0,0,0) 70%)",
        pointerEvents: "none",
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, cubicBezier: [0.16, 1, 0.3, 1] }}
        className="glass-card"
        style={{
          width: "100%",
          maxWidth: "520px",
          padding: "40px",
          textAlign: "center",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-lg)",
          zIndex: 10,
          background: "var(--bg-card)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px"
        }}
      >
        {/* Brand Logo or Fallback */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          {user?.organizationLogo ? (
            <img 
              src={user.organizationLogo} 
              alt="Logo" 
              style={{ width: "40px", height: "40px", borderRadius: "10px", objectFit: "cover", border: "1px solid var(--border)" }} 
            />
          ) : (
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, var(--accent) 0%, #0284c7 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "750",
              fontSize: "1.1rem"
            }}>
              {user?.organizationName ? user.organizationName[0].toUpperCase() : "O"}
            </div>
          )}
          <span style={{ fontSize: "1.2rem", fontWeight: "750" }}>{user?.organizationName || "SARVA AI"}</span>
        </div>

        {/* Dynamic Status Display */}
        {status === "pending" && (
          <>
            <div style={{
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid rgba(245, 158, 11, 0.2)",
              color: "#f59e0b",
              padding: "10px 18px",
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <FiClock /> Pending Workspace Approval
            </div>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "750" }}>Awaiting Administrator Review</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Your account was created successfully, but access to your organization's workspace is currently pending approval.
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", fontStyle: "italic", marginTop: "8px" }}>
                Please contact your organization's <strong>HR</strong> or <strong>Head</strong> to approve your request. You will automatically gain access once approved.
              </p>
            </div>
          </>
        )}

        {status === "rejected" && (
          <>
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "var(--danger)",
              padding: "10px 18px",
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <FiAlertOctagon /> Join Request Rejected
            </div>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "750" }}>Access Denied</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Your request to join the organization's workspace was declined by the administrator.
              </p>
              {user?.rejectedReason && (
                <div style={{
                  background: "rgba(0, 0, 0, 0.15)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  marginTop: "8px",
                  textAlign: "left"
                }}>
                  <strong>Reason for rejection:</strong> "{user.rejectedReason}"
                </div>
              )}
            </div>
          </>
        )}

        {status === "suspended" && (
          <>
            <div style={{
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "var(--danger)",
              padding: "10px 18px",
              borderRadius: "20px",
              fontWeight: "700",
              fontSize: "0.85rem",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <FiAlertTriangle /> Account Suspended
            </div>
            <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "8px" }}>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "750" }}>Workspace Access Suspended</h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.5" }}>
                Your account access has been temporarily suspended by your organization's Head or HR.
              </p>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "4px" }}>
                Please reach out to your administrator to resolve this issue.
              </p>
            </div>
          </>
        )}

        {/* Teammate Application Info Card */}
        <div className="branding-stats-grid" style={{
          width: "100%",
          borderTop: "1px solid var(--border)",
          paddingTop: "20px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          textAlign: "left"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: "550" }}>Workspace:</span>
            <span style={{ fontWeight: "600" }}>{user?.organizationName}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: "550" }}>Requested Role:</span>
            <span style={{ fontWeight: "600" }}>{user?.role}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: "550" }}>Department:</span>
            <span style={{ fontWeight: "600" }}>📂 {user?.department}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
            <span style={{ color: "var(--text-secondary)", fontWeight: "550" }}>Registration Date:</span>
            <span style={{ fontWeight: "600" }}>
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          width: "100%",
          gap: "12px",
          marginTop: "16px",
          borderTop: "1px solid var(--border)",
          paddingTop: "24px"
        }}>
          {status === "pending" && (
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              style={{
                flex: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                borderRadius: "8px",
                background: "var(--accent)",
                color: "white",
                border: "none",
                fontWeight: "600",
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={(e) => e.target.style.background = "var(--accent-hover)"}
              onMouseLeave={(e) => e.target.style.background = "var(--accent)"}
            >
              <FiRefreshCw className={refreshing ? "spin" : ""} /> Refresh Status
            </button>
          )}
          <button
            onClick={() => setIsFeedbackOpen(true)}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.03)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              fontWeight: "600",
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.08)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.03)"}
          >
            <FiMessageSquare /> Give Feedback
          </button>
          <button
            onClick={handleLogout}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "12px",
              borderRadius: "8px",
              background: "rgba(255, 255, 255, 0.03)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              fontWeight: "600",
              fontSize: "0.88rem",
              cursor: "pointer",
              transition: "all 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.background = "rgba(255, 255, 255, 0.08)"}
            onMouseLeave={(e) => e.target.style.background = "rgba(255, 255, 255, 0.03)"}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default PendingApproval;
