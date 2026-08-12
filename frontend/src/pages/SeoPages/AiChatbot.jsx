import { Link } from "react-router-dom";
import { FiMessageSquare, FiClock, FiCpu, FiLock, FiFileText, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const AiChatbot = () => {
  useSeo({
    title: "AI Chatbot – Intelligent Conversations | SARVA AI",
    description: "SARVA AI Chatbot provides natural context-aware conversations, dynamic model selection, persistent session history, file interactions, and enterprise privacy.",
    canonicalPath: "/ai-chatbot"
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <div className="seo-hero-badge">💬 Conversational AI Engine</div>
        <h1 className="seo-page-title">AI Chatbot – Intelligent Conversations</h1>
        <p className="seo-page-subtitle">
          SARVA AI chatbot combines fast inference, deep contextual understanding, multi-turn memory, and document attachment capabilities to deliver human-like conversational experiences.
        </p>

        <section className="seo-card" style={{ marginBottom: "30px" }}>
          <h2 className="seo-card-title"><FiMessageSquare className="seo-card-icon" /> What is SARVA AI Chatbot?</h2>
          <p className="seo-card-text">
            SARVA AI Chatbot is an enterprise-grade conversational assistant engineered using React, FastAPI, and MongoDB. It bridges the gap between raw Large Language Models (LLMs) and intuitive user experiences by maintaining conversational flow, formatting code blocks, rendering rich Markdown, and processing user feedback in real time.
          </p>
        </section>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiClock /></div>
            <h3 className="seo-card-title">Session History & Memory</h3>
            <p className="seo-card-text">
              Conversations are automatically grouped into sessions stored inside MongoDB Atlas. Users can rename chat threads, search previous messages, delete old conversations, and pick up right where they left off.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCpu /></div>
            <h3 className="seo-card-title">Context-Aware Responses</h3>
            <p className="seo-card-text">
              Every query is evaluated against full multi-turn conversation history. This ensures follow-up prompts like "Explain line 5 of that function" or "Summarize the second paragraph" return accurate context without needing repetitive explanations.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiFileText /></div>
            <h3 className="seo-card-title">File & Vision Interaction</h3>
            <p className="seo-card-text">
              Upload PDF files, code documents, or images directly into the chat stream. The chatbot extracts content on the backend, feeds it to the LLM context window, and answers precise queries about the uploaded media.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiLock /></div>
            <h3 className="seo-card-title">Data Privacy & Security</h3>
            <p className="seo-card-text">
              User conversations and uploaded documents are isolated per user account. Authentication is secured via JWT bearer tokens and HTTPS encryption, ensuring your proprietary data remains private.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h3 className="seo-card-title">Experience SARVA AI Chatbot</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Start chatting with Llama 3.3, Gemma, and Vision models inside our high-speed interface.
          </p>
          <Link to="/chat" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Launch AI Chatbot <FiArrowRight />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default AiChatbot;
