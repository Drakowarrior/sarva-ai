import { Link } from "react-router-dom";
import { FiLayers, FiCpu, FiFileText, FiRefreshCw, FiMoon, FiShield, FiStar, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const Features = () => {
  useSeo({
    title: "SARVA AI Features – Conversational AI, PDF Analysis & Memory",
    description: "Discover SARVA AI features: dynamic LLM model switching, document PDF parsing, MongoDB session memory, enterprise auth, dark/light themes, and user feedback.",
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
        <div className="seo-hero-badge">✨ Core Platform Features</div>
        <h1 className="seo-page-title">SARVA AI Platform Features</h1>
        <p className="seo-page-subtitle">
          An all-in-one conversational suite designed to boost productivity, accelerate code comprehension, and automate complex document analysis workflows.
        </p>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiCpu /></div>
            <h3 className="seo-card-title">Dynamic LLM Engine</h3>
            <p className="seo-card-text">
              Switch dynamically between leading open and closed models including Llama 3.3 70B, Llama 3.2 Vision, Gemma, and Mixtral to tailor reasoning depth to your precise prompt.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiFileText /></div>
            <h3 className="seo-card-title">Multi-Format Document Parsing</h3>
            <p className="seo-card-text">
              Upload PDF documents, resume files, text transcripts, or code source files. SARVA AI extracts text and vision features to answer in-context questions effortlessly.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiRefreshCw /></div>
            <h3 className="seo-card-title">Persistent MongoDB Memory</h3>
            <p className="seo-card-text">
              Organize conversations into persistent chat threads. Rename, search, and delete chat sessions inline with real-time MongoDB Atlas synchronization.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiStar /></div>
            <h3 className="seo-card-title">User Feedback Loop</h3>
            <p className="seo-card-text">
              Integrated feedback modal captures 1-5 star ratings, comments, exit intent signals, and route leave triggers to continuously improve model output alignment.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiMoon /></div>
            <h3 className="seo-card-title">Theme System & Glassmorphism</h3>
            <p className="seo-card-text">
              Smooth dark and light mode toggle backed by CSS variable tokens, glassmorphic UI panels, micro-animations, and full mobile viewport responsiveness.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiShield /></div>
            <h3 className="seo-card-title">Organization Governance</h3>
            <p className="seo-card-text">
              Organization user creation, pending approval workflows, member listing dashboards, and administrative controls for enterprise workspaces.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h3 className="seo-card-title">Try All Features Live</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Experience fast conversational AI with file support and dynamic model selection.
          </p>
          <Link to="/chat" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Get Started Free <FiArrowRight />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default Features;
