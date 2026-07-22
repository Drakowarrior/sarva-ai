import { useEffect, useRef, useState } from "react";
import { useChat } from "../../context/ChatContext";
import { useSession } from "../../context/SessionContext";
import ChatBubble from "../ChatBubble/ChatBubble";
import EmptyState from "../EmptyState/EmptyState";
import TypingIndicator from "../TypingIndicator/TypingIndicator";
import { motion } from "framer-motion";

const MessageSkeleton = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%", padding: "20px 0" }}>
      {[1, 2, 3].map((n) => (
        <div key={n} className={`message-wrapper ${n % 2 === 0 ? "assistant" : "user"}`}>
          <div className={`avatar ${n % 2 === 0 ? "assistant" : "user"}`} />
          <div className="message-bubble" style={{ width: "100%", maxWidth: n % 2 === 0 ? "60%" : "40%" }}>
            <div className="message-content" style={{ padding: "14px 18px", background: "var(--chat-ai-bg)", border: "1px solid var(--border)", borderRadius: "16px" }}>
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                style={{
                  height: "14px",
                  background: "var(--border)",
                  borderRadius: "4px",
                  width: "100%",
                  marginBottom: "8px"
                }}
              />
              <motion.div
                animate={{ opacity: [0.4, 0.7, 0.4] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                style={{
                  height: "14px",
                  background: "var(--border)",
                  borderRadius: "4px",
                  width: "75%"
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

function ChatWindow() {
  const { 
    messages, 
    loading, 
    sendChatMessage, 
    regenerateLastResponse,
    messageSearchQuery
  } = useChat();
  const { currentSession, sessions } = useSession();
  const activeSession = sessions.find(s => s.session_id === currentSession);
  const activeTitle = activeSession ? activeSession.title : "New Chat";

  const [showScrollButton, setShowScrollButton] = useState(false);
  const containerRef = useRef(null);
  const lastSessionIdRef = useRef(null);
  const autoScrollRef = useRef(true);

  const scrollToBottom = (force = false) => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    if (force || autoScrollRef.current) {
      // Use microtask deferral to ensure rendering has completed
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            top: containerRef.current.scrollHeight,
            behavior: "smooth"
          });
        }
      }, 50);
    }
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    
    // Check if the user is at/near the bottom within 150px
    const threshold = 150;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    autoScrollRef.current = isNearBottom;

    const isFar = container.scrollHeight - container.scrollTop - container.clientHeight > 200;
    setShowScrollButton(isFar);
  };

  // Switch session: Snap scroll instantly to bottom
  useEffect(() => {
    if (containerRef.current && currentSession) {
      if (lastSessionIdRef.current !== currentSession) {
        setTimeout(() => {
          if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
            autoScrollRef.current = true;
          }
        }, 50);
        lastSessionIdRef.current = currentSession;
      }
    }
  }, [currentSession, messages]);

  // Message or loading updates
  useEffect(() => {
    if (!messageSearchQuery && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      const isUserMsg = lastMessage?.role === "user";
      if (isUserMsg) {
        autoScrollRef.current = true;
      }
      scrollToBottom(isUserMsg);
    }
  }, [messages, loading, messageSearchQuery]);

  // Listen for media element loads (like uploaded images)
  useEffect(() => {
    const handleScrollEvent = () => {
      scrollToBottom(false);
    };
    window.addEventListener("sarvaai-scroll-chat", handleScrollEvent);
    return () => window.removeEventListener("sarvaai-scroll-chat", handleScrollEvent);
  }, []);

  const handleSelectPrompt = (promptText) => {
    if (currentSession) {
      sendChatMessage(currentSession, promptText);
    } else {
      sendChatMessage(null, promptText);
    }
  };

  const handleRegenerate = () => {
    if (currentSession) {
      regenerateLastResponse(currentSession);
    }
  };

  // Client-side message filtering
  const filteredMessages = messages.filter((msg) =>
    (msg.message || msg.content || "").toLowerCase().includes(messageSearchQuery.toLowerCase())
  );

  return (
    <div ref={containerRef} onScroll={handleScroll} className="chat-window" style={{ position: "relative" }}>
      {/* Print Only Document Header */}
      <div className="print-only-header">
        <h1>{activeTitle}</h1>
        <p>SARVA AI Chat Transcript — {new Date().toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</p>
      </div>

      {loading && messages.length === 0 ? (
        <MessageSkeleton />
      ) : messages.length === 0 ? (
        <EmptyState onSelectPrompt={handleSelectPrompt} />
      ) : messageSearchQuery && filteredMessages.length === 0 ? (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          color: "var(--text-secondary)",
          fontSize: "0.95rem"
        }}>
          🔍 No messages match "{messageSearchQuery}"
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px", width: "100%" }}>
          {filteredMessages.map((msg, index) => {
            const originalIndex = messages.indexOf(msg);
            return (
              <ChatBubble
                key={msg._id || originalIndex}
                message={msg}
                messageIndex={originalIndex}
                isLast={originalIndex === messages.length - 1}
                onRegenerate={handleRegenerate}
              />
            );
          })}
        </div>
      )}

      {loading && !messageSearchQuery && <TypingIndicator />}

      {/* Floating Scroll to Bottom button */}
      {showScrollButton && (
        <button
          className="scroll-to-bottom-btn glass"
          onClick={() => scrollToBottom(true)}
          style={{
            position: "absolute",
            bottom: "24px",
            right: "24px",
            zIndex: 99,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "var(--shadow-lg)",
            cursor: "pointer",
            color: "var(--text-primary)",
            transition: "all 0.2s ease"
          }}
          title="Scroll to bottom"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </button>
      )}
    </div>
  );
}

export default ChatWindow;