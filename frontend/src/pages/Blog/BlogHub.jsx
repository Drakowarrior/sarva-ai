import React from "react";
import { Link } from "react-router-dom";
import { FiCode, FiLayers, FiShield, FiFileText, FiCpu, FiArrowRight, FiClock, FiBookOpen } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

export const articlesData = [
  {
    slug: "react-fastapi-ai-chatbot",
    title: "How to Build an AI Chatbot with React and FastAPI",
    description: "A step-by-step engineering deep dive into building an ultra-fast full-stack conversational AI platform with React 19 and FastAPI.",
    category: "React + FastAPI",
    targetKeyword: "React FastAPI AI chatbot",
    date: "August 13, 2026",
    readTime: "8 min read",
    icon: FiCode,
    iconColor: "#38bdf8"
  },
  {
    slug: "fastapi-groq-chatbot",
    title: "How to Build an AI Chatbot with Groq and LLaMA",
    description: "Learn how to integrate Groq LPUs for 300+ tokens/sec LLM streaming with Llama 3.3 70B models.",
    category: "Groq & LLaMA",
    targetKeyword: "Groq AI chatbot",
    date: "August 12, 2026",
    readTime: "8 min read",
    icon: FiCpu,
    iconColor: "#a855f7"
  },
  {
    slug: "chat-with-pdf",
    title: "How to Chat With PDF Documents Using AI",
    description: "Parse multi-page PDF files, extract clean text streams, and inject document context into LLM context windows.",
    category: "PDF Processing",
    targetKeyword: "chat with PDF AI",
    date: "August 13, 2026",
    readTime: "7 min read",
    icon: FiFileText,
    iconColor: "#ec4899"
  },
  {
    slug: "ai-document-analysis",
    title: "How to Build an AI Document Analysis System",
    description: "Build automated document processing pipelines for PDF reports, DOCX files, and resume screening.",
    category: "Document AI",
    targetKeyword: "AI document analysis chatbot",
    date: "August 10, 2026",
    readTime: "6 min read",
    icon: FiFileText,
    iconColor: "#f59e0b"
  },
  {
    slug: "full-stack-ai-architecture",
    title: "React + FastAPI + MongoDB: Full-Stack AI Architecture",
    description: "Production guide for hosting React SPAs on Vercel Edge Network and FastAPI microservices on cloud infrastructure.",
    category: "Full-Stack System",
    targetKeyword: "full stack AI chatbot",
    date: "August 02, 2026",
    readTime: "9 min read",
    icon: FiLayers,
    iconColor: "#10b981"
  },
  {
    slug: "jwt-ai-chatbot",
    title: "How JWT Authentication Works in AI Chatbot Applications",
    description: "Enforcing security compliance, bcrypt password hashing, token validation, and multi-tenant user data isolation.",
    category: "Security & Auth",
    targetKeyword: "JWT AI chatbot",
    date: "August 05, 2026",
    readTime: "6 min read",
    icon: FiShield,
    iconColor: "#6366f1"
  },
  {
    slug: "chat-history-memory",
    title: "How to Build Conversational AI With Chat History and Memory",
    description: "Designing a high-performance MongoDB Atlas database schema for multi-turn chat threads and session state.",
    category: "State & Database",
    targetKeyword: "AI chatbot with chat history",
    date: "August 08, 2026",
    readTime: "7 min read",
    icon: FiLayers,
    iconColor: "#14b8a6"
  }
];

const BlogHub = () => {
  useSeo({
    title: "SARVA Technical Blog — Engineering Articles & Guides",
    description: "In-depth engineering articles on full-stack AI development with React 19, FastAPI, MongoDB Atlas, Groq LPUs, and cloud security.",
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }]} />
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
                className="seo-card hover-lift"
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
