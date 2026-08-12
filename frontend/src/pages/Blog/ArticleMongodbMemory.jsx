import { Link } from "react-router-dom";
import { FiArrowRight, FiDatabase, FiLayers } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const ArticleMongodbMemory = () => {
  useSeo({
    title: "How MongoDB Stores Conversational AI Session Memory | SARVA AI",
    description: "Designing a high-performance MongoDB Atlas database schema for multi-turn chat threads, user profiles, and session trajectories in AI chatbot platforms.",
    canonicalPath: "/blog/mongodb-chat-memory",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "MongoDB Session Memory", "item": "https://sarva-ai-one.vercel.app/blog/mongodb-chat-memory" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "How MongoDB Stores Conversational AI Session Memory",
          "description": "Database schema and indexing strategies for LLM multi-turn chat history.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "datePublished": "2026-08-08"
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "880px" }}>
        <div className="seo-hero-badge">💾 Database & State Management</div>
        <h1 className="seo-page-title" style={{ fontSize: "2.4rem" }}>
          How MongoDB Stores Conversational AI Session Memory
        </h1>
        
        <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "30px" }}>
          <span>By Karan Garg</span> • <span>August 08, 2026</span> • <span>7 min read</span>
        </div>

        <section className="seo-card" style={{ marginBottom: "28px" }}>
          <h2 className="seo-card-title">MongoDB Atlas Collection Schemas</h2>
          <p className="seo-card-text">
            To provide persistent memory across browser sessions and devices, SARVA AI organizes chat data into three core MongoDB collections:
          </p>
          <ul className="seo-card-text" style={{ paddingLeft: "20px", marginTop: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <li><code>users</code>: User account credentials, account type (personal/organization), and creation timestamps.</li>
            <li><code>sessions</code>: Session ID string, user ID pointer, title string, and compound index on <code>{`{ user_id: 1, created_at: -1 }`}</code>.</li>
            <li><code>messages</code>: Trajectory of turn-by-turn user and assistant messages linked via <code>sessionId</code>.</li>
          </ul>
        </section>

        <section className="seo-card" style={{ textAlign: "center", marginTop: "36px" }}>
          <h3 className="seo-card-title">Explore Backend Architecture</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Learn more about how SARVA AI synchronizes backend state with FastAPI and React.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
            <Link to="/technology" className="seo-cta-btn" style={{ padding: "10px 22px" }}>
              View Tech Stack <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleMongodbMemory;
