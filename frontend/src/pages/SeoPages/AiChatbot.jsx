import { Link } from "react-router-dom";
import { FiMessageSquare, FiClock, FiCpu, FiLock, FiFileText, FiArrowRight, FiHelpCircle } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const FAQS = [
  {
    q: "How does SARVA AI Chatbot maintain conversation memory?",
    a: "SARVA AI stores multi-turn conversation sessions inside MongoDB Atlas. Each user query is processed with preceding message history, allowing the AI to understand contextual follow-up questions seamlessly."
  },
  {
    q: "Can I upload files and PDFs directly into the chat?",
    a: "Yes! SARVA AI supports multi-format document analysis. You can upload PDFs, text files, and images into the chat stream for instant summaries, code reviews, and document QA."
  },
  {
    q: "Which AI models power the chatbot?",
    a: "SARVA AI supports dynamic model switching across Groq LPU inference models including Llama 3.3 70B, Qwen 3 32B, Gemma 2 9B, and Vision models for low-latency responses exceeding 300 tokens per second."
  },
  {
    q: "Is my chat data kept secure and private?",
    a: "Absolutely. All user sessions and uploaded files are isolated at the database level and protected using stateless JWT bearer tokens and HTTPS transport encryption."
  }
];

const AiChatbot = () => {
  useSeo({
    title: "AI Chatbot for Business | Intelligent Conversations | SARVA AI",
    description: "Explore SARVA AI's intelligent AI chatbot for multi-turn conversations, PDF document parsing, dynamic model selection, and secure enterprise workflows.",
    canonicalPath: "/ai-chatbot",
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
          { "@type": "ListItem", "position": 2, "name": "AI Chatbot", "item": "https://sarva-ai-one.vercel.app/ai-chatbot" }
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
        <SeoBreadcrumbs items={[{ name: "AI Chatbot", path: "/ai-chatbot" }]} />
        <div className="seo-hero-badge">Conversational AI Engine</div>
        <h1 className="seo-page-title">Intelligent AI Chatbot for Modern Workflows</h1>
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
              Conversations are automatically grouped into sessions stored inside MongoDB Atlas. Users can rename chat threads, search previous messages, delete old conversations, and pick up right where they left off.
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
