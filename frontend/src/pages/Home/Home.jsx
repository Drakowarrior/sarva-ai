import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  FiArrowRight, FiCpu, FiDatabase, FiFileText, FiLayers, FiShield, 
  FiCode, FiMessageSquare, FiZap, FiGithub, FiCheckCircle, FiTerminal, 
  FiUsers, FiLock, FiCheck, FiCommand, FiActivity 
} from "react-icons/fi";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import PublicDemo from "../../components/PublicDemo/PublicDemo";
import { 
  ChatPreview, 
  DocumentPreview, 
  WorkspacePreview, 
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
    title: "SARVA AI – Intelligent Enterprise AI Workspace OS",
    description: "SARVA AI is an intelligent conversational AI platform for natural conversations, document analysis, team collaboration, and enterprise productivity.",
    canonicalPath: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebSite",
          "@id": "https://sarva-ai-one.vercel.app/#website",
          "url": "https://sarva-ai-one.vercel.app/",
          "name": "SARVA AI",
          "description": "Intelligent Enterprise AI Workspace OS",
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
    <div className="sarva-home-root">
      {/* 1. FLOATING NAVIGATION BAR */}
      <SeoHeader />

      {/* 2. HERO SECTION */}
      <section className="sarva-hero-section">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="sarva-hero-eyebrow"
        >
          ✦ ENTERPRISE AI WORKSPACE OS
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="sarva-hero-title"
        >
          Your Intelligence. Connected. <br />
          <span className="sarva-hero-title-accent">Your Work. Accelerated.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="sarva-hero-subtitle"
        >
          Chat, analyze documents, collaborate across your organization, and turn complex technical information into useful answers — all from one intelligent workspace.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="sarva-hero-cta-group"
        >
          <Link 
            to={isAuthenticated ? "/chat" : "/auth"} 
            onClick={() => {
              trackCtaClick("home_hero", "Launch SARVA AI");
              trackTrySarvaClick("home_hero");
            }}
            className="sarva-btn-primary"
          >
            {isAuthenticated ? "Launch Dashboard" : "Launch SARVA AI"} <FiArrowRight />
          </Link>

          <a href="#capabilities" className="sarva-btn-secondary">
            Explore Platform <FiZap />
          </a>
        </motion.div>
        <span className="sarva-hero-subtext">No credit card required · Free plan available</span>

        {/* Hero Product Centerpiece Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="sarva-hero-mockup-wrapper"
        >
          <ChatPreview />
        </motion.div>
      </section>

      {/* 3. TRUST & CREDIBILITY STRIP */}
      <section className="sarva-trust-strip">
        <div className="sarva-trust-label">BUILT FOR MODERN TECHNICAL TEAMS</div>
        <div className="sarva-trust-badges">
          <span className="sarva-trust-badge-item">💻 AI Engineering</span>
          <span className="sarva-trust-badge-item">🔬 Academic Research</span>
          <span className="sarva-trust-badge-item">⚡ Software Development</span>
          <span className="sarva-trust-badge-item">👥 Human Resources</span>
          <span className="sarva-trust-badge-item">📊 Technical Operations</span>
        </div>
      </section>

      {/* 4. CORE PLATFORM CAPABILITIES (6-CARD GRID) */}
      <section id="capabilities" className="sarva-section">
        <div className="sarva-section-header">
          <span className="sarva-section-tag">PLATFORM CAPABILITIES</span>
          <h2 className="sarva-section-title">Everything your team needs to work with AI.</h2>
          <p className="sarva-section-subtitle">
            One workspace for conversations, document analysis, knowledge retrieval, and organization collaboration.
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

        {/* SHOWCASE C: TEAM KNOWLEDGE & WORKSPACE */}
        <div className="sarva-showcase-row">
          <div className="sarva-showcase-text">
            <span className="sarva-showcase-tag">03 · ORGANIZATION WORKSPACE</span>
            <h2 className="sarva-showcase-title">Move from individual chats to team intelligence.</h2>
            <p className="sarva-showcase-desc">
              Connect your teammates in an Executive Organization Workspace. Manage member permissions, invite collaborators via secure codes, and share conversation threads.
            </p>
            <div className="sarva-showcase-bullets">
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Role-Based Access Control (Head, Team Lead, HR, Member)</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Workspace invite codes & member management</div>
              <div className="sarva-showcase-bullet-item"><FiCheck className="sarva-bullet-icon" /> Department organization & shared workspace chats</div>
            </div>
          </div>
          <div>
            <WorkspacePreview />
          </div>
        </div>

        {/* SHOWCASE D: TECHNICAL WORKFLOWS */}
        <div className="sarva-showcase-row reverse">
          <div>
            <TechnicalPreview />
          </div>
          <div className="sarva-showcase-text">
            <span className="sarva-showcase-tag">04 · TECHNICAL WORKFLOWS</span>
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

// Helper icons for security items
function FiKey(props) {
  return <FiLock {...props} />;
}
function FiGlobe(props) {
  return <FiZap {...props} />;
}

export default Home;