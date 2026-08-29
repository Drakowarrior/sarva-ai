import { Link } from "react-router-dom";
import { FiShield, FiKey, FiLock, FiServer, FiDatabase, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const Security = () => {
  useSeo({
    title: "SARVA Security & Privacy — JWT Auth, Bcrypt & Data Protection",
    description: "Enterprise session isolation, JWT bearer token security, bcrypt hashing, and strict data privacy compliance.",
    canonicalPath: "/security",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "Security", "item": "https://sarva-ai-one.vercel.app/security" }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "Security", path: "/security" }]} />
        <div className="seo-hero-badge">Enterprise Security Standards</div>
        <h1 className="seo-page-title">Security & Privacy Architecture</h1>
        <p className="seo-page-subtitle">
          SARVA AI is engineered from the ground up to protect user data, guard against unauthorized access, and enforce strict session isolation across all conversational workflows.
        </p>

        <div className="seo-grid-4-cards">
          <div className="seo-card">
            <div className="seo-card-icon"><FiKey aria-hidden="true" /></div>
            <h2 className="seo-card-title">JWT & Bearer Authentication</h2>
            <p className="seo-card-text">
              All protected API endpoints require cryptographically signed JSON Web Tokens (JWT). Passwords are never stored in plaintext and are hashed using bcrypt with salt rounds.
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
              Strict Pydantic schema validation, file size limits, extension whitelist checks, and CORS origin policy guard against XSS, injection attacks, and unauthorized cross-origin requests.
            </p>
          </div>
        </div>

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
