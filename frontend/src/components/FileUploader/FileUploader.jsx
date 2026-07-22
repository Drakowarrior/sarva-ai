import { useRef, useState } from "react";
import { FiPaperclip } from "react-icons/fi";
import { useChat } from "../../context/ChatContext";
import api from "../../services/api";
import toast from "react-hot-toast";

function FileUploader() {
  const { attachedFiles, setAttachedFiles } = useChat();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const file = files[0];
    const max_size = 10 * 1024 * 1024; // 10MB
    const allowed_extensions = ["txt", "pdf", "docx", "png", "jpg", "jpeg", "webp"];
    const ext = file.name.split(".").pop().toLowerCase();

    if (!allowed_extensions.includes(ext)) {
      toast.error("Unsupported file format. Use TXT, PDF, DOCX, or Images.");
      return;
    }

    if (file.size > max_size) {
      toast.error("File is too large. Limit is 10MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const uploadToastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const response = await api.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data.success) {
        setAttachedFiles((prev) => [...prev, response.data]);
        toast.success(`${file.name} attached!`, { id: uploadToastId });
      } else {
        toast.error("Upload failed.", { id: uploadToastId });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.detail || "Upload error occurred.", { id: uploadToastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const triggerSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div style={{ display: "inline-block" }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
        accept=".txt,.pdf,.docx,image/png,image/jpeg,image/jpg,image/webp"
      />
      <button
        type="button"
        className="chat-input-action-btn"
        onClick={triggerSelect}
        disabled={uploading}
        title="Attach a file (PDF, DOCX, TXT, or Image)"
      >
        <FiPaperclip style={{ fontSize: "1.2rem", transform: uploading ? "rotate(45deg)" : "none" }} />
      </button>
    </div>
  );
}

export default FileUploader;
