import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import TableOfContents from "../../components/Common/TableOfContents";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const ArticleJwtSecurity = () => {
  useSeo({
    title: "How JWT Authentication Works in AI Chatbot Applications | SARVA AI",
    description: "Security compliance, bcrypt password hashing, token validation, and multi-tenant session privacy.",
    canonicalPath: "/blog/jwt-ai-chatbot",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
          { "@type": "ListItem", "position": 3, "name": "JWT AI Chatbot Security", "item": "https://sarva-ai-one.vercel.app/blog/jwt-ai-chatbot" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": "How JWT Authentication Works in AI Chatbot Applications",
        "description": "Technical guide on implementing JWT bearer security in AI chatbot applications.",
        "author": { "@type": "Person", "name": "Karan Garg" },
        "publisher": { "@type": "Organization", "name": "SARVA AI" },
        "datePublished": "2026-08-05",
        "dateModified": "2026-08-05",
        "mainEntityOfPage": "https://sarva-ai-one.vercel.app/blog/jwt-ai-chatbot"
      }
    ]
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "JWT AI Chatbot Security", path: "/blog/jwt-ai-chatbot" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How JWT Authentication Works in AI Chatbot Applications
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 24px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 05, 2026</span>
          <span>•</span>
          <span><FiClock /> 6 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Securing AI application user sessions requires stateless authentication that protects private chat histories and uploaded document contents without introducing database lookup overhead on every streaming HTTP request.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Token Generation & Password Hashing
          </h2>
          <p>
            Passwords are hashed using `passlib` with `bcrypt`. Upon successful login, FastAPI encodes a signed JSON Web Token (JWT) containing the user subject and expiration timestamp:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#a855f7" }}>
{`from datetime import datetime, timedelta
import jwt

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=1440))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")`}
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(56, 189, 248, 0.15))", 
            border: "1px solid rgba(168, 85, 247, 0.4)", 
            borderRadius: "16px", 
            padding: "24px", 
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Experience Protected AI Sessions in SARVA AI
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              SARVA AI isolates all chat threads and file uploads behind encrypted JWT bearer authentication.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_jwt_security", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Multi-Tenant Session Isolation
          </h2>
          <p>
            Every database query for session records filtering matches against the decoded JWT user ID parameter, guaranteeing multi-tenant privacy compliance.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            Related Engineering Articles & Guides
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← React + FastAPI AI Chatbot
            </Link>
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
            </Link>
            <Link to="/blog/chat-history-memory" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              MongoDB Thread Memory →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleJwtSecurity;
