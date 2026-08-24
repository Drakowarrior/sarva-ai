import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiFileText, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const ArticleChatWithPdf = () => {
  useSeo({
    title: "How to Chat With PDF Documents Using AI & FastAPI | SARVA AI",
    description: "Multi-page PDF text extraction and context window injection techniques for AI assistants.",
    canonicalPath: "/blog/chat-with-pdf",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "Chat with PDF AI", "item": "https://sarva-ai-one.vercel.app/blog/chat-with-pdf" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "How to Chat With PDF Documents Using AI",
          "description": "Technical guide explaining PDF parsing, context window injection, and document Q&A architectures.",
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "Chat with PDF AI", path: "/blog/chat-with-pdf" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Chat With PDF Documents Using AI
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 13, 2026</span>
          <span>•</span>
          <span><FiClock /> 7 min read</span>
        </div>

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Enabling users to upload PDF documents and ask questions about their content requires an automated processing pipeline capable of extracting clean text from multi-page PDF binaries, handling layout artifacts, and injecting extracted text into LLM system prompts.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Extracting Text from PDF Streams
          </h2>
          <p>
            When a PDF file is uploaded via HTTP POST to FastAPI, the server saves the file to a secure directory and uses libraries like `pypdf` or `pdfplumber` to extract text blocks line by line:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`import pypdf

async def extract_pdf_text(file_path: str) -> str:
    reader = pypdf.PdfReader(file_path)
    extracted_pages = []
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            extracted_pages.append(f"[Page {idx+1}]\n{text.strip()}")
    return "\n\n".join(extracted_pages)`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Context Injection & Prompt Construction
          </h2>
          <p>
            The extracted text is formatted into system prompt context so the AI model answers questions grounded strictly in the document content:
          </p>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", margin: "20px 0" }}>
            <code style={{ color: "#38bdf8", fontSize: "0.88rem" }}>
              "You are an AI Document Assistant. Use the following PDF content to answer user questions:\n\n[Content of attached file: quarterly_report.pdf]\n...\n[End of file content]\n\nUser Question: {`{user_query}`}"
            </code>
          </div>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(14, 165, 233, 0.15))", 
            border: "1px solid rgba(236, 72, 153, 0.4)", 
            borderRadius: "16px", 
            padding: "24px", 
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Want to try AI-powered document conversations yourself?
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              SARVA AI includes built-in drag-and-drop PDF parsing, resume screening, and automatic document context injection.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_pdf_chat", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. Context Window Boundaries & Safety
          </h2>
          <p>
            For ultra-large documents, truncating or selecting top matching chunks prevents exceeding model token bounds while maintaining response accuracy.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            Related Engineering Articles & Guides
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/blog/ai-document-analysis" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← AI Document Analysis System
            </Link>
            <Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Groq LPU LLaMA 3.3 Integration →
            </Link>
            <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              React + FastAPI AI Chatbot →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleChatWithPdf;
