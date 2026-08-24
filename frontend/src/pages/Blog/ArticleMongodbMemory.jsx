import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiLayers, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const ArticleMongodbMemory = () => {
  useSeo({
    title: "How to Build Conversational AI With Chat History and Memory | SARVA AI",
    description: "Designing a high-performance MongoDB Atlas database schema for multi-turn chat threads, user profiles, and session trajectories.",
    canonicalPath: "/blog/chat-history-memory",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "How to Build Conversational AI With Chat History and Memory",
      "description": "Technical guide detailing MongoDB Atlas schema design for AI session context.",
      "author": { "@type": "Person", "name": "Karan Garg" },
      "publisher": { "@type": "Organization", "name": "SARVA AI" },
      "datePublished": "2026-08-08"
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/" style={{ color: "var(--accent)", textDecoration: "none" }}>Home</Link> / 
          <Link to="/blog" style={{ color: "var(--accent)", textDecoration: "none" }}>Blog</Link> / 
          <span>Chat History & Memory</span>
        </div>

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Build Conversational AI With Chat History and Memory
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 08, 2026</span>
          <span>•</span>
          <span><FiClock /> 7 min read</span>
        </div>

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Contextual memory retention allows large language models to maintain coherent multi-turn conversations across hours or days. Storing session trajectories efficiently requires a document schema tailored for fast query indexing.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. MongoDB Document Collections Schema
          </h2>
          <p>
            We separate metadata objects (`sessions` collection) from individual dialogue turns (`messages` collection) to enable lightning-fast thread sidebar loading:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#10b981" }}>
{`// Message Document Schema
{
  "_id": ObjectId("..."),
  "session_id": "sess_89f2a",
  "user_id": "usr_4410",
  "role": "user", // "user" or "assistant"
  "content": "Explain async MongoDB queries in Motor.",
  "files": [
    { "filename": "spec.pdf", "file_type": "pdf" }
  ],
  "created_at": ISODate("2026-08-08T10:15:30Z")
}`}
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))", 
            border: "1px solid rgba(16, 185, 129, 0.4)", 
            borderRadius: "16px", 
            padding: "24px", 
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Experience Persistent AI Memory in SARVA AI
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              SARVA AI saves your conversation threads automatically so you can resume discussions anytime.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_mongodb_memory", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Index Optimization
          </h2>
          <p>
            Compound indexes on `(user_id, updated_at)` and `(session_id, created_at)` ensure sub-10ms response times even as document collections grow into millions of records.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            Related Engineering Articles & Guides
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← JWT Security & Auth
            </Link>
            <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              React + FastAPI AI Chatbot →
            </Link>
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleMongodbMemory;
