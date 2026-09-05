import { Link } from "react-router-dom";
import { FiCpu, FiFileText, FiRefreshCw, FiMoon, FiShield, FiStar, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const Features = () => {
  useSeo({
    title: "SARVA AI Features — AI Chatbot, PDF Analysis, Multi-Model Routing & Memory | SARVA AI",
    description: "Explore SARVA AI's full capability suite: multi-turn chat threads, PDF document parsing, dynamic model routing across Llama 3.3 70B, Groq LPU inference, and role-based organization security.",
    canonicalPath: "/features",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://sarva-ai-one.vercel.app/features" }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "Features", path: "/features" }]} />
        <div className="seo-hero-badge">Core Platform Capabilities</div>
        <h1 className="seo-page-title">SARVA AI Features — AI Chatbot, PDF Analysis, Multi-Model Routing & Memory</h1>
        <p className="seo-page-subtitle">
          An all-in-one conversational suite designed to boost productivity, accelerate code comprehension, and automate complex document analysis workflows.
        </p>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiCpu aria-hidden="true" /></div>
            <h2 className="seo-card-title">Dynamic LLM Engine</h2>
            <p className="seo-card-text">
              Switch dynamically between leading open and closed models including Llama 3.3 70B, Llama 3.2 Vision, Gemma, and Mixtral to tailor reasoning depth to your precise prompt. Powered by <Link to="/technology" style={{ color: "var(--accent)" }}>Groq LPU hardware</Link> for 300+ tokens/sec.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiFileText aria-hidden="true" /></div>
            <h2 className="seo-card-title">Multi-Format Document Parsing</h2>
            <p className="seo-card-text">
              Upload PDF documents, resume files, text transcripts, or code source files. SARVA AI extracts text and vision features to answer in-context questions effortlessly. See the <Link to="/file-analysis" style={{ color: "var(--accent)" }}>full file analysis capabilities</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiRefreshCw aria-hidden="true" /></div>
            <h2 className="seo-card-title">Persistent MongoDB Memory</h2>
            <p className="seo-card-text">
              Organize conversations into persistent chat threads. Rename, search, and delete chat sessions inline with real-time MongoDB Atlas synchronization. <Link to="/ai-chatbot" style={{ color: "var(--accent)" }}>Explore the full chatbot experience</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiStar aria-hidden="true" /></div>
            <h2 className="seo-card-title">User Feedback Loop</h2>
            <p className="seo-card-text">
              Integrated feedback modal captures 1-5 star ratings, comments, exit intent signals, and route leave triggers to continuously improve model output alignment.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiMoon aria-hidden="true" /></div>
            <h2 className="seo-card-title">Theme System & Glassmorphism</h2>
            <p className="seo-card-text">
              Smooth dark and light mode toggle backed by CSS variable tokens, glassmorphic UI panels, micro-animations, and full mobile viewport responsiveness.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiShield aria-hidden="true" /></div>
            <h2 className="seo-card-title">Organization Governance</h2>
            <p className="seo-card-text">
              Organization user creation, pending approval workflows, member listing dashboards, and administrative controls for enterprise workspaces. Learn about <Link to="/enterprise-ai" style={{ color: "var(--accent)" }}>enterprise AI features</Link> and <Link to="/security" style={{ color: "var(--accent)" }}>security architecture</Link>.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px" }}>
          <h2 className="seo-card-title">Technical Implementation Guides</h2>
          <p className="seo-card-text" style={{ marginBottom: "16px" }}>
            Explore the engineering blog to learn how each feature was built from the ground up:
          </p>
          <ul style={{ paddingLeft: "20px", lineHeight: "2", color: "var(--text-secondary)" }}>
            <li><Link to="/blog/chat-with-pdf" style={{ color: "var(--accent)", fontWeight: "600" }}>How to Chat With PDF Documents Using AI</Link></li>
            <li><Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>How to Build a React + FastAPI AI Chatbot</Link></li>
            <li><Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>How to Use Groq LPU & LLaMA for AI Inference</Link></li>
            <li><Link to="/blog/chat-history-memory" style={{ color: "var(--accent)", fontWeight: "600" }}>Building Conversational AI with MongoDB Memory</Link></li>
            <li><Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>How JWT Auth Works in AI Chatbot Applications</Link></li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Try All Features Live</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Experience fast conversational AI with file support and dynamic model selection.
          </p>
          <Link to="/chat" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Get Started Free <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default Features;
