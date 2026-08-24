import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiCode, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const ArticleArchitectureDeployment = () => {
  useSeo({
    title: "React + FastAPI + MongoDB: Production Full-Stack AI Guide | SARVA AI",
    description: "Production deployment guide for hosting React SPAs on Vercel Edge and FastAPI microservices on cloud APIs.",
    canonicalPath: "/blog/full-stack-ai-architecture",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "Full-Stack AI Architecture", "item": "https://sarva-ai-one.vercel.app/blog/full-stack-ai-architecture" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "React + FastAPI + MongoDB: Full-Stack AI Architecture",
          "description": "Comprehensive engineering breakdown of deploying full-stack AI applications.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-02"
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "Full-Stack AI Architecture", path: "/blog/full-stack-ai-architecture" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          React + FastAPI + MongoDB: Full-Stack AI Architecture
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 02, 2026</span>
          <span>•</span>
          <span><FiClock /> 9 min read</span>
        </div>

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Deploying a production full-stack AI platform demands decoupled service separation: edge-rendered React frontend for low latency, an asynchronous FastAPI application server for business logic and document parsing, and MongoDB Atlas for document state isolation.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Microservice Responsibilities
          </h2>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>Frontend (React 19 + Vite)</strong>: Single-Page Application hosted on Vercel Global CDN with SPA route rewrites.</li>
            <li><strong>Backend (FastAPI + Async Python)</strong>: Hosted on Render cloud with CORS headers, health checks, and rate limiting.</li>
            <li><strong>Database (MongoDB Atlas)</strong>: Distributed NoSQL collection storing user profiles, chat threads, and message context.</li>
            <li><strong>LLM Inference (Groq LPUs)</strong>: Streaming Llama 3.3 models via high-bandwidth API tokens.</li>
          </ul>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(56, 189, 248, 0.15))", 
            border: "1px solid rgba(245, 158, 11, 0.4)", 
            borderRadius: "16px", 
            padding: "24px", 
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Try This Full-Stack Platform Now
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Explore SARVA AI live in your browser to experience fast page loads, instant auth, and fluid AI responses.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_full_stack", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Cross-Origin Security (CORS) Configuration
          </h2>
          <p>
            Ensuring secure cross-origin communication between Vercel deployment domains and Render REST APIs requires strict `CORSMiddleware` configuration.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            Related Engineering Articles & Guides
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← React + FastAPI AI Chatbot
            </Link>
            <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              JWT Security & Auth →
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

export default ArticleArchitectureDeployment;
