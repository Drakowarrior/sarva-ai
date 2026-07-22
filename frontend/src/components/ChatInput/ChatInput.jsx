import { useState, useRef, useEffect } from "react";
import { FiSend, FiX, FiFileText, FiImage } from "react-icons/fi";
import { useChat } from "../../context/ChatContext";
import { useSession } from "../../context/SessionContext";
import FileUploader from "../FileUploader/FileUploader";

function ChatInput() {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  const {
    sendChatMessage,
    attachedFiles,
    setAttachedFiles,
    loading
  } = useChat();

  const {
    currentSession,
    createSession
  } = useSession();

  // Auto-adjust height of textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !attachedFiles.length) return;
    if (loading) return;

    let targetSessionId = currentSession;
    
    // Auto-create session if none is active
    if (!targetSessionId) {
      const sessionTitle = text.trim().slice(0, 30) || "New Chat";
      const newSess = await createSession(sessionTitle);
      targetSessionId = newSess.session_id;
    }

    await sendChatMessage(targetSessionId, text);
    setText("");
    
    // Focus back on input
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const removeAttachment = (fileId) => {
    setAttachedFiles((prev) => prev.filter((f) => f.file_id !== fileId));
  };

  return (
    <div className="chat-input-wrapper">
      <form onSubmit={handleSend} className="chat-input-container">
        {/* Attachment Queue Previews */}
        {attachedFiles.length > 0 && (
          <div className="upload-preview-container">
            {attachedFiles.map((file) => {
              const isImage = ["png", "jpg", "jpeg", "webp"].includes(file.file_type?.toLowerCase());
              return (
                <div key={file.file_id} className="upload-bubble">
                  {isImage ? <FiImage style={{ color: "#38bdf8" }} /> : <FiFileText style={{ color: "#38bdf8" }} />}
                  <span>{file.filename}</span>
                  <button
                    type="button"
                    className="upload-bubble-remove"
                    onClick={() => removeAttachment(file.file_id)}
                  >
                    <FiX />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Text Input Row */}
        <div className="chat-input-textarea-row">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={currentSession ? "Ask SARVA AI... (Shift+Enter for new line)" : "Type to start a new chat..."}
            disabled={loading}
          />
        </div>

        {/* Action Row */}
        <div className="chat-input-actions">
          <div className="chat-input-btn-group">
            <FileUploader />
          </div>

          <button
            type="submit"
            className="send-btn"
            disabled={(!text.trim() && !attachedFiles.length) || loading}
          >
            <FiSend /> {loading ? "Generating..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatInput;