import { Link } from "react-router-dom";
import { FiShield, FiDatabase, FiCloud, FiKey, FiServer, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const EnterpriseAi = () => {
  useSeo({
    title: "Enterprise AI Assistant & Conversational Platform | SARVA AI",
    description: "SARVA AI delivers enterprise conversational AI with JWT authentication, session management, file processing, FastAPI microservices, and cloud infrastructure.",
    canonicalPath: "/enterprise-ai",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "Enterprise AI", "item": "https://sarva-ai-one.vercel.app/enterprise-ai" }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <div className="seo-hero-badge">Enterprise Grade AI Architecture</div>
        <h1 className="seo-page-title">Enterprise AI Assistant & Conversational Platform</h1>
        <p className="seo-page-subtitle">
          Engineered for scale, reliability, and corporate data governance. SARVA AI empowers organizations with private AI assistant workflows, role-based controls, and seamless cloud integrations.
        </p>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiKey /></div>
            <h3 className="seo-card-title">JWT Authentication & Authorization</h3>
            <p className="seo-card-text">
              Secure endpoint access backed by JSON Web Tokens, bcrypt password hashing, and token expiration handling. Supports individual personal accounts and multi-user organization accounts with pending approval workflows.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiDatabase /></div>
            <h3 className="seo-card-title">Session & State Management</h3>
            <p className="seo-card-text">
              MongoDB Atlas stores session metadata, message trajectories, and file references with indexed query performance. Built-in mechanisms handle clean session switching, historical loading, and user feedback capture.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiServer /></div>
            <h3 className="seo-card-title">FastAPI Microservice Backend</h3>
            <p className="seo-card-text">
              High-throughput async Python service built on FastAPI and Uvicorn. Implements clean router separation for auth, chat completion, session history, document parsing, organization dashboards, and feedback endpoints.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCloud /></div>
            <h3 className="seo-card-title">Cloud Deployment Infrastructure</h3>
            <p className="seo-card-text">
              Optimized for modern cloud platforms: React single-page application hosted on Vercel Edge Network, FastAPI microservices deployed on Render cloud, and global MongoDB Atlas cluster persistence.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px" }}>
          <h2 className="seo-card-title"><FiShield className="seo-card-icon" /> Enterprise Security & Compliance Highlights</h2>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <li><strong>Isolated Tenant Data:</strong> Complete logical separation of user databases and session histories.</li>
            <li><strong>Encrypted Transport:</strong> Mandatory TLS/HTTPS encryption across all API request pathways and WebSocket fallback links.</li>
            <li><strong>API Rate Limiting:</strong> Defense against denial-of-service attempts and resource consumption abuse.</li>
            <li><strong>Feedback & Audit Logging:</strong> Capture positive and negative user ratings for continuous model performance evaluation.</li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h3 className="seo-card-title">Deploy SARVA AI in Your Organization</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Get started with our organization dashboard and customizable AI assistant workflows.
          </p>
          <Link to="/auth" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Create Enterprise Account <FiArrowRight />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default EnterpriseAi;
