import { Link } from "react-router-dom";
import { FiClock, FiCalendar, FiRefreshCw } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import TableOfContents from "../../components/Common/TableOfContents";
import useSeo from "../../hooks/useSeo";
import { trackCtaClick } from "../../utils/analytics";

const FAQS = [
  {
    q: "What is chat with PDF?",
    a: "Chat with PDF is a technique that lets you upload a PDF document and ask an AI questions about its contents. Instead of reading the entire file yourself, you type natural language questions and the AI responds with answers grounded in the text of your specific document."
  },
  {
    q: "What Python library is best for extracting text from PDFs?",
    a: "pypdf and pdfplumber are the most popular choices. pypdf is lightweight and fast for most documents. pdfplumber gives better results for PDFs with complex layouts, tables, or columns. For scanned PDFs, you will also need pytesseract (OCR) since image-only PDFs have no embedded text."
  },
  {
    q: "How do you handle very large PDF documents that exceed the LLM context window?",
    a: "The two main strategies are truncation and chunking with retrieval. Truncation simply cuts the document at a token limit and injects what fits. Chunking splits the document into overlapping segments, embeds them, and uses semantic similarity search to retrieve only the most relevant chunks for each query. For a production RAG pipeline, chunking plus retrieval is significantly more accurate."
  },
  {
    q: "Can SARVA AI read scanned PDFs?",
    a: "Scanned PDFs contain images of text rather than machine-readable characters. SARVA AI currently extracts embedded digital text using pypdf. OCR support for fully scanned documents is on the product roadmap."
  },
  {
    q: "How are uploaded PDF files kept private?",
    a: "Uploaded files are stored in isolated user-specific directories on the FastAPI server. They are associated with a specific user session via JWT bearer authentication and are cleared on session expiry. No file content is shared across user accounts."
  },
  {
    q: "What is the difference between PDF chat and standard AI chat?",
    a: "Standard AI chat relies on the model's pre-trained knowledge. PDF chat grounds the model's responses in the specific content of your uploaded document. This means the AI can answer questions about proprietary reports, contracts, or manuals that it was never trained on."
  }
];

const ArticleChatWithPdf = () => {
  useSeo({
    title: "Chat With PDF Using AI: FastAPI + Python Implementation Guide | SARVA AI",
    description: "Learn how to build a PDF chatbot with FastAPI and Python. Covers pypdf text extraction, context injection, chunking strategies, security, and limitations.",
    canonicalPath: "/blog/chat-with-pdf",
    image: "/logo.jpg",
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
          "headline": "Chat With PDF Using AI: FastAPI + Python Implementation Guide",
          "description": "Technical guide explaining PDF parsing, context window injection, chunking strategies, limitations, and document Q&A architectures using FastAPI and Python.",
          "image": "https://sarva-ai-one.vercel.app/logo.jpg",
          "author": {
            "@type": "Person",
            "name": "Karan Garg",
            "url": "https://github.com/Drakowarrior"
          },
          "publisher": {
            "@type": "Organization",
            "name": "SARVA AI",
            "url": "https://sarva-ai-one.vercel.app"
          },
          "datePublished": "2026-08-13",
          "dateModified": "2026-09-12",
          "mainEntityOfPage": "https://sarva-ai-one.vercel.app/blog/chat-with-pdf"
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "Chat with PDF AI", path: "/blog/chat-with-pdf" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          Chat With PDF Using AI: FastAPI + Python Implementation Guide
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)", flexWrap: "wrap" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FiCalendar aria-hidden="true" /> August 13, 2026
          </span>
          <span>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FiRefreshCw aria-hidden="true" /> Updated September 12, 2026
          </span>
          <span>•</span>
          <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <FiClock aria-hidden="true" /> 14 min read
          </span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>

          {/* GEO-friendly definition — first paragraph answers "what is chat with PDF" immediately */}
          <p>
            <strong>Chat with PDF</strong> is a technique that lets users upload a PDF document and ask questions about its contents in natural language. Instead of reading a 50-page report manually, you ask the AI "What are the key findings?" and it responds with answers grounded specifically in your file — not its pre-training knowledge.
          </p>
          <p>
            Building this requires an automated pipeline that extracts clean text from PDF binaries, injects that text into an LLM system prompt, and streams back grounded responses. This guide walks through the complete implementation used in <strong>SARVA AI</strong> — from FastAPI file upload handling to accurate document-grounded responses and production security controls.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Why Build a PDF Chatbot?
          </h2>
          <p>
            Standard AI chat models are limited to their pre-training data. A PDF chatbot changes that by grounding the model's responses in <em>your specific document</em>. This opens up a huge range of practical use cases:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>Legal contracts:</strong> Ask "What are the termination clauses?" without reading 80 pages.</li>
            <li><strong>Research papers:</strong> Summarize methodology, extract results, compare with other studies.</li>
            <li><strong>Financial reports:</strong> Pull specific figures, compare quarters, identify risks.</li>
            <li><strong>Technical documentation:</strong> Ask implementation questions about proprietary APIs.</li>
            <li><strong>HR and recruitment:</strong> Screen resumes against job descriptions at scale.</li>
          </ul>
          <p>
            SARVA AI's <Link to="/file-analysis" style={{ color: "var(--accent)" }}>AI file analysis engine</Link> supports PDF, DOCX, TXT, JSON, and image formats — all handled through the same backend pipeline described below. For the broader document processing architecture, see the guide on <Link to="/blog/ai-document-analysis" style={{ color: "var(--accent)" }}>building an AI document analysis system</Link>.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Extracting Text from PDF Streams
          </h2>
          <p>
            When a PDF file is uploaded via HTTP POST to FastAPI, the server saves the file to a secure directory and uses <code>pypdf</code> to extract text blocks page by page. The key is preserving page boundaries so you can tell the model exactly which page content came from:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`import pypdf

async def extract_pdf_text(file_path: str) -> str:
    reader = pypdf.PdfReader(file_path)
    extracted_pages = []
    for idx, page in enumerate(reader.pages):
        text = page.extract_text()
        if text:
            extracted_pages.append(f"[Page {idx+1}]\\n{text.strip()}")
    return "\\n\\n".join(extracted_pages)`}
          </pre>

          <p style={{ marginTop: "16px" }}>
            For PDFs with complex table layouts or multi-column designs, <code>pdfplumber</code> gives better extraction quality because it preserves positional information. Scanned PDFs (image-only) require an additional OCR step using <code>pytesseract</code> + <code>pdf2image</code>.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. Context Injection &amp; Prompt Construction
          </h2>
          <p>
            The extracted text is formatted as a system message so the AI model answers questions grounded strictly in the document content. The prompt structure matters — you want the model to acknowledge the document boundary and refuse to guess beyond it:
          </p>

          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", margin: "20px 0" }}>
            <code style={{ color: "#38bdf8", fontSize: "0.88rem", whiteSpace: "pre-wrap", display: "block" }}>
{`system_prompt = f"""You are an AI Document Assistant.
Use ONLY the following document content to answer user questions.
If the answer is not contained in the document, say so explicitly.

[Document: {filename}]
{extracted_text}
[End of document]
"""

messages = [
    {"role": "system", "content": system_prompt},
    *conversation_history,
    {"role": "user", "content": user_query}
]`}
            </code>
          </div>

          <p>
            The explicit instruction "use ONLY the document content" reduces hallucination significantly. Without it, models often supplement document answers with their pre-training knowledge in ways that are hard to detect. For Groq LPU hardware acceleration used in SARVA AI — which handles this streaming pipeline at 300+ tokens/sec — see the <Link to="/technology" style={{ color: "var(--accent)" }}>full technology architecture overview</Link>.
          </p>

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
              SARVA AI includes built-in drag-and-drop PDF parsing, resume screening, and automatic document context injection — all running on Groq LPU hardware for instant responses.
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

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. Handling Context Window Limits &amp; Chunking
          </h2>
          <p>
            Most LLMs have a context window of 8,000–128,000 tokens. A single 100-page PDF can easily exceed 50,000 tokens. You have two practical strategies:
          </p>

          <h3 style={{ fontSize: "1.25rem", marginTop: "24px", marginBottom: "8px", color: "var(--text-primary)" }}>
            Strategy A — Truncation (Simple)
          </h3>
          <p>
            Extract all text, then truncate at a safe token limit before injecting into the prompt. This is simple to implement but sacrifices the later pages of the document:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#ec4899" }}>
{`MAX_CHARS = 12000  # ~3000 tokens for most models

def truncate_document(text: str) -> str:
    if len(text) > MAX_CHARS:
        return text[:MAX_CHARS] + "\\n\\n[Document truncated — content continues beyond this point]"
    return text`}
          </pre>

          <h3 style={{ fontSize: "1.25rem", marginTop: "24px", marginBottom: "8px", color: "var(--text-primary)" }}>
            Strategy B — Semantic Chunking with Retrieval (RAG)
          </h3>
          <p>
            Split the document into overlapping chunks (~500 tokens each), embed each chunk using a text embedding model, store embeddings in a vector database, and at query time retrieve only the top-k most relevant chunks. This scales to thousands of pages but requires embedding infrastructure. See our related article on <Link to="/blog/ai-document-analysis" style={{ color: "var(--accent)" }}>building an AI document analysis pipeline</Link> for the full chunking implementation.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            5. File Upload Flow with FastAPI
          </h2>
          <p>
            On the backend, FastAPI's <code>UploadFile</code> handles multipart form submissions. The key steps are: validate file type, enforce size limits, save to a user-specific directory, extract text, then return a session-scoped file reference:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
import os, uuid, shutil

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt", ".py", ".js", ".json"}
MAX_FILE_SIZE_MB = 10

router = APIRouter(prefix="/api/files")

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, "File type not supported")

    content = await file.read()
    if len(content) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(413, "File exceeds 10MB limit")

    user_dir = f"./uploads/{user_id}"
    os.makedirs(user_dir, exist_ok=True)
    file_id = str(uuid.uuid4())
    save_path = f"{user_dir}/{file_id}{ext}"

    with open(save_path, "wb") as f:
        f.write(content)

    extracted_text = await extract_text_from_file(save_path)
    return {"file_id": file_id, "filename": file.filename, "text_length": len(extracted_text)}`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            6. Security &amp; Privacy Considerations
          </h2>
          <p>
            PDF chatbots handle sensitive data. These are the security controls implemented in SARVA AI:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>File extension whitelist:</strong> Only explicitly allowed file types are accepted. MIME type spoofing is mitigated by checking both the extension and content header.</li>
            <li><strong>User directory isolation:</strong> Files are saved under <code>./uploads/{"{user_id}/"}</code> so users cannot traverse into each other's directories.</li>
            <li><strong>JWT-scoped access:</strong> File IDs are only accessible to the authenticated user who uploaded them. All file retrieval endpoints validate the JWT bearer token and match the user ID.</li>
            <li><strong>Session lifecycle cleanup:</strong> Files are flagged for deletion when a session ends or expires. A scheduled background task purges orphaned files.</li>
            <li><strong>No permanent storage:</strong> Uploaded document content is never written to the main database. Only metadata (filename, file type, session ID) is persisted.</li>
          </ul>

          <p>
            Learn more about the full security architecture on the <Link to="/security" style={{ color: "var(--accent)" }}>SARVA AI enterprise security page</Link>.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            7. Limitations &amp; When This Approach Falls Short
          </h2>
          <p>
            The context-injection approach used in SARVA AI is effective for most documents but has important limitations you should understand before using it in production:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li>
              <strong>Scanned and image-only PDFs:</strong> PDFs created from scanned paper pages contain no machine-readable text — only images. <code>pypdf</code> extracts nothing from these. You need an OCR step (e.g. <code>pytesseract</code> + <code>pdf2image</code>) to convert page images to text first. This adds latency and can introduce recognition errors.
            </li>
            <li>
              <strong>Very large documents:</strong> A 200-page PDF may contain 100,000+ tokens. Truncation loses information from later pages. Simple chunking loses global context. Production RAG systems require embedding infrastructure (vector databases) to handle documents at this scale correctly.
            </li>
            <li>
              <strong>Complex table layouts:</strong> <code>pypdf</code> extracts text in reading order, which can produce garbled output from tables and multi-column layouts. <code>pdfplumber</code> preserves more structural information but is slower and not always perfect.
            </li>
            <li>
              <strong>Password-protected PDFs:</strong> Encrypted PDFs cannot be read without the password. The extraction will return empty text or raise an error.
            </li>
            <li>
              <strong>Non-text content:</strong> Charts, diagrams, and embedded formulas are not extracted as meaningful text. The AI will not "see" a bar chart — only whatever text labels are embedded in the chart.
            </li>
            <li>
              <strong>Hallucination risk with long prompts:</strong> When the injected document text is close to the model's context window limit, models can begin confusing document content with their own knowledge. Always include an explicit instruction to acknowledge when information is not in the document.
            </li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            8. Frequently Asked Questions
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
            Related Engineering Articles &amp; Guides
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

export default ArticleChatWithPdf;
