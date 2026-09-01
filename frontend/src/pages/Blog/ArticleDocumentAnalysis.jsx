import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import TableOfContents from "../../components/Common/TableOfContents";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const ArticleDocumentAnalysis = () => {
  useSeo({
    title: "How to Build an AI Document Analysis Pipeline | SARVA AI",
    description: "Building automated document processing pipelines for PDF reports, DOCX files, and resume screening.",
    canonicalPath: "/blog/ai-document-analysis",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "AI Document Analysis System", "item": "https://sarva-ai-one.vercel.app/blog/ai-document-analysis" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "How to Build an AI Document Analysis System",
          "description": "Technical guide explaining multi-format document extraction and summarization.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-10"
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "860px", margin: "0 auto", padding: "40px 24px" }}>
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "AI Document Analysis System", path: "/blog/ai-document-analysis" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Build an AI Document Analysis System
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 10, 2026</span>
          <span>•</span>
          <span><FiClock /> 6 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Modern enterprise workflows demand document comprehension systems capable of extracting structured intelligence from unstructured PDFs, DOCX files, code repositories, and financial spreadsheets.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Document Upload & Extraction Engine
          </h2>
          <p>
            The backend validates file MIME types, sanitizes filenames, and routes files to specific parser modules depending on file extension:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`async def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return await extract_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return await extract_docx(file_path)
    elif ext in [".txt", ".py", ".js", ".json"]:
        return await read_plain_text(file_path)
    return ""` }
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{ 
            background: "linear-gradient(135deg, rgba(236, 72, 153, 0.15), rgba(56, 189, 248, 0.15))", 
            border: "1px solid rgba(236, 72, 153, 0.4)", 
            borderRadius: "16px", 
            padding: "24px", 
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Try Document Analysis in SARVA AI
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Upload any PDF report or text archive directly to SARVA AI and receive detailed summaries instantly.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_doc_analysis", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Structured Output Generation
          </h2>
          <p>
            By combining extracted file text with clear prompt directives, the LLM produces Markdown tables, bulleted executive summaries, and action item lists automatically.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "32px", marginBottom: "12px", color: "var(--text-primary)" }}>
            Related Engineering Articles & Guides
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/blog/chat-with-pdf" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← Chat With PDF Documents
            </Link>
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
            </Link>
            <Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Groq LPU LLaMA 3.3 Integration →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleDocumentAnalysis;
