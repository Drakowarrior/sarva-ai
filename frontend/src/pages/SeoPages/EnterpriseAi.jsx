import { Link } from "react-router-dom";
import { FiShield, FiDatabase, FiCloud, FiKey, FiServer, FiArrowRight, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "How does SARVA AI handle multi-user organization accounts?",
    a: "SARVA AI supports organization workspaces with role-based access control (RBAC), department isolation, member invitation codes, and pending approval workflows for administrative oversight."
  },
  {
    q: "Can SARVA AI be integrated with custom enterprise backend services?",
    a: "Yes. SARVA AI is built on an asynchronous FastAPI microservice architecture, offering REST endpoints for authentication, chat completions, document parsing, and session management."
  },
  {
    q: "How is user data protected within an enterprise environment?",
    a: "Data isolation is enforced at the database level. All communication pathways require mandatory HTTPS encryption and stateless JWT bearer authentication."
  }
];

const EnterpriseAi = () => {
  useSeo({
    title: "Enterprise AI Solutions & Business Automation | SARVA AI",
    description: "Deploy SARVA AI's enterprise AI solutions for secure business automation, role-based access control, organization workspace management, FastAPI microservices, and private data governance.",
    canonicalPath: "/enterprise-ai",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Enterprise AI", "item": "https://sarva-ai-one.vercel.app/enterprise-ai" }
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
        <SeoBreadcrumbs items={[{ name: "Enterprise AI", path: "/enterprise-ai" }]} />
        <div className="seo-hero-badge">Enterprise Grade AI Architecture</div>
        <h1 className="seo-page-title">Enterprise AI Solutions for Business Automation</h1>
        <p className="seo-page-subtitle">
          Engineered for scale, reliability, and corporate data governance. SARVA AI empowers organizations with private AI assistant workflows, role-based controls, and seamless cloud integrations.
        </p>

        <div className="seo-grid-4-cards">
          <div className="seo-card">
            <div className="seo-card-icon"><FiKey aria-hidden="true" /></div>
            <h2 className="seo-card-title">JWT Authentication & Authorization</h2>
            <p className="seo-card-text">
              Secure endpoint access backed by JSON Web Tokens and bcrypt password hashing. Learn more on our <Link to="/security" style={{ color: "var(--accent)" }}>enterprise security architecture page</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiDatabase aria-hidden="true" /></div>
            <h2 className="seo-card-title">Session & State Management</h2>
            <p className="seo-card-text">
              MongoDB Atlas stores session metadata, message trajectories, and file references with indexed query performance.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiServer aria-hidden="true" /></div>
            <h2 className="seo-card-title">FastAPI Microservice Backend</h2>
            <p className="seo-card-text">
              High-throughput async Python service built on FastAPI. Read our technical deep-dive on <Link to="/technology" style={{ color: "var(--accent)" }}>SARVA AI technology architecture</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCloud aria-hidden="true" /></div>
            <h2 className="seo-card-title">Cloud Deployment Infrastructure</h2>
            <p className="seo-card-text">
              Optimized for modern cloud platforms: React SPA hosted on Vercel Edge Network, FastAPI microservices on Render cloud, and global MongoDB Atlas clusters.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px" }}>
          <h2 className="seo-card-title"><FiShield className="seo-card-icon" aria-hidden="true" /> Enterprise Security & Compliance Highlights</h2>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><strong>Isolated Tenant Data:</strong> Complete logical separation of user databases and session histories.</li>
            <li><strong>Encrypted Transport:</strong> Mandatory TLS/HTTPS encryption across all API request pathways.</li>
            <li><strong>API Rate Limiting:</strong> Defense against denial-of-service attempts and resource consumption abuse.</li>
            <li><strong>Feedback & Audit Logging:</strong> Capture positive and negative user ratings for continuous model evaluation.</li>
          </ul>
        </section>

        {/* FAQ Section */}
        <section className="seo-card" style={{ marginTop: "40px" }} aria-labelledby="enterprise-faq-heading">
          <h2 id="enterprise-faq-heading" className="seo-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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

        {/* Related Resources */}
        <section className="seo-card" style={{ marginTop: "30px" }}>
          <h2 className="seo-card-title">Related Technical Documentation & Case Studies</h2>
          <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
            <li>
              <Link to="/case-study" style={{ color: "var(--accent)", fontWeight: "600" }}>SARVA AI Full-Stack Engineering Case Study</Link> — Detailed breakdown of architecture, challenges overcome, and benchmarks.
            </li>
            <li>
              <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>Enterprise JWT Security & Authentication Guide</Link> — Learn how bearer tokens secure AI microservice endpoints.
            </li>
            <li>
              <Link to="/ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>Intelligent Conversational AI Chatbot Features</Link> — Overview of context-aware prompt streaming and model switching.
            </li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Deploy SARVA AI in Your Organization</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Get started with our organization dashboard and customizable AI assistant workflows.
          </p>
          <Link to="/auth" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Create Enterprise Account <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default EnterpriseAi;
