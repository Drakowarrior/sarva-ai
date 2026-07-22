import api from "./api";

export const getMyOrg = async () => {
  const response = await api.get("/organizations/my");
  return response.data;
};

export const updateOrg = async (payload) => {
  const response = await api.put("/organizations/my", payload);
  return response.data;
};

export const deleteOrg = async () => {
  const response = await api.delete("/organizations/my");
  return response.data;
};

export const transferOwnership = async (targetUserId) => {
  const response = await api.post("/organizations/transfer", { targetUserId });
  return response.data;
};

export const getMembers = async () => {
  const response = await api.get("/organizations/members");
  return response.data;
};

export const updateMemberDetails = async (targetUserId, payload) => {
  const response = await api.patch(`/organizations/members/${targetUserId}`, payload);
  return response.data;
};

export const removeMember = async (targetUserId) => {
  const response = await api.delete(`/organizations/members/${targetUserId}`);
  return response.data;
};

export const archiveMember = async (targetUserId) => {
  const response = await api.post(`/organizations/members/${targetUserId}/archive`);
  return response.data;
};

export const restoreMember = async (targetUserId) => {
  const response = await api.post(`/organizations/members/${targetUserId}/restore`);
  return response.data;
};

export const bulkUpdateRole = async (userIds, role) => {
  const response = await api.patch("/organizations/members/bulk-role", { userIds, role });
  return response.data;
};

export const bulkRemoveMembers = async (userIds) => {
  const response = await api.post("/organizations/members/bulk-remove", { userIds });
  return response.data;
};

export const bulkArchiveMembers = async (userIds, archive) => {
  const response = await api.post("/organizations/members/bulk-archive", { userIds, archive });
  return response.data;
};

export const inviteMembersBulk = async (payload) => {
  const response = await api.post("/organizations/invite", payload);
  return response.data;
};

export const getInvitations = async () => {
  const response = await api.get("/organizations/invitations");
  return response.data;
};

export const cancelInvitation = async (invitationId) => {
  const response = await api.delete(`/organizations/invitations/${invitationId}`);
  return response.data;
};

export const createDepartment = async (name) => {
  const response = await api.post("/organizations/departments", { name });
  return response.data;
};

export const renameDepartment = async (oldName, newName) => {
  const response = await api.put("/organizations/departments", { oldName, newName });
  return response.data;
};

export const deleteDepartment = async (deptName) => {
  const response = await api.delete(`/organizations/departments/${deptName}`);
  return response.data;
};

export const getActivityLogs = async () => {
  const response = await api.get("/organizations/logs");
  return response.data;
};

export const getSharedChats = async () => {
  const response = await api.get("/organizations/shared-chats");
  return response.data;
};

export const deleteSharedChat = async (sessionId) => {
  const response = await api.delete(`/organizations/shared-chats/${sessionId}`);
  return response.data;
};

export const getPendingApprovals = async () => {
  const response = await api.get("/organizations/approvals/pending");
  return response.data;
};

export const approveMember = async (targetUserId) => {
  const response = await api.post(`/organizations/approvals/${targetUserId}/approve`);
  return response.data;
};

export const rejectMember = async (targetUserId, rejectedReason = "") => {
  const response = await api.post(`/organizations/approvals/${targetUserId}/reject`, { rejectedReason });
  return response.data;
};

export const bulkApproveRejectMembers = async (userIds, action, rejectedReason = "") => {
  const response = await api.post("/organizations/approvals/bulk-action", { userIds, action, rejectedReason });
  return response.data;
};

export const getNotifications = async () => {
  const response = await api.get("/organizations/notifications");
  return response.data;
};

export const markNotificationRead = async (notificationId) => {
  const response = await api.post(`/organizations/notifications/${notificationId}/read`);
  return response.data;
};
