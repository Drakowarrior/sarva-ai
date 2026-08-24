import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCode, FiLayers, FiCheckCircle, FiBookOpen, FiClock, FiCpu } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const ArticleReactFastApi = () => {
  useSeo({
    title: "How to Build an AI Chatbot with React 19 & FastAPI | SARVA AI",
    description: "Learn how to construct a full-stack conversational AI application using React 19, FastAPI, Server-Sent Events (SSE), and asynchronous model pipelines.",
    canonicalPath: "/blog/react-fastapi-ai-chatbot",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "React + FastAPI AI Chatbot", "item": "https://sarva-ai-one.vercel.app/blog/react-fastapi-ai-chatbot" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "How to Build an AI Chatbot with React and FastAPI",
          "description": "Step-by-step technical guide to integrating React single-page frontend with FastAPI backend.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-13"
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "React + FastAPI AI Chatbot", path: "/blog/react-fastapi-ai-chatbot" }]} />

        {/* Title & Metadata */}
        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Build an AI Chatbot with React and FastAPI
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 13, 2026</span>
          <span>•</span>
          <span><FiClock /> 8 min read</span>
        </div>

        {/* Article Content */}
        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Building a responsive conversational AI application requires orchestrating two distinct execution environments: a dynamic single-page web interface in <strong>React</strong> and a high-performance, asynchronous REST backend built with <strong>FastAPI</strong>.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. System Architecture Overview
          </h2>
          <p>
            In modern full-stack AI design, the React client handles state management, multi-turn UI streaming, and markdown rendering. The FastAPI server validates incoming payloads, enforces JWT session security, and dispatches prompts to high-throughput LLM engines like Groq LPUs.
          </p>

          {/* Architecture Box */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", margin: "24px 0" }}>
            <h4 style={{ margin: 0, color: "#38bdf8", fontSize: "1rem" }}>Full-Stack Pipeline Flow</h4>
            <pre style={{ background: "#090d16", padding: "12px", borderRadius: "8px", marginTop: "10px", fontSize: "0.85rem", overflowX: "auto", color: "#f8fafc" }}>
{`React SPA (Vite + Context) 
  ── [POST /api/chat] ──► FastAPI Router (Python Async)
                            ├── JWT Authentication Check
                            ├── Context Extraction & Document Parsing
                            └── Groq LPU Inference (Llama 3.3 70B)`}
            </pre>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. FastAPI Backend Setup
          </h2>
          <p>
            FastAPI provides native support for Python `async/await` coroutines, allowing the server to maintain open streaming connections without thread starvation. Here is how we define the primary endpoint:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/chat")

class ChatRequest(BaseModel):
    session_id: str
    message: str
    model: str = "qwen-3.6-27b"

@router.post("")
async def handle_chat_message(payload: ChatRequest):
    # Process message and call AI engine asynchronously
    response_text = await generate_ai_response(payload.message, payload.model)
    return {"reply": response_text}`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. React State & Chat Stream Hook
          </h2>
          <p>
            On the client side, React manages conversation state using standard hooks and optimistic UI updates so the user receives instant visual feedback.
          </p>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(139, 92, 246, 0.15))", 
            border: "1px solid rgba(56, 189, 248, 0.4)", 
            borderRadius: "16px", 
            padding: "24px", 
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Experience This Architecture in Action
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              I implemented this exact full-stack architecture in <strong>SARVA AI</strong>, featuring instant streaming, PDF document context, and multi-turn session persistence.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_react_fastapi", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. Key Engineering Tradeoffs
          </h2>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>WebSocket vs HTTP Streaming</strong>: WebSockets are ideal for bidirectional updates, while HTTP SSE is simpler to deploy behind standard reverse proxies.</li>
            <li><strong>Session Storage</strong>: Storing thread state in MongoDB Atlas ensures persistence across page reloads.</li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            Related Engineering Articles & Guides
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← Groq LPU LLaMA 3.3 Integration
            </Link>
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
            </Link>
            <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              JWT Security & Auth →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleReactFastApi;
