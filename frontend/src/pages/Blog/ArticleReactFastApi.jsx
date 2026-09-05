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
    q: "Should I use WebSocket or SSE for AI streaming in React?",
    a: "For one-directional AI response streaming (server pushes tokens to client), Server-Sent Events (SSE) is simpler and works better behind standard reverse proxies and CDNs like Vercel. WebSockets are better when you need true bidirectional communication — for example, collaborative editing or multiplayer features. For a chatbot, SSE is the recommended approach."
  },
  {
    q: "How do I handle JWT authentication in React with Axios?",
    a: "Store the JWT in httpOnly cookies (safest) or in localStorage (simpler). Create an Axios instance with a request interceptor that reads the token and injects it as a Bearer header on every protected API call. Add a response interceptor to detect 401 errors and redirect to the login page automatically."
  },
  {
    q: "How do I store and restore chat history across page reloads?",
    a: "Store conversation sessions in MongoDB Atlas with a sessions collection (session metadata) and a separate messages collection (individual turns). On page load, fetch the user's sessions list from FastAPI and let them click to restore any thread. Never rely on browser localStorage for chat history — it's device-specific and easily lost."
  },
  {
    q: "What is the best way to prevent CORS errors between React and FastAPI?",
    a: "Add CORSMiddleware to your FastAPI app with explicit allow_origins listing your Vercel frontend domain. In development, include http://localhost:5173 (or your Vite port). Never use allow_origins=['*'] in production as it bypasses origin protection for authenticated endpoints."
  },
  {
    q: "How do I handle streaming responses in React from a FastAPI SSE endpoint?",
    a: "Use the browser's native EventSource API or fetch with ReadableStream to consume SSE tokens. For each incoming chunk, append the delta to your existing message state using a functional state update to avoid stale closure issues. Cancel the stream on component unmount using an AbortController."
  }
];

const ArticleReactFastApi = () => {
  useSeo({
    title: "How to Build an AI Chatbot with React 19 & FastAPI | SARVA AI",
    description: "Complete guide to building a full-stack AI chatbot with React 19 and FastAPI. Covers project setup, async REST endpoints, JWT middleware, real-time SSE streaming, MongoDB session persistence, and Vercel deployment.",
    canonicalPath: "/blog/react-fastapi-ai-chatbot",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "React + FastAPI AI Chatbot", "item": "https://sarva-ai-one.vercel.app/blog/react-fastapi-ai-chatbot" }
          ]
        },
        {
          "@type": "BlogPosting",
          "headline": "How to Build an AI Chatbot with React and FastAPI",
          "description": "Step-by-step technical guide to integrating React single-page frontend with FastAPI backend for AI chatbot applications.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-13",
          "dateModified": "2026-09-05",
          "mainEntityOfPage": "https://sarva-ai-one.vercel.app/blog/react-fastapi-ai-chatbot"
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "React + FastAPI AI Chatbot", path: "/blog/react-fastapi-ai-chatbot" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Build an AI Chatbot with React and FastAPI
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 24px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 13, 2026</span>
          <span>•</span>
          <span><FiClock /> 14 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Building a responsive conversational AI application requires orchestrating two distinct execution environments: a dynamic single-page web interface in <strong>React</strong> and a high-performance, asynchronous REST backend built with <strong>FastAPI</strong>. This guide walks through the complete architecture, code structure, and deployment decisions used in <strong>SARVA AI</strong> — from project setup to production deployment.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. System Architecture Overview
          </h2>
          <p>
            In modern full-stack AI design, the React client handles state management, multi-turn UI streaming, and markdown rendering. The FastAPI server validates incoming payloads, enforces JWT session security, and dispatches prompts to high-throughput LLM engines like <Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)" }}>Groq LPUs</Link>. Learn more about the full infrastructure on the <Link to="/technology" style={{ color: "var(--accent)" }}>SARVA AI technology architecture page</Link>.
          </p>

          {/* Architecture Box */}
          <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "12px", padding: "20px", margin: "24px 0" }}>
            <h4 style={{ margin: 0, color: "#38bdf8", fontSize: "1rem" }}>Full-Stack Pipeline Flow</h4>
            <pre style={{ background: "#090d16", padding: "12px", borderRadius: "8px", marginTop: "10px", fontSize: "0.85rem", overflowX: "auto", color: "#f8fafc" }}>
{`React SPA (Vite + Context) 
  ── [POST /api/chat] ──► FastAPI Router (Python Async)
                            ├── JWT Authentication Check
                            ├── Context Extraction & Document Parsing
                            ├── Session History Loading (MongoDB)
                            └── Groq LPU Inference (Llama 3.3 70B)`}
            </pre>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Project Setup & Dependencies
          </h2>
          <p>
            Start by scaffolding both services. Frontend uses Vite for fast builds and React Router for client-side routing. Backend uses FastAPI with Uvicorn as the ASGI server:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`# Frontend
npm create vite@latest frontend -- --template react
cd frontend && npm install react-router-dom axios react-hot-toast

# Backend
pip install fastapi uvicorn[standard] pymongo pyjwt bcrypt python-multipart groq`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. FastAPI Backend Setup
          </h2>
          <p>
            FastAPI provides native support for Python <code>async/await</code> coroutines, allowing the server to maintain open streaming connections without thread starvation. Here is the primary chat endpoint with JWT authentication dependency injection:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/chat")

class ChatRequest(BaseModel):
    session_id: str
    message: str
    model: str = "llama-3.3-70b-versatile"

@router.post("")
async def handle_chat_message(
    payload: ChatRequest,
    user_id: str = Depends(get_current_user)  # JWT auth
):
    # Load session history from MongoDB
    history = await load_session_messages(payload.session_id, user_id)
    
    # Append new user message
    history.append({"role": "user", "content": payload.message})
    
    # Call Groq LPU inference
    response_text = await generate_ai_response(history, payload.model)
    
    # Persist both messages to MongoDB
    await save_message(payload.session_id, user_id, "user", payload.message)
    await save_message(payload.session_id, user_id, "assistant", response_text)
    
    return {"reply": response_text}`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. CORS & Auth Middleware Configuration
          </h2>
          <p>
            When your React app runs on Vercel and your FastAPI runs on Render, cross-origin requests are blocked by default. Add <code>CORSMiddleware</code> with explicit origins:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

ALLOWED_ORIGINS = [
    "https://sarva-ai-one.vercel.app",
    "http://localhost:5173",  # Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)`}
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(139, 92, 246, 0.15))",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: "16px",
            padding: "24px",
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Experience This Architecture in Action
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              I implemented this exact full-stack architecture in <strong>SARVA AI</strong>, featuring instant streaming, PDF document context, and multi-turn session persistence — powered by Groq LPUs.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_react_fastapi", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            5. React State & Chat Stream Hook
          </h2>
          <p>
            On the client side, React manages conversation state using standard hooks and optimistic UI updates so the user receives instant visual feedback. The key pattern is maintaining a local <code>messages</code> array and appending streamed chunks as they arrive. Explore <Link to="/ai-chatbot" style={{ color: "var(--accent)" }}>SARVA AI's chatbot features</Link> to see this in practice:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);

const sendMessage = async (text) => {
  // Optimistic UI: add user message immediately
  setMessages(prev => [...prev, { role: "user", content: text }]);
  setLoading(true);

  try {
    const res = await axios.post("/api/chat", {
      session_id: activeSessionId,
      message: text,
      model: selectedModel,
    }, {
      headers: { Authorization: \`Bearer \${token}\` }
    });

    setMessages(prev => [...prev, { role: "assistant", content: res.data.reply }]);
  } catch (err) {
    toast.error("Failed to send message");
  } finally {
    setLoading(false);
  }
};`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            6. Key Engineering Tradeoffs
          </h2>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>WebSocket vs HTTP SSE:</strong> WebSockets are ideal for bidirectional updates, while HTTP SSE is simpler to deploy behind standard reverse proxies like Vercel. For chatbots, SSE is usually the right choice.</li>
            <li><strong>Session Storage — MongoDB vs Redis:</strong> MongoDB Atlas stores thread state persistently, surviving server restarts. Redis is faster for ephemeral session state but requires additional infrastructure.</li>
            <li><strong>Model selection per-request:</strong> Allowing the client to specify the model on each request gives users control over cost vs quality. SARVA AI defaults to Llama 3.3 70B but downgrades to Llama 3.1 8B Instant for quick conversational replies.</li>
            <li><strong>Context window management:</strong> Truncate or summarize old conversation turns to prevent exceeding model limits. Track token count per message to make smart truncation decisions.</li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            7. Frequently Asked Questions
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
            Related Engineering Articles & Product Features
          </h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "16px" }}>
            <Link to="/ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              AI Chatbot Feature Overview
            </Link>
            <Link to="/blog/fastapi-groq-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Groq LPU LLaMA 3.3 Integration →
            </Link>
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
            </Link>
            <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              JWT Auth & Security Guide →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleReactFastApi;
