import { Link } from "react-router-dom";
import { FiKey, FiLock, FiServer, FiDatabase, FiArrowRight, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "How does SARVA AI secure user authentication?",
    a: "SARVA AI utilizes cryptographically signed JSON Web Tokens (JWT) for all protected API endpoints. Passwords are never stored in plaintext and are securely hashed using bcrypt."
  },
  {
    q: "Is enterprise data shared across different user accounts?",
    a: "No. Strict logical tenant isolation is maintained inside MongoDB Atlas. User sessions, conversation histories, and uploaded file references are isolated per user and organization context."
  },
  {
    q: "Is data encrypted in transit?",
    a: "Yes. 100% of data transmitted between client browsers, Vercel edge nodes, Render backend microservices, and MongoDB Atlas database clusters is encrypted in transit using TLS 1.3."
  }
];

const Security = () => {
  useSeo({
    title: "Secure Enterprise AI & Data Protection Architecture | SARVA AI",
    description: "Learn how SARVA AI protects enterprise data with JWT bearer tokens, bcrypt password encryption, MongoDB Atlas tenant isolation, TLS 1.3 transport security, and Pydantic input validation.",
    canonicalPath: "/security",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Security", "item": "https://sarva-ai-one.vercel.app/security" }
          ]
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
        <SeoBreadcrumbs items={[{ name: "Security", path: "/security" }]} />
        <div className="seo-hero-badge">Enterprise Security Standards</div>
        <h1 className="seo-page-title">Enterprise AI Security & Data Privacy Architecture</h1>
        <p className="seo-page-subtitle">
          SARVA AI is engineered from the ground up to protect user data, guard against unauthorized access, and enforce strict session isolation across all conversational workflows.
        </p>

        <div className="seo-grid-4-cards">
          <div className="seo-card">
            <div className="seo-card-icon"><FiKey aria-hidden="true" /></div>
            <h2 className="seo-card-title">JWT & Bearer Authentication</h2>
            <p className="seo-card-text">
              All protected API endpoints require cryptographically signed JSON Web Tokens (JWT). Read our technical guide on <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)" }}>JWT security in FastAPI AI chatbots</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiDatabase aria-hidden="true" /></div>
            <h2 className="seo-card-title">Database Level Tenant Isolation</h2>
            <p className="seo-card-text">
              Chat histories, uploaded document references, and user profiles are tied strictly to user IDs and organization account contexts inside MongoDB Atlas.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiLock aria-hidden="true" /></div>
            <h2 className="seo-card-title">Encrypted Data Transport</h2>
            <p className="seo-card-text">
              100% of data transmitted between the client browser, Vercel edge frontend, Render backend microservices, and MongoDB Atlas database clusters is encrypted in transit using TLS 1.3.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiServer aria-hidden="true" /></div>
            <h2 className="seo-card-title">Input Sanitization & Protection</h2>
            <p className="seo-card-text">
              Strict Pydantic schema validation, file size limits, extension whitelist checks, and CORS origin policy guard against XSS, injection attacks, and unauthorized requests.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="seo-card" style={{ marginTop: "40px" }} aria-labelledby="security-faq-heading">
          <h2 id="security-faq-heading" className="seo-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

        {/* Topic Cluster Related Resources */}
        <section className="seo-card" style={{ marginTop: "30px" }}>
          <h2 className="seo-card-title">Related AI Security Architecture Resources</h2>
          <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
            <li>
              <Link to="/enterprise-ai" style={{ color: "var(--accent)", fontWeight: "600" }}>Enterprise AI Solutions & Governance</Link> — Role-based access control and organizational workspace administration.
            </li>
            <li>
              <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>JWT AI Chatbot Security Walkthrough</Link> — Deep dive into state management, token generation, and password hashing.
            </li>
            <li>
              <Link to="/technology" style={{ color: "var(--accent)", fontWeight: "600" }}>SARVA AI Full-Stack Infrastructure</Link> — Specifications of React, FastAPI microservices, and MongoDB persistence.
            </li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Experience Secure AI Assistance</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Sign up for a protected personal or organization workspace account today.
          </p>
          <Link to="/auth" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Create Secure Account <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default Security;
