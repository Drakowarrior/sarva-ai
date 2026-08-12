import { Link } from "react-router-dom";
import { FiArrowRight, FiCpu, FiDatabase, FiFileText, FiLayers, FiShield, FiCode, FiMessageSquare, FiZap, FiLock } from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

function Home() {
  const { isAuthenticated } = useAuth();

  useSeo({
    title: "SARVA AI – Enterprise Conversational AI Platform",
    description: "SARVA AI is an intelligent conversational AI platform for natural conversations, AI assistance, file analysis, and productive workflows.",
    canonicalPath: "/"
  });

  return (
    <div className="seo-page-container">
      {/* Shared SEO Header */}
      <SeoHeader />

      {/* Hero Section */}
      <section className="landing-hero" style={{ padding: "60px 24px", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="seo-hero-badge"
        >
          ✨ Next-Gen Enterprise AI Assistant
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="seo-page-title"
        >
          Enterprise Conversational AI Platform
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="seo-page-subtitle"
        >
          SARVA AI delivers high-performance conversational intelligence, contextual memory retention, multi-format file analysis, and enterprise-grade security for modern workflows.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <Link to={isAuthenticated ? "/chat" : "/auth"} className="seo-cta-btn" style={{ padding: "12px 28px", fontSize: "1rem" }}>
            {isAuthenticated ? "Launch Dashboard" : "Get Started Free"} <FiArrowRight />
          </Link>
          <Link to="/case-study" className="seo-social-link" style={{ padding: "12px 24px", fontSize: "1rem" }}>
            Explore Case Study <FiCode />
          </Link>
        </motion.div>
      </section>

      {/* Content Section with Natural Headings */}
      <main className="seo-page-content">
        {/* Section 1 */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <FiMessageSquare className="seo-card-icon" style={{ margin: 0 }} /> Intelligent AI Conversations
          </h2>
          <p className="seo-card-text">
            Engage in seamless, multi-turn dialogues powered by modern large language models. SARVA AI preserves conversation context across interactions, allowing users to ask complex follow-up questions, debug code snippets, draft detailed documentation, and brainstorm solutions naturally.
          </p>
        </section>

        {/* Section 2 */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <FiCpu className="seo-card-icon" style={{ margin: 0 }} /> Powerful AI Assistant
          </h2>
          <p className="seo-card-text">
            Dynamic model selection enables flexible reasoning tuned to your specific task. Choose between low-latency models like <strong>Llama 3.1 8B Instant</strong>, high-capability vision models like <strong>Llama 3.2 Vision</strong>, or heavy-reasoning engines like <strong>Llama 3.3 70B Versatile</strong> and <strong>Mixtral 8x7B</strong>.
          </p>
        </section>

        {/* Section 3 */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <FiFileText className="seo-card-icon" style={{ margin: 0 }} /> File Analysis and AI Assistance
          </h2>
          <p className="seo-card-text">
            Upload complex documents including PDF reports, Word documents, code archives, and images. SARVA AI extracts text, parses structured data, summarizes length documents, extracts resume bullet points, and provides contextual answers grounded in your uploaded files.
          </p>
        </section>

        {/* Section 4 */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <FiShield className="seo-card-icon" style={{ margin: 0 }} /> Secure and Scalable Architecture
          </h2>
          <p className="seo-card-text">
            Built with modern security standard practices, SARVA AI employs JWT bearer authentication, bcrypt password hashing, session isolation, role-based access control, and encrypted MongoDB Atlas database storage for enterprise privacy compliance.
          </p>
        </section>

        {/* Section 5 */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <FiZap className="seo-card-icon" style={{ margin: 0 }} /> Built for Modern AI Workflows
          </h2>
          <p className="seo-card-text">
            Designed for developers, researchers, and enterprise teams. Includes real-time Markdown rendering, syntax highlighted code blocks, instant copy actions, organization workspace management, and user feedback mechanisms.
          </p>
        </section>

        {/* Quick Links Grid */}
        <h3 className="seo-section-heading">Explore Platform Capabilities</h3>
        <div className="seo-grid-2">
          <Link to="/ai-chatbot" className="seo-card" style={{ textDecoration: "none" }}>
            <div className="seo-card-icon"><FiMessageSquare /></div>
            <h3 className="seo-card-title">AI Chatbot</h3>
            <p className="seo-card-text">Learn how SARVA AI handles natural language conversations and session history.</p>
          </Link>

          <Link to="/enterprise-ai" className="seo-card" style={{ textDecoration: "none" }}>
            <div className="seo-card-icon"><FiShield /></div>
            <h3 className="seo-card-title">Enterprise AI</h3>
            <p className="seo-card-text">Explore cloud deployment, REST API backend, and authentication security.</p>
          </Link>

          <Link to="/file-analysis" className="seo-card" style={{ textDecoration: "none" }}>
            <div className="seo-card-icon"><FiFileText /></div>
            <h3 className="seo-card-title">File Analysis</h3>
            <p className="seo-card-text">Discover document comprehension, PDF processing, and resume screening.</p>
          </Link>

          <Link to="/technology" className="seo-card" style={{ textDecoration: "none" }}>
            <div className="seo-card-icon"><FiDatabase /></div>
            <h3 className="seo-card-title">Tech Stack</h3>
            <p className="seo-card-text">Examine our React, FastAPI, MongoDB Atlas, and Groq LLM architecture.</p>
          </Link>
        </div>
      </main>

      {/* Shared SEO Footer */}
      <SeoFooter />
    </div>
  );
}

export default Home;