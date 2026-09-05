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
    q: "Should I deploy my FastAPI AI backend on Render or Railway?",
    a: "Both Render and Railway are excellent choices for FastAPI deployment. Render's free tier is more generous for always-on services — though it spins down after inactivity (similar to Railway's hobby tier). For production AI chatbots, Render's paid tier ($7/month) keeps the service warm. Railway offers faster builds and a sleeker dashboard but similar pricing. SARVA AI uses Render due to its reliable free-tier behavior during development."
  },
  {
    q: "How do I prevent Vercel cold starts from slowing down my React SPA?",
    a: "Vercel doesn't have cold start issues for static React/Vite SPAs — the frontend is served from a global CDN edge network with no server-side rendering involved. Cold starts are only a concern for Vercel's serverless functions (API routes). Since SARVA AI uses a separate FastAPI backend on Render, Vercel serves purely static assets with sub-50ms global latency."
  },
  {
    q: "How do I configure SPA routing rewrites on Vercel for React Router?",
    a: "Add a vercel.json file to your frontend directory with a rewrites rule that redirects all non-asset paths to /index.html. Without this, refreshing on a client-side route like /blog/chat-with-pdf returns a 404 from Vercel. The rewrite rule is: { source: '/:path*', destination: '/index.html' }."
  },
  {
    q: "How do I handle environment variables securely across frontend and backend?",
    a: "In the React frontend, only expose variables that are safe to be public — prefix them with VITE_ and they get embedded in the JavaScript bundle. Never put secret keys (API keys, JWT secrets, database URIs) in frontend environment variables. Keep all secrets in the FastAPI backend's environment variables, configured in your Render dashboard or .env file."
  },
  {
    q: "What is the best CI/CD setup for a FastAPI + Vercel full-stack AI app?",
    a: "Vercel auto-deploys the frontend on every push to your main branch — zero configuration needed. For the FastAPI backend on Render, enable Auto-Deploy from your GitHub repository so every push triggers a new deployment. Add a GitHub Actions workflow for running tests and lint checks before merges to main to prevent deploying broken code."
  }
];

const ArticleArchitectureDeployment = () => {
  useSeo({
    title: "React + FastAPI + MongoDB: Production Full-Stack AI Architecture Guide | SARVA AI",
    description: "Complete guide to deploying full-stack AI applications with React on Vercel, FastAPI on Render, and MongoDB Atlas. Covers CORS configuration, SPA routing, environment variables, CI/CD, and microservice architecture patterns.",
    canonicalPath: "/blog/full-stack-ai-architecture",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "Full-Stack AI Architecture", "item": "https://sarva-ai-one.vercel.app/blog/full-stack-ai-architecture" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "React + FastAPI + MongoDB: Full-Stack AI Architecture",
          "description": "Comprehensive engineering breakdown of deploying and structuring full-stack AI applications with React, FastAPI, and MongoDB Atlas.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-02",
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "Full-Stack AI Architecture", path: "/blog/full-stack-ai-architecture" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          React + FastAPI + MongoDB: Full-Stack AI Architecture
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 02, 2026</span>
          <span>•</span>
          <span><FiClock /> 14 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Deploying a production full-stack AI platform demands decoupled service separation: edge-rendered React frontend for low latency, an asynchronous FastAPI application server for business logic and document parsing, and MongoDB Atlas for document state isolation. This article covers the complete architecture decisions, configuration, and deployment strategy behind <Link to="/case-study" style={{ color: "var(--accent)" }}>SARVA AI's production infrastructure</Link>.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Microservice Architecture Overview
          </h2>
          <p>
            SARVA AI uses a three-tier decoupled architecture where each service is deployed independently, scaled independently, and communicates over HTTPS:
          </p>

          <div style={{ background: "rgba(0,0,0,0.3)", padding: "20px", borderRadius: "12px", margin: "20px 0", fontFamily: "monospace", fontSize: "0.9rem", color: "var(--accent)" }}>
            [ React 19 SPA (Vercel Edge CDN) ] <br />
            &nbsp;&nbsp;&nbsp;&nbsp;│<br />
            &nbsp;&nbsp;&nbsp;&nbsp;├──► HTTPS REST ──► [ FastAPI Backend (Render) ]<br />
            &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│<br />
            &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;├──► MongoDB Atlas Cloud<br />
            &nbsp;&nbsp;&nbsp;&nbsp;│&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└──► Groq Hardware LPU API
          </div>

          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>Frontend (React 19 + Vite):</strong> Single-Page Application hosted on Vercel Global CDN with SPA route rewrites via <code>vercel.json</code>.</li>
            <li><strong>Backend (FastAPI + Async Python):</strong> Hosted on Render cloud with CORS headers, health check endpoints, and rate limiting middleware.</li>
            <li><strong>Database (MongoDB Atlas):</strong> Distributed NoSQL store for user profiles, chat threads, message context, and file metadata.</li>
            <li><strong>LLM Inference (Groq LPUs):</strong> External API delivering 300+ tokens/sec streaming via the Groq Python SDK.</li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Vercel Configuration for React SPA
          </h2>
          <p>
            Without proper Vercel configuration, refreshing the browser on any client-side route returns a 404. Add a <code>vercel.json</code> in the frontend root to handle SPA routing:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#f59e0b" }}>
{`// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" }
      ]
    }
  ]
}`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. FastAPI CORS Configuration for Cross-Origin Deployment
          </h2>
          <p>
            When React runs on <code>sarva-ai-one.vercel.app</code> and FastAPI on <code>render-service.onrender.com</code>, all API calls are cross-origin. Configure <code>CORSMiddleware</code> with explicit allowed origins:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#f59e0b" }}>
{`from fastapi.middleware.cors import CORSMiddleware

ALLOWED_ORIGINS = [
    "https://sarva-ai-one.vercel.app",
    "https://your-preview-deploy.vercel.app",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,   # Required for JWT cookie auth
    allow_methods=["*"],
    allow_headers=["*"],
)`}
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(245, 158, 11, 0.15), rgba(56, 189, 248, 0.15))",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            borderRadius: "16px",
            padding: "24px",
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Try This Full-Stack Platform Now
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              Explore SARVA AI live in your browser to experience fast page loads, instant auth, and fluid AI responses built on this exact architecture.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_full_stack", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. MongoDB Atlas Connection & Connection Pooling
          </h2>
          <p>
            Use Motor (async PyMongo) for non-blocking database operations. Initialize the connection once at application startup using FastAPI's lifespan context manager to avoid creating new connections per request:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#f59e0b" }}>
{`from contextlib import asynccontextmanager
from motor.motor_asyncio import AsyncIOMotorClient

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create connection pool
    app.state.db_client = AsyncIOMotorClient(
        os.getenv("MONGODB_URI"),
        maxPoolSize=20,
        minPoolSize=5
    )
    app.state.db = app.state.db_client["sarva_ai"]
    yield
    # Shutdown: close pool
    app.state.db_client.close()

app = FastAPI(lifespan=lifespan)`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            5. Environment Variables & Secrets Management
          </h2>
          <p>
            Never commit secrets to your repository. Use environment variables for all sensitive configuration:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>Frontend (<code>VITE_</code> prefix):</strong> Only for public configuration like API base URL. These get embedded in the JavaScript bundle — never put secrets here.</li>
            <li><strong>Backend Render dashboard:</strong> <code>MONGODB_URI</code>, <code>GROQ_API_KEY</code>, <code>JWT_SECRET</code> — these stay server-side.</li>
            <li><strong>Local development:</strong> Use <code>.env</code> files. Add <code>.env</code> to <code>.gitignore</code>.</li>
          </ul>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#f59e0b" }}>
{`# frontend/.env.local (safe to commit example values only)
VITE_API_BASE_URL=http://localhost:8000

# backend/.env (NEVER commit — add to .gitignore)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/sarva_ai
GROQ_API_KEY=gsk_your_key_here
JWT_SECRET=your_random_256bit_secret_here`}
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
            <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← React + FastAPI AI Chatbot
            </Link>
            <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              JWT Security & Auth →
            </Link>
            <Link to="/blog/chat-history-memory" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              MongoDB Thread Memory →
            </Link>
            <Link to="/technology" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              SARVA AI Tech Stack →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleArchitectureDeployment;
