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
    q: "Should I use JWT or session cookies for authentication in a FastAPI AI app?",
    a: "JWT bearer tokens are generally better for FastAPI AI chatbots because they are stateless — the server doesn't need to maintain a session store to validate them. This simplifies horizontal scaling and works naturally with REST APIs. httpOnly cookies are safer against XSS than storing JWTs in localStorage. For maximum security, use short-lived JWTs stored in httpOnly cookies, with a separate refresh token mechanism."
  },
  {
    q: "How long should JWT access tokens last for an AI chatbot?",
    a: "For AI chatbots where users expect sessions to persist across browser tabs, 24-hour access tokens are common. For higher-security enterprise applications, 15–60 minute access tokens paired with refresh tokens (7–30 day lifetime) are more appropriate. SARVA AI uses 24-hour tokens for convenience, with plans to add refresh tokens in a future update."
  },
  {
    q: "How do you implement FastAPI JWT dependency injection?",
    a: "Define a Depends function that reads the Authorization header, decodes the JWT using your secret key and algorithm, and returns the user payload (or raises a 401 HTTPException). Pass this function as a Depends parameter to any protected route. FastAPI handles calling it automatically on every request to that endpoint."
  },
  {
    q: "What is multi-tenant session isolation in an AI chatbot?",
    a: "Multi-tenant isolation means that User A's chat history, uploaded files, and account data are completely inaccessible to User B, even if they are both using the same backend service. This is enforced by always including a user_id filter in every MongoDB query, where user_id is extracted from the validated JWT token — never from the request body, which the client could manipulate."
  },
  {
    q: "How do I protect against token theft and replay attacks?",
    a: "Use short token expiry times combined with HTTPS-only transmission to reduce the window of opportunity for replay attacks. Storing JWTs in httpOnly cookies prevents JavaScript from accessing them, blocking the most common XSS-based theft vector. Consider adding a jti (JWT ID) claim and maintaining a server-side revocation list for high-security contexts where you need the ability to invalidate individual tokens before expiry."
  }
];

const ArticleJwtSecurity = () => {
  useSeo({
    title: "How JWT Authentication Works in AI Chatbot Applications | SARVA AI",
    description: "Implement JWT authentication in FastAPI AI chatbot applications. Complete guide to bcrypt password hashing, token generation, FastAPI dependency injection, multi-tenant session isolation, and secure API endpoint protection.",
    canonicalPath: "/blog/jwt-ai-chatbot",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "JWT AI Chatbot Security", "item": "https://sarva-ai-one.vercel.app/blog/jwt-ai-chatbot" }
          ]
        },
        {
          "@type": "BlogPosting",
          "headline": "How JWT Authentication Works in AI Chatbot Applications",
          "description": "Technical guide on implementing JWT bearer security in FastAPI AI chatbot applications with bcrypt and multi-tenant isolation.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-05",
          "dateModified": "2026-09-05",
          "mainEntityOfPage": "https://sarva-ai-one.vercel.app/blog/jwt-ai-chatbot"
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "JWT AI Chatbot Security", path: "/blog/jwt-ai-chatbot" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How JWT Authentication Works in AI Chatbot Applications
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 24px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 05, 2026</span>
          <span>•</span>
          <span><FiClock /> 11 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Securing AI application user sessions requires stateless authentication that protects private chat histories and uploaded document contents without introducing database lookup overhead on every streaming HTTP request. JSON Web Tokens (JWT) are the standard solution — and this guide covers the complete implementation used in <Link to="/security" style={{ color: "var(--accent)" }}>SARVA AI's security architecture</Link>, from password hashing to multi-tenant data isolation.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Why JWT for AI Chatbot Security?
          </h2>
          <p>
            Traditional session-based authentication requires the server to look up a session record in a database on every request. For AI chatbots that may handle dozens of streaming connections simultaneously, this overhead adds up. JWT bearer tokens solve this by encoding all necessary authentication data directly in the token, which the server validates cryptographically without any database query:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>Stateless:</strong> No server-side session store needed. Each token is self-contained.</li>
            <li><strong>Scalable:</strong> Works naturally with horizontally scaled FastAPI instances.</li>
            <li><strong>User-scoped:</strong> The token payload carries the user ID used to scope all database queries.</li>
            <li><strong>Expirable:</strong> Tokens have built-in expiry, limiting the damage window if stolen.</li>
          </ul>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Password Hashing with bcrypt
          </h2>
          <p>
            Passwords are never stored in plaintext. Use <code>passlib</code> with <code>bcrypt</code> to hash passwords on registration and verify them on login:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#a855f7" }}>
{`from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. Token Generation & Login Endpoint
          </h2>
          <p>
            Upon successful login, FastAPI encodes a signed JWT containing the user subject and expiration timestamp. The secret key must be kept server-side and never exposed to the client:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#a855f7" }}>
{`from datetime import datetime, timedelta
import jwt

SECRET_KEY = os.getenv("JWT_SECRET")   # Keep this in .env, never commit it
ALGORITHM = "HS256"
TOKEN_EXPIRE_HOURS = 24

def create_access_token(data: dict) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(hours=TOKEN_EXPIRE_HOURS)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

@router.post("/login")
async def login(credentials: LoginSchema):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    
    token = create_access_token({"sub": str(user["_id"]), "email": user["email"]})
    return {"access_token": token, "token_type": "bearer"}`}
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(56, 189, 248, 0.15))",
            border: "1px solid rgba(168, 85, 247, 0.4)",
            borderRadius: "16px",
            padding: "24px",
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Experience Protected AI Sessions in SARVA AI
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              SARVA AI isolates all chat threads and file uploads behind encrypted JWT bearer authentication — so your conversations are always private.
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_jwt_security", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. FastAPI Dependency Injection for Auth
          </h2>
          <p>
            Create a reusable <code>get_current_user</code> dependency that validates the JWT on every protected route automatically:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#a855f7" }}>
{`from fastapi import Depends, HTTPException, Header

async def get_current_user(authorization: str = Header(...)) -> str:
    try:
        scheme, token = authorization.split(" ")
        if scheme.lower() != "bearer":
            raise HTTPException(401, "Invalid auth scheme")
        
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token payload")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token")

# Usage in any protected route:
@router.get("/sessions")
async def get_sessions(user_id: str = Depends(get_current_user)):
    sessions = await db.sessions.find({"user_id": user_id}).to_list(50)
    return sessions`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            5. Multi-Tenant Session Isolation
          </h2>
          <p>
            Every database query for session records and message records filters by the decoded JWT user ID. This is what guarantees that User A can never access User B's data — even if they discover the session ID:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#a855f7" }}>
{`# WRONG — trusts client-provided user_id (dangerous):
async def get_messages(session_id: str, user_id: str = Body(...)):
    return await db.messages.find({"session_id": session_id}).to_list(100)

# CORRECT — uses JWT-verified user_id (safe):
async def get_messages(
    session_id: str,
    user_id: str = Depends(get_current_user)  # From validated JWT
):
    return await db.messages.find({
        "session_id": session_id,
        "user_id": user_id   # Both session AND user must match
    }).to_list(100)`}
          </pre>

          <p>
            See the complete security architecture — including CORS configuration, input validation, and file sandbox isolation — on the <Link to="/security" style={{ color: "var(--accent)" }}>SARVA AI enterprise security page</Link>.
          </p>

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
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
            </Link>
            <Link to="/blog/chat-history-memory" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              MongoDB Thread Memory →
            </Link>
            <Link to="/security" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Enterprise Security Architecture →
            </Link>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleJwtSecurity;
