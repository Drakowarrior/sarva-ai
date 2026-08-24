import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiCpu, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const ArticleFastApiGroq = () => {
  useSeo({
    title: "How to Build an AI Chatbot with Groq and LLaMA | SARVA AI",
    description: "Step-by-step technical guide to constructing ultra-fast conversational AI platforms using Groq LPU inference and Llama 3.3 70B models.",
    canonicalPath: "/blog/fastapi-groq-chatbot",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "How to Build an AI Chatbot with Groq and LLaMA",
      "description": "Technical guide explaining Groq LPU streaming integration with FastAPI backend.",
      "author": { "@type": "Person", "name": "Karan Garg" },
      "publisher": { "@type": "Organization", "name": "SARVA AI" },
      "datePublished": "2026-08-12"
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/" style={{ color: "var(--accent)", textDecoration: "none" }}>Home</Link> / 
          <Link to="/blog" style={{ color: "var(--accent)", textDecoration: "none" }}>Blog</Link> / 
          <span>Groq + LLaMA AI Chatbot</span>
        </div>

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Build an AI Chatbot with Groq and LLaMA
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 12, 2026</span>
          <span>•</span>
          <span><FiClock /> 8 min read</span>
        </div>

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Low-latency token generation is the defining requirement for modern conversational AI. By leveraging <strong>Groq LPUs (Language Processing Units)</strong> alongside open-weights models like <strong>Llama 3.3 70B</strong>, developers can stream responses at speeds exceeding 300 tokens per second.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Why Groq LPU Hardware Matters
          </h2>
          <p>
            Traditional GPU clusters suffer from memory bandwidth bottlenecks when running autoregressive LLM decoding. Groq's Tensor Streaming Architecture uses static execution schedules to deliver deterministic, high-throughput token streams.
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`from groq import AsyncGroq
import os

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_response(prompt_history: list):
    completion = await client.chat.completions.create(
        model="qwen-3.6-27b",
        messages=prompt_history,
        temperature=0.7,
        max_tokens=2048
    )
    return completion.choices[0].message.content`}
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.15))", 
            border: "1px solid rgba(56, 189, 248, 0.4)", 
            borderRadius: "16px", 
            padding: "24px", 
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Test Groq Token Streaming Live
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              I implemented Groq acceleration in <strong>SARVA AI</strong>. Try asking a question to experience 300+ tok/sec inference!
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_groq_llama", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Model Selection Tuning
          </h2>
          <p>
            Depending on query complexity, SARVA AI maps requests to specialized endpoints:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "12px 0" }}>
            <li><strong>Llama 3.1 8B Instant</strong>: Optimized for quick conversational replies.</li>
            <li><strong>Qwen 3.6 27B / GPT OSS 120B</strong>: Tuning for deep code reasoning and document analysis.</li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            Related Engineering Articles & Guides
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← React + FastAPI AI Chatbot
            </Link>
            <Link to="/blog/chat-with-pdf" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Chat With PDF Documents →
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

export default ArticleFastApiGroq;
