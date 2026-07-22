import { useState } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FiCopy, FiCheck, FiRotateCw, FiFileText, FiImage, FiCpu, FiUser, FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { useSession } from "../../context/SessionContext";
import DislikeFeedbackModal from "../DislikeFeedbackModal/DislikeFeedbackModal";
import api from "../../services/api";
import toast from "react-hot-toast";

function CodeBlock({ children, language, ...props }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const codeText = String(children).replace(/\n$/, "");
  const lineCount = codeText.split("\n").length;
  const isLong = lineCount > 18;

  return (
    <div style={{ position: "relative" }} className="code-block-wrapper">
      <div
        className="code-block-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#1e293b",
          padding: "6px 12px",
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          fontSize: "0.75rem",
          color: "#94a3b8"
        }}
      >
        <span style={{ textTransform: "uppercase" }}>{language}</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {isLong && (
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                fontSize: "0.75rem",
                outline: "none"
              }}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </button>
          )}
          <button
            className="code-copy-btn"
            onClick={() => {
              navigator.clipboard.writeText(codeText);
              toast.success("Code copied!");
            }}
            style={{
              background: "transparent",
              border: "none",
              color: "#94a3b8",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <FiCopy /> Copy
          </button>
        </div>
      </div>

      <div style={{ 
        maxHeight: isExpanded ? "none" : "120px", 
        overflow: "hidden", 
        position: "relative",
        borderBottomLeftRadius: "8px",
        borderBottomRightRadius: "8px"
      }}>
        <SyntaxHighlighter
          style={atomDark}
          language={language}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: isExpanded ? "8px" : 0,
            borderBottomRightRadius: isExpanded ? "8px" : 0,
            background: "#0f172a"
          }}
          {...props}
        >
          {codeText}
        </SyntaxHighlighter>
        
        {!isExpanded && (
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "50px",
            background: "linear-gradient(transparent, #0f172a)",
            pointerEvents: "none"
          }} />
        )}
      </div>
    </div>
  );
}

function ChatBubble({ message, messageIndex, isLast, onRegenerate }) {
  const { _id: messageId, role, message: text, files = [] } = message;
  const isUser = role === "user";
  const [copied, setCopied] = useState(false);
  const [isDislikeOpen, setIsDislikeOpen] = useState(false);

  const { messages, setMessages, currentSession, userId } = useSession();
  const feedback = message.feedback || null;

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = async () => {
    if (!messageId) return;
    const isClearing = feedback?.type === "like";
    try {
      const userMessageObj = messageIndex > 0 ? messages[messageIndex - 1] : null;
      const userMessageText = userMessageObj ? (userMessageObj.message || userMessageObj.content || "") : "";
      
      const conversationHistory = messages.slice(0, messageIndex + 1).map((msg) => ({
        role: msg.role,
        content: msg.message || msg.content || ""
      }));

      await api.post(`/message/${messageId}/feedback`, {
        type: isClearing ? "none" : "like",
        sessionId: currentSession,
        userId: userId,
        messageId: messageId,
        timestamp: message.timestamp || new Date().toISOString(),
        userMessage: userMessageText,
        assistantMessage: text,
        messageIndex: messageIndex,
        conversation: conversationHistory
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, feedback: isClearing ? null : { type: "like", options: [], comments: "" } } : msg
        )
      );
      if (isClearing) {
        toast.success("Feedback removed.");
      } else {
        toast.success("Thank you for your feedback! We're glad the response was helpful.");
      }
    } catch (error) {
      console.error("Failed to submit message like:", error);
      toast.error("Failed to submit feedback.");
    }
  };

  const handleDislikeSubmit = async (options, comments) => {
    if (!messageId) return;
    try {
      const userMessageObj = messageIndex > 0 ? messages[messageIndex - 1] : null;
      const userMessageText = userMessageObj ? (userMessageObj.message || userMessageObj.content || "") : "";

      const conversationHistory = messages.slice(0, messageIndex + 1).map((msg) => ({
        role: msg.role,
        content: msg.message || msg.content || ""
      }));

      await api.post(`/message/${messageId}/feedback`, {
        type: "dislike",
        options,
        comments,
        sessionId: currentSession,
        userId: userId,
        messageId: messageId,
        timestamp: message.timestamp || new Date().toISOString(),
        userMessage: userMessageText,
        assistantMessage: text,
        messageIndex: messageIndex,
        conversation: conversationHistory
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, feedback: { type: "dislike", options, comments } } : msg
        )
      );
      toast.success("Thank you for helping us improve our responses.");
      setIsDislikeOpen(false);
    } catch (error) {
      console.error("Failed to submit message dislike:", error);
      toast.error("Failed to submit feedback.");
    }
  };

  const handleDislikeSkip = async () => {
    if (!messageId) return;
    try {
      const userMessageObj = messageIndex > 0 ? messages[messageIndex - 1] : null;
      const userMessageText = userMessageObj ? (userMessageObj.message || userMessageObj.content || "") : "";

      const conversationHistory = messages.slice(0, messageIndex + 1).map((msg) => ({
        role: msg.role,
        content: msg.message || msg.content || ""
      }));

      await api.post(`/message/${messageId}/feedback`, {
        type: "dislike",
        options: [],
        comments: "",
        sessionId: currentSession,
        userId: userId,
        messageId: messageId,
        timestamp: message.timestamp || new Date().toISOString(),
        userMessage: userMessageText,
        assistantMessage: text,
        messageIndex: messageIndex,
        conversation: conversationHistory
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, feedback: { type: "dislike", options: [], comments: "" } } : msg
        )
      );
      toast.success("Thank you for helping us improve our responses.");
      setIsDislikeOpen(false);
    } catch (error) {
      console.error("Failed to skip message dislike:", error);
      toast.error("Failed to submit feedback.");
    }
  };

  const handleClearDislike = async () => {
    if (!messageId) return;
    try {
      await api.post(`/message/${messageId}/feedback`, {
        type: "none",
        sessionId: currentSession,
        userId: userId
      });
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, feedback: null } : msg
        )
      );
      toast.success("Feedback removed.");
    } catch (error) {
      console.error("Failed to remove dislike feedback:", error);
      toast.error("Failed to remove feedback.");
    }
  };

  const handleFileClick = (file) => {
    if (file.file_url) {
      window.open(file.file_url, "_blank");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`message-wrapper ${role}`}
    >
      <div className={`avatar ${role}`}>
        {isUser ? (
          <FiUser />
        ) : (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ width: "1.2rem", height: "1.2rem", color: "var(--accent)" }}
          >
            <path d="M12 2c-.5 0-.9.3-1.1.7L9.2 7.2 4.7 8.9c-.4.2-.7.6-.7 1.1s.3.9.7 1.1l4.5 1.7 1.7 4.5c.2.4.6.7 1.1.7s.9-.3 1.1-.7l1.7-4.5 4.5-1.7c.4-.2.7-.6.7-1.1s-.3-.9-.7-1.1l-4.5-1.7-1.7-4.5C12.9 2.3 12.5 2 12 2zm6 11c-.3 0-.5.1-.6.4l-.8 2.1-2.1.8c-.3.1-.4.3-.4.6s.1.5.4.6l2.1.8.8 2.1c.1.3.3.4.6.4s.5-.1.6-.4l.8-2.1 2.1-.8c.3-.1.4-.3.4-.6s-.1-.5-.4-.6l-2.1-.8-.8-2.1c-.1-.3-.3-.4-.6-.4z" />
          </svg>
        )}
      </div>

      <div className="message-bubble">
        {/* Render Attachments (if any) */}
        {files && files.length > 0 && (
          <div className="message-attachments">
            {files.map((file, idx) => {
              const fileType = file.file_type?.toLowerCase();
              const isImage = ["png", "jpg", "jpeg", "webp"].includes(fileType);
              
              if (isImage) {
                return (
                  <img
                    key={idx}
                    src={file.file_url}
                    alt={file.filename}
                    className="attachment-image-preview"
                    onClick={() => handleFileClick(file)}
                    onLoad={() => window.dispatchEvent(new Event("sarvaai-scroll-chat"))}
                  />
                );
              } else {
                return (
                  <div
                    key={idx}
                    className="attachment-badge"
                    onClick={() => handleFileClick(file)}
                    title="Click to view file"
                  >
                    <FiFileText style={{ color: "#38bdf8" }} />
                    <span>{file.filename}</span>
                  </div>
                );
              }
            })}
          </div>
        )}

        {/* Message Content */}
        <div className="message-content">
          {isUser ? (
            <p style={{ whiteSpace: "pre-wrap" }}>{text}</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <ReactMarkdown
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    const isInline = !match;
                    return !isInline ? (
                      <CodeBlock language={match[1]} {...props}>
                        {children}
                      </CodeBlock>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }
                }}
              >
                {text}
              </ReactMarkdown>
              {message.isStreaming && <span className="streaming-cursor" />}
            </div>
          )}
        </div>

        {/* Message Actions */}
        <div className="message-actions">
          <button onClick={handleCopy} className="message-action-btn" title="Copy Message">
            {copied ? <FiCheck style={{ color: "#10b981" }} /> : <FiCopy />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
          
          {!isUser && messageId && (
            <>
              <button
                onClick={handleLike}
                className={`message-action-btn ${feedback?.type === "like" ? "active" : ""}`}
                style={{ color: feedback?.type === "like" ? "var(--success)" : "inherit" }}
                title="Like Response"
              >
                <FiThumbsUp />
                <span>Like</span>
              </button>
              <button
                onClick={() => {
                  if (feedback?.type === "dislike") {
                    handleClearDislike();
                  } else {
                    setIsDislikeOpen(true);
                  }
                }}
                className={`message-action-btn ${feedback?.type === "dislike" ? "active" : ""}`}
                style={{ color: feedback?.type === "dislike" ? "var(--danger)" : "inherit" }}
                title="Dislike Response"
              >
                <FiThumbsDown />
                <span>Dislike</span>
              </button>
            </>
          )}

          {!isUser && isLast && (
            <button onClick={onRegenerate} className="message-action-btn" title="Regenerate Response">
              <FiRotateCw />
              <span>Regenerate</span>
            </button>
          )}
        </div>

        {/* Modal for dislike comments */}
        <DislikeFeedbackModal
          isOpen={isDislikeOpen}
          onClose={() => setIsDislikeOpen(false)}
          onSubmit={handleDislikeSubmit}
          onSkip={handleDislikeSkip}
        />
      </div>
    </motion.div>
  );
}

export default ChatBubble;
