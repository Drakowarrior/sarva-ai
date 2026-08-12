import { Link } from "react-router-dom";
import { FiCode, FiLayers, FiShield, FiFileText, FiCpu, FiArrowRight, FiClock, FiBookOpen } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

export const articlesData = [
  {
    slug: "fastapi-groq-ai-chatbot",
    title: "How I Built a Full-Stack AI Chatbot with React, FastAPI and Groq",
    description: "A step-by-step engineering deep dive into building an ultra-fast conversational AI platform with 300+ tokens/sec LLM streaming.",
    category: "Full-Stack AI",
    date: "August 12, 2026",
    readTime: "8 min read",
    icon: FiCpu,
    iconColor: "#38bdf8"
  },
  {
    slug: "ai-document-analysis",
    title: "Building AI PDF & Document Analysis with FastAPI",
    description: "Learn how to parse PDF reports, DOCX files, and text archives on the backend and feed prompt context into LLM context windows.",
    category: "Document AI",
    date: "August 10, 2026",
    readTime: "6 min read",
    icon: FiFileText,
    iconColor: "#ec4899"
  },
  {
    slug: "mongodb-chat-memory",
    title: "How MongoDB Stores Conversational AI Session Memory",
    description: "Designing a high-performance MongoDB Atlas database schema for multi-turn chat threads, user profiles, and session trajectories.",
    category: "Database & State",
    date: "August 08, 2026",
    readTime: "7 min read",
    icon: FiLayers,
    iconColor: "#10b981"
  },
  {
    slug: "jwt-ai-chatbot-security",
    title: "Designing JWT Authentication for AI Chatbot Applications",
    description: "Enforcing security compliance, bcrypt password hashing, token validation, and multi-tenant user data isolation in AI platforms.",
    category: "Security",
    date: "August 05, 2026",
    readTime: "6 min read",
    icon: FiShield,
    iconColor: "#a855f7"
  },
  {
    slug: "full-stack-ai-architecture",
    title: "Deploying Full-Stack AI Applications on Vercel + Render",
    description: "Production guide for hosting React SPAs on Vercel Edge Network and FastAPI microservices on Render cloud with CORS and health checks.",
    category: "DevOps & Cloud",
    date: "August 02, 2026",
    readTime: "9 min read",
    icon: FiCode,
    iconColor: "#f59e0b"
  }
];

const BlogHub = () => {
  useSeo({
    title: "SARVA AI Engineering Blog & Technical Articles",
    description: "Technical articles and engineering guides on building full-stack AI chatbots with React 19, FastAPI, MongoDB Atlas, Groq LPUs, and cloud security.",
    canonicalPath: "/blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" }
          ]
        },
        {
          "@type": "CollectionPage",
          "name": "SARVA AI Engineering Blog",
          "url": "https://sarva-ai-one.vercel.app/blog",
          "description": "Technical engineering articles on full-stack conversational AI development."
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "1100px" }}>
        <div className="seo-hero-badge"><FiBookOpen /> Technical Engineering Hub</div>
        <h1 className="seo-page-title">SARVA AI Engineering Blog</h1>
        <p className="seo-page-subtitle">
          In-depth technical guides, software architecture breakdowns, and practical tutorials written by developers for building modern AI applications.
        </p>

        <div className="seo-grid-2" style={{ marginTop: "30px" }}>
          {articlesData.map((article) => {
            const Icon = article.icon;
            return (
              <Link
                key={article.slug}
                to={`/blog/${article.slug}`}
                className="seo-card"
                style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{
                      fontSize: "0.78rem",
                      fontWeight: "700",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      background: "rgba(56, 189, 248, 0.1)",
                      color: article.iconColor,
                      border: "1px solid rgba(56, 189, 248, 0.2)"
                    }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", display: "flex", alignItems: "center", gap: "4px" }}>
                      <FiClock /> {article.readTime}
                    </span>
                  </div>

                  <div className="seo-card-icon" style={{ color: article.iconColor }}><Icon /></div>
                  <h2 className="seo-card-title" style={{ fontSize: "1.25rem", lineHeight: "1.4" }}>
                    {article.title}
                  </h2>
                  <p className="seo-card-text" style={{ marginTop: "8px", fontSize: "0.92rem" }}>
                    {article.description}
                  </p>
                </div>

                <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "6px", fontWeight: "600", fontSize: "0.9rem", color: "var(--accent)" }}>
                  Read Technical Article <FiArrowRight />
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default BlogHub;
