import { Link } from "react-router-dom";
import { FiCode, FiCpu, FiDatabase, FiShield, FiServer, FiLayers, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const CaseStudy = () => {
  useSeo({
    title: "SARVA AI Case Study – Building a Full-Stack Conversational AI Platform",
    description: "In-depth engineering case study on SARVA AI: Problem, Solution, Architecture, React frontend, FastAPI backend, MongoDB Atlas, JWT Auth, Groq LLMs, Challenges, Results, and Future Roadmap.",
    canonicalPath: "/case-study",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Case Study", "item": "https://sarva-ai-one.vercel.app/case-study" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "SARVA AI Case Study – Building a Full-Stack Conversational AI Platform",
          "description": "Comprehensive 12-section technical case study detailing the engineering of SARVA AI.",
          "author": { "@type": "Person", "name": "Karan Garg" }
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "1050px" }}>
        <div className="seo-hero-badge">Engineering Case Study</div>
        <h1 className="seo-page-title">SARVA AI Case Study – Building a Full-Stack Conversational AI Platform</h1>
        <p className="seo-page-subtitle">
          An exhaustive breakdown of how SARVA AI was conceptualized, architected, built, and deployed as a high-performance enterprise conversational AI platform.
        </p>

        {/* 1. Problem */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiCode className="seo-card-icon" /> 1. Problem Statement</h2>
          <p className="seo-card-text">
            Modern conversational AI tools frequently lock users into rigid single-model paradigms, offer sluggish token streaming, lack seamless multi-format document analysis capabilities, and expose organizations to data privacy risks. Developers and enterprises required a decoupled, ultra-fast, multi-model conversational assistant capable of maintaining context-aware session memory, processing resumes/PDFs inline, and delivering robust role-based security.
          </p>
        </section>

        {/* 2. Solution */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiCheckCircle className="seo-card-icon" /> 2. Solution Overview</h2>
          <p className="seo-card-text">
            SARVA AI addresses these challenges with a production-grade full-stack architecture:
          </p>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>Dynamic Model Routing:</strong> Switch between Llama 3.3 70B Versatile, Llama 3.2 Vision, Gemma, and Mixtral on a per-query basis.</li>
            <li><strong>Document Comprehension Pipeline:</strong> Upload PDFs, DOCX, and images with automatic backend text extraction and prompt injection.</li>
            <li><strong>Persistent Session Memory:</strong> Indexed MongoDB Atlas storage with real-time thread restoration and searchability.</li>
            <li><strong>Enterprise Governance:</strong> Organization accounts, pending approval workflows, JWT security, and user feedback loops.</li>
          </ul>
        </section>

        {/* 3. System Architecture */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiLayers className="seo-card-icon" /> 3. System Architecture</h2>
          <p className="seo-card-text">
            SARVA AI adopts a decoupled 3-tier microservice architecture:
          </p>
          <div style={{
            background: "rgba(0,0,0,0.3)",
            padding: "20px",
            borderRadius: "12px",
            margin: "16px 0",
            fontFamily: "monospace",
            fontSize: "0.9rem",
            color: "var(--accent)"
          }}>
            [ React 19 SPA (Vercel) ] <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│ <br />
            &nbsp;&nbsp;&nbsp;&nbsp;├──► REST / JSON over HTTPS ──► [ FastAPI Backend (Render) ] <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│ <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► [ MongoDB Atlas Cloud Database ] <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──► [ Groq Hardware LPU API ]
          </div>
        </section>

        {/* 4. Frontend Layer */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiCode className="seo-card-icon" /> 4. Frontend Layer (React 19 + Vite)</h2>
          <p className="seo-card-text">
            The frontend is engineered with React 19 and Vite for instant build times and lightweight bundles. Key highlights include:
          </p>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>Context Providers:</strong> Separated <code>AuthContext</code>, <code>SessionContext</code>, <code>ChatContext</code>, and <code>ThemeContext</code> prevent unnecessary re-render chains.</li>
            <li><strong>Rich Rendering:</strong> <code>react-markdown</code> and <code>react-syntax-highlighter</code> format mathematical notation, code syntax, tables, and lists cleanly.</li>
            <li><strong>Glassmorphic UI:</strong> Curated CSS token design system with dark/light themes, smooth backdrop filters, and responsive mobile drawers.</li>
          </ul>
        </section>

        {/* 5. Backend Layer */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiServer className="seo-card-icon" /> 5. Backend Layer (FastAPI + Python)</h2>
          <p className="seo-card-text">
            The backend microservice utilizes Python 3.11 and FastAPI for high-concurrency async execution:
          </p>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>Modular Routers:</strong> Modular route handlers for <code>/auth</code>, <code>/chat</code>, <code>/sessions</code>, <code>/org</code>, and <code>/feedback</code>.</li>
            <li><strong>Document Parsing Engine:</strong> Specialized extraction utilities for PDF text streams, Word documents, plain text, and image byte arrays.</li>
            <li><strong>Pydantic Data Contracts:</strong> Strict validation of incoming request bodies and payload fields before database write operations.</li>
          </ul>
        </section>

        {/* 6. Database Layer */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiDatabase className="seo-card-icon" /> 6. Database Layer (MongoDB Atlas)</h2>
          <p className="seo-card-text">
            MongoDB Atlas serves as the persistence engine, managing four primary collections:
          </p>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><code>users</code>: Hashed credentials, personal/org account type, approval status, and creation timestamps.</li>
            <li><code>sessions</code>: Session ID, user ID, session title, creation date, and last active timestamp with indexed lookups.</li>
            <li><code>messages</code>: Trajectory of messages, roles (user/assistant), model tags, timestamps, and attached file metadata.</li>
            <li><code>feedback</code>: Star ratings, user comments, page URLs, and exit intent analytics.</li>
          </ul>
        </section>

        {/* 7. Authentication */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiShield className="seo-card-icon" /> 7. Authentication & Security</h2>
          <p className="seo-card-text">
            Security compliance is enforced through JWT bearer token validation on protected endpoints. Passwords are hashed using <code>bcrypt</code>. Organization accounts require administrator review and status toggle to prevent unauthorized workspace access.
          </p>
        </section>

        {/* 8. LLM Integration */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiCpu className="seo-card-icon" /> 8. LLM Integration (Groq Hardware Acceleration)</h2>
          <p className="seo-card-text">
            By connecting directly to Groq Cloud LPUs, SARVA AI delivers token speeds exceeding 300 tokens per second. The platform formats chat messages into standardized model schemas, injects system prompts, and handles fallback retries gracefully.
          </p>
        </section>

        {/* 9. Deployment */}
        <section className="seo-card" style={{ marginBottom: "32px" }}>
          <h2 className="seo-card-title"><FiServer className="seo-card-icon" /> 9. Deployment & Infrastructure</h2>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>Frontend Hosting:</strong> Deployed on Vercel Edge Network at <code>https://sarva-ai-one.vercel.app/</code> with automatic SPA routing rewrites.</li>
            <li><strong>Backend Hosting:</strong> Deployed on Render cloud services with environment secret configuration and health check monitoring.</li>
            <li><strong>SEO & Webmaster Verification:</strong> Root-level <code>sitemap.xml</code>, <code>robots.txt</code>, BingSiteAuth, and Google Search Console verification.</li>
          </ul>
        </section>

        {/* 10. Challenges & 11. Results */}
        <div className="seo-grid-2">
          <div className="seo-card">
            <h3 className="seo-card-title">10. Challenges Overcome</h3>
            <p className="seo-card-text">
              Handling large document context windows without blowing past rate limits was solved by truncating long transcripts and summarizing pre-pass contexts. Preserving React state across async session loading was resolved using ref-backed message pointers.
            </p>
          </div>

          <div className="seo-card">
            <h3 className="seo-card-title">11. Key Engineering Results</h3>
            <p className="seo-card-text">
              Achieved under 500ms initial response latency on Groq models, 100% test coverage on authentication endpoints, zero-downtime Vercel/Render CI/CD deployments, and complete multi-format file comprehension.
            </p>
          </div>
        </div>

        {/* 12. Future Improvements */}
        <section className="seo-card" style={{ marginTop: "32px" }}>
          <h2 className="seo-card-title">12. Future Roadmap & Enhancements</h2>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><strong>Vector RAG Search:</strong> Integrate MongoDB Vector Search for semantic document retrieval across large enterprise PDF libraries.</li>
            <li><strong>Real-Time Voice Input:</strong> Web Speech API / Whisper transcription integration for hands-free voice interactions.</li>
            <li><strong>Custom System Prompts:</strong> Allow users to configure persona rules, system system instructions, and temperature parameters per session.</li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h3 className="seo-card-title">Experience SARVA AI Production App</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Test out the full system live on Vercel.
          </p>
          <Link to="/chat" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Launch SARVA AI <FiArrowRight />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default CaseStudy;
