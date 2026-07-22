import {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import api from "../services/api";
import { useSession } from "./SessionContext";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const ChatContext = createContext();

// Configuration
const WS_RESPONSE_TIMEOUT_MS = 15000; // 15 seconds before falling back to HTTP
const MAX_RECONNECT_ATTEMPTS = 5;

export const ChatProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { 
    messages, 
    setMessages, 
    loading, 
    setLoading, 
    refreshSessionsList 
  } = useSession();
  
  // Ref to track the absolute latest messages array to prevent stale closure lagging
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Model & Language choices
  const [selectedModel, setSelectedModel] = useState(() => {
    const stored = localStorage.getItem("selectedModel");
    const validModels = ["meta-llama/llama-4-scout-17b-16e-instruct", "qwen/qwen3-32b", "llama-3.1-8b-instant"];
    if (stored && validModels.includes(stored)) {
      return stored;
    }
    localStorage.setItem("selectedModel", "meta-llama/llama-4-scout-17b-16e-instruct");
    return "meta-llama/llama-4-scout-17b-16e-instruct";
  });
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("selectedLanguage") || "English"
  );
  
  // File uploads queue
  const [attachedFiles, setAttachedFiles] = useState([]);

  // Message Search Query
  const [messageSearchQuery, setMessageSearchQuery] = useState("");

  // REST Streaming placeholder states (for backward compatibility)
  const connectionStatus = "Connected";
  const isGenerating = loading;
  const stopGenerating = () => {};

  const sendChatMessage = async (sessionId, text, filesOverride = null, messagesOverride = null) => {
    if (!text.trim() && !(filesOverride || attachedFiles).length) return;

    const filesToSend = filesOverride !== null ? filesOverride : attachedFiles;
    
    const userMessageId = `user_msg_${Math.random().toString(36).substr(2, 9)}`;
    const userMessage = {
      _id: userMessageId,
      messageId: userMessageId,
      role: "user",
      message: text,
      content: text,
      files: filesToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setAttachedFiles([]); // Reset uploads queue
    setLoading(true);

    let processedText = text;
    if (selectedLanguage !== "English") {
      processedText = `${text}\n\n[Please respond in ${selectedLanguage}]`;
    }

    const userId = localStorage.getItem("sarvaai_user_id");
    const currentHistory = messagesOverride !== null ? messagesOverride : messagesRef.current;

    const apiMessages = [
      ...currentHistory.map((msg) => ({
        role: msg.role,
        content: msg.message || msg.content || ""
      }))
    ];

    try {
      const response = await api.post("/chat", {
        messages: [...apiMessages, { role: "user", content: processedText }],
        sessionId: sessionId,
        userId: userId,
        model: selectedModel,
        files: filesToSend,
        messageId: userMessageId
      });

      setMessages((prev) => [
        ...prev,
        response.data.message || {
          role: "assistant",
          message: response.data.response,
          content: response.data.response,
          timestamp: new Date().toISOString()
        }
      ]);
      setLoading(false);
      await refreshSessionsList();
    } catch (error) {
      console.error("[HTTP] Send chat message error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          message: `⚠️ Error: ${error?.response?.data?.detail || error.message || "Failed to get AI response."}`,
          content: `⚠️ Error: ${error?.response?.data?.detail || error.message || "Failed to get AI response."}`,
          timestamp: new Date().toISOString()
        },
      ]);
      setLoading(false);
    }
  };

  const regenerateLastResponse = async (sessionId) => {
    if (messages.length === 0 || loading) return;
    
    let lastUserMessageIndex = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        lastUserMessageIndex = i;
        break;
      }
    }

    if (lastUserMessageIndex === -1) return;

    const lastUserMessage = messages[lastUserMessageIndex];
    const trimmedHistory = messages.slice(0, lastUserMessageIndex);
    setMessages(trimmedHistory);
    
    await sendChatMessage(sessionId, lastUserMessage.message, lastUserMessage.files, trimmedHistory);
  };

  // Export Chat as TXT
  const exportChatAsTXT = (sessionTitle) => {
    if (messages.length === 0) {
      toast.error("No conversation to export.");
      return;
    }
    try {
      let content = `SARVA AI Chat Log - Session: ${sessionTitle}\n`;
      content += `Date: ${new Date().toLocaleString()}\n`;
      content += `=========================================\n\n`;
      
      messages.forEach((msg) => {
        const time = msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : "";
        content += `[${msg.role.toUpperCase()} - ${time}]\n`;
        content += `${msg.message || msg.content}\n`;
        if (msg.files && msg.files.length > 0) {
          content += `Attached: ${msg.files.map(f => f.filename).join(", ")}\n`;
        }
        content += `-----------------------------------------\n\n`;
      });

      const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `${sessionTitle.replace(/\s+/g, "_")}_transcript.txt`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Chat exported as TXT!");
    } catch (err) {
      toast.error("TXT Export failed");
    }
  };

  // Export Chat as PDF
  const exportChatAsPDF = () => {
    if (messages.length === 0) {
      toast.error("No conversation to print.");
      return;
    }
    toast.success("Opening Print Dialog...");
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Export Chat as Markdown
  const exportChatAsMarkdown = (sessionTitle) => {
    if (messages.length === 0) {
      toast.error("No conversation to export.");
      return;
    }
    try {
      let content = `# ${sessionTitle}\n\n`;
      messages.forEach((msg) => {
        content += `### **${msg.role === "user" ? "User" : "SARVA AI"}**\n`;
        content += `${msg.content || msg.message}\n\n`;
        if (msg.files && msg.files.length > 0) {
          content += `*Attached files: ${msg.files.map(f => f.filename).join(", ")}*\n\n`;
        }
      });
      const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `${sessionTitle.replace(/\s+/g, "_")}_transcript.md`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Chat exported as Markdown!");
    } catch (err) {
      toast.error("Markdown Export failed");
    }
  };

  // Export Chat as JSON
  const exportChatAsJSON = (sessionTitle) => {
    if (messages.length === 0) {
      toast.error("No conversation to export.");
      return;
    }
    try {
      const standardMsgs = messages.map((msg, idx) => ({
        sessionId: msg.session_id || "",
        userId: msg.user_id || "",
        messageId: msg._id || msg.messageId || "",
        role: msg.role,
        content: msg.content || msg.message || "",
        timestamp: msg.timestamp || "",
        messageIndex: msg.messageIndex ?? idx,
        files: msg.files || []
      }));
      const blob = new Blob([JSON.stringify(standardMsgs, null, 2)], { type: "application/json;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", url);
      downloadAnchor.setAttribute("download", `${sessionTitle.replace(/\s+/g, "_")}_transcript.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);
      toast.success("Chat exported as JSON!");
    } catch (err) {
      toast.error("JSON Export failed");
    }
  };

  const changeModel = (model) => {
    setSelectedModel(model);
    localStorage.setItem("selectedModel", model);
  };

  const changeLanguage = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem("selectedLanguage", lang);
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        loading,
        sendChatMessage,
        selectedModel,
        setSelectedModel: changeModel,
        selectedLanguage,
        setSelectedLanguage: changeLanguage,
        attachedFiles,
        setAttachedFiles,
        regenerateLastResponse,
        messageSearchQuery,
        setMessageSearchQuery,
        exportChatAsTXT,
        exportChatAsPDF,
        exportChatAsMarkdown,
        exportChatAsJSON,
        
        // WS streaming exports
        connectionStatus,
        isGenerating,
        stopGenerating
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);