import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  createSession as createSessionApi,
  getSessions,
  deleteSession as deleteSessionApi,
} from "../services/sessionService";
import { getMessages } from "../services/chatService";
import api from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const generateSessionId = () => {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let randomPrefix = "";
  for (let i = 0; i < 8; i++) {
    randomPrefix += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${randomPrefix}_${Date.now()}`;
};

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const userId = localStorage.getItem("sarvaai_user_id") || (() => {
    const chars = "0123456789abcdef";
    let hex = "";
    for (let i = 0; i < 24; i++) {
      hex += chars[Math.floor(Math.random() * 16)];
    }
    localStorage.setItem("sarvaai_user_id", hex);
    return hex;
  })();
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(
    localStorage.getItem("currentSessionId") || null
  );
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [feedbackPromptMessage, setFeedbackPromptMessage] = useState(
    "Before you leave, would you like to share your experience with us? Your feedback helps us improve."
  );

  const triggerFeedback = (onConfirm) => {
    // Only prompt if there are messages in the current chat session
    if (messages.length === 0) {
      onConfirm();
      return;
    }
    setPendingNavigation(() => onConfirm);
    setIsFeedbackOpen(true);
  };

  const loadMessages = async (sessionId) => {
    if (!sessionId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setMessages([]); // Clear messages immediately to prevent flash of old chats
    try {
      const data = await getMessages(sessionId);
      setMessages(data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshSessionsList = async () => {
    try {
      const data = await getSessions();
      setSessions(data || []);
      return data;
    } catch (error) {
      console.error("Failed to refresh sessions list:", error);
      return [];
    }
  };

  const loadSessions = async () => {
    try {
      const data = await getSessions();
      setSessions(data || []);

      // Check for new shared sessions to notify the recipient
      if (data && data.length > 0) {
        const notifiedStr = localStorage.getItem("notified_shared_sessions") || "[]";
        let notifiedIds = [];
        try {
          notifiedIds = JSON.parse(notifiedStr);
        } catch (e) {
          notifiedIds = [];
        }

        let newlyNotified = false;
        data.forEach((session) => {
          if (session.isShared && !notifiedIds.includes(session.session_id)) {
            const senderName = session.sharedBy || "Someone";
            toast.success(`${senderName} shared a chat with you! 🟣`, {
              duration: 6000,
              icon: "📣"
            });
            notifiedIds.push(session.session_id);
            newlyNotified = true;
          }
        });

        if (newlyNotified) {
          localStorage.setItem("notified_shared_sessions", JSON.stringify(notifiedIds));
        }
      }
      
      const storedId = localStorage.getItem("currentSessionId");
      if (data && data.length > 0) {
        const activeExists = data.some(s => s.session_id === storedId);
        if (activeExists) {
          setCurrentSession(storedId);
          await loadMessages(storedId);
        } else {
          // Default to the first session if the saved one doesn't exist
          const firstSession = data[0].session_id;
          setCurrentSession(firstSession);
          localStorage.setItem("currentSessionId", firstSession);
          await loadMessages(firstSession);
        }
      } else {
        const newSessionId = generateSessionId();
        setCurrentSession(newSessionId);
        localStorage.setItem("currentSessionId", newSessionId);
        setMessages([]);
        try {
          await createSessionApi("New Chat", newSessionId);
          const updatedData = await getSessions();
          setSessions(updatedData || []);
        } catch (err) {
          console.error("Failed to automatically create default session:", err);
        }
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    }
  };

  const createSession = async (title = "New Chat") => {
    return new Promise((resolve, reject) => {
      triggerFeedback(async () => {
        try {
          const newSessionId = generateSessionId();
          const data = await createSessionApi(title, newSessionId);
          await loadSessions();
          setCurrentSession(data.session_id);
          localStorage.setItem("currentSessionId", data.session_id);
          await loadMessages(data.session_id);
          resolve(data);
        } catch (error) {
          console.error("Failed to create new session:", error);
          reject(error);
        }
      });
    });
  };

  const deleteSession = async (sessionId) => {
    try {
      await deleteSessionApi(sessionId);
      
      let nextSessionId = null;
      if (currentSession === sessionId) {
        const remaining = sessions.filter(s => s.session_id !== sessionId);
        if (remaining.length > 0) {
          nextSessionId = remaining[0].session_id;
        }
      } else {
        nextSessionId = currentSession;
      }
      
      await refreshSessionsList();
      
      if (nextSessionId) {
        setCurrentSession(nextSessionId);
        localStorage.setItem("currentSessionId", nextSessionId);
        await loadMessages(nextSessionId);
      } else {
        setCurrentSession(null);
        localStorage.removeItem("currentSessionId");
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to delete session:", error);
      throw error;
    }
  };

  const selectSession = async (sessionId) => {
    if (currentSession === sessionId) return;

    triggerFeedback(async () => {
      setCurrentSession(sessionId);
      localStorage.setItem("currentSessionId", sessionId);
      await loadMessages(sessionId);
    });
  };

  const restoreSession = async () => {
    const storedId = localStorage.getItem("currentSessionId");
    if (storedId) {
      setCurrentSession(storedId);
      await loadMessages(storedId);
    }
  };

  const renameSession = async (sessionId, newTitle) => {
    try {
      await api.patch(`/session/${sessionId}`, { title: newTitle });
      await refreshSessionsList();
    } catch (error) {
      console.error("Failed to rename session:", error);
    }
  };

  const togglePinSession = async (sessionId, currentPinned) => {
    try {
      await api.patch(`/session/${sessionId}/pin`, { pinned: !currentPinned });
      await refreshSessionsList();
    } catch (error) {
      console.error("Failed to toggle pin state:", error);
    }
  };

  const toggleFavoriteSession = async (sessionId, currentFavorite) => {
    try {
      await api.patch(`/session/${sessionId}/favorite`, { favorite: !currentFavorite });
      await refreshSessionsList();
    } catch (error) {
      console.error("Failed to toggle favorite state:", error);
    }
  };

  const duplicateSession = async (sessionId) => {
    try {
      const response = await api.post(`/session/${sessionId}/duplicate`);
      if (response.data.success) {
        toast.success("Chat duplicated!");
        await refreshSessionsList();
        if (response.data.session_id) {
          setCurrentSession(response.data.session_id);
          localStorage.setItem("currentSessionId", response.data.session_id);
          await loadMessages(response.data.session_id);
        }
      } else {
        toast.error(response.data.error || "Failed to duplicate chat");
      }
    } catch (error) {
      console.error("Failed to duplicate session:", error);
      toast.error("Failed to duplicate session");
    }
  };

  const clearAllSessions = async () => {
    try {
      await api.delete("/sessions");
      setSessions([]);
      setCurrentSession(null);
      localStorage.removeItem("currentSessionId");
      setMessages([]);
    } catch (error) {
      console.error("Failed to clear sessions:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadSessions();
    } else {
      setSessions([]);
      setCurrentSession(null);
      setMessages([]);
    }
  }, [isAuthenticated]);

  return (
    <SessionContext.Provider
      value={{
        userId,
        sessions,
        messages,
        setMessages,
        currentSession,
        selectedSession: currentSession, // Alias matching requirement spec
        loading,
        setLoading,
        createSession,
        deleteSession,
        selectSession,
        loadMessages,
        restoreSession,
        renameSession,
        togglePinSession,
        toggleFavoriteSession,
        clearAllSessions,
        duplicateSession,
        
        // Feedback trigger states
        isFeedbackOpen,
        setIsFeedbackOpen,
        pendingNavigation,
        setPendingNavigation,
        feedbackPromptMessage,
        setFeedbackPromptMessage,
        triggerFeedback,
        
        // Backward-compatible aliases to avoid breaking any other file
        newSession: createSession,
        removeSession: deleteSession,
        setCurrentSession: selectSession,
        loadSessions,
        refreshSessionsList
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);