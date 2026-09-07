import { Link } from "react-router-dom";
import { FiCpu, FiFileText, FiRefreshCw, FiMoon, FiShield, FiStar, FiArrowRight, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "What can the SARVA AI chatbot do?",
    a: "The SARVA AI chatbot supports multi-turn contextual conversations, dynamic model switching across open-weight LLMs like Llama 3.3 70B and Llama 3.2 Vision, syntax-highlighted code rendering, Markdown output, and conversation transcript export."
  },
  {
    q: "Can SARVA AI analyze uploaded files and PDFs?",
    a: "Yes. SARVA AI accepts PDF documents, DOCX files, plain text, JSON, Markdown, and image files. The FastAPI backend extracts document text and injects it into the AI context window, enabling document-grounded Q&A and summarization."
  },
  {
    q: "Does SARVA AI support conversation memory across sessions?",
    a: "Yes. Conversations are organized into persistent chat threads stored in MongoDB Atlas. Users can rename, search, and restore previous chat sessions, and the AI uses the full conversation history to handle follow-up questions accurately."
  },
  {
    q: "What AI technologies power SARVA AI's features?",
    a: "SARVA AI uses Groq Language Processing Units (LPUs) for fast inference, running open-weight models including Llama 3.3 70B Versatile, Llama 3.2 Vision, and Llama 3.1 8B Instant — all served through the Groq Cloud API via a FastAPI backend."
  }
];

const Features = () => {
  useSeo({
    title: "SARVA AI Features — Chatbot, PDF Analysis & Memory",
    description: "Explore SARVA AI features: multi-turn chat memory, PDF parsing, dynamic Llama 3.3 model routing, Groq LPU speed, and role-based organization security.",
    canonicalPath: "/features",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Features", "item": "https://sarva-ai-one.vercel.app/features" }
          ]
        },
        {
          "@type": "WebPage",
          "@id": "https://sarva-ai-one.vercel.app/features",
          "name": "SARVA AI Features",
          "description": "SARVA AI provides AI-powered features for conversational interaction, file analysis, conversation memory, and model-powered developer workflows.",
          "url": "https://sarva-ai-one.vercel.app/features"
        },
        {
          "@type": "ItemList",
          "name": "SARVA AI Core Features",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Dynamic LLM Engine", "description": "Switch between Llama 3.3 70B, Llama 3.2 Vision, Gemma, and Mixtral via Groq LPU hardware." },
            { "@type": "ListItem", "position": 2, "name": "Multi-Format Document Parsing", "description": "Upload PDF, DOCX, TXT, JSON, Markdown, and image files for in-context AI analysis." },
            { "@type": "ListItem", "position": 3, "name": "Persistent MongoDB Memory", "description": "Organize conversations into searchable, renameable threads stored in MongoDB Atlas." },
            { "@type": "ListItem", "position": 4, "name": "User Feedback Loop", "description": "Integrated star-rating feedback modal captures quality signals for model alignment." },
            { "@type": "ListItem", "position": 5, "name": "Theme System & Glassmorphism", "description": "Dark and light mode toggle backed by CSS variable tokens with micro-animations." },
            { "@type": "ListItem", "position": 6, "name": "Organization Governance", "description": "Organization accounts, pending approval workflows, and RBAC administrative controls." }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": FAQS.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": { "@type": "Answer", "text": item.a }
          }))
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "Features", path: "/features" }]} />
        <div className="seo-hero-badge">Core Platform Capabilities</div>
        <h1 className="seo-page-title">SARVA AI Features — AI Chatbot, PDF Analysis, Multi-Model Routing &amp; Memory</h1>
        <p className="seo-page-subtitle">
          SARVA AI provides AI-powered features for conversational interaction, file analysis, multi-turn conversation memory, and model-powered developer workflows — built on React 19, FastAPI, and Groq LPU hardware.
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
            <h2 className="seo-card-title">Theme System &amp; Glassmorphism</h2>
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
            <li><Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>How to Use Groq LPU &amp; LLaMA for AI Inference</Link></li>
            <li><Link to="/blog/chat-history-memory" style={{ color: "var(--accent)", fontWeight: "600" }}>Building Conversational AI with MongoDB Memory</Link></li>
            <li><Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>How JWT Auth Works in AI Chatbot Applications</Link></li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="seo-card" style={{ marginTop: "40px" }} aria-labelledby="features-faq-heading">
          <h2 id="features-faq-heading" className="seo-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiHelpCircle style={{ color: "var(--accent)" }} aria-hidden="true" /> Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            {FAQS.map((faq, idx) => (
              <details key={idx} style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px"
              }}>
                <summary style={{ fontWeight: "700", cursor: "pointer", color: "var(--text-primary)" }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: "8px", color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.92rem" }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Try All Features Live</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Experience fast conversational AI with file support and dynamic model selection.
          </p>
          <Link to="/auth" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Get Started Free <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default Features;
