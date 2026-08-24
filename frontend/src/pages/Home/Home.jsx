import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, FiCpu, FiDatabase, FiFileText, FiLayers, FiShield, 
  FiCode, FiMessageSquare, FiZap, FiGithub, FiCheckCircle, FiTerminal, 
  FiUsers, FiLock, FiCheck, FiCommand, FiActivity, FiKey, FiGlobe 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import PublicDemo from "../../components/PublicDemo/PublicDemo";
import { 
  ChatPreview, 
  DocumentPreview, 
  TechnicalPreview, 
  ArchitectureDiagramMockup 
} from "../../components/ProductMockups/ProductMockups";
import useSeo from "../../hooks/useSeo";
import { 
  trackCtaClick, 
  trackTrySarvaClick, 
  trackGithubClick, 
  trackCaseStudyView, 
  trackUseCasesView 
} from "../../utils/analytics";
import "./Home.css";

const CAPABILITIES = [
  {
    num: "01",
    icon: <FiMessageSquare />,
    title: "AI Conversations",
    description: "Context-aware multi-turn conversations powered by Groq LPUs for instant 300+ token/sec responses."
  },
  {
    num: "02",
    icon: <FiFileText />,
    title: "Document Intelligence",
    description: "Upload financial reports, research PDFs, and specs to extract grounded answers and key takeaways."
  },
  {
    num: "03",
    icon: <FiCode />,
    title: "Technical Analysis",
    description: "Debug code, review Python/React architecture, format API specs, and analyze system performance."
  },
  {
    num: "04",
    icon: <FiCpu />,
    title: "Knowledge & Research",
    description: "Synthesize data across multi-source threads and maintain persistent context stored in MongoDB Atlas."
  },
  {
    num: "05",
    icon: <FiUsers />,
    title: "Team Collaboration",
    description: "Share conversations with workspace members, assign RBAC permissions, and streamline team workflows."
  },
  {
    num: "06",
    icon: <FiShield />,
    title: "Enterprise Workspace",
    description: "Stateless JWT authentication, department isolation, and organization administrative workspace controls."
  }
];

function Home() {
  const { isAuthenticated } = useAuth();
  const [selectedPromptForDemo, setSelectedPromptForDemo] = useState("");

  useSeo({
    title: "SARVA AI — Enterprise AI Workspace & Conversational Platform",
    description: "SARVA connects your conversations, PDF documents, knowledge base, team workflows, and multi-model AI into one secure workspace.",
    canonicalPath: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://sarva-ai-one.vercel.app/#website",
          "url": "https://sarva-ai-one.vercel.app/",
          "name": "SARVA AI",
          "description": "SARVA AI — Enterprise AI Workspace & Conversational Platform",
          "publisher": {
            "@type": "Organization",
            "name": "SARVA AI",
            "url": "https://sarva-ai-one.vercel.app/"
          }
        },
        {
          "@type": "SoftwareApplication",
          "@id": "https://sarva-ai-one.vercel.app/#software",
          "name": "SARVA Intelligence Platform",
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
    <div className="sarva-home-root sarva-grid-bg">
      {/* 1. NAVIGATION BAR */}
      <SeoHeader />

      {/* 2. PRODUCT-FIRST HERO SECTION */}
      <section className="sarva-hero-section">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sarva-hero-eyebrow"
        >
          SARVA / INTELLIGENCE INFRASTRUCTURE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="sarva-hero-title"
        >
          Your intelligence, connected to your work.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="sarva-hero-subtitle"
        >
          SARVA connects conversations, documents, knowledge, workflows and AI into one unified workspace. Built for software engineers, researchers, and enterprise teams.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="sarva-hero-cta-group"
        >
          <Link 
            to={isAuthenticated ? "/chat" : "/auth"} 
            onClick={() => {
              trackCtaClick("home_hero", "Open Workspace");
              trackTrySarvaClick("home_hero");
            }}
            className="sarva-btn-primary"
          >
            {isAuthenticated ? "Open Workspace" : "Open Workspace"} <FiArrowRight />
          </Link>

          <a href="#capabilities" className="sarva-btn-secondary">
            Explore Platform
          </a>
        </motion.div>
        <span className="sarva-hero-subtext">Free trial available · No credit card required</span>

        {/* Immediate Above-The-Fold Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="sarva-hero-mockup-wrapper"
        >
          <ChatPreview />
        </motion.div>
      </section>

      {/* 3. TECHNICAL AUDIENCE & DOMAIN SYSTEM */}
      <section className="sarva-trust-strip">
        <div className="sarva-trust-label">BUILT FOR TECHNICAL ORGANIZATIONS & RESEARCH TEAMS</div>
        <div className="sarva-trust-badges">
          <span className="sarva-trust-badge-item">Software Engineering</span>
          <span className="sarva-trust-badge-item">AI Research</span>
          <span className="sarva-trust-badge-item">Technical Operations</span>
          <span className="sarva-trust-badge-item">Organization Administration</span>
          <span className="sarva-trust-badge-item">Document Intelligence</span>
        </div>
      </section>

      {/* 4. PLATFORM ARCHITECTURE CAPABILITIES */}
      <section id="capabilities" className="sarva-section">
        <div className="sarva-section-header">
          <span className="sarva-section-tag">SYSTEM CAPABILITIES</span>
          <h2 className="sarva-section-title">One intelligence layer for your organization.</h2>
          <p className="sarva-section-subtitle">
            Structure your knowledge, execute multi-model analysis, and collaborate seamlessly.
          </p>
        </div>

        <div className="sarva-capabilities-grid">
          {CAPABILITIES.map((cap, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
              className="sarva-capability-card"
            >
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div className="sarva-cap-icon-box">{cap.icon}</div>
                  <span className="sarva-cap-num">{cap.num}</span>
                </div>
                <h3 className="sarva-cap-title">{cap.title}</h3>
                <p className="sarva-cap-desc">{cap.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. ALTERNATING FEATURE SHOWCASE SECTIONS */}
      <section className="sarva-showcase-container">
        {/* SHOWCASE A: AI CONVERSATIONS */}
        <div className="sarva-showcase-row">
          <div className="sarva-showcase-text">
            <span className="sarva-showcase-tag">01 · CONVERSATIONAL ENGINE</span>
            <h2 className="sarva-showcase-title">High-throughput token generation at 300+ tok/sec.</h2>
            <p className="sarva-showcase-desc">
              Experience instant answers powered by Groq LPU hardware acceleration. Switch between Llama 4 Scout (17B), Qwen 3 (32B), and instant fast models seamlessly.
            </p>
            <div className="sarva-showcase-bullets">
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Multi-turn persistent thread memory</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Dynamic model selection on the fly</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Markdown, code blocks, & LaTeX math rendering</div>
            </div>
          </div>
          <div>
            <ChatPreview />
          </div>
        </div>

        {/* SHOWCASE B: DOCUMENT INTELLIGENCE */}
        <div className="sarva-showcase-row reverse">
          <div>
            <DocumentPreview />
          </div>
          <div className="sarva-showcase-text">
            <span className="sarva-showcase-tag">02 · DOCUMENT INTELLIGENCE</span>
            <h2 className="sarva-showcase-title">Upload documents and extract grounded answers.</h2>
            <p className="sarva-showcase-desc">
              Parse PDF financial reports, technical documentation, resumes, and text files. Extract structured insights directly from file contents without manual searching.
            </p>
            <div className="sarva-showcase-bullets">
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> PyPDF asynchronous extraction pipeline</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Grounded contextual Q&A from uploaded PDFs</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Support for multi-page PDF files & code archives</div>
            </div>
          </div>
        </div>

        {/* SHOWCASE C: TECHNICAL WORKFLOWS */}
        <div className="sarva-showcase-row">
          <div className="sarva-showcase-text">
            <span className="sarva-showcase-tag">03 · TECHNICAL WORKFLOWS</span>
            <h2 className="sarva-showcase-title">Engineered for software & AI developers.</h2>
            <p className="sarva-showcase-desc">
              Debug complex code, inspect stack trace errors, format API endpoints, and export conversation transcripts directly to Markdown, Plain Text, or PDF.
            </p>
            <div className="sarva-showcase-bullets">
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Syntax-highlighted code blocks with 1-click copy</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Transcript exports (Markdown, TXT, PDF, JSON)</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> FastAPI & MongoDB Atlas execution pipeline</div>
            </div>
          </div>
          <div>
            <TechnicalPreview />
          </div>
        </div>
      </section>

      {/* 6. "HOW SARVA AI WORKS" ARCHITECTURE TIMELINE */}
      <section className="sarva-section">
        <div className="sarva-section-header">
          <span className="sarva-section-tag">ARCHITECTURE PIPELINE</span>
          <h2 className="sarva-section-title">How SARVA AI Operates</h2>
          <p className="sarva-section-subtitle">
            From user prompt to high-speed LPU generation, stateful storage, and grounded context delivery.
          </p>
        </div>

        <div className="sarva-timeline-grid">
          <div className="sarva-timeline-card">
            <span className="sarva-step-badge">STEP 01</span>
            <h3 className="sarva-step-title">1. Prompt & File Context</h3>
            <p className="sarva-step-desc">Enter natural prompts or attach PDF documents. Text is parsed and contextually attached.</p>
          </div>

          <div className="sarva-timeline-card">
            <span className="sarva-step-badge">STEP 02</span>
            <h3 className="sarva-step-title">2. JWT Security & Auth</h3>
            <p className="sarva-step-desc">Requests are authenticated via OAuth2 Bearer tokens and checked against RBAC policy.</p>
          </div>

          <div className="sarva-timeline-card">
            <span className="sarva-step-badge">STEP 03</span>
            <h3 className="sarva-step-title">3. Groq LPU Inference</h3>
            <p className="sarva-step-desc">Llama 4 Scout stream generates high-speed responses at over 300 tokens per second.</p>
          </div>

          <div className="sarva-timeline-card">
            <span className="sarva-step-badge">STEP 04</span>
            <h3 className="sarva-step-title">4. MongoDB Atlas Memory</h3>
            <p className="sarva-step-desc">Conversations and thread states are saved to cloud clusters for multi-turn thread history.</p>
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <ArchitectureDiagramMockup />
        </div>
      </section>

      {/* 7. ENTERPRISE SECURITY PANEL */}
      <section className="sarva-section">
        <div className="sarva-security-panel">
          <div className="sarva-section-header" style={{ textAlign: "left", margin: 0 }}>
            <span className="sarva-section-tag" style={{ color: "#10b981" }}>ENTERPRISE PRIVACY & SECURITY</span>
            <h2 className="sarva-section-title" style={{ fontSize: "2rem" }}>Built for Enterprise Confidence.</h2>
            <p className="sarva-section-subtitle">
              Strict authentication, multi-tenant isolation, and encrypted session security standards.
            </p>
          </div>

          <div className="sarva-security-grid">
            <div className="sarva-security-item">
              <div className="sarva-sec-title"><FiLock style={{ color: "#10b981" }} /> JWT Bearer Tokens</div>
              <p className="sarva-sec-desc">Stateless token authentication signed with HS256 algorithm and expiration validation.</p>
            </div>

            <div className="sarva-security-item">
              <div className="sarva-sec-title"><FiShield style={{ color: "#38bdf8" }} /> RBAC Permissions</div>
              <div className="sarva-sec-desc">Hierarchical permissions for Head, Team Lead, HR, Executive, and Intern roles.</div>
            </div>

            <div className="sarva-security-item">
              <div className="sarva-sec-title"><FiDatabase style={{ color: "#a855f7" }} /> Multi-Tenant Isolation</div>
              <p className="sarva-sec-desc">Database collection isolation ensures users and organizations only access authorized data.</p>
            </div>

            <div className="sarva-security-item">
              <div className="sarva-sec-title"><FiKey style={{ color: "#ec4899" }} /> Bcrypt Salt Hashing</div>
              <p className="sarva-sec-desc">Passwords are hashed using Bcrypt algorithm with salt rounds before backend storage.</p>
            </div>

            <div className="sarva-security-item">
              <div className="sarva-sec-title"><FiGlobe style={{ color: "#f59e0b" }} /> CORS Origin Protection</div>
              <p className="sarva-sec-desc">Restricted API domain whitelist prevents unauthorized cross-origin requests.</p>
            </div>

            <div className="sarva-security-item">
              <div className="sarva-sec-title"><FiActivity style={{ color: "#10b981" }} /> Protected API Architecture</div>
              <p className="sarva-sec-desc">FastAPI input schemas validate payloads and sanitize requests automatically.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. LIVE PRODUCT DEMO */}
      <section className="sarva-section" style={{ padding: "40px 24px" }}>
        <div className="sarva-section-header">
          <span className="sarva-section-tag">LIVE INTERACTIVE DEMO</span>
          <h2 className="sarva-section-title">Experience SARVA AI Live</h2>
          <p className="sarva-section-subtitle">
            Try asking questions, inspecting responses, or testing prompts right now in your browser.
          </p>
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <PublicDemo initialPrompt={selectedPromptForDemo} />
        </div>
      </section>

      {/* 9. FINAL CONVERSION CTA */}
      <section style={{ padding: "0 24px" }}>
        <div className="sarva-cta-banner">
          <h2>Ready to Experience Intelligent AI Assistance?</h2>
          <p>Start working with SARVA AI in seconds. No credit card required.</p>
          <Link
            to={isAuthenticated ? "/chat" : "/auth"}
            onClick={() => {
              trackCtaClick("home_bottom", "Try SARVA AI Free");
              trackTrySarvaClick("home_bottom");
            }}
            className="sarva-btn-primary"
            style={{ padding: "16px 36px", fontSize: "1.1rem" }}
          >
            {isAuthenticated ? "Launch Dashboard" : "Try SARVA AI Free"} <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* 10. ENTERPRISE FOOTER */}
      <SeoFooter />
    </div>
  );
}

export default Home;