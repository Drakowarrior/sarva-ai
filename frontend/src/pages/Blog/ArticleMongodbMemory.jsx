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
    q: "How many messages should I store per conversation session?",
    a: "There is no fixed limit, but you should truncate the context injected into the LLM prompt rather than the database records. Store the full conversation in MongoDB for display purposes. When calling the AI model, inject only the last N messages (e.g., last 20 turns) or however many fit within your token budget. This keeps database queries fast while preventing LLM context overflow."
  },
  {
    q: "Should I use Redis or MongoDB for AI chatbot session state?",
    a: "MongoDB Atlas is better when you need persistent, searchable conversation history across sessions and devices. Redis is better for ephemeral hot state — like active streaming sessions or rate-limit counters. For most AI chatbots, MongoDB is the right primary store, with Redis optionally added for caching frequently accessed sessions."
  },
  {
    q: "How do I implement session search so users can find old conversations?",
    a: "Create a text index on the session title field and the first message content field in MongoDB. When the user types into the search bar, query sessions with a text search filter scoped to that user's ID. For basic implementations, a regex search across session titles works well enough without a full text index."
  },
  {
    q: "What is the best way to generate automatic session titles?",
    a: "After the first user message is sent and a response received, make a separate lightweight LLM call (using a small fast model) with a prompt like: 'Summarize this conversation topic in 5 words or less.' Store the result as the session title. This gives users meaningful thread names without requiring manual input."
  },
  {
    q: "How do you handle session loading when a user has hundreds of threads?",
    a: "Paginate the sessions list with a limit of 20–30 sessions per page, sorted by last_updated descending. Load message history lazily — only fetch messages for the session the user actually clicks on, not all sessions on load. Use compound indexes on (user_id, updated_at) to make this query sub-10ms even with millions of documents."
  }
];

const ArticleMongodbMemory = () => {
  useSeo({
    title: "How to Build Conversational AI With Chat History & Memory | SARVA AI",
    description: "Design MongoDB Atlas schemas for AI chatbot session memory. Learn how to build persistent multi-turn conversation threads with compound indexes, Motor async queries, session pagination, and automatic title generation.",
    canonicalPath: "/blog/chat-history-memory",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "Chat History & Memory", "item": "https://sarva-ai-one.vercel.app/blog/chat-history-memory" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "How to Build Conversational AI With Chat History and Memory",
          "description": "Technical guide detailing MongoDB Atlas schema design and Motor async queries for AI session context persistence.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-08",
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "Chat History & Memory", path: "/blog/chat-history-memory" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Build Conversational AI With Chat History and Memory
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 08, 2026</span>
          <span>•</span>
          <span><FiClock /> 12 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Contextual memory retention allows large language models to maintain coherent multi-turn conversations across hours or days. Without persistent session storage, every new user message starts from scratch — the AI has no memory of what was discussed before. Storing session trajectories efficiently requires a document schema tailored for fast query indexing, lazy loading, and seamless context injection. This is the approach used in <Link to="/ai-chatbot" style={{ color: "var(--accent)" }}>SARVA AI's conversational AI engine</Link>.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Why Persistent Memory Matters
          </h2>
          <p>
            A conversational AI without memory forces users to repeat themselves constantly. With session memory:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li>Users can say "Explain that last point differently" and the AI understands what "that" refers to.</li>
            <li>Long debugging sessions can continue after a page refresh without losing context.</li>
            <li>Document analysis conversations accumulate knowledge about the uploaded file across multiple questions.</li>
            <li>Users can return to a thread days later and pick up exactly where they left off.</li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. MongoDB Document Collections Schema
          </h2>
          <p>
            We separate metadata objects (<code>sessions</code> collection) from individual dialogue turns (<code>messages</code> collection) to enable lightning-fast thread sidebar loading without fetching all message content upfront:
          </p>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#10b981" }}>
{`// sessions collection — lightweight metadata only
{
  "_id": ObjectId("..."),
  "user_id": "usr_4410",
  "title": "FastAPI CORS configuration help",  // auto-generated
  "created_at": ISODate("2026-08-08T10:00:00Z"),
  "updated_at": ISODate("2026-08-08T10:15:30Z"),
  "message_count": 12
}

// messages collection — full conversation turns
{
  "_id": ObjectId("..."),
  "session_id": "sess_89f2a",
  "user_id": "usr_4410",
  "role": "user",   // "user" | "assistant"
  "content": "Explain async MongoDB queries in Motor.",
  "model": "llama-3.3-70b-versatile",
  "files": [
    { "filename": "spec.pdf", "file_type": "pdf" }
  ],
  "created_at": ISODate("2026-08-08T10:15:30Z")
}`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. Index Optimization for Fast Queries
          </h2>
          <p>
            Compound indexes on the right fields are what make this schema performant at scale. Create these indexes when initializing your MongoDB database:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#10b981" }}>
{`// In your db_init.py or startup hook
async def create_indexes(db):
    # Sessions: load user's thread list sorted by last active
    await db.sessions.create_index([("user_id", 1), ("updated_at", -1)])
    
    # Messages: load all messages for a session in order
    await db.messages.create_index([("session_id", 1), ("created_at", 1)])
    
    # Optional: full-text search on session titles
    await db.sessions.create_index([("title", "text")])`}
          </pre>
          <p style={{ marginTop: "16px" }}>
            Compound indexes on <code>(user_id, updated_at)</code> and <code>(session_id, created_at)</code> ensure sub-10ms query response times even as collections grow into millions of records.
          </p>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(56, 189, 248, 0.15))",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "16px",
            padding: "24px",
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Experience Persistent AI Memory in SARVA AI
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              SARVA AI saves your conversation threads automatically so you can resume discussions anytime, even across devices.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_mongodb_memory", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. Motor Async Queries in FastAPI
          </h2>
          <p>
            Use <code>motor</code> (the async MongoDB driver) for non-blocking database operations inside FastAPI endpoints:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#10b981" }}>
{`from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient(MONGODB_URI)
db = client["sarva_ai"]

async def load_session_messages(session_id: str, user_id: str, limit: int = 20) -> list:
    """Load the last N messages for context injection into the LLM prompt."""
    cursor = db.messages.find(
        {"session_id": session_id, "user_id": user_id},
        {"role": 1, "content": 1, "_id": 0}
    ).sort("created_at", -1).limit(limit)
    
    messages = await cursor.to_list(length=limit)
    return list(reversed(messages))  # Chronological order for prompt

async def save_message(session_id: str, user_id: str, role: str, content: str):
    """Persist a message and update session last-active timestamp."""
    from datetime import datetime
    await db.messages.insert_one({
        "session_id": session_id,
        "user_id": user_id,
        "role": role,
        "content": content,
        "created_at": datetime.utcnow()
    })
    await db.sessions.update_one(
        {"_id": session_id, "user_id": user_id},
        {"$set": {"updated_at": datetime.utcnow()}, "$inc": {"message_count": 1}}
    )`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            5. Automatic Session Title Generation
          </h2>
          <p>
            After the first exchange completes, generate a descriptive session title using a fast lightweight model. This runs asynchronously after the response is already returned to the user:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#10b981" }}>
{`async def auto_generate_title(first_user_message: str, session_id: str):
    prompt = [
        {"role": "system", "content": "Generate a concise 4-6 word title for this conversation. Reply with only the title, no punctuation."},
        {"role": "user", "content": first_user_message}
    ]
    title = await generate_response(prompt, model="llama-3.1-8b-instant")
    await db.sessions.update_one(
        {"_id": session_id},
        {"$set": {"title": title.strip()}}
    )`}
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
            <Link to="/blog/jwt-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              ← JWT Security & Auth
            </Link>
            <Link to="/blog/react-fastapi-ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              React + FastAPI AI Chatbot →
            </Link>
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
            </Link>
            <Link to="/ai-chatbot" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              AI Chatbot Features →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleMongodbMemory;
