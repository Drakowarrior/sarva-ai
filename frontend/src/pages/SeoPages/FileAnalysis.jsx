import { Link } from "react-router-dom";
import { FiFileText, FiSearch, FiCheckCircle, FiShield, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FileAnalysis = () => {
  useSeo({
    title: "AI Document Analysis — Chat With PDFs, Resumes & Reports",
    description: "Parse multi-page PDF files, extract structured insights, and ask context-grounded questions with SARVA AI.",
    canonicalPath: "/file-analysis",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "File Analysis", "item": "https://sarva-ai-one.vercel.app/file-analysis" }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "File Analysis", path: "/file-analysis" }]} />
        <div className="seo-hero-badge">Intelligent Document Comprehension</div>
        <h1 className="seo-page-title">File Analysis & AI Assistance</h1>
        <p className="seo-page-subtitle">
          Transform unstructured documents into actionable insights. Upload PDF files, resumes, research papers, and technical specifications for instant parsing and context-grounded AI responses.
        </p>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiFileText /></div>
            <h3 className="seo-card-title">Multi-Format Document Upload</h3>
            <p className="seo-card-text">
              Supports PDF documents, DOCX files, TXT files, JSON schemas, Markdown documents, and image formats. Upload directly within the chat window before asking your query.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiSearch /></div>
            <h3 className="seo-card-title">Contextual Text Extraction</h3>
            <p className="seo-card-text">
              The backend FastAPI pipeline processes document structures, strips irrelevances, formats content into structured prompt context, and feeds it into the LLM context window.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCheckCircle /></div>
            <h3 className="seo-card-title">Resume & Report Screening</h3>
            <p className="seo-card-text">
              Ideal for HR and recruiter workflows: extract candidate candidate skills, experience timelines, project accomplishments, and compare resumes against job descriptions in seconds.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiShield /></div>
            <h3 className="seo-card-title">Private File Sandbox</h3>
            <p className="seo-card-text">
              Uploaded files are safely stored in isolated temporary user directories and cleared upon session lifecycle triggers to maintain absolute privacy.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h3 className="seo-card-title">Analyze Your First Document</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Upload a PDF or text document and ask SARVA AI to summarize or extract key points.
          </p>
          <Link to="/chat" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Upload & Analyze Files <FiArrowRight />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default FileAnalysis;
