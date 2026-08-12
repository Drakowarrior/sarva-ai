import { Link } from "react-router-dom";
import { FiArrowRight, FiFileText, FiShield, FiCode } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const ArticleDocumentAnalysis = () => {
  useSeo({
    title: "Building AI PDF & Document Analysis with FastAPI | SARVA AI",
    description: "Learn how to parse PDF reports, DOCX files, and text archives on the backend and feed prompt context into LLM context windows using Python and FastAPI.",
    canonicalPath: "/blog/ai-document-analysis",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "AI Document Analysis", "item": "https://sarva-ai-one.vercel.app/blog/ai-document-analysis" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "Building AI PDF & Document Analysis with FastAPI",
          "description": "Engineering guide on document text extraction and LLM prompt context injection.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "datePublished": "2026-08-10"
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "880px" }}>
        <div className="seo-hero-badge">📄 Document AI Architecture</div>
        <h1 className="seo-page-title" style={{ fontSize: "2.4rem" }}>
          Building AI PDF & Document Analysis with FastAPI
        </h1>
        
        <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "30px" }}>
          <span>By Karan Garg</span> • <span>August 10, 2026</span> • <span>6 min read</span>
        </div>

        <section className="seo-card" style={{ marginBottom: "28px" }}>
          <h2 className="seo-card-title">Document Processing Pipeline</h2>
          <p className="seo-card-text">
            Document AI enables users to upload PDF reports, resumes, and technical documentation to ask grounded queries. In SARVA AI, the extraction pipeline processes uploaded binary files in memory, extracts structured text streams using <code>PyPDF</code>, truncates formatting bloat, and injects context directly into the prompt trajectory.
          </p>
        </section>

        <section className="seo-card" style={{ marginBottom: "28px" }}>
          <h2 className="seo-card-title">Python Text Extraction Code Example</h2>
          <pre style={{
            background: "#0f172a",
            padding: "16px",
            borderRadius: "10px",
            color: "#f8fafc",
            overflowX: "auto",
            fontSize: "0.85rem",
            margin: "16px 0",
            border: "1px solid var(--border)"
          }}>
            {`from pypdf import PdfReader
import io

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    reader = PdfReader(io.BytesIO(pdf_bytes))
    extracted_pages = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            extracted_pages.append(text)
    return "\\n".join(extracted_pages)`}
          </pre>
        </section>

        <section className="seo-card" style={{ textAlign: "center", marginTop: "36px" }}>
          <h3 className="seo-card-title">Explore SARVA AI Document Comprehension</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            See how our live platform processes multi-format files inside the chat stream.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
            <Link to="/file-analysis" className="seo-cta-btn" style={{ padding: "10px 22px" }}>
              Explore File Analysis <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleDocumentAnalysis;
