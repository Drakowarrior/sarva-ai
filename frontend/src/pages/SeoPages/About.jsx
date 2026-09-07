import { Link } from "react-router-dom";
import { FiInfo, FiTarget, FiUserCheck, FiCode, FiArrowRight, FiGithub, FiGlobe, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "What is SARVA AI built with?",
    a: "SARVA AI is built with React 19 and Vite for the frontend, FastAPI (Python 3.11+) for the backend microservice, MongoDB Atlas for persistent data storage, and Groq LPU hardware acceleration for fast AI model inference."
  },
  {
    q: "What problem does SARVA AI solve?",
    a: "SARVA AI addresses the gap between raw LLM APIs and practical enterprise use. It provides a unified full-stack platform where users can chat conversationally, upload and analyze documents, maintain session memory across threads, and manage team access with role-based controls — without building this infrastructure from scratch."
  },
  {
    q: "Who is SARVA AI designed for?",
    a: "SARVA AI is designed for software engineers, AI researchers, technical teams, and enterprise organizations who need a customizable, deployable AI assistant. It is particularly useful for teams working with code analysis, document intelligence, and internal knowledge workflows."
  }
];

const About = () => {
  useSeo({
    title: "About SARVA AI — Full-Stack Conversational AI Platform Built with React & FastAPI",
    description: "SARVA AI is a full-stack enterprise AI platform built with React 19 and FastAPI by Karan Garg. Features multi-turn conversation memory, PDF document analysis, Groq LPU inference, and organization workspace management.",
    canonicalPath: "/about",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "About", "item": "https://sarva-ai-one.vercel.app/about" }
          ]
        },
        {
          "@type": "Organization",
          "name": "SARVA AI",
          "url": "https://sarva-ai-one.vercel.app",
          "description": "Enterprise conversational AI platform built with React 19, FastAPI, MongoDB Atlas, and Groq LPU inference.",
          "sameAs": ["https://github.com/Drakowarrior/sarva-ai"]
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
        <SeoBreadcrumbs items={[{ name: "About", path: "/about" }]} />
        <div className="seo-hero-badge">Platform Vision &amp; Engineering</div>
        <h1 className="seo-page-title">About SARVA AI — Full-Stack Conversational AI Platform</h1>
        <p className="seo-page-subtitle">
          SARVA AI is a production-ready enterprise conversational AI platform built to deliver intuitive reasoning, document intelligence, multi-model flexibility, and developer-centric workflows — engineered from the ground up with React 19 and FastAPI.
        </p>

        <section className="seo-card" style={{ marginBottom: "30px" }}>
          <h2 className="seo-card-title"><FiTarget className="seo-card-icon" /> Our Mission</h2>
          <p className="seo-card-text">
            Our mission is to democratize access to high-speed, enterprise-grade AI reasoning by providing a unified full-stack conversational platform. Whether analyzing technical resumes, inspecting complex codebases, or conducting deep research, SARVA AI streamlines interactions with state-of-the-art LLMs — with persistent memory, document comprehension, and organization-scale access controls built in.
          </p>
        </section>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiCode aria-hidden="true" /></div>
            <h2 className="seo-card-title">Full-Stack Excellence</h2>
            <p className="seo-card-text">
              Built from scratch using <Link to="/technology" style={{ color: "var(--accent)" }}>React 19, FastAPI, MongoDB Atlas, and Groq LPU hardware acceleration</Link> to ensure zero friction between human intent and AI execution. Every component of the stack was chosen for production reliability, low latency, and developer ergonomics.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiUserCheck aria-hidden="true" /></div>
            <h2 className="seo-card-title">Developer &amp; Enterprise Focus</h2>
            <p className="seo-card-text">
              Engineered with production requirements in mind: <Link to="/security" style={{ color: "var(--accent)" }}>JWT authentication</Link>, organization dashboards with RBAC, rate-limiting protection, audit feedback logs, and cross-platform responsiveness. See the <Link to="/enterprise-ai" style={{ color: "var(--accent)" }}>enterprise AI features</Link> for workspace controls.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "32px" }}>
          <h2 className="seo-card-title"><FiInfo className="seo-card-icon" /> Developer &amp; Project</h2>
          <p className="seo-card-text">
            SARVA AI was designed and built by <strong>Karan Garg</strong>, a full-stack developer and intern at IGT Solutions. The project demonstrates end-to-end engineering of a production conversational AI platform — from database schema design to frontend UX and cloud deployment.
          </p>
          <div style={{ display: "flex", gap: "12px", marginTop: "16px", flexWrap: "wrap" }}>
            <a href="https://github.com/Drakowarrior/sarva-ai" target="_blank" rel="noopener noreferrer" className="seo-social-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FiGithub aria-hidden="true" /> View on GitHub
            </a>
            <a href="https://sarva-ai-one.vercel.app" target="_blank" rel="noopener noreferrer" className="seo-social-link" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <FiGlobe aria-hidden="true" /> Live Platform
            </a>
          </div>
        </section>

        <section className="seo-card" style={{ marginTop: "32px" }}>
          <h2 className="seo-card-title">Explore SARVA AI Capabilities</h2>
          <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "var(--text-secondary)", lineHeight: "2" }}>
            <li><Link to="/ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>AI Chatbot</Link> — Multi-turn memory, PDF uploads, dynamic model switching</li>
            <li><Link to="/file-analysis" style={{ color: "var(--accent)", fontWeight: "600" }}>AI File Analysis</Link> — PDF, DOCX, image and code file parsing</li>
            <li><Link to="/enterprise-ai" style={{ color: "var(--accent)", fontWeight: "600" }}>Enterprise AI</Link> — Organization workspaces, RBAC, and admin controls</li>
            <li><Link to="/security" style={{ color: "var(--accent)", fontWeight: "600" }}>Security Architecture</Link> — JWT, bcrypt, TLS 1.3, and tenant isolation</li>
            <li><Link to="/technology" style={{ color: "var(--accent)", fontWeight: "600" }}>Technology Stack</Link> — React 19, FastAPI, MongoDB Atlas, Groq LPUs</li>
            <li><Link to="/case-study" style={{ color: "var(--accent)", fontWeight: "600" }}>Engineering Case Study</Link> — Full architecture breakdown and design decisions</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="seo-card" style={{ marginTop: "40px" }} aria-labelledby="about-faq-heading">
          <h2 id="about-faq-heading" className="seo-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
          <h2 className="seo-card-title">Want to see how SARVA AI works?</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Explore our platform features or test out our live interactive chat experience.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/features" className="seo-cta-btn" style={{ padding: "12px 24px" }}>
              Explore Features <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/auth" className="seo-social-link" style={{ padding: "12px 24px" }}>
              Try Live Demo <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default About;
