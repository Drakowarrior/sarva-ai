import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import ChatWindow from "../../components/ChatWindow/ChatWindow";
import ChatInput from "../../components/ChatInput/ChatInput";
import Settings from "../../components/Settings/Settings";
import ShareModal from "../../components/ShareModal/ShareModal";
import { useSession } from "../../context/SessionContext";
import useSeo from "../../hooks/useSeo";

function Chat() {
  useSeo({
    title: "SARVA AI - Chat Workspace",
    description: "Private AI Workspace and Chat Interface",
    robots: "noindex, follow"
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [shareSessionId, setShareSessionId] = useState(null);

  const { currentSession } = useSession();

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

      {/* Mobile sidebar backdrop */}
      <div
        className={`sidebar-backdrop ${sidebarOpen ? "visible" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <main className="chat-main">
        <h1 className="sr-only">SARVA AI Chat Interface</h1>
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