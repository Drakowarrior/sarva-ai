import { Link } from "react-router-dom";
import { FiCode, FiLayers, FiDatabase, FiCpu, FiArrowRight, FiZap, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "Why does SARVA AI use FastAPI for the backend microservice?",
    a: "FastAPI offers high-performance asynchronous Python request handling built on Starlette and Pydantic, enabling low latency and automatic OpenAPI spec generation for AI completions."
  },
  {
    q: "How does Groq LPU hardware accelerate AI token generation?",
    a: "Groq Language Processing Units (LPUs) are purpose-built compute engines designed for sequential model inference, achieving speeds of >300 tokens/sec for Llama 3.3 models."
  },
  {
    q: "What role does MongoDB Atlas play in the architecture?",
    a: "MongoDB Atlas provides scalable JSON document storage for user accounts, session state metadata, message trajectories, and user feedback logs with indexing."
  }
];

const Technology = () => {
  useSeo({
    title: "SARVA AI Tech Stack – React, FastAPI, MongoDB & Groq LPU Architecture",
    description: "Explore the SARVA AI full-stack technology architecture: React 19 single-page frontend, asynchronous FastAPI Python backend, Groq LPU hardware inference with Llama 3.3 70B, and MongoDB Atlas cloud database.",
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
          "headline": "SARVA AI Full-Stack Technology Architecture",
          "description": "Full-stack architecture overview featuring React 19, FastAPI, MongoDB Atlas, and Groq Cloud LPUs.",
          "author": { "@type": "Person", "name": "Karan Garg" }
        },
        {
          "@type": "FAQPage",
          "mainEntity": FAQS.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": item.a
            }
          }))
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
        <h1 className="seo-page-title">SARVA AI Full-Stack Technology Architecture</h1>
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
            <div style={{ padding: "16px 24px", background: "var(--sarva-accent-soft)", border: "1px solid var(--border-accent)", borderRadius: "12px", color: "var(--sarva-text-accent)", cursor: "default" }}>
              React 19 Frontend
            </div>
            <div style={{ color: "var(--sarva-text-secondary)", userSelect: "none" }} aria-hidden="true">↓ REST / HTTPS</div>
            <div style={{ padding: "16px 24px", background: "var(--sarva-surface-hover)", border: "1px solid var(--sarva-border)", borderRadius: "12px", color: "var(--sarva-text-accent)", cursor: "default" }}>
              FastAPI Async Backend
            </div>
            <div style={{ color: "var(--sarva-text-secondary)", userSelect: "none" }} aria-hidden="true">↓ Async Queries / Groq LPU</div>
            <div style={{ padding: "16px 24px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "12px", color: "var(--sarva-success)", cursor: "default" }}>
              MongoDB Atlas & Groq LLMs
            </div>
          </div>
        </section>

        <div className="seo-grid-4-cards">
          <div className="seo-card">
            <div className="seo-card-icon"><FiCode aria-hidden="true" /></div>
            <h2 className="seo-card-title">Frontend Framework</h2>
            <p className="seo-card-text">
              Built with <strong>React 19</strong>, <strong>Vite</strong>, and <strong>Framer Motion</strong>. Provides responsive glassmorphic UI, real-time message streaming, and syntax-highlighted code blocks.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiZap aria-hidden="true" /></div>
            <h2 className="seo-card-title">Backend API Service</h2>
            <p className="seo-card-text">
              Powered by <strong>FastAPI (Python 3.11+)</strong> and <strong>Uvicorn</strong>. Read our implementation article on <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)" }}>React and FastAPI AI Chatbots</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiDatabase aria-hidden="true" /></div>
            <h2 className="seo-card-title">Database & Persistence</h2>
            <p className="seo-card-text">
              Driven by <strong>MongoDB Atlas</strong> and <strong>PyMongo</strong>. Stores user profiles, hashed credentials, session metadata, message histories, and user feedback.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCpu aria-hidden="true" /></div>
            <h2 className="seo-card-title">Groq LLM Inference Engine</h2>
            <p className="seo-card-text">
              Integrated with <strong>Groq Language Processing Units (LPUs)</strong> for lightning-fast token generation. Read our guide on <Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)" }}>FastAPI and Groq Acceleration</Link>.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px" }}>
          <h2 className="seo-card-title"><FiLayers className="seo-card-icon" aria-hidden="true" /> Core Technology Specifications</h2>
          <table style={{ width: "100%", borderCollapse: "collapse", color: "var(--sarva-text-secondary)", fontSize: "0.95rem" }}>
            <tbody>
              <tr style={{ borderBottom: "1px solid var(--sarva-border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--sarva-text-primary)" }}>Frontend Stack</td>
                <td style={{ padding: "12px" }}>React 19, Vite 8, React Router 7, Framer Motion 12, Axios</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--sarva-border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--sarva-text-primary)" }}>Backend Stack</td>
                <td style={{ padding: "12px" }}>FastAPI, Python 3.11, Uvicorn, PyMongo, Pydantic, PyJWT</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--sarva-border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--sarva-text-primary)" }}>Database</td>
                <td style={{ padding: "12px" }}>MongoDB Atlas Cloud (M0 / Production Cluster)</td>
              </tr>
              <tr style={{ borderBottom: "1px solid var(--sarva-border)" }}>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--sarva-text-primary)" }}>Inference API</td>
                <td style={{ padding: "12px" }}>Groq Cloud LPU API (Llama-3.3-70b-versatile, Llama-3.2-11b-vision-preview)</td>
              </tr>
              <tr>
                <td style={{ padding: "12px", fontWeight: "700", color: "var(--sarva-text-primary)" }}>Hosting</td>
                <td style={{ padding: "12px" }}>Frontend on Vercel, Backend on Render Cloud</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* FAQ Section */}
        <section className="seo-card" style={{ marginTop: "40px" }} aria-labelledby="tech-faq-heading">
          <h2 id="tech-faq-heading" className="seo-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

        {/* Related Technical Resources */}
        <section className="seo-card" style={{ marginTop: "30px" }}>
          <h2 className="seo-card-title">Related Technical Documentation & Guides</h2>
          <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
            <li>
              <Link to="/case-study" style={{ color: "var(--accent)", fontWeight: "600" }}>SARVA AI Full-Stack Engineering Case Study</Link> — Benchmark metrics, challenges overcome, and system latency.
            </li>
            <li>
              <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", fontWeight: "600" }}>Full-Stack AI Architecture & Deployment</Link> — System design patterns for enterprise AI platforms.
            </li>
            <li>
              <Link to="/blog/chat-history-memory" style={{ color: "var(--accent)", fontWeight: "600" }}>MongoDB Session Memory Management</Link> — Designing persistent conversation stores.
            </li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Read the Full Architecture Case Study</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Explore deep technical insights into how we engineered SARVA AI from the ground up.
          </p>
          <Link to="/case-study" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            View Technical Case Study <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default Technology;
