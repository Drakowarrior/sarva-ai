import { Link } from "react-router-dom";
import { FiArrowRight, FiShield, FiLock } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const ArticleJwtSecurity = () => {
  useSeo({
    title: "Designing JWT Authentication for AI Chatbot Applications | SARVA AI",
    description: "Enforcing security compliance, bcrypt password hashing, token validation, and multi-tenant user data isolation in production AI platforms.",
    canonicalPath: "/blog/jwt-ai-chatbot-security",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "JWT AI Chatbot Security", "item": "https://sarva-ai-one.vercel.app/blog/jwt-ai-chatbot-security" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "Designing JWT Authentication for AI Chatbot Applications",
          "description": "Security engineering guide on bearer token auth and bcrypt password protection in AI platforms.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "datePublished": "2026-08-05"
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "880px" }}>
        <div className="seo-hero-badge">🔒 Security Engineering</div>
        <h1 className="seo-page-title" style={{ fontSize: "2.4rem" }}>
          Designing JWT Authentication for AI Chatbot Applications
        </h1>
        
        <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "30px" }}>
          <span>By Karan Garg</span> • <span>August 05, 2026</span> • <span>6 min read</span>
        </div>

        <section className="seo-card" style={{ marginBottom: "28px" }}>
          <h2 className="seo-card-title">Token Bearer Security Model</h2>
          <p className="seo-card-text">
            Security in AI chat platforms requires isolating session threads and protecting proprietary document uploads. SARVA AI implements JSON Web Token (JWT) bearer validation. Passwords are salted and hashed using <code>bcrypt</code> before database storage.
          </p>
        </section>

        <section className="seo-card" style={{ textAlign: "center", marginTop: "36px" }}>
          <h3 className="seo-card-title">Learn More About SARVA AI Security</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Explore our enterprise security architecture and data privacy standards.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
            <Link to="/security" className="seo-cta-btn" style={{ padding: "10px 22px" }}>
              Explore Security & Privacy <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleJwtSecurity;
