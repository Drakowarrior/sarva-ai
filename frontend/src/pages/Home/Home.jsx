import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, FiCpu, FiDatabase, FiFileText, FiLayers, FiShield, 
  FiCode, FiMessageSquare, FiZap, FiGithub, FiCheckCircle, FiTerminal 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import PublicDemo from "../../components/PublicDemo/PublicDemo";
import { ChatInterfaceMockup, ArchitectureDiagramMockup } from "../../components/ProductMockups/ProductMockups";
import useSeo from "../../hooks/useSeo";
import { 
  trackCtaClick, 
  trackTrySarvaClick, 
  trackGithubClick, 
  trackCaseStudyView, 
  trackUseCasesView 
} from "../../utils/analytics";

const USE_CASES = [
  {
    id: "coding",
    category: "💻 Coding",
    title: "Software Engineering & Debugging",
    description: "Debug FastAPI route errors, inspect React state hooks, review Python algorithms, and generate structured implementation code.",
    exampleTask: "Debug FastAPI 422 validation errors or craft async MongoDB Atlas queries.",
    promptExample: "Help me debug this FastAPI API endpoint and structure async Pydantic schemas."
  },
  {
    id: "documents",
    category: "📄 Documents",
    title: "AI Document Analysis & PDF Context",
    description: "Upload financial reports, research papers, resumes, and text archives. Extract structured insights directly from file contents.",
    exampleTask: "Extract resume key qualifications or summarize 50-page PDF research reports.",
    promptExample: "Analyze my uploaded PDF report and summarize 5 key takeaways."
  },
  {
    id: "learning",
    category: "📚 Learning",
    title: "Computer Science & Education",
    description: "Master complex concepts, understand machine learning architectures, study Data Structures & Algorithms, and format study outlines.",
    exampleTask: "Break down transformer attention mechanisms or binary search tree algorithms.",
    promptExample: "Explain the difference between RAG and model fine-tuning with code examples."
  },
  {
    id: "analysis",
    category: "📊 Analysis",
    title: "Technical Data & Insight Extraction",
    description: "Synthesize multi-source technical data, extract action items, compare cloud architecture models, and optimize system design.",
    exampleTask: "Compare Groq LPU throughput vs standard cloud GPU latency metrics.",
    promptExample: "Analyze token streaming latency differences between Llama 3.3 70B and Llama 3.1 8B."
  },
  {
    id: "writing",
    category: "✍️ Writing",
    title: "Technical Writing & Documentation",
    description: "Draft architectural specifications, API reference manuals, project READMEs, and technical blog summaries effortlessly.",
    exampleTask: "Generate clean API documentation or refine technical documentation summaries.",
    promptExample: "Draft a comprehensive README for a full-stack React and FastAPI AI platform."
  }
];

function Home() {
  const { isAuthenticated } = useAuth();
  const [selectedPromptForDemo, setSelectedPromptForDemo] = useState("");

  useSeo({
    title: "SARVA AI – Intelligent Conversational AI Platform",
    description: "SARVA AI is an intelligent conversational AI platform for natural conversations, AI assistance, file analysis, and productive workflows.",
    canonicalPath: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://sarva-ai-one.vercel.app/#website",
          "url": "https://sarva-ai-one.vercel.app/",
          "name": "SARVA AI",
          "description": "Intelligent Conversational AI Platform",
          "author": {
            "@type": "Person",
            "name": "Karan Garg"
          }
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://sarva-ai-one.vercel.app/#software",
          "name": "SARVA AI Platform",
          "operatingSystem": "Web",
          "applicationCategory": "BusinessApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      {/* 1. NAVBAR */}
      <SeoHeader />

      {/* 2. HERO */}
      <section className="landing-hero" style={{ padding: "50px 24px 20px", textAlign: "center", maxWidth: "920px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="seo-hero-badge"
        >
          ✨ Full-Stack Conversational AI Platform
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="seo-page-title"
          style={{ fontSize: "2.8rem", lineHeight: "1.2" }}
        >
          Your Intelligent AI Assistant
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="seo-page-subtitle"
          style={{ fontSize: "1.15rem", maxWidth: "760px", margin: "16px auto 28px" }}
        >
          Chat, analyze files, manage conversations, and get AI-powered assistance from one platform. Powered by React, FastAPI, MongoDB, and Groq LPUs.
        </motion.p>

        {/* 3. PRIMARY & SECONDARY CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap", marginBottom: "32px" }}
        >
          <Link 
            to={isAuthenticated ? "/chat" : "/auth"} 
            onClick={() => {
              trackCtaClick("home_hero", "Try SARVA AI Free");
              trackTrySarvaClick("home_hero");
            }}
            className="seo-cta-btn" 
            style={{ padding: "14px 32px", fontSize: "1.05rem" }}
          >
            {isAuthenticated ? "Launch Dashboard" : "Try SARVA AI Free"} <FiArrowRight />
          </Link>
          <a 
            href="#features" 
            className="seo-social-link" 
            style={{ padding: "14px 28px", fontSize: "1rem" }}
          >
            Explore Features <FiZap />
          </a>
        </motion.div>
      </section>

      {/* 4. INTERACTIVE PUBLIC DEMO & 5. EXAMPLE PROMPTS */}
      <section style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}>
            Try SARVA AI Live in Your Browser
          </h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            Experience real-time AI assistance before creating your free account.
          </p>
        </div>

        <PublicDemo initialPrompt={selectedPromptForDemo} />
      </section>

      <main className="seo-page-content" style={{ maxWidth: "1100px", margin: "40px auto 0" }}>
        {/* 6. USE CASES SECTION */}
        <section style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 className="seo-section-heading" style={{ fontSize: "1.9rem" }}>
              SARVA AI Support Use Cases
            </h2>
            <p className="seo-page-subtitle" style={{ margin: "8px auto 0" }}>
              Engineered to supercharge technical productivity across core engineering workflows.
            </p>
          </div>

          <div className="seo-grid-2">
            {USE_CASES.map((uc) => (
              <div 
                key={uc.id} 
                className="seo-card hover-lift"
                style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#38bdf8", marginBottom: "8px" }}>
                    {uc.category}
                  </div>
                  <h3 className="seo-card-title" style={{ fontSize: "1.25rem", marginBottom: "8px" }}>
                    {uc.title}
                  </h3>
                  <p className="seo-card-text" style={{ fontSize: "0.92rem", marginBottom: "16px" }}>
                    {uc.description}
                  </p>
                  <div style={{ 
                    background: "rgba(15, 23, 42, 0.6)", 
                    padding: "10px 14px", 
                    borderRadius: "8px", 
                    fontSize: "0.85rem", 
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                    marginBottom: "16px"
                  }}>
                    <strong>Example Task:</strong> {uc.exampleTask}
                  </div>
                </div>

                <Link
                  to={isAuthenticated ? "/chat" : "/auth"}
                  onClick={() => {
                    trackUseCasesView(uc.id);
                    trackCtaClick("use_case_card", `Try ${uc.id}`);
                  }}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    color: "#38bdf8",
                    fontWeight: "600",
                    fontSize: "0.9rem",
                    textDecoration: "none",
                    marginTop: "8px"
                  }}
                >
                  Try it →
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* 7. PRODUCT SCREENSHOTS / REAL MOCKUP */}
        <section style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 className="seo-section-heading" style={{ fontSize: "1.9rem" }}>
              Actual SARVA AI Workspace Interface
            </h2>
            <p className="seo-page-subtitle">
              Clean markdown rendering, model selection, document attachment context, and session history.
            </p>
          </div>

          <ChatInterfaceMockup />
        </section>

        {/* 8. KEY FEATURES */}
        <section id="features" style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <h2 className="seo-section-heading" style={{ fontSize: "1.9rem" }}>
              Core Platform Capabilities
            </h2>
          </div>

          <div className="seo-grid-2">
            <div className="seo-card">
              <div className="seo-card-icon"><FiMessageSquare /></div>
              <h3 className="seo-card-title">Intelligent AI Conversations</h3>
              <p className="seo-card-text">
                Multi-turn conversation history stored seamlessly in MongoDB Atlas for persistent thread context.
              </p>
            </div>

            <div className="seo-card">
              <div className="seo-card-icon"><FiCpu /></div>
              <h3 className="seo-card-title">Groq LPU Acceleration</h3>
              <p className="seo-card-text">
                High-throughput token generation streaming at 300+ tokens/sec using Llama 3.3 70B and Llama 3.1 8B.
              </p>
            </div>

            <div className="seo-card">
              <div className="seo-card-icon"><FiFileText /></div>
              <h3 className="seo-card-title">PDF & Document Analysis</h3>
              <p className="seo-card-text">
                Extract context from PDF reports, resumes, and text documents to receive grounded AI answers.
              </p>
            </div>

            <div className="seo-card">
              <div className="seo-card-icon"><FiShield /></div>
              <h3 className="seo-card-title">JWT Authentication & Privacy</h3>
              <p className="seo-card-text">
                Stateless JWT tokens, bcrypt password encryption, and multi-tenant database session isolation.
              </p>
            </div>
          </div>
        </section>

        {/* 9. HOW IT WORKS & 10. ARCHITECTURE */}
        <section style={{ marginBottom: "50px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 className="seo-section-heading" style={{ fontSize: "1.9rem" }}>
              How SARVA AI Works
            </h2>
            <p className="seo-page-subtitle">
              React 19 Frontend ➔ FastAPI Python Backend ➔ MongoDB Session Store ➔ Groq LPU Models
            </p>
          </div>

          <ArchitectureDiagramMockup />
        </section>

        {/* 11. SECURITY & PRIVACY */}
        <section className="seo-card" style={{ marginBottom: "50px", padding: "32px" }}>
          <h2 className="seo-card-title" style={{ fontSize: "1.6rem", display: "flex", alignItems: "center", gap: "10px" }}>
            <FiShield style={{ color: "#10b981", margin: 0 }} /> Enterprise-Grade Security Standards
          </h2>
          <p className="seo-card-text" style={{ fontSize: "0.98rem", marginTop: "12px" }}>
            SARVA AI implements stateless JWT bearer tokens, CORS origins protection, client IP rate limiting, input validation, and password salt hashing via Bcrypt. Your data is isolated per authenticated account.
          </p>
          <div style={{ marginTop: "16px" }}>
            <Link to="/security" className="seo-social-link" style={{ fontSize: "0.9rem" }}>
              Learn about SARVA AI Security Architecture <FiArrowRight />
            </Link>
          </div>
        </section>

        {/* 12. CASE STUDY */}
        <section className="seo-card" style={{ marginBottom: "50px", background: "linear-gradient(135deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h2 className="seo-card-title" style={{ fontSize: "1.5rem" }}>
                Full-Stack Technical Case Study
              </h2>
              <p className="seo-card-text" style={{ marginTop: "6px" }}>
                Read the engineering report on building 300+ token/sec AI streaming with FastAPI & React.
              </p>
            </div>
            <Link 
              to="/case-study" 
              onClick={() => trackCaseStudyView("home_banner")}
              className="seo-cta-btn" 
              style={{ padding: "10px 22px", fontSize: "0.9rem" }}
            >
              Read Case Study <FiCode />
            </Link>
          </div>
        </section>

        {/* 13. GITHUB TRAFFIC SOURCE BANNER */}
        <section className="seo-card" style={{ marginBottom: "50px", border: "1px solid rgba(56, 189, 248, 0.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "20px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#38bdf8", fontWeight: "700", fontSize: "0.85rem" }}>
                <FiGithub /> OPEN SOURCE & DEVELOPER RESOURCES
              </div>
              <h3 style={{ fontSize: "1.4rem", margin: "6px 0", color: "var(--text-primary)" }}>
                Explore SARVA AI on GitHub
              </h3>
              <p style={{ color: "var(--text-secondary)", fontSize: "0.92rem" }}>
                Full-stack conversational AI platform built with React, FastAPI, MongoDB Atlas and Groq.
              </p>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackGithubClick("home_banner")}
              className="seo-social-link"
              style={{ padding: "12px 24px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              <FiGithub /> View on GitHub <FiArrowRight />
            </a>
          </div>
        </section>

        {/* 14. FINAL CTA */}
        <section style={{ textAlignment: "center", padding: "40px 24px", background: "var(--bg-card)", borderRadius: "24px", border: "1px solid var(--border)", textAlign: "center", marginBottom: "40px" }}>
          <h2 style={{ fontSize: "2rem", marginBottom: "12px", color: "var(--text-primary)" }}>
            Ready to Experience Intelligent AI Assistance?
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 24px", fontSize: "1.05rem" }}>
            Get started in seconds with your free account. No credit card required.
          </p>
          <Link
            to="/auth"
            onClick={() => {
              trackCtaClick("home_bottom", "Try SARVA AI Free");
              trackTrySarvaClick("home_bottom");
            }}
            className="seo-cta-btn"
            style={{ padding: "14px 36px", fontSize: "1.1rem", display: "inline-flex" }}
          >
            Try SARVA AI Free <FiArrowRight />
          </Link>
        </section>
      </main>

      {/* 15. FOOTER */}
      <SeoFooter />
    </div>
  );
}

export default Home;