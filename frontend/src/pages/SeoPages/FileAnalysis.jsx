import { Link } from "react-router-dom";
import { FiFileText, FiSearch, FiCheckCircle, FiShield, FiArrowRight, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "What document formats are supported for AI file analysis?",
    a: "SARVA AI supports multi-format document uploads including PDF files, DOCX documents, TXT files, JSON data, Markdown specs, and image formats for multi-modal analysis."
  },
  {
    q: "How does SARVA AI answer questions from long PDF documents?",
    a: "The backend extraction pipeline parses PDF text, strips noise, formats structured content chunks, and injects relevant context directly into the LLM prompt window."
  },
  {
    q: "Are my uploaded documents stored permanently?",
    a: "No. Uploaded files operate inside isolated user sandboxes and are retained only for active session context to guarantee data confidentiality."
  }
];

const FileAnalysis = () => {
  useSeo({
    title: "AI File Analysis – Intelligent Document Processing | SARVA AI",
    description: "Parse multi-page PDFs, resumes, financial reports, and technical specs with SARVA AI's intelligent document analysis and extraction tools.",
    canonicalPath: "/file-analysis",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
          { "@type": "ListItem", "position": 2, "name": "File Analysis", "item": "https://sarva-ai-one.vercel.app/file-analysis" }
        ]
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map(item => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a
          }
        }))
      }
    ]
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "File Analysis", path: "/file-analysis" }]} />
        <div className="seo-hero-badge">Intelligent Document Comprehension</div>
        <h1 className="seo-page-title">AI-Powered Document and File Analysis</h1>
        <p className="seo-page-subtitle">
          Transform unstructured documents into actionable insights. Upload PDF files, resumes, research papers, and technical specifications for instant parsing and context-grounded AI responses.
        </p>

        <div className="seo-grid-4-cards">
          <div className="seo-card">
            <div className="seo-card-icon"><FiFileText aria-hidden="true" /></div>
            <h2 className="seo-card-title">Multi-Format Document Upload</h2>
            <p className="seo-card-text">
              Supports PDF documents, DOCX files, TXT files, JSON schemas, Markdown documents, and image formats. Upload directly within the chat window before asking your query.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiSearch aria-hidden="true" /></div>
            <h2 className="seo-card-title">Contextual Text Extraction</h2>
            <p className="seo-card-text">
              The backend FastAPI pipeline processes document structures, strips irrelevances, formats content into structured prompt context, and feeds it into the LLM context window. Read more about <Link to="/blog/chat-with-pdf" style={{ color: "var(--accent)" }}>chatting with PDFs via FastAPI</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCheckCircle aria-hidden="true" /></div>
            <h2 className="seo-card-title">Resume & Report Screening</h2>
            <p className="seo-card-text">
              Ideal for HR and recruiter workflows: extract candidate skills, experience timelines, project accomplishments, and compare resumes against job descriptions in seconds.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiShield aria-hidden="true" /></div>
            <h2 className="seo-card-title">Private File Sandbox</h2>
            <p className="seo-card-text">
              Uploaded files are safely stored in isolated temporary user directories and cleared upon session lifecycle triggers to maintain absolute privacy. Learn more on our <Link to="/security" style={{ color: "var(--accent)" }}>security architecture page</Link>.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="seo-card" style={{ marginTop: "40px" }} aria-labelledby="file-faq-heading">
          <h2 id="file-faq-heading" className="seo-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FiHelpCircle style={{ color: "var(--accent)" }} aria-hidden="true" /> Frequently Asked Questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "16px" }}>
            {FAQS.map((faq, idx) => (
              <details key={idx} style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "12px 16px"
              }}>
                <summary style={{ fontWeight: "700", cursor: "pointer", color: "var(--text-primary)" }}>
                  {faq.q}
                </summary>
                <p style={{ marginTop: "8px", color: "var(--text-secondary)", lineHeight: "1.6", fontSize: "0.92rem" }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Topic Cluster Related Resources */}
        <section className="seo-card" style={{ marginTop: "30px" }}>
          <h2 className="seo-card-title">Related AI Document Analysis Guides</h2>
          <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
            <li>
              <Link to="/blog/chat-with-pdf" style={{ color: "var(--accent)", fontWeight: "600" }}>Chat With PDF Implementation Guide</Link> — Step-by-step tutorial on building document parsing AI pipelines.
            </li>
            <li>
              <Link to="/blog/ai-document-analysis" style={{ color: "var(--accent)", fontWeight: "600" }}>AI Document Analysis and Text Extraction</Link> — Techniques for grounded AI response generation.
            </li>
            <li>
              <Link to="/ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>SARVA AI Conversational Assistant Features</Link> — Multi-turn memory and low-latency response generation.
            </li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Analyze Your First Document</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Upload a PDF or text document and ask SARVA AI to summarize or extract key points.
          </p>
          <Link to="/chat" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Upload & Analyze Files <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default FileAnalysis;
