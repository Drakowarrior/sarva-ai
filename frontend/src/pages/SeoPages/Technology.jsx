import { Link } from "react-router-dom";
import { FiCode, FiLayers, FiDatabase, FiCpu, FiArrowRight, FiZap } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const Technology = () => {
  useSeo({
    title: "SARVA Technology Stack — React 19, FastAPI & MongoDB Atlas",
    description: "Full-stack engineering breakdown: React single-page frontend, FastAPI async backend, Groq LPUs, and MongoDB Atlas.",
    canonicalPath: "/technology",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Technology Stack", "item": "https://sarva-ai-one.vercel.app/technology" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "SARVA AI Technology Stack",
          "description": "Full-stack architecture overview featuring React 19, FastAPI, MongoDB Atlas, and Groq Cloud LPUs.",
          "author": { "@type": "Person", "name": "Karan Garg" }
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "Technology Stack", path: "/technology" }]} />
        <div className="seo-hero-badge">Modern Full-Stack Architecture</div>
        <h1 className="seo-page-title">SARVA AI Technology Stack</h1>
        <p className="seo-page-subtitle">
          SARVA AI is built on a modern, decoupled full-stack architecture optimized for ultra-low latency inference, high concurrent throughput, and rich interactive frontend experiences.
        </p>

        {/* Visual Architecture Flow Diagram */}
        <section className="seo-card" style={{ marginBottom: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">System Architecture Flow</h2>
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
            margin: "30px 0",
            fontSize: "1.1rem",
            fontWeight: "700"
          }}>
            <div style={{ padding: "16px 24px", background: "rgba(99, 102, 241, 0.15)", border: "1px solid rgba(99, 102, 241, 0.3)", borderRadius: "12px", color: "var(--accent)" }}>
              React 19 Frontend
            </div>
            <div style={{ color: "var(--text-secondary)" }}>↓ REST / HTTPS</div>
            <div style={{ padding: "16px 24px", background: "rgba(236, 72, 153, 0.15)", border: "1px solid rgba(236, 72, 153, 0.3)", borderRadius: "12px", color: "#ec4899" }}>
              FastAPI Async Backend
            </div>
            <div style={{ color: "var(--text-secondary)" }}>↓ Async Queries / Groq LPU</div>
            <div style={{ padding: "16px 24px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "12px", color: "#10b981" }}>
              MongoDB Atlas & Groq LLMs
            </div>
          </div>
        </section>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiCode /></div>
            <h3 className="seo-card-title">Frontend Framework</h3>
            <p className="seo-card-text">
              Built with <strong>React 19</strong>, <strong>Vite</strong>, and <strong>Framer Motion</strong>. Provides responsive glassmorphic UI, real-time message streaming UI, syntax-highlighted code blocks, custom theme hooks, and React Router navigation.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiZap /></div>
            <h3 className="seo-card-title">Backend API Service</h3>
            <p className="seo-card-text">
              Powered by <strong>FastAPI (Python 3.11+)</strong> and <strong>Uvicorn</strong>. Utilizes asynchronous endpoint routing, Pydantic data schemas, automatic OpenAPI documentation, CORS middleware, and custom exception handling.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiDatabase /></div>
            <h3 className="seo-card-title">Database & Persistence</h3>
            <p className="seo-card-text">
              Driven by <strong>MongoDB Atlas</strong> and <strong>PyMongo</strong>. Stores user profiles, hashed credentials, organization structures, chat session metadata, message histories, and user feedback logs with optimized indexing.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCpu /></div>
            <h3 className="seo-card-title">Groq LLM Inference Engine</h3>
            <p className="seo-card-text">
              Integrated with <strong>Groq Language Processing Units (LPUs)</strong> for lightning-fast token generation. Supports dynamic runtime switching between Llama 3.3 70B, Llama 3.2 Vision, Gemma, and Mixtral models.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px" }}>
          <h2 className="seo-card-title"><FiLayers className="seo-card-icon" /> Core Technology Specifications</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Frontend Stack</td>
                <td style={{ padding: "12px" }}>React 19, Vite 8, React Router 7, Framer Motion 12, Axios</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Backend Stack</td>
                <td style={{ padding: "12px" }}>FastAPI, Python 3.11, Uvicorn, PyMongo, Pydantic, PyJWT</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Database</td>
                <td style={{ padding: "12px" }}>MongoDB Atlas Cloud (M0 / Production Cluster)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Inference API</td>
                <td style={{ padding: "12px" }}>Groq Cloud LPU API (Qwen-3.6-27b / GPT-OSS-120b, Llama-3.2-11b-vision-preview)</td>
              </tr>
              <tr>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--text-primary)" }}>Hosting</td>
                <td style={{ padding: "12px" }}>Frontend on Vercel, Backend on Render Cloud</td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h3 className="seo-card-title">Read the Full Architecture Case Study</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Explore deep technical insights into how we engineered SARVA AI from the ground up.
          </p>
          <Link to="/case-study" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            View Technical Case Study <FiArrowRight />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default Technology;
