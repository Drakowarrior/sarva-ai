import { Link } from "react-router-dom";
import { FiMessageSquare, FiClock, FiCpu, FiLock, FiFileText, FiArrowRight, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "How does SARVA AI Chatbot maintain conversation memory?",
    a: "SARVA AI stores multi-turn conversation sessions inside MongoDB Atlas. Each user query is processed with preceding message history, allowing the AI to understand contextual follow-up questions seamlessly. Sessions are automatically titled and searchable."
  },
  {
    q: "Can I upload files and PDFs directly into the chat?",
    a: "Yes. SARVA AI supports multi-format document uploads including PDFs, DOCX files, text files, and images. Files are processed through a FastAPI extraction pipeline that injects document content directly into the AI context window."
  },
  {
    q: "Which AI models power the chatbot?",
    a: "SARVA AI supports dynamic model switching across Groq LPU inference models including Llama 3.3 70B Versatile, Llama 3.2 Vision, and Llama 3.1 8B Instant for responses exceeding 300 tokens per second."
  },
  {
    q: "Is my chat data kept secure and private?",
    a: "Yes. All user sessions and uploaded files are isolated per user account at the MongoDB Atlas database level, protected using stateless JWT bearer tokens and TLS 1.3 transport encryption."
  },
  {
    q: "What makes SARVA AI different from ChatGPT or Claude?",
    a: "SARVA AI is a full-stack open application built with React 19 and FastAPI, featuring multi-turn persistent memory via MongoDB, organization workspace management with RBAC, and direct Groq LPU hardware acceleration. It is designed for developers and enterprises needing a deployable, customizable AI assistant — not just a chat interface."
  },
  {
    q: "Can I use SARVA AI for code review and programming help?",
    a: "Yes. SARVA AI renders markdown and syntax-highlighted code blocks natively. You can paste code snippets, upload code files, and ask the AI to review, refactor, explain, or debug. The Llama 3.3 70B model is particularly capable for programming tasks."
  }
];

const AiChatbot = () => {
  useSeo({
    title: "AI Chatbot Platform — Multi-Turn Conversations, PDF Support & Memory | SARVA AI",
    description: "SARVA AI is an intelligent AI chatbot with persistent conversation memory, PDF document parsing, dynamic model switching across Llama 3.3 70B and Vision models, and secure enterprise-grade session isolation.",
    canonicalPath: "/ai-chatbot",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "AI Chatbot", "item": "https://sarva-ai-one.vercel.app/ai-chatbot" }
          ]
        },
        {
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
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "AI Chatbot", path: "/ai-chatbot" }]} />
        <div className="seo-hero-badge">Conversational AI Engine</div>
        <h1 className="seo-page-title">AI Chatbot — Multi-Turn Conversations, PDF Support & Persistent Memory</h1>
        <p className="seo-page-subtitle">
          SARVA AI chatbot combines fast inference, deep contextual understanding, multi-turn memory, and document attachment capabilities to deliver human-like conversational experiences.
        </p>

        <section className="seo-card" style={{ marginBottom: "30px" }}>
          <h2 className="seo-card-title"><FiMessageSquare className="seo-card-icon" aria-hidden="true" /> What is SARVA AI Chatbot?</h2>
          <p className="seo-card-text seo-card-content">
            SARVA AI Chatbot is an enterprise-grade conversational assistant engineered using React, FastAPI, and MongoDB. It bridges the gap between raw Large Language Models (LLMs) and intuitive user experiences by maintaining conversational flow, formatting code blocks, rendering rich Markdown, and processing user feedback in real time.
          </p>
        </section>

        <div className="seo-grid-4-cards">
          <div className="seo-card">
            <div className="seo-card-icon"><FiClock aria-hidden="true" /></div>
            <h2 className="seo-card-title">Session History & Memory</h2>
            <p className="seo-card-text">
              Conversations are automatically grouped into sessions stored inside MongoDB Atlas. Users can rename chat threads, search previous messages, delete old conversations, and pick up right where they left off. Read how this works in our <Link to="/blog/chat-history-memory" style={{ color: "var(--accent)" }}>MongoDB chat memory guide</Link>.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiCpu aria-hidden="true" /></div>
            <h2 className="seo-card-title">Context-Aware Responses</h2>
            <p className="seo-card-text">
              Every query is evaluated against full multi-turn conversation history. This ensures follow-up prompts like "Explain line 5 of that function" or "Summarize the second paragraph" return accurate context without needing repetitive explanations.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiFileText aria-hidden="true" /></div>
            <h2 className="seo-card-title">File & Vision Interaction</h2>
            <p className="seo-card-text">
              Upload PDF files, code documents, or images directly into the chat stream. Read more about our <Link to="/file-analysis" style={{ color: "var(--accent)" }}>AI file analysis tools</Link> for document QA.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiLock aria-hidden="true" /></div>
            <h2 className="seo-card-title">Data Privacy & Security</h2>
            <p className="seo-card-text">
              User conversations and uploaded documents are isolated per user account. Learn more on our <Link to="/security" style={{ color: "var(--accent)" }}>enterprise security architecture page</Link>.
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="seo-card" style={{ marginTop: "40px" }} aria-labelledby="chatbot-faq-heading">
          <h2 id="chatbot-faq-heading" className="seo-card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
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
          <h2 className="seo-card-title">Related AI Resources & Guides</h2>
          <ul style={{ paddingLeft: "20px", marginTop: "12px", color: "var(--text-secondary)", lineHeight: "1.8" }}>
            <li>
              <Link to="/enterprise-ai" style={{ color: "var(--accent)", fontWeight: "600" }}>Enterprise AI Solutions for Business Automation</Link> — Explore scalable organization workspaces and RBAC dashboard.
            </li>
            <li>
              <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>Building Full-Stack React & FastAPI AI Chatbots</Link> — Detailed engineering walkthrough of async API integration.
            </li>
            <li>
              <Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)", fontWeight: "600" }}>FastAPI &amp; Groq Hardware LPU Acceleration</Link> — How Groq chipsets achieve &gt;300 tokens/sec inference.
            </li>
          </ul>
        </section>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Experience SARVA AI Chatbot</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Start chatting with Llama 3.3, Gemma, and Vision models inside our high-speed interface.
          </p>
          <Link to="/chat" className="seo-cta-btn" style={{ padding: "12px 28px" }}>
            Launch AI Chatbot <FiArrowRight aria-hidden="true" />
          </Link>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default AiChatbot;
