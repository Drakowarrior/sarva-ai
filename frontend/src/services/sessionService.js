import api from "./api";

export const createSession = async (title = "New Chat", sessionId = null) => {
  const response = await api.post(
    "/session/create",
    {
      title,
      session_id: sessionId
    }
  );

  return response.data;
};

export const getSessions = async () => {
  const response = await api.get(
    "/sessions"
  );

  return response.data;
};

export const deleteSession = async (
  sessionId
) => {
  const response = await api.delete(
    `/session/${sessionId}`
  );

  return response.data;
};