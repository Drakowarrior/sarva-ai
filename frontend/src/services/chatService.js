import api from "./api";

export const sendMessage = async (
  sessionId,
  messages,
  userId
) => {

  const response = await api.post(
    "/chat",
    {
      sessionId,
      messages,
      userId,
    }
  );

  return response.data;
};

export const getMessages = async (
  sessionId
) => {

  const response = await api.get(
    `/messages/${sessionId}`
  );

  return response.data;
};