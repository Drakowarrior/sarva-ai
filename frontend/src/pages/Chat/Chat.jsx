import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";
import Settings from "../../components/Settings/Settings";
import ShareModal from "../../components/ShareModal/ShareModal";
import { useSession } from "../../context/SessionContext";
import { useChat } from "../../context/ChatContext";

function Chat() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareSessionId, setShareSessionId] = useState(null);

  const { currentSession, sessions, messages } = useSession();
  const { exportChatAsTXT, exportChatAsPDF } = useChat();

  const activeSession = sessions.find(s => s.session_id === currentSession);
  const activeTitle = activeSession ? activeSession.title : "New Chat";

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openSettings = () => {
    setSettingsOpen(true);
  };

  const closeSettings = () => {
    setSettingsOpen(false);
  };

  const handleOpenShare = (sessionId) => {
    setShareSessionId(sessionId || currentSession);
    setShareOpen(true);
  };

  const handleCloseShare = () => {
    setShareOpen(false);
    setShareSessionId(null);
  };

  return (
    <div className="chat-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onOpenSettings={openSettings}
        onOpenShare={handleOpenShare}
      />

      {/* Overlay to close mobile sidebar drawer */}
      {sidebarOpen && (
        <div
          className="modal-overlay"
          style={{ zIndex: 90, background: "rgba(0,0,0,0.4)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="chat-main">
        <Navbar
          onToggleSidebar={toggleSidebar}
          onOpenSettings={openSettings}
          onOpenShare={() => handleOpenShare(currentSession)}
        />

        <ChatWindow />

        <ChatInput />
      </main>

      <Settings
        isOpen={settingsOpen}
        onClose={closeSettings}
      />

      <ShareModal
        isOpen={shareOpen}
        onClose={handleCloseShare}
        sessionId={shareSessionId}
      />
    </div>
  );
}

export default Chat;