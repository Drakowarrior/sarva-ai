import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import TableOfContents from "../../components/Common/TableOfContents";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const FAQS = [
  {
    q: "What is the difference between AI document analysis and simply asking ChatGPT about a document?",
    a: "When you paste text into ChatGPT, you are limited by what fits in a single prompt. AI document analysis pipelines automate file upload, text extraction, chunking, and context injection — handling documents of any size programmatically. They also enable batch processing of multiple documents, structured output generation, and integration into broader enterprise workflows."
  },
  {
    q: "How do you extract text from DOCX files in Python?",
    a: "Use the python-docx library (pip install python-docx). Call docx.Document(filepath) to open the file, then iterate over doc.paragraphs to extract text blocks. For tables, iterate over doc.tables. Each paragraph and cell has a .text property containing the plain text content."
  },
  {
    q: "How accurate is AI document text extraction?",
    a: "For digitally created PDFs and DOCX files, text extraction is highly accurate — approaching 100% character fidelity. The main failure cases are scanned PDFs (images requiring OCR), PDFs with complex multi-column layouts, and files with embedded fonts that use non-standard character encoding. For scanned documents, pytesseract provides OCR fallback."
  },
  {
    q: "Can AI summarize financial reports or legal contracts reliably?",
    a: "Modern LLMs like Llama 3.3 70B can produce accurate summaries of financial reports, contracts, and technical documentation when given the document content as context. The key is grounding the response: instruct the model to answer based only on the provided document and to cite page numbers or sections when possible. This significantly reduces hallucination risk."
  },
  {
    q: "What is the maximum file size an AI document pipeline can handle?",
    a: "There is no hard technical limit on file size for extraction — you can process arbitrarily large PDFs. The practical constraint is LLM context window size. After extraction, you need to either truncate the text to fit within the model's context limit, or use a RAG (Retrieval Augmented Generation) approach that chunks the document and retrieves only the most relevant sections per query."
  }
];

const ArticleDocumentAnalysis = () => {
  useSeo({
    title: "How to Build an AI Document Analysis Pipeline | SARVA AI",
    description: "Build an AI document analysis pipeline with FastAPI and Python. Learn multi-format text extraction from PDFs, DOCX, and code files, MIME validation, structured output generation, and LLM-powered summarization.",
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
          "description": "Technical guide explaining multi-format document extraction, MIME validation, and LLM-powered summarization pipelines.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-10",
          "dateModified": "2026-09-05"
        },
        {
          "@type": "FAQPage",
          "mainEntity": FAQS.map(item => ({
            "@type": "Question",
            "name": item.q,
            "acceptedAnswer": { "@type": "Answer", "text": item.a }
          }))
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
          <span><FiClock /> 11 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Modern enterprise workflows demand document comprehension systems capable of extracting structured intelligence from unstructured PDFs, DOCX files, code repositories, and financial spreadsheets. This guide walks through the complete document analysis pipeline used in <Link to="/file-analysis" style={{ color: "var(--accent)" }}>SARVA AI's file analysis engine</Link> — from secure upload handling to LLM-powered structured output generation.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Use Cases for AI Document Analysis
          </h2>
          <p>
            Understanding when an AI document pipeline adds genuine value helps scope the right solution:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>Resume screening:</strong> Extract candidate skills, experience years, projects, and education — then compare against a job description to rank applicants.</li>
            <li><strong>Legal contract review:</strong> Identify clauses, obligations, deadlines, and penalty conditions across multi-hundred-page contracts.</li>
            <li><strong>Financial report analysis:</strong> Extract specific figures, year-over-year comparisons, and risk disclosures without reading the full document.</li>
            <li><strong>Technical documentation Q&A:</strong> Let users ask natural-language questions about internal engineering specs or API documentation.</li>
            <li><strong>Research paper summarization:</strong> Produce structured summaries with methodology, findings, limitations, and cited sources.</li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Document Upload & MIME Validation
          </h2>
          <p>
            The backend validates file MIME types, sanitizes filenames, and routes files to specific parser modules depending on file extension. Security controls are applied before any parsing:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`async def extract_text_from_file(file_path: str) -> str:
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return await extract_pdf(file_path)
    elif ext in [".docx", ".doc"]:
        return await extract_docx(file_path)
    elif ext in [".txt", ".py", ".js", ".json", ".md"]:
        return await read_plain_text(file_path)
    return ""`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. PDF Text Extraction
          </h2>
          <p>
            For PDF files, use <code>pypdf</code> to extract text page by page, preserving page boundaries for downstream citation:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`import pypdf

async def extract_pdf(file_path: str) -> str:
    reader = pypdf.PdfReader(file_path)
    pages = []
    for i, page in enumerate(reader.pages):
        text = page.extract_text()
        if text and text.strip():
            pages.append(f"[Page {i + 1}]\\n{text.strip()}")
    return "\\n\\n".join(pages)`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. DOCX and Plain Text Extraction
          </h2>
          <p>
            For Word documents, use <code>python-docx</code>. For code files and plain text, simply read the file contents with appropriate encoding:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`import docx as python_docx

async def extract_docx(file_path: str) -> str:
    doc = python_docx.Document(file_path)
    paragraphs = [para.text for para in doc.paragraphs if para.text.strip()]
    tables = []
    for table in doc.tables:
        for row in table.rows:
            tables.append(" | ".join(cell.text for cell in row.cells))
    return "\\n".join(paragraphs + tables)

async def read_plain_text(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()`}
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
              Upload any PDF report, resume, or code file directly to SARVA AI and receive detailed AI-powered summaries, extractions, and Q&A answers instantly.
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

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            5. Structured Output Generation with LLMs
          </h2>
          <p>
            By combining extracted file text with clear prompt directives, the LLM produces Markdown tables, bulleted executive summaries, and action item lists automatically. The key is being explicit about the desired output format in the system prompt:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`SUMMARY_PROMPT = """You are a professional document analyst.
Given the following document, produce a structured summary with these sections:

## Executive Summary
(2-3 sentence overview)

## Key Points
(Bullet list of the most important facts or findings)

## Action Items
(Numbered list of recommended next steps, if applicable)

Base your response strictly on the document provided. 
Do not add information not present in the document.

Document:
{document_text}
"""`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            6. Frequently Asked Questions
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

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
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
            <Link to="/file-analysis" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              AI File Analysis Features →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleDocumentAnalysis;
