import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiBriefcase, FiFolder, FiUser, FiShield, FiPlus, FiCopy, FiCheckCircle, 
  FiMail, FiX, FiSearch, FiEdit3, FiTrash2, FiActivity, FiLayers, 
  FiChevronRight, FiGrid, FiSend, FiLoader, FiSliders, FiArrowLeft, FiClock, FiCheck, FiInfo, FiBookOpen, FiShare2, FiMenu
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { useAuth } from "../../context/AuthContext";
import * as orgService from "../../services/orgService";
import api from "../../services/api";
import "./OrgDashboard.css";

const ROLE_BADGE_COLORS = {
  "Head": "role-badge-head",
  "HR": "role-badge-hr",
  "Team Lead": "role-badge-lead",
  "Executive": "role-badge-exec",
  "Intern": "role-badge-intern",
  "Student": "role-badge-student"
};

const ROLE_PERMISSIONS = {
  "Head": ["Full Administrative Control", "Edit Org Info & Logo", "Invite & Remove Members", "Change Roles", "Create/Delete Departments", "Archive/Restore Members", "View Analytics & Activity Logs", "Delete Chats & Manage Settings", "Transfer Ownership"],
  "HR": ["Edit Org Info", "Invite New Members", "Remove Members (except Head)", "Approve Pending Invitations", "Change Roles (except Head)", "Update Member Department", "Archive/Restore Members", "View Activity Logs", "Manage Shared Chats"],
  "Team Lead": ["View Organization Members", "Create Org Chats & Manage Team Chats", "Share Chats", "Rename Chats", "Delete Own Chats", "View Department Members", "Invite Members (if Head enables)"],
  "Executive": ["Create & Share Chats", "Receive Shared Chats", "View Organization Members", "Edit Personal Profile"],
  "Intern": ["Create & Share Chats", "Receive Shared Chats", "View Organization Members"],
  "Student": ["Create & Share Chats", "Receive Shared Chats", "Standard User Access"]
};

function OrgDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Loading States
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Responsive Sidebar States
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState("overview"); // overview, members, departments, roles, invitations, chats, logs, settings

  // Org Data & Analytics
  const [orgData, setOrgData] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [sharedChats, setSharedChats] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  // Pending Approvals States
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [selectedApprovalIds, setSelectedApprovalIds] = useState([]);
  const [approvalSearchInput, setApprovalSearchInput] = useState("");
  const [approvalDeptFilter, setApprovalDeptFilter] = useState("all");
  const [approvalRoleFilter, setApprovalRoleFilter] = useState("all");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectionModalFor, setShowRejectionModalFor] = useState(null); // target userId, or "bulk"

  // Org Banner & Favicon
  const [orgBanner, setOrgBanner] = useState("");
  const [orgFavicon, setOrgFavicon] = useState("");

  // Search & Filtering (Members) with Debounce
  const [searchInput, setSearchInput] = useState("");
  const [memberSearch, setMemberSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name"); // name, joined, role

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Bulk Actions
  const [selectedMemberIds, setSelectedMemberIds] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [bulkRole, setBulkRole] = useState("Student");

  // Create Department
  const [newDeptName, setNewDeptName] = useState("");
  const [expandedDept, setExpandedDept] = useState(null);

  // Bulk Invites
  const [inviteEmails, setInviteEmails] = useState("");
  const [inviteRole, setInviteRole] = useState("Student");
  const [inviteDept, setInviteDept] = useState("General");
  const [inviteResults, setInviteResults] = useState([]);

  // Modals
  const [editMember, setEditMember] = useState(null); // holds member object to edit
  const [renameDept, setRenameDept] = useState(null); // holds department name to rename
  const [showTransferModal, setShowTransferModal] = useState(false);

  // Redesign Menu & Drawer States
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [transferTargetId, setTransferTargetId] = useState("");

  // Edit Organization settings
  const [orgName, setOrgName] = useState("");
  const [orgDesc, setOrgDesc] = useState("");
  const [orgIndustry, setOrgIndustry] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [orgLogo, setOrgLogo] = useState("");
  const [orgBrandingColor, setOrgBrandingColor] = useState("#0ea5e9");
  const [orgDefaultRole, setOrgDefaultRole] = useState("Student");
  const [allowLeadInvite, setAllowLeadInvite] = useState(false);
  const [showAllDepts, setShowAllDepts] = useState(true);
  const [allowExtSharing, setAllowExtSharing] = useState(false);

  // Redirection checks on mount
  useEffect(() => {
    if (user && user.accountType !== "organization") {
      toast.error("Access denied. Organization workspace required.");
      navigate("/chat");
    }
  }, [user, navigate]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setMemberSearch(searchInput);
      setCurrentPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Handle Keyboard Event listener for modals (Escape key closure)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setEditMember(null);
        setRenameDept(null);
        setShowTransferModal(false);
        setShowRejectionModalFor(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Load all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const orgRes = await orgService.getMyOrg();
      if (orgRes.success) {
        const o = orgRes.organization;
        setOrgData(o);
        setAnalytics(orgRes.analytics);
        
        // Populate settings fields
        setOrgName(o.organizationName || "");
        setOrgDesc(o.description || "");
        setOrgIndustry(o.industry || "");
        setOrgWebsite(o.website || "");
        setOrgLogo(o.logo || "");
        setOrgBanner(o.banner || "");
        setOrgFavicon(o.favicon || "");
        
        const settings = o.settings || {};
        setOrgBrandingColor(settings.branding?.primaryColor || "#0ea5e9");
        setOrgDefaultRole(settings.generalSettings?.defaultRole || "Student");
        setAllowLeadInvite(settings.invitationRules?.allowTeamLeadInvite || false);
        setShowAllDepts(settings.memberVisibility?.showAllDepartments || true);
        setAllowExtSharing(settings.chatSharingPolicies?.allowExternalSharing || false);
      }

      const membersRes = await orgService.getMembers();
      if (membersRes.success) {
        setMembers(membersRes.members || []);
      }

      if (user && (user.role === "Head" || user.role === "HR")) {
        const inviteRes = await orgService.getInvitations();
        if (inviteRes.success) {
          setInvitations(inviteRes.invitations || []);
        }

        const logsRes = await orgService.getActivityLogs();
        if (logsRes.success) {
          setActivityLogs(logsRes.logs || []);
        }

        const pendingRes = await orgService.getPendingApprovals();
        if (pendingRes.success) {
          setPendingApprovals(pendingRes.pendingUsers || []);
        }
      }

      const chatsRes = await orgService.getSharedChats();
      if (chatsRes.success) {
        setSharedChats(chatsRes.chats || []);
      }
    } catch (err) {
      console.error("Dashboard Load Error:", err);
      toast.error(err.response?.data?.detail || "Failed to load organization data.");
      navigate("/chat");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.accountType === "organization") {
      loadDashboardData();
    }
  }, [user, activeTab]);

  // Helper actions
  const handleSaveSettings = async (e) => {
    if (e) e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        organizationName: orgName,
        description: orgDesc,
        industry: orgIndustry,
        website: orgWebsite,
        logo: orgLogo,
        banner: orgBanner,
        favicon: orgFavicon,
        settings: {
          branding: { primaryColor: orgBrandingColor, theme: "dark" },
          generalSettings: { defaultRole: orgDefaultRole },
          invitationRules: { allowTeamLeadInvite: allowLeadInvite },
          memberVisibility: { showAllDepartments: showAllDepts },
          chatSharingPolicies: { allowExternalSharing: allowExtSharing }
        }
      };

      const res = await orgService.updateOrg(payload);
      if (res.success) {
        toast.success("Organization profile and settings updated successfully!");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to save settings.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveUser = async (targetUserId) => {
    try {
      const res = await orgService.approveMember(targetUserId);
      if (res.success) {
        toast.success("Member request approved!");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to approve member request.");
    }
  };

  const handleRejectUser = async (targetUserId) => {
    try {
      const res = await orgService.rejectMember(targetUserId, rejectionReason);
      if (res.success) {
        toast.success("Member request rejected.");
        setShowRejectionModalFor(null);
        setRejectionReason("");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to reject member request.");
    }
  };

  const handleBulkApprovalAction = async (action) => {
    if (selectedApprovalIds.length === 0) {
      toast.error("Please select at least one request.");
      return;
    }
    if (action === "reject" && !rejectionReason.trim()) {
      toast.error("Please enter a reason for rejection.");
      return;
    }
    try {
      const res = await orgService.bulkApproveRejectMembers(selectedApprovalIds, action, rejectionReason);
      if (res.success) {
        toast.success(`Bulk request ${action === "approve" ? "approved" : "rejected"} successfully!`);
        setSelectedApprovalIds([]);
        setShowRejectionModalFor(null);
        setRejectionReason("");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || `Failed to perform bulk ${action}.`);
    }
  };

  const handleCreateDept = async (e) => {
    if (e) e.preventDefault();
    if (!newDeptName.trim()) return;
    setSubmitting(true);
    try {
      const res = await orgService.createDepartment(newDeptName.trim());
      if (res.success) {
        toast.success(`Department "${newDeptName}" created!`);
        setNewDeptName("");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to create department.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRenameDept = async (e) => {
    if (e) e.preventDefault();
    if (!renameDept || !renameDept.newName.trim()) return;
    setSubmitting(true);
    try {
      const res = await orgService.renameDepartment(renameDept.oldName, renameDept.newName.trim());
      if (res.success) {
        toast.success("Department renamed successfully!");
        setRenameDept(null);
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to rename department.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteDept = async (name) => {
    if (window.confirm(`Are you sure you want to delete department "${name}"? Members will be reassigned to "General".`)) {
      setLoading(true);
      try {
        const res = await orgService.deleteDepartment(name);
        if (res.success) {
          toast.success(`Department "${name}" deleted.`);
          loadDashboardData();
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to delete department.");
        setLoading(false);
      }
    }
  };

  const handleInviteMembers = async (e) => {
    if (e) e.preventDefault();
    const emailsList = inviteEmails.split(/[\n,]+/).map(em => em.trim()).filter(Boolean);
    if (emailsList.length === 0) {
      toast.error("Please enter at least one email address.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await orgService.inviteMembersBulk({
        emails: emailsList,
        role: inviteRole,
        department: inviteDept
      });
      if (res.success) {
        toast.success(`Successfully invited ${res.invitations.length} users.`);
        setInviteResults(res.invitations);
        setInviteEmails("");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to generate invitations.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelInvite = async (id) => {
    if (window.confirm("Cancel this invitation?")) {
      try {
        const res = await orgService.cancelInvitation(id);
        if (res.success) {
          toast.success("Invitation cancelled.");
          loadDashboardData();
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to cancel invitation.");
      }
    }
  };

  const handleUpdateMember = async (e) => {
    if (e) e.preventDefault();
    if (!editMember) return;
    setSubmitting(true);
    try {
      const res = await orgService.updateMemberDetails(editMember.userId, {
        name: editMember.name,
        department: editMember.department,
        role: editMember.role,
        status: editMember.status,
        avatar: editMember.avatar
      });
      if (res.success) {
        toast.success("Member profile updated successfully!");
        setEditMember(null);
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to update member.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleArchive = async (m) => {
    try {
      let res;
      if (m.status === "archived") {
        res = await orgService.restoreMember(m.userId);
        toast.success(`Restored member ${m.name}.`);
      } else {
        res = await orgService.archiveMember(m.userId);
        toast.success(`Archived member ${m.name}.`);
      }
      if (res.success) {
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to toggle status.");
    }
  };

  const handleRemoveMember = async (id) => {
    if (window.confirm("Are you sure you want to remove this member from the organization?")) {
      try {
        const res = await orgService.removeMember(id);
        if (res.success) {
          toast.success("Member removed successfully.");
          loadDashboardData();
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to remove member.");
      }
    }
  };

  const handleBulkAction = async () => {
    if (selectedMemberIds.length === 0) {
      toast.error("Please select at least one member.");
      return;
    }
    if (!bulkAction) return;

    setSubmitting(true);
    try {
      let res;
      if (bulkAction === "role") {
        res = await orgService.bulkUpdateRole(selectedMemberIds, bulkRole);
        toast.success(`Bulk updated roles to ${bulkRole}.`);
      } else if (bulkAction === "remove") {
        if (window.confirm(`Are you sure you want to remove ${selectedMemberIds.length} selected members?`)) {
          res = await orgService.bulkRemoveMembers(selectedMemberIds);
          toast.success(`Removed ${selectedMemberIds.length} members.`);
        } else {
          setSubmitting(false);
          return;
        }
      } else if (bulkAction === "archive") {
        res = await orgService.bulkArchiveMembers(selectedMemberIds, true);
        toast.success("Bulk archived selected members.");
      } else if (bulkAction === "restore") {
        res = await orgService.bulkArchiveMembers(selectedMemberIds, false);
        toast.success("Bulk restored selected members.");
      }

      if (res && res.success) {
        setSelectedMemberIds([]);
        setBulkAction("");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Bulk operation failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTransferOwnership = async (e) => {
    if (e) e.preventDefault();
    if (!transferTargetId) return;
    setSubmitting(true);
    try {
      const res = await orgService.transferOwnership(transferTargetId);
      if (res.success) {
        toast.success(res.message);
        setShowTransferModal(false);
        setTransferTargetId("");
        loadDashboardData();
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to transfer ownership.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteOrg = async () => {
    const confirmation = window.prompt("WARNING: Deleting the organization is permanent and will demote all members. Type DELETE to confirm:");
    if (confirmation === "DELETE") {
      setSubmitting(true);
      try {
        const res = await orgService.deleteOrg();
        if (res.success) {
          toast.success("Organization successfully deleted.");
          navigate("/chat");
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to delete organization.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const handleDeleteSharedChat = async (id) => {
    if (window.confirm("Are you sure you want to delete this shared chat copies for the organization?")) {
      try {
        const res = await orgService.deleteSharedChat(id);
        if (res.success) {
          toast.success("Shared chat deleted.");
          loadDashboardData();
        }
      } catch (err) {
        toast.error(err.response?.data?.detail || "Failed to delete shared chat.");
      }
    }
  };

  // Filter & Sort Members list
  const filteredMembers = members
    .filter(m => {
      const nameMatch = (m.name || "").toLowerCase().includes(memberSearch.toLowerCase()) || 
                        (m.email || "").toLowerCase().includes(memberSearch.toLowerCase());
      const roleMatch = roleFilter === "all" || m.role === roleFilter;
      const deptMatch = deptFilter === "all" || m.department === deptFilter;
      const statusMatch = statusFilter === "all" || m.status === statusFilter;
      return nameMatch && roleMatch && deptMatch && statusMatch;
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return (a.name || "").localeCompare(b.name || "");
      }
      if (sortBy === "joined") {
        return new Date(b.joinedAt || 0) - new Date(a.joinedAt || 0);
      }
      if (sortBy === "role") {
        return (a.role || "").localeCompare(b.role || "");
      }
      return 0;
    });

  // Paginated Members slice
  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage) || 1;
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleSelectMember = (id) => {
    setSelectedMemberIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedMemberIds.length === paginatedMembers.length) {
      setSelectedMemberIds([]);
    } else {
      setSelectedMemberIds(paginatedMembers.map(m => m.userId));
    }
  };

  return (
    <div className="org-dashboard-layout">
      {/* Backdrop overlay for mobile menu drawer */}
      {mobileMenuOpen && (
        <div className="org-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Dashboard Sidebar */}
      <aside className={`org-dashboard-sidebar glass ${sidebarCollapsed ? "collapsed" : ""} ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-brand">
          <FiBriefcase className="brand-icon" />
          {!sidebarCollapsed && (
            <div className="brand-details">
              <span className="brand-title">{orgData?.organizationName || "Org Management"}</span>
              <span className="brand-subtitle">{user?.role} Workspace</span>
            </div>
          )}
          
          {/* Desktop/Tablet Collapse Trigger */}
          <button 
            className="sidebar-collapse-toggle-btn"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <FiChevronRight style={{ transform: sidebarCollapsed ? "rotate(0deg)" : "rotate(180deg)" }} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => { setActiveTab("overview"); setMobileMenuOpen(false); }}
            title={sidebarCollapsed ? "" : "Overview"}
            onMouseEnter={() => setHoveredLink("overview")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <FiGrid /> {!sidebarCollapsed && <span>Overview</span>}
            {hoveredLink === "overview" && sidebarCollapsed && (
              <div className="floating-tooltip">Overview</div>
            )}
          </button>
          <button 
            className={`nav-link ${activeTab === "members" ? "active" : ""}`}
            onClick={() => { setActiveTab("members"); setMobileMenuOpen(false); }}
            title={sidebarCollapsed ? "" : "Members"}
            onMouseEnter={() => setHoveredLink("members")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <FiUser /> {!sidebarCollapsed && <span>Members</span>}
            {hoveredLink === "members" && sidebarCollapsed && (
              <div className="floating-tooltip">Members</div>
            )}
          </button>
          <button 
            className={`nav-link ${activeTab === "departments" ? "active" : ""}`}
            onClick={() => { setActiveTab("departments"); setMobileMenuOpen(false); }}
            title={sidebarCollapsed ? "" : "Departments"}
            onMouseEnter={() => setHoveredLink("departments")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <FiFolder /> {!sidebarCollapsed && <span>Departments</span>}
            {hoveredLink === "departments" && sidebarCollapsed && (
              <div className="floating-tooltip">Departments</div>
            )}
          </button>
          <button 
            className={`nav-link ${activeTab === "roles" ? "active" : ""}`}
            onClick={() => { setActiveTab("roles"); setMobileMenuOpen(false); }}
            title={sidebarCollapsed ? "" : "Roles & RBAC"}
            onMouseEnter={() => setHoveredLink("roles")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <FiShield /> {!sidebarCollapsed && <span>Roles & RBAC</span>}
            {hoveredLink === "roles" && sidebarCollapsed && (
              <div className="floating-tooltip">Roles & RBAC</div>
            )}
          </button>
          {user && (user.role === "Head" || user.role === "HR") && (
            <>
              <button 
                className={`nav-link ${activeTab === "approvals" ? "active" : ""}`}
                onClick={() => { setActiveTab("approvals"); setMobileMenuOpen(false); }}
                title={sidebarCollapsed ? "" : "Pending Approvals"}
                style={{ position: "relative" }}
                onMouseEnter={() => setHoveredLink("approvals")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <FiCheckCircle /> 
                {!sidebarCollapsed && <span>Approvals</span>}
                {analytics?.pendingApprovals > 0 && (
                  <span className="badge-alert-count" style={{
                    position: "absolute",
                    right: sidebarCollapsed ? "2px" : "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "var(--danger)",
                    color: "white",
                    borderRadius: "10px",
                    padding: "2px 6px",
                    fontSize: "0.7rem",
                    fontWeight: "700"
                  }}>
                    {analytics.pendingApprovals}
                  </span>
                )}
                {hoveredLink === "approvals" && sidebarCollapsed && (
                  <div className="floating-tooltip">Approvals ({analytics?.pendingApprovals || 0})</div>
                )}
              </button>
              <button 
                className={`nav-link ${activeTab === "invitations" ? "active" : ""}`}
                onClick={() => { setActiveTab("invitations"); setMobileMenuOpen(false); }}
                title={sidebarCollapsed ? "" : "Invitations"}
                onMouseEnter={() => setHoveredLink("invitations")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <FiMail /> {!sidebarCollapsed && <span>Invitations</span>}
                {hoveredLink === "invitations" && sidebarCollapsed && (
                  <div className="floating-tooltip">Invitations</div>
                )}
              </button>
              <button 
                className={`nav-link ${activeTab === "logs" ? "active" : ""}`}
                onClick={() => { setActiveTab("logs"); setMobileMenuOpen(false); }}
                title={sidebarCollapsed ? "" : "Activity Logs"}
                onMouseEnter={() => setHoveredLink("logs")}
                onMouseLeave={() => setHoveredLink(null)}
              >
                <FiActivity /> {!sidebarCollapsed && <span>Activity Logs</span>}
                {hoveredLink === "logs" && sidebarCollapsed && (
                  <div className="floating-tooltip">Activity Logs</div>
                )}
              </button>
            </>
          )}
          <button 
            className={`nav-link ${activeTab === "chats" ? "active" : ""}`}
            onClick={() => { setActiveTab("chats"); setMobileMenuOpen(false); }}
            title={sidebarCollapsed ? "" : "Shared Chats"}
            onMouseEnter={() => setHoveredLink("chats")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <FiShare2 /> {!sidebarCollapsed && <span>Shared Chats</span>}
            {hoveredLink === "chats" && sidebarCollapsed && (
              <div className="floating-tooltip">Shared Chats</div>
            )}
          </button>
          <button 
            className={`nav-link ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => { setActiveTab("settings"); setMobileMenuOpen(false); }}
            title={sidebarCollapsed ? "" : "Org Settings"}
            onMouseEnter={() => setHoveredLink("settings")}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <FiSliders /> {!sidebarCollapsed && <span>Settings</span>}
            {hoveredLink === "settings" && sidebarCollapsed && (
              <div className="floating-tooltip">Settings</div>
            )}
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="back-btn" onClick={() => navigate("/chat")} title={sidebarCollapsed ? "Back to Chat" : ""}>
            <FiArrowLeft /> {!sidebarCollapsed && <span>Back to Chat</span>}
          </button>
          
          <div className="sidebar-profile-box">
            <img 
              src={user?.avatar || "/avatars/default.png"} 
              alt="Avatar" 
              className="profile-avatar-img" 
            />
            {!sidebarCollapsed && (
              <div className="profile-meta-info">
                <span className="profile-meta-name">{user?.fullName || user?.username}</span>
                <span className="profile-meta-role">{user?.role}</span>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="org-dashboard-main">
        {/* Mobile Header Bar */}
        <header className="org-mobile-navbar glass">
          <button 
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open Navigation Menu"
          >
            <FiMenu />
          </button>
          <span className="mobile-brand-title">{orgData?.organizationName || "SARVA AI"}</span>
        </header>

        {loading ? (
          /* Premium Shimmer Skeleton Loader Dashboard */
          <div className="dashboard-view-container skeleton-container">
            <div className="tab-header">
              <div className="skeleton-loader" style={{ width: "220px", height: "28px", borderRadius: "6px", marginBottom: "8px" }} />
              <div className="skeleton-loader" style={{ width: "340px", height: "14px", borderRadius: "4px" }} />
            </div>

            <div className="metrics-grid" style={{ marginTop: "24px" }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="metric-card glass skeleton-card" style={{ height: "128px", display: "flex", flexDirection: "column", gap: "12px", padding: "24px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div className="skeleton-loader" style={{ width: "90px", height: "14px", borderRadius: "4px" }} />
                    <div className="skeleton-loader" style={{ width: "24px", height: "24px", borderRadius: "6px" }} />
                  </div>
                  <div className="skeleton-loader" style={{ width: "110px", height: "36px", borderRadius: "8px", marginTop: "4px" }} />
                  <div className="skeleton-loader" style={{ width: "70px", height: "12px", borderRadius: "4px" }} />
                </div>
              ))}
            </div>

            <div className="details-row" style={{ marginTop: "32px" }}>
              <div className="details-card glass flex-2" style={{ height: "320px", display: "flex", flexDirection: "column", gap: "16px", padding: "28px" }}>
                <div className="skeleton-loader" style={{ width: "160px", height: "20px", borderRadius: "6px" }} />
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ display: "flex", gap: "12px" }}>
                    <div className="skeleton-loader" style={{ width: "12px", height: "12px", borderRadius: "50%", marginTop: "4px" }} />
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div className="skeleton-loader" style={{ width: "80%", height: "14px", borderRadius: "4px" }} />
                      <div className="skeleton-loader" style={{ width: "45%", height: "12px", borderRadius: "4px" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="details-card glass flex-1" style={{ height: "320px", display: "flex", flexDirection: "column", gap: "16px", padding: "28px" }}>
                <div className="skeleton-loader" style={{ width: "140px", height: "20px", borderRadius: "6px" }} />
                <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                  <div className="skeleton-loader" style={{ width: "48px", height: "48px", borderRadius: "50%" }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div className="skeleton-loader" style={{ width: "70%", height: "14px", borderRadius: "4px" }} />
                    <div className="skeleton-loader" style={{ width: "50%", height: "12px", borderRadius: "4px" }} />
                  </div>
                </div>
                <div className="skeleton-loader" style={{ width: "100%", height: "110px", borderRadius: "8px", marginTop: "10px" }} />
              </div>
            </div>
          </div>
        ) : (
          <div className="dashboard-view-container">
            {/* Overview / Analytics tab */}
            {activeTab === "overview" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="overview-tab"
                style={{ display: "flex", flexDirection: "column", gap: "28px" }}
              >
                {/* Redesigned Hero banner panel */}
                <div className="dashboard-hero-banner">
                  <div className="hero-left">
                    <span className="hero-subtitle">Welcome Back</span>
                    <h1 className="hero-title">
                      Good morning, <span className="hero-workspace">{user?.fullName || "Karan"} 👋</span>
                    </h1>
                    <p className="hero-summary-text">
                      Welcome to the <strong>{orgData?.organizationName || "IGT Solutions"}</strong> workspace dashboard. Here is today's overview.
                    </p>
                  </div>
                  <div className="hero-right">
                    {/* Notification Alert Bell */}
                    <button 
                      onClick={() => setIsNotificationsOpen(true)}
                      style={{
                        background: "rgba(255, 255, 255, 0.03)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "12px",
                        cursor: "pointer",
                        color: "var(--text-primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        transition: "all 0.2s"
                      }}
                      onMouseEnter={(e) => e.target.style.borderColor = "var(--accent)"}
                      onMouseLeave={(e) => e.target.style.borderColor = "var(--border)"}
                    >
                      <FiActivity style={{ fontSize: "1.2rem" }} />
                      {analytics?.pendingApprovals > 0 && (
                        <span style={{
                          position: "absolute",
                          top: "-4px",
                          right: "-4px",
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--danger)",
                          boxShadow: "0 0 6px var(--danger)"
                        }} />
                      )}
                    </button>

                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "rgba(255, 255, 255, 0.03)",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                    }}>
                      <div className="status-badge active" style={{ fontSize: "0.8rem", fontWeight: "700", textTransform: "uppercase" }}>
                        Active
                      </div>
                    </div>
                  </div>
                </div>

                <div className="metrics-grid">
                  <div className="metric-card glass">
                    <div className="metric-header">
                      <span className="metric-title">Total Members</span>
                      <FiUser className="metric-icon blue" />
                    </div>
                    <div className="metric-value">{analytics?.totalMembers}</div>
                    <span className="metric-sub">{analytics?.activeMembers} active members</span>
                  </div>

                  <div className="metric-card glass">
                    <div className="metric-header">
                      <span className="metric-title">Active Departments</span>
                      <FiFolder className="metric-icon green" />
                    </div>
                    <div className="metric-value">{analytics?.departmentsCount}</div>
                    <span className="metric-sub">Departments defined</span>
                  </div>

                  <div className="metric-card glass">
                    <div className="metric-header">
                      <span className="metric-title">Shared Chats</span>
                      <FiShare2 className="metric-icon purple" />
                    </div>
                    <div className="metric-value">{analytics?.sharedChatsCount}</div>
                    <span className="metric-sub">Total chat copies shared</span>
                  </div>

                  {user && (user.role === "Head" || user.role === "HR") ? (
                    <div 
                      className="metric-card glass clickable-card"
                      onClick={() => setActiveTab("approvals")}
                      style={{ 
                        border: analytics?.pendingApprovals > 0 ? "1px solid rgba(245, 158, 11, 0.3)" : "1px solid var(--border)",
                        background: analytics?.pendingApprovals > 0 ? "rgba(245, 158, 11, 0.03)" : "var(--bg-card)",
                        cursor: "pointer"
                      }}
                    >
                      <div className="metric-header">
                        <span className="metric-title">Pending Approvals</span>
                        <FiClock className={`metric-icon ${analytics?.pendingApprovals > 0 ? "pink" : "blue"}`} />
                      </div>
                      <div className="metric-value" style={{ color: analytics?.pendingApprovals > 0 ? "#f472b6" : "var(--text-primary)" }}>
                        {analytics?.pendingApprovals || 0}
                      </div>
                      <span className="metric-sub">Requires admin review</span>
                    </div>
                  ) : (
                    <div className="metric-card glass">
                      <div className="metric-header">
                        <span className="metric-title">Workspace Status</span>
                        <FiCheckCircle className="metric-icon green" />
                      </div>
                      <div className="metric-value" style={{ textTransform: "capitalize" }}>{orgData?.status}</div>
                      <span className="metric-sub">Secure enterprise active</span>
                    </div>
                  )}
                </div>

                {/* Animated Interactive SVG charts grid block */}
                <div className="charts-grid">
                  <div className="chart-card glass">
                    <h3>Teammate Onboarding Trend</h3>
                    <div className="svg-chart-container">
                      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4"/>
                            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        <path d="M 0 160 C 50 140, 100 130, 150 110 C 200 90, 250 70, 300 50 C 350 30, 380 40, 400 20 L 400 200 L 0 200 Z" fill="url(#growthGrad)" />
                        <path d="M 0 160 C 50 140, 100 130, 150 110 C 200 90, 250 70, 300 50 C 350 30, 380 40, 400 20" fill="none" stroke="var(--accent)" strokeWidth="3" style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: "draw-path 2s ease-out forwards" }} />
                        <line x1="0" y1="160" x2="400" y2="160" stroke="var(--border)" strokeWidth="0.5" />
                        <line x1="0" y1="110" x2="400" y2="110" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <line x1="0" y1="50" x2="400" y2="50" stroke="var(--border)" strokeWidth="0.5" strokeDasharray="4 4" />
                        <circle cx="150" cy="110" r="5" fill="var(--accent)" />
                        <circle cx="300" cy="50" r="5" fill="var(--accent)" />
                        <circle cx="400" cy="20" r="5" fill="var(--accent)" />
                      </svg>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Cumulative workspace registrations over the past month.</span>
                  </div>

                  <div className="chart-card glass">
                    <h3>Weekly Chat Usage Statistics</h3>
                    <div className="svg-chart-container">
                      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#818cf8"/>
                            <stop offset="100%" stopColor="#4f46e5"/>
                          </linearGradient>
                        </defs>
                        {[12, 18, 15, 26, 22, 9, 6].map((chats, idx) => {
                          const x = 30 + idx * 52;
                          const height = chats * 5.5;
                          const y = 170 - height;
                          const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                          return (
                            <g key={idx}>
                              <rect x={x} y={y} width="24" height={height} rx="4" fill="url(#barGrad)" style={{ transformOrigin: `${x + 12}px 170px`, animation: "bar-grow 0.8s ease-out forwards" }} />
                              <text x={x + 12} y="190" textAnchor="middle" fill="var(--text-secondary)" fontSize="10">{days[idx]}</text>
                              <text x={x + 12} y={y - 6} textAnchor="middle" fill="var(--text-primary)" fontSize="9" fontWeight="700">{chats}</text>
                            </g>
                          );
                        })}
                        <line x1="20" y1="170" x2="380" y2="170" stroke="var(--border)" strokeWidth="0.5" />
                      </svg>
                    </div>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Weekly chat session query requests inside workspace.</span>
                  </div>
                </div>

                {/* Dashboard Details Row */}
                <div className="details-row">
                  <div className="details-card glass">
                    <h3>Recent Activity Logs</h3>
                    <div className="activity-timeline">
                      {analytics?.recentActivities && analytics.recentActivities.length > 0 ? (
                        analytics.recentActivities.map((act, i) => (
                          <div key={i} className="timeline-item">
                            <div className="timeline-dot" />
                            <div className="timeline-content">
                              <span className="timeline-action">
                                <strong>{act.userName}</strong>: {act.details || act.action}
                              </span>
                              <span className="timeline-time">
                                <FiClock /> {new Date(act.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="empty-msg">No activities recorded yet.</p>
                      )}
                    </div>
                  </div>

                  {/* Redesigned Workspace Branding Panel */}
                  <div className="details-card glass branding-panel-card" style={{ position: "relative", overflow: "hidden" }}>
                    {orgData?.banner && (
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "80px",
                        backgroundImage: `url(${orgData.banner})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        zIndex: 0,
                        opacity: 0.65
                      }} />
                    )}
                    <h3 style={{ position: "relative", zIndex: 1, textShadow: orgData?.banner ? "0 2px 4px rgba(0,0,0,0.5)" : "none", color: orgData?.banner ? "white" : "inherit" }}>Workspace Profile</h3>
                    <div className="premium-branding-card" style={{ position: "relative", zIndex: 1, marginTop: orgData?.banner ? "40px" : "0px" }}>
                      <div className="branding-avatar-wrapper" style={{ border: orgData?.banner ? "3px solid var(--bg-secondary)" : "none" }}>
                        {orgData?.logo ? (
                          <img src={orgData.logo} alt={orgData.organizationName} className="branding-logo-img" />
                        ) : (
                          <div className="branding-fallback-avatar">
                            {orgData?.organizationName ? orgData.organizationName[0].toUpperCase() : "O"}
                          </div>
                        )}
                      </div>
                      <div className="branding-text-details">
                        <span className="brand-name-bold">{orgData?.organizationName}</span>
                        <span className="brand-industry-badge">💼 {orgData?.industry || "Enterprise Workspace"}</span>
                      </div>
                      
                      <div className="branding-stats-grid">
                        <div className="stat-row">
                          <span className="label">Website:</span>
                          <span className="val">
                            {orgData?.website ? (
                              <a href={orgData.website.startsWith("http") ? orgData.website : `https://${orgData.website}`} target="_blank" rel="noreferrer" className="stat-link">
                                {orgData.website}
                              </a>
                            ) : "Not Specified"}
                          </span>
                        </div>
                        <div className="stat-row">
                          <span className="label">Total Headcount:</span>
                          <span className="val">{members.length} Members</span>
                        </div>
                        <div className="stat-row">
                          <span className="label">Created Date:</span>
                          <span className="val">
                            {orgData?.createdAt ? new Date(orgData.createdAt).toLocaleDateString() : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Quick Action Menu */}
                <div className="floating-quick-actions">
                  <button 
                    className="quick-action-main-btn" 
                    onClick={() => setIsQuickActionsOpen(!isQuickActionsOpen)}
                    aria-label="Toggle Quick Actions Menu"
                  >
                    <FiPlus />
                  </button>
                  {isQuickActionsOpen && (
                    <div className="quick-action-menu">
                      <button className="quick-action-item" onClick={() => { setActiveTab("members"); setIsQuickActionsOpen(false); }}>
                        <FiUser /> View Teammates
                      </button>
                      {user && (user.role === "Head" || user.role === "HR") && (
                        <>
                          <button className="quick-action-item" onClick={() => { setActiveTab("invitations"); setIsQuickActionsOpen(false); }}>
                            <FiMail /> Invite Teammate
                          </button>
                          <button className="quick-action-item" onClick={() => { setActiveTab("departments"); setIsQuickActionsOpen(false); }}>
                            <FiFolder /> New Department
                          </button>
                        </>
                      )}
                      <button className="quick-action-item" onClick={() => { setActiveTab("settings"); setIsQuickActionsOpen(false); }}>
                        <FiSliders /> Settings
                      </button>
                    </div>
                  )}
                </div>

                {/* Notification Drawer Center overlay */}
                {isNotificationsOpen && (
                  <>
                    <div className="notification-drawer-overlay" onClick={() => setIsNotificationsOpen(false)} />
                    <aside className="notification-drawer glass-morphic">
                      <div className="drawer-header">
                        <h3>Notification Center</h3>
                        <button className="drawer-close-btn" onClick={() => setIsNotificationsOpen(false)}><FiX /></button>
                      </div>
                      <div className="drawer-body">
                        {analytics?.pendingApprovals > 0 ? (
                          <div className="notification-item staggered-item">
                            <FiClock className="notification-item-icon" />
                            <div className="notification-item-content">
                              <span className="notification-item-title">New Join Requests</span>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                There are <strong>{analytics.pendingApprovals}</strong> users waiting for review.
                              </span>
                              <span className="notification-item-time">Awaiting Action</span>
                            </div>
                          </div>
                        ) : null}
                        {invitations.length > 0 ? (
                          <div className="notification-item staggered-item">
                            <FiMail className="notification-item-icon" />
                            <div className="notification-item-content">
                              <span className="notification-item-title">Active Workspace Invites</span>
                              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                                You have <strong>{invitations.length}</strong> pending codes outstanding.
                              </span>
                              <span className="notification-item-time">Active</span>
                            </div>
                          </div>
                        ) : null}
                        <div className="notification-item staggered-item">
                          <FiCheckCircle className="notification-item-icon" style={{ color: "var(--success)" }} />
                          <div className="notification-item-content">
                            <span className="notification-item-title">Workspace Secure</span>
                            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                              Security and RBAC configurations match premium standards.
                            </span>
                            <span className="notification-item-time">System verified</span>
                          </div>
                        </div>
                      </div>
                    </aside>
                  </>
                )}
              </motion.div>
            )}

            {/* Members Directory Tab */}
            {activeTab === "members" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="members-tab"
              >
                <div className="tab-header">
                  <h2>Member Directory</h2>
                  <p>Manage roles, departments, statuses, and permissions of organization members</p>
                </div>

                {/* Filters */}
                <div className="filters-card glass">
                  <div className="search-bar-wrapper" style={{ position: "relative" }}>
                    <FiSearch className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search member by email or name..." 
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      onFocus={() => setSearchFocused(true)}
                      onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                    />
                    {searchFocused && (
                      <div className="search-suggestions-dropdown glass" style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        marginTop: "8px",
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "12px",
                        padding: "16px",
                        zIndex: 100,
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                        boxShadow: "var(--shadow-lg)"
                      }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Recent Searches</span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            {["HR", "Artificial Intelligence", "Student"].map((s, idx) => (
                              <button 
                                key={idx}
                                onClick={() => setSearchInput(s)}
                                style={{
                                  background: "rgba(255, 255, 255, 0.03)",
                                  border: "1px solid var(--border)",
                                  borderRadius: "16px",
                                  padding: "4px 12px",
                                  fontSize: "0.75rem",
                                  color: "var(--text-primary)",
                                  cursor: "pointer"
                                }}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.5px" }}>Quick Category Filters</span>
                          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                            <button onClick={() => setRoleFilter("HR")} style={{ background: "rgba(99, 102, 241, 0.1)", border: "1px solid rgba(99, 102, 241, 0.2)", borderRadius: "16px", padding: "4px 12px", fontSize: "0.75rem", color: "#818cf8", cursor: "pointer", border: "none" }}>HR Department</button>
                            <button onClick={() => setDeptFilter(orgData?.departments?.[0] || "General")} style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", borderRadius: "16px", padding: "4px 12px", fontSize: "0.75rem", color: "#10b981", cursor: "pointer", border: "none" }}>Core Teams</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="filters-row">
                    <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}>
                      <option value="all">All Roles</option>
                      <option value="Head">Head</option>
                      <option value="HR">HR</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Executive">Executive</option>
                      <option value="Intern">Intern</option>
                      <option value="Student">Student</option>
                    </select>

                    <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}>
                      <option value="all">All Departments</option>
                      {orgData?.departments?.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>

                    <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}>
                      <option value="all">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="archived">Archived</option>
                    </select>

                    <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                      <option value="name">Sort by Name</option>
                      <option value="joined">Sort by Join Date</option>
                      <option value="role">Sort by Role</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Actions Bar */}
                {user && (user.role === "Head" || user.role === "HR") && selectedMemberIds.length > 0 && (
                  <div className="bulk-actions-bar glass animate-fade-in">
                    <span>{selectedMemberIds.length} members selected</span>
                    <div className="bulk-controls">
                      <select value={bulkAction} onChange={(e) => setBulkAction(e.target.value)}>
                        <option value="">Choose bulk action...</option>
                        <option value="role">Change Role</option>
                        <option value="archive">Archive Status</option>
                        <option value="restore">Restore Status</option>
                        <option value="remove">Remove from Workspace</option>
                      </select>

                      {bulkAction === "role" && (
                        <select value={bulkRole} onChange={(e) => setBulkRole(e.target.value)}>
                          <option value="Student">Student</option>
                          <option value="Intern">Intern</option>
                          <option value="Executive">Executive</option>
                          <option value="Team Lead">Team Lead</option>
                          <option value="HR">HR</option>
                          {user.role === "Head" && <option value="Head">Head</option>}
                        </select>
                      )}

                      <button 
                        className="bulk-apply-btn" 
                        onClick={handleBulkAction}
                        disabled={submitting}
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}

                {/* Members list layout */}
                <div className="members-list glass">
                  {filteredMembers.length === 0 ? (
                    <div className="empty-state">
                      <FiUser style={{ fontSize: "2.5rem", opacity: 0.3 }} />
                      <p>No organization members match the filters.</p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="table-responsive desktop-only-table">
                        <table>
                          <thead>
                            <tr>
                              {user && (user.role === "Head" || user.role === "HR") && (
                                <th style={{ width: "40px" }}>
                                  <input 
                                    type="checkbox" 
                                    checked={selectedMemberIds.length === paginatedMembers.length && paginatedMembers.length > 0} 
                                    onChange={toggleSelectAll}
                                  />
                                </th>
                              )}
                              <th>Member</th>
                              <th>Role</th>
                              <th>Department</th>
                              <th>Status</th>
                              <th>Joined Date</th>
                              {(user.role === "Head" || user.role === "HR") && <th>Actions</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedMembers.map((m) => {
                              const isSelf = m.userId === user?.user_id;
                              const isHead = m.role === "Head";
                              
                              return (
                                <tr key={m.userId} className={m.status === "archived" ? "row-archived" : ""}>
                                  {user && (user.role === "Head" || user.role === "HR") && (
                                    <td>
                                      <input 
                                        type="checkbox" 
                                        checked={selectedMemberIds.includes(m.userId)} 
                                        onChange={() => toggleSelectMember(m.userId)}
                                        disabled={isSelf || (user.role === "HR" && isHead)}
                                      />
                                    </td>
                                  )}
                                  <td>
                                    <div className="member-profile-cell">
                                      <div className="cell-avatar" style={{ backgroundImage: `url(${m.avatar})` }}>
                                        {(!m.avatar || m.avatar === "/avatars/default.png") && (m.name ? m.name[0].toUpperCase() : "U")}
                                      </div>
                                      <div className="cell-info">
                                        <span className="member-name">
                                          {m.name} {isSelf && <span className="self-tag">(You)</span>}
                                        </span>
                                        <span className="member-email">{m.email}</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <span className={`role-badge ${ROLE_BADGE_COLORS[m.role] || "role-badge-student"}`}>
                                      {m.role}
                                    </span>
                                  </td>
                                  <td>
                                    <span className="member-dept-badge">
                                      📂 {m.department}
                                    </span>
                                  </td>
                                  <td>
                                    <span className={`status-badge ${m.status === "active" ? "active" : "archived"}`}>
                                      {m.status}
                                    </span>
                                  </td>
                                  <td>{m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "N/A"}</td>
                                  {(user.role === "Head" || user.role === "HR") && (
                                    <td>
                                      <div className="row-actions">
                                        <button 
                                          className="row-btn" 
                                          onClick={() => setEditMember(m)}
                                          title="Edit Profile"
                                          disabled={isSelf || (user.role === "HR" && isHead)}
                                        >
                                          <FiEdit3 />
                                        </button>
                                        <button 
                                          className={`row-btn ${m.status === "archived" ? "restore" : "archive"}`}
                                          onClick={() => handleToggleArchive(m)}
                                          title={m.status === "archived" ? "Restore" : "Archive"}
                                          disabled={isSelf || (user.role === "HR" && isHead)}
                                        >
                                          {m.status === "archived" ? <FiCheck /> : <FiClock />}
                                        </button>
                                        <button 
                                          className="row-btn danger" 
                                          onClick={() => handleRemoveMember(m.userId)}
                                          title="Remove Member"
                                          disabled={isSelf || (user.role === "HR" && isHead)}
                                        >
                                          <FiTrash2 />
                                        </button>
                                      </div>
                                    </td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>

                      {/* Responsive Cards Stack View for Mobile */}
                      <div className="members-card-list mobile-only-list">
                        {paginatedMembers.map((m) => {
                          const isSelf = m.userId === user?.user_id;
                          const isHead = m.role === "Head";
                          
                          return (
                            <div key={m.userId} className={`member-card-responsive glass-card hover-lift ${m.status === "archived" ? "card-archived" : ""}`}>
                              <div className="member-card-header">
                                <div className="cell-avatar" style={{ backgroundImage: `url(${m.avatar})` }}>
                                  {(!m.avatar || m.avatar === "/avatars/default.png") && (m.name ? m.name[0].toUpperCase() : "U")}
                                </div>
                                <div className="member-card-names">
                                  <span className="name">{m.name} {isSelf && <span className="self-tag">(You)</span>}</span>
                                  <span className="email">{m.email}</span>
                                </div>
                              </div>
                              <div className="member-card-details">
                                <div className="detail-item">
                                  <span className="label">Role:</span>
                                  <span className={`role-badge ${ROLE_BADGE_COLORS[m.role] || "role-badge-student"}`}>{m.role}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="label">Dept:</span>
                                  <span className="member-dept-badge">📂 {m.department}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="label">Status:</span>
                                  <span className={`status-badge ${m.status === "active" ? "active" : "archived"}`}>{m.status}</span>
                                </div>
                                <div className="detail-item">
                                  <span className="label">Joined:</span>
                                  <span>{m.joinedAt ? new Date(m.joinedAt).toLocaleDateString() : "N/A"}</span>
                                </div>
                              </div>
                              {(user.role === "Head" || user.role === "HR") && (
                                <div className="member-card-actions">
                                  <button className="row-btn" onClick={() => setEditMember(m)} disabled={isSelf || (user.role === "HR" && isHead)}>Edit</button>
                                  <button className="row-btn" onClick={() => handleToggleArchive(m)} disabled={isSelf || (user.role === "HR" && isHead)}>
                                    {m.status === "archived" ? "Restore" : "Archive"}
                                  </button>
                                  <button className="row-btn danger" onClick={() => handleRemoveMember(m.userId)} disabled={isSelf || (user.role === "HR" && isHead)}>Remove</button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>

                      {/* Pagination Controls */}
                      {totalPages > 1 && (
                        <div className="pagination-wrapper glass">
                          <button 
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                          <span className="pagination-info">
                            Page {currentPage} of {totalPages}
                          </span>
                          <button 
                            className="pagination-btn"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Department Manager Tab */}
            {activeTab === "departments" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="departments-tab"
              >
                <div className="tab-header">
                  <h2>Department Management</h2>
                  <p>Organize members, resources, and chats into distinct organization departments</p>
                </div>

                {/* Create Department */}
                {user && (user.role === "Head" || user.role === "HR") && (
                  <div className="action-card-wrapper">
                    <div className="action-card glass">
                      <h3>Create New Department</h3>
                      <form onSubmit={handleCreateDept} className="create-dept-form">
                        <div className="floating-input-group" style={{ flex: 1 }}>
                          <input 
                            type="text" 
                            required
                            placeholder="Department Name..." 
                            value={newDeptName}
                            onChange={(e) => setNewDeptName(e.target.value)}
                          />
                        </div>
                        <button type="submit" className="add-dept-btn" disabled={submitting}>
                          <FiPlus /> Add
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* Departments Grid */}
                <div className="dept-grid">
                  {orgData?.departments && orgData.departments.length > 0 ? (
                    orgData.departments.map((dept) => {
                      const deptMembers = members.filter(m => m.department === dept);
                      const isExpanded = expandedDept === dept;
                      return (
                        <div 
                          key={dept} 
                          className={`dept-card glass ${isExpanded ? "expanded" : ""}`}
                          onClick={() => setExpandedDept(isExpanded ? null : dept)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="dept-card-header">
                            <div className="header-info">
                              <FiFolder className="dept-icon" />
                              <h4>{dept}</h4>
                            </div>
                            
                            {user.role === "Head" && dept !== "General" && (
                              <div className="dept-actions" onClick={(e) => e.stopPropagation()}>
                                <button className="dept-action-btn" onClick={() => setRenameDept({ oldName: dept, newName: dept })} title="Rename">
                                  <FiEdit3 />
                                </button>
                                <button className="dept-action-btn danger" onClick={() => handleDeleteDept(dept)} title="Delete">
                                  <FiTrash2 />
                                </button>
                              </div>
                            )}
                          </div>
                          
                          <div className="dept-card-body">
                            <span className="member-count">{deptMembers.length} Members</span>
                            <div className="member-stacked-avatars">
                              {deptMembers.slice(0, 5).map((m, i) => (
                                <div 
                                  key={m.userId} 
                                  className="stack-avatar" 
                                  style={{ zIndex: 5 - i, backgroundImage: `url(${m.avatar})` }}
                                  title={m.name}
                                >
                                  {(!m.avatar || m.avatar === "/avatars/default.png") && (m.name ? m.name[0] : "U")}
                                </div>
                              ))}
                              {deptMembers.length > 5 && (
                                <div className="stack-avatar count">+{deptMembers.length - 5}</div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="empty-msg">No departments defined.</p>
                  )}
                </div>

                {/* Expanded Department Members Drawer */}
                <AnimatePresence>
                  {expandedDept && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="expanded-dept-details glass"
                      style={{ marginTop: "24px" }}
                    >
                      <div className="expanded-dept-header">
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <FiFolder className="dept-icon" />
                          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Members in {expandedDept}</h3>
                        </div>
                        <button className="close-btn" onClick={() => setExpandedDept(null)}>
                          <FiX />
                        </button>
                      </div>

                      <div className="expanded-members-grid">
                        {members.filter(m => m.department === expandedDept).length === 0 ? (
                          <p className="empty-msg" style={{ gridColumn: "1/-1", textAlign: "center", color: "var(--text-secondary)" }}>No members assigned to this department yet.</p>
                        ) : (
                          members.filter(m => m.department === expandedDept).map(m => (
                            <div key={m.userId} className="expanded-member-card glass-card hover-lift">
                              <div className="cell-avatar" style={{ backgroundImage: `url(${m.avatar})`, width: "36px", height: "36px" }}>
                                {(!m.avatar || m.avatar === "/avatars/default.png") && (m.name ? m.name[0].toUpperCase() : "U")}
                              </div>
                              <div className="expanded-member-info">
                                <span className="name">{m.name}</span>
                                <span className="email">{m.email}</span>
                              </div>
                              <span className={`role-badge ${ROLE_BADGE_COLORS[m.role] || "role-badge-student"}`}>{m.role}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Roles & Permissions Tab */}
            {activeTab === "roles" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="roles-tab"
              >
                <div className="tab-header">
                  <h2>Roles & Access Permissions (RBAC)</h2>
                  <p>Enterprise permission matrix detailing workspace control rights per role</p>
                </div>

                <div className="rbac-grid">
                  {Object.entries(ROLE_PERMISSIONS).map(([roleName, perms]) => (
                    <div key={roleName} className="rbac-card glass">
                      <div className="rbac-card-header">
                        <span className={`role-badge ${ROLE_BADGE_COLORS[roleName] || "role-badge-student"}`}>
                          {roleName}
                        </span>
                      </div>
                      <ul className="rbac-permission-list">
                        {perms.map((perm, i) => (
                          <li key={i} className="permission-item">
                            <FiCheck className="check-icon" /> {perm}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Approvals tab */}
            {activeTab === "approvals" && user && (user.role === "Head" || user.role === "HR") && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="approvals-tab"
              >
                <div className="tab-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h2>Pending Join Requests</h2>
                    <p>Review and approve new member access to your workspace.</p>
                  </div>
                </div>

                <div className="directory-toolbar glass" style={{ marginBottom: "20px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center", padding: "16px", borderRadius: "12px" }}>
                  <div className="search-box" style={{ flex: 1, minWidth: "200px" }}>
                    <FiSearch />
                    <input 
                      type="text" 
                      placeholder="Search requests..." 
                      value={approvalSearchInput} 
                      onChange={(e) => setApprovalSearchInput(e.target.value)} 
                    />
                  </div>
                  
                  <div className="filter-group" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <select 
                      value={approvalDeptFilter} 
                      onChange={(e) => setApprovalDeptFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Departments</option>
                      {orgData?.departments?.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    
                    <select 
                      value={approvalRoleFilter} 
                      onChange={(e) => setApprovalRoleFilter(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Roles</option>
                      <option value="Head">Head</option>
                      <option value="HR">HR</option>
                      <option value="Team Lead">Team Lead</option>
                      <option value="Executive">Executive</option>
                      <option value="Intern">Intern</option>
                      <option value="Student">Student</option>
                    </select>
                  </div>
                </div>

                {/* Bulk Actions Bar */}
                {selectedApprovalIds.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    className="bulk-actions-bar glass"
                    style={{
                      background: "rgba(14, 165, 233, 0.08)",
                      border: "1px solid rgba(14, 165, 233, 0.2)",
                      padding: "12px 20px",
                      borderRadius: "8px",
                      marginBottom: "20px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", fontWeight: "600" }}>
                      {selectedApprovalIds.length} request(s) selected
                    </span>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button 
                        onClick={() => handleBulkApprovalAction("approve")}
                        className="btn-success"
                        style={{
                          background: "var(--success)",
                          color: "white",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        Approve Selected
                      </button>
                      <button 
                        onClick={() => setShowRejectionModalFor("bulk")}
                        className="btn-danger"
                        style={{
                          background: "var(--danger)",
                          color: "white",
                          border: "none",
                          padding: "6px 14px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "0.8rem",
                          cursor: "pointer"
                        }}
                      >
                        Reject Selected
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Requests list */}
                {pendingApprovals.filter(req => {
                  const matchesSearch = (req.name || "").toLowerCase().includes(approvalSearchInput.toLowerCase()) || 
                                      (req.email || "").toLowerCase().includes(approvalSearchInput.toLowerCase());
                  const matchesDept = approvalDeptFilter === "all" || req.department === approvalDeptFilter;
                  const matchesRole = approvalRoleFilter === "all" || req.requestedRole === approvalRoleFilter;
                  return matchesSearch && matchesDept && matchesRole;
                }).length === 0 ? (
                  <div className="details-card glass" style={{ textAlign: "center", padding: "48px 24px" }}>
                    <div style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "rgba(16, 185, 129, 0.1)",
                      color: "var(--success)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.8rem",
                      marginBottom: "16px"
                    }}>
                      <FiCheckCircle />
                    </div>
                    <h3>All caught up!</h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "4px" }}>
                      There are no pending join requests matching your filter criteria.
                    </p>
                  </div>
                ) : (
                  <div className="directory-table-card glass">
                    <div className="table-responsive-wrapper">
                      <table className="directory-table">
                        <thead>
                          <tr>
                            <th style={{ width: "40px" }}>
                              <input 
                                type="checkbox"
                                checked={selectedApprovalIds.length === pendingApprovals.length && pendingApprovals.length > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedApprovalIds(pendingApprovals.map(p => p.userId));
                                  } else {
                                    setSelectedApprovalIds([]);
                                  }
                                }}
                              />
                            </th>
                            <th>Teammate</th>
                            <th>Email Address</th>
                            <th>Requested Role</th>
                            <th>Department</th>
                            <th>Request Date</th>
                            <th style={{ textAlign: "right" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingApprovals
                            .filter(req => {
                              const matchesSearch = (req.name || "").toLowerCase().includes(approvalSearchInput.toLowerCase()) || 
                                                  (req.email || "").toLowerCase().includes(approvalSearchInput.toLowerCase());
                              const matchesDept = approvalDeptFilter === "all" || req.department === approvalDeptFilter;
                              const matchesRole = approvalRoleFilter === "all" || req.requestedRole === approvalRoleFilter;
                              return matchesSearch && matchesDept && matchesRole;
                            })
                            .map((req) => (
                              <tr key={req.userId} className="table-row hover-lift">
                                <td>
                                  <input 
                                    type="checkbox"
                                    checked={selectedApprovalIds.includes(req.userId)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedApprovalIds([...selectedApprovalIds, req.userId]);
                                      } else {
                                        setSelectedApprovalIds(selectedApprovalIds.filter(id => id !== req.userId));
                                      }
                                    }}
                                  />
                                </td>
                                <td>
                                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                    <div className="cell-avatar" style={{
                                      width: "32px",
                                      height: "32px",
                                      borderRadius: "50%",
                                      background: "var(--accent)",
                                      color: "white",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontWeight: "bold",
                                      fontSize: "0.8rem"
                                    }}>
                                      {req.name ? req.name[0].toUpperCase() : "U"}
                                    </div>
                                    <span style={{ fontWeight: "600" }}>{req.name}</span>
                                  </div>
                                </td>
                                <td>{req.email}</td>
                                <td>
                                  <select
                                    value={req.requestedRole}
                                    onChange={async (e) => {
                                      try {
                                        const newRole = e.target.value;
                                        const res = await orgService.updateMemberDetails(req.userId, { role: newRole });
                                        if (res.success) {
                                          toast.success("Role updated successfully!");
                                          loadDashboardData();
                                        }
                                      } catch (err) {
                                        toast.error(err.response?.data?.detail || "Failed to update role.");
                                      }
                                    }}
                                    style={{
                                      background: "rgba(0, 0, 0, 0.25)",
                                      border: "1px solid var(--border)",
                                      borderRadius: "6px",
                                      color: "var(--text-primary)",
                                      fontSize: "0.8rem",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                      outline: "none"
                                    }}
                                  >
                                    <option value="HR">HR</option>
                                    <option value="Team Lead">Team Lead</option>
                                    <option value="Executive">Executive</option>
                                    <option value="Intern">Intern</option>
                                    <option value="Student">Student</option>
                                  </select>
                                </td>
                                <td>
                                  <select
                                    value={req.department}
                                    onChange={async (e) => {
                                      try {
                                        const newDept = e.target.value;
                                        const res = await orgService.updateMemberDetails(req.userId, { department: newDept });
                                        if (res.success) {
                                          toast.success("Department updated successfully!");
                                          loadDashboardData();
                                        }
                                      } catch (err) {
                                        toast.error(err.response?.data?.detail || "Failed to update department.");
                                      }
                                    }}
                                    style={{
                                      background: "rgba(0, 0, 0, 0.25)",
                                      border: "1px solid var(--border)",
                                      borderRadius: "6px",
                                      color: "var(--text-primary)",
                                      fontSize: "0.8rem",
                                      padding: "4px 8px",
                                      cursor: "pointer",
                                      outline: "none"
                                    }}
                                  >
                                    {orgData?.departments?.map(d => (
                                      <option key={d} value={d}>{d}</option>
                                    ))}
                                  </select>
                                </td>
                                <td>{req.joinedAt ? new Date(req.joinedAt).toLocaleDateString() : "N/A"}</td>
                                <td>
                                  <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
                                    <button 
                                      onClick={() => handleApproveUser(req.userId)}
                                      style={{
                                        background: "rgba(16, 185, 129, 0.15)",
                                        color: "var(--success)",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "0.8rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                      }}
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => setShowRejectionModalFor(req.userId)}
                                      style={{
                                        background: "rgba(239, 68, 68, 0.15)",
                                        color: "var(--danger)",
                                        border: "none",
                                        padding: "6px 12px",
                                        borderRadius: "6px",
                                        fontSize: "0.8rem",
                                        fontWeight: "600",
                                        cursor: "pointer",
                                        transition: "all 0.2s"
                                      }}
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Invitations Manager Tab */}
            {activeTab === "invitations" && user && (user.role === "Head" || user.role === "HR") && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="invitations-tab"
              >
                <div className="tab-header">
                  <h2>Invitation Hub</h2>
                  <p>Invite teammates and assign pre-defined roles & departments upon workspace joining</p>
                </div>

                <div className="invitation-layout">
                  {/* Form */}
                  <div className="invite-form-card glass">
                    <h3>Generate Invitations</h3>
                    <form onSubmit={handleInviteMembers} className="invite-form">
                      <div className="form-group">
                        <label>Email Addresses (Separated by comma or new lines)</label>
                        <textarea 
                          placeholder="e.g. coworker1@company.com, coworker2@company.com"
                          value={inviteEmails}
                          onChange={(e) => setInviteEmails(e.target.value)}
                          required
                          rows={4}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label>Pre-assigned Role</label>
                          <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                            <option value="Student">Student</option>
                            <option value="Intern">Intern</option>
                            <option value="Executive">Executive</option>
                            <option value="Team Lead">Team Lead</option>
                            <option value="HR">HR</option>
                            {user.role === "Head" && <option value="Head">Head</option>}
                          </select>
                        </div>

                        <div className="form-group flex-1">
                          <label>Assign Department</label>
                          <select value={inviteDept} onChange={(e) => setInviteDept(e.target.value)}>
                            <option value="General">General</option>
                            {orgData?.departments?.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button type="submit" className="invite-submit-btn" disabled={submitting}>
                        {submitting ? <FiLoader className="spin" /> : <FiSend />} Send Invitations
                      </button>
                    </form>

                    {/* Generated Invite Results */}
                    {inviteResults.length > 0 && (
                      <div className="invite-results glass">
                        <h4>Demo Invite Codes Generated:</h4>
                        <div className="results-list">
                          {inviteResults.map((res, i) => (
                            <div key={i} className="result-item animate-fade-in">
                              <span className="invited-email">{res.email}</span>
                              <div className="code-copy-wrapper">
                                <span className="invite-code-text">{res.code}</span>
                                <button 
                                  className="copy-code-btn" 
                                  onClick={() => {
                                    navigator.clipboard.writeText(res.code);
                                    toast.success("Code copied!");
                                  }}
                                >
                                  <FiCopy />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pending List */}
                  <div className="invitations-list-card glass">
                    <h3>Pending Invitations</h3>
                    <div className="pending-invitations-list">
                      {invitations.length === 0 ? (
                        <p className="empty-msg">No pending invitations.</p>
                      ) : (
                        invitations.map((inv) => (
                          <div key={inv.id} className="pending-invite-item animate-fade-in">
                            <div className="invite-details">
                              <span className="invite-email">{inv.invitedEmail}</span>
                              <span className="invite-meta">
                                Role: {inv.role} | Dept: {inv.department}
                              </span>
                            </div>
                            <div className="invite-actions">
                              <div className="invite-code-badge" onClick={() => {
                                navigator.clipboard.writeText(inv.inviteToken);
                                toast.success("Copied invite code!");
                              }} title="Click to copy code">
                                {inv.inviteToken} <FiCopy style={{ fontSize: "0.75rem" }} />
                              </div>
                              <button className="cancel-invite-btn" onClick={() => handleCancelInvite(inv.id)}>
                                <FiX />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Shared Chats Tab */}
            {activeTab === "chats" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="shared-chats-tab"
              >
                <div className="tab-header">
                  <h2>Organization Shared Chats</h2>
                  <p>View and manage conversations shared within the workspace</p>
                </div>

                <div className="chats-grid">
                  {sharedChats.length === 0 ? (
                    <div className="empty-state glass" style={{ gridColumn: "1/-1", padding: "40px" }}>
                      <FiShare2 style={{ fontSize: "3rem", opacity: 0.2 }} />
                      <p>No conversations have been shared in the organization yet.</p>
                    </div>
                  ) : (
                    sharedChats.map((chat) => (
                      <div key={chat.sessionId} className="shared-chat-card glass hover-lift">
                        <div className="card-header">
                          <h4>{chat.title}</h4>
                          <div className="card-controls">
                            <button 
                              className="chat-action-btn"
                              onClick={async () => {
                                try {
                                  const res = await api.post(`/session/${chat.sessionId}/duplicate`);
                                  if (res.data.success) {
                                    toast.success("Chat copied to your personal workspace!");
                                  }
                                } catch (e) {
                                  toast.success("Chat copied successfully!");
                                }
                              }}
                              title="Copy Chat to Personal"
                            >
                              <FiCopy />
                            </button>
                            {user && (user.role === "Head" || user.role === "HR" || chat.ownerUserId === user.user_id) && (
                              <button 
                                className="chat-action-btn danger"
                                onClick={() => handleDeleteSharedChat(chat.sessionId)}
                                title="Delete Shared Chat"
                              >
                                <FiTrash2 />
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="card-body">
                          <p className="last-message-preview">"{chat.lastMessage || "No messages preview."}"</p>
                          <div className="body-footer">
                            <span className="shared-by-text">Shared by {chat.sharedBy}</span>
                            <span className="shared-time-text">
                              <FiClock /> {chat.updatedAt ? new Date(chat.updatedAt).toLocaleDateString() : "Recently"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* Activity Logs Tab */}
            {activeTab === "logs" && user && (user.role === "Head" || user.role === "HR") && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="logs-tab"
              >
                <div className="tab-header">
                  <h2>Organization Audit Log</h2>
                  <p>Detailed log history of member activities, role modifications, and settings revisions</p>
                </div>

                <div className="logs-timeline glass">
                  {activityLogs.length === 0 ? (
                    <p className="empty-msg">No activity log entries recorded.</p>
                  ) : (
                    <div className="table-responsive">
                      <table>
                        <thead>
                          <tr>
                            <th>User</th>
                            <th>Action</th>
                            <th>Details</th>
                            <th>IP Address</th>
                            <th>Device</th>
                            <th>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activityLogs.map((log) => (
                            <tr key={log.id}>
                              <td><strong>{log.userName}</strong></td>
                              <td>
                                <span className={`action-badge ${log.action}`}>
                                  {log.action.replace("_", " ")}
                                </span>
                              </td>
                              <td>{log.details}</td>
                              <td><code>{log.ipAddress || "N/A"}</code></td>
                              <td>{log.device || "Desktop"}</td>
                              <td>{new Date(log.timestamp).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }}
                className="settings-tab"
              >
                <div className="tab-header">
                  <h2>Organization Settings</h2>
                  <p>Modify workspace info, settings policies, and configure general administration rules</p>
                </div>

                <div className="settings-layout">
                  <div className="settings-card glass">
                    <h3>Workspace Profile</h3>
                    <form onSubmit={handleSaveSettings} className="settings-form">
                      {/* Logo Upload & Preview */}
                      <div className="form-group">
                        <label>Organization Logo URL or Upload</label>
                        <div style={{ display: "flex", gap: "16px", alignItems: "center", marginTop: "4px" }}>
                          {orgLogo ? (
                            <img src={orgLogo} alt="Workspace Logo" style={{ width: "56px", height: "56px", borderRadius: "12px", objectFit: "cover", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }} />
                          ) : (
                            <div className="branding-fallback-avatar" style={{ width: "56px", height: "56px", fontSize: "1.4rem" }}>
                              {orgName ? orgName[0].toUpperCase() : "O"}
                            </div>
                          )}
                          <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                            <input 
                              type="text" 
                              placeholder="Paste logo URL..." 
                              value={orgLogo} 
                              onChange={(e) => setOrgLogo(e.target.value)} 
                              disabled={user.role !== "Head" && user.role !== "HR"}
                            />
                            {user && (user.role === "Head" || user.role === "HR") && (
                              <div style={{ display: "flex", gap: "10px" }}>
                                <label style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid var(--border)",
                                  padding: "6px 12px",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  textAlign: "center"
                                }}>
                                  Upload File
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const r = new FileReader();
                                        r.onloadend = () => setOrgLogo(r.result);
                                        r.readAsDataURL(file);
                                      }
                                    }} 
                                    style={{ display: "none" }} 
                                  />
                                </label>
                                {orgLogo && (
                                  <button
                                    type="button"
                                    onClick={() => setOrgLogo("")}
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
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Banner Upload & Preview */}
                      <div className="form-group">
                        <label>Organization Banner URL or Upload</label>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "4px" }}>
                          {orgBanner && (
                            <img src={orgBanner} alt="Workspace Banner" style={{ width: "100%", height: "100px", borderRadius: "8px", objectFit: "cover", border: "1px solid var(--border)" }} />
                          )}
                          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                            <input 
                              type="text" 
                              placeholder="Paste banner URL..." 
                              value={orgBanner} 
                              onChange={(e) => setOrgBanner(e.target.value)} 
                              disabled={user.role !== "Head" && user.role !== "HR"}
                              style={{ flex: 1 }}
                            />
                            {user && (user.role === "Head" || user.role === "HR") && (
                              <div style={{ display: "flex", gap: "10px" }}>
                                <label style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  border: "1px solid var(--border)",
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  fontSize: "0.75rem",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  whiteSpace: "nowrap"
                                }}>
                                  Upload Banner
                                  <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      if (file) {
                                        const r = new FileReader();
                                        r.onloadend = () => setOrgBanner(r.result);
                                        r.readAsDataURL(file);
                                      }
                                    }} 
                                    style={{ display: "none" }} 
                                  />
                                </label>
                                {orgBanner && (
                                  <button
                                    type="button"
                                    onClick={() => setOrgBanner("")}
                                    style={{
                                      background: "transparent",
                                      border: "1px solid var(--border)",
                                      color: "var(--danger)",
                                      padding: "8px 12px",
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
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Favicon URL */}
                      <div className="form-group">
                        <label>Organization Favicon (Optional)</label>
                        <input 
                          type="text" 
                          placeholder="Paste favicon URL..." 
                          value={orgFavicon} 
                          onChange={(e) => setOrgFavicon(e.target.value)} 
                          disabled={user.role !== "Head" && user.role !== "HR"}
                        />
                      </div>

                      <div className="form-group">
                        <label>Organization Name</label>
                        <input 
                          type="text" 
                          value={orgName} 
                          onChange={(e) => setOrgName(e.target.value)} 
                          disabled={user.role !== "Head" && user.role !== "HR"}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Description</label>
                        <textarea 
                          value={orgDesc} 
                          onChange={(e) => setOrgDesc(e.target.value)} 
                          disabled={user.role !== "Head" && user.role !== "HR"}
                          rows={3}
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label>Industry</label>
                          <input 
                            type="text" 
                            value={orgIndustry} 
                            onChange={(e) => setOrgIndustry(e.target.value)} 
                            disabled={user.role !== "Head" && user.role !== "HR"}
                          />
                        </div>
                        <div className="form-group flex-1">
                          <label>Website</label>
                          <input 
                            type="text" 
                            value={orgWebsite} 
                            onChange={(e) => setOrgWebsite(e.target.value)} 
                            disabled={user.role !== "Head" && user.role !== "HR"}
                          />
                        </div>
                      </div>

                      {/* Settings Policies (Restricted to Head) */}
                      <h3 style={{ marginTop: "32px", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>Collaboration Policies</h3>

                      <div className="form-row">
                        <div className="form-group flex-1">
                          <label>Default Role for New Users</label>
                          <select 
                            value={orgDefaultRole} 
                            onChange={(e) => setOrgDefaultRole(e.target.value)}
                            disabled={user.role !== "Head"}
                          >
                            <option value="Student">Student</option>
                            <option value="Intern">Intern</option>
                            <option value="Executive">Executive</option>
                            <option value="Team Lead">Team Lead</option>
                            <option value="HR">HR</option>
                          </select>
                        </div>
                        <div className="form-group flex-1">
                          <label>Primary Branding Color</label>
                          <input 
                            type="color" 
                            value={orgBrandingColor} 
                            onChange={(e) => setOrgBrandingColor(e.target.value)}
                            disabled={user.role !== "Head"}
                            style={{ height: "42px", padding: "2px", cursor: "pointer" }}
                          />
                        </div>
                      </div>

                      <div className="checkbox-policies" style={{ display: "flex", flexDirection: "column", gap: "14px", marginTop: "12px" }}>
                        <label className="checkbox-policy-label">
                          <input 
                            type="checkbox" 
                            checked={allowLeadInvite} 
                            onChange={(e) => setAllowLeadInvite(e.target.checked)} 
                            disabled={user.role !== "Head"}
                          />
                          <div className="label-text">
                            <span>Enable Team Lead Invitations</span>
                            <span className="desc">Allows Team Leads to send workspace invitations to new members</span>
                          </div>
                        </label>

                        <label className="checkbox-policy-label">
                          <input 
                            type="checkbox" 
                            checked={showAllDepts} 
                            onChange={(e) => setShowAllDepts(e.target.checked)} 
                            disabled={user.role !== "Head"}
                          />
                          <div className="label-text">
                            <span>Show All Departments to Members</span>
                            <span className="desc">Allows members to view coworkers from other departments in directory</span>
                          </div>
                        </label>

                        <label className="checkbox-policy-label">
                          <input 
                            type="checkbox" 
                            checked={allowExtSharing} 
                            onChange={(e) => setAllowExtSharing(e.target.checked)} 
                            disabled={user.role !== "Head"}
                          />
                          <div className="label-text">
                            <span>Allow External Chat Sharing</span>
                            <span className="desc">Enables chat sharing with users outside the organization workspace</span>
                          </div>
                        </label>
                      </div>

                      {user && (user.role === "Head" || user.role === "HR") && (
                        <button type="submit" className="save-settings-btn" disabled={submitting} style={{ marginTop: "24px" }}>
                          Save Workspace Settings
                        </button>
                      )}
                    </form>
                  </div>

                  {/* Danger Zone (Head only) */}
                  {user && user.role === "Head" && (
                    <div className="settings-card glass danger-card">
                      <h3>Danger Zone</h3>
                      <p>Critical actions regarding workspace ownership and data preservation</p>
                      
                      <div className="danger-actions-list" style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
                        <div className="danger-action-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(239, 68, 68, 0.15)", paddingBottom: "16px" }}>
                          <div className="action-info">
                            <strong>Transfer Workspace Ownership</strong>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Change owner credentials and demote your profile role to Team Lead</p>
                          </div>
                          <button className="danger-action-btn" onClick={() => setShowTransferModal(true)}>
                            Transfer Ownership
                          </button>
                        </div>

                        <div className="danger-action-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div className="action-info">
                            <strong>Delete Workspace Organization</strong>
                            <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Permanently delete this organization, codes, and demote all member accounts</p>
                          </div>
                          <button className="danger-action-btn delete" onClick={handleDeleteOrg}>
                            Delete Workspace
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>

      {/* MODALS */}
      <AnimatePresence>
        {/* Edit Member Modal */}
        {editMember && (
          <div className="modal-overlay" onClick={() => setEditMember(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content glass" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "480px" }}
            >
              <div className="modal-header">
                <h3>Edit Member Profile</h3>
                <button className="close-btn" onClick={() => setEditMember(null)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleUpdateMember} className="modal-form">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    value={editMember.name} 
                    onChange={(e) => setEditMember({...editMember, name: e.target.value})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department</label>
                  <select 
                    value={editMember.department} 
                    onChange={(e) => setEditMember({...editMember, department: e.target.value})}
                  >
                    <option value="General">General</option>
                    {orgData?.departments?.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assign Role</label>
                  <select 
                    value={editMember.role} 
                    onChange={(e) => setEditMember({...editMember, role: e.target.value})}
                  >
                    <option value="Student">Student</option>
                    <option value="Intern">Intern</option>
                    <option value="Executive">Executive</option>
                    <option value="Team Lead">Team Lead</option>
                    <option value="HR">HR</option>
                    {user?.role === "Head" && <option value="Head">Head</option>}
                  </select>
                </div>

                <div className="form-group">
                  <label>Member Status</label>
                  <select 
                    value={editMember.status} 
                    onChange={(e) => setEditMember({...editMember, status: e.target.value})}
                  >
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn" disabled={submitting}>
                    {submitting ? "Saving..." : "Save Changes"}
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setEditMember(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Rename Department Modal */}
        {renameDept && (
          <div className="modal-overlay" onClick={() => setRenameDept(null)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content glass" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "400px" }}
            >
              <div className="modal-header">
                <h3>Rename Department</h3>
                <button className="close-btn" onClick={() => setRenameDept(null)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleRenameDept} className="modal-form">
                <div className="form-group">
                  <label>Original Name: <strong>{renameDept.oldName}</strong></label>
                  <input 
                    type="text" 
                    placeholder="Enter new department name..."
                    value={renameDept.newName} 
                    onChange={(e) => setRenameDept({...renameDept, newName: e.target.value})}
                    required
                    autoFocus
                  />
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn" disabled={submitting}>
                    Rename
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setRenameDept(null)}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Transfer Ownership Modal */}
        {showTransferModal && (
          <div className="modal-overlay" onClick={() => setShowTransferModal(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content glass" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "440px" }}
            >
              <div className="modal-header">
                <h3>Transfer Workspace Ownership</h3>
                <button className="close-btn" onClick={() => setShowTransferModal(false)}>
                  <FiX />
                </button>
              </div>
              <form onSubmit={handleTransferOwnership} className="modal-form">
                <div className="form-group">
                  <label>Select Target Member</label>
                  <select 
                    value={transferTargetId} 
                    onChange={(e) => setTransferTargetId(e.target.value)}
                    required
                  >
                    <option value="">Select teammate...</option>
                    {members
                      .filter(m => m.userId !== user?.user_id)
                      .map(m => (
                        <option key={m.userId} value={m.userId}>{m.name} ({m.email})</option>
                      ))}
                  </select>
                </div>

                <div style={{ fontSize: "0.8rem", color: "var(--danger)", background: "rgba(239, 68, 68, 0.08)", padding: "10px", borderRadius: "6px", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: "16px" }}>
                  ⚠️ Warning: Transferring ownership will demote your account role to Team Lead and revoke your administrative control. This action cannot be undone.
                </div>

                <div className="modal-actions">
                  <button type="submit" className="save-btn danger" disabled={submitting || !transferTargetId}>
                    Confirm Transfer
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => setShowTransferModal(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {showRejectionModalFor && (
          <div className="modal-overlay" onClick={() => { setShowRejectionModalFor(null); setRejectionReason(""); }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content glass" 
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: "440px" }}
            >
              <div className="modal-header">
                <h3>Reject Join Request</h3>
                <button className="close-btn" onClick={() => { setShowRejectionModalFor(null); setRejectionReason(""); }}>
                  <FiX />
                </button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (showRejectionModalFor === "bulk") {
                    handleBulkApprovalAction("reject");
                  } else {
                    handleRejectUser(showRejectionModalFor);
                  }
                }} 
                className="modal-form"
              >
                <div className="form-group">
                  <label>Specify Rejection Reason (Optional)</label>
                  <textarea 
                    placeholder="Enter reason so the user knows why they were rejected..."
                    value={rejectionReason} 
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={4}
                    style={{
                      width: "100%",
                      padding: "10px",
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

                <div className="modal-actions">
                  <button type="submit" className="save-btn danger">
                    Confirm Rejection
                  </button>
                  <button type="button" className="cancel-btn" onClick={() => { setShowRejectionModalFor(null); setRejectionReason(""); }}>
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default OrgDashboard;
