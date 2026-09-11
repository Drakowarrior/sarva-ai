# 🚀 SARVA AI — GitHub Growth & Marketing Playbook

This document contains the repository configuration settings, topic tags, developer community distribution strategy, and **10 technical engineering post templates** designed to share technical lessons learned while building **SARVA AI**.

---

## 🎯 1. Repository Configuration & Setup

### Repository Description (Copy into GitHub "About" box)
> `Full-stack AI chatbot with RAG, PDF analysis, JWT authentication, MongoDB memory, and Groq-powered inference. Built with React + FastAPI.`

### Website Link
> `https://sarva-ai-one.vercel.app/`

### 15 Essential Topic Tags (Add to GitHub "Topics")
Add these exact tags to your GitHub repository settings:

`ai` `artificial-intelligence` `chatbot` `rag` `llm` `fastapi` `react` `mongodb` `groq` `python` `pdf-ai` `generative-ai` `full-stack` `jwt-authentication` `conversational-ai`

---

## 📢 2. Developer Community Distribution Strategy

| Community / Platform | Target Audience | Focus & Tone |
|:---|:---|:---|
| **r/FastAPI** | Python / FastAPI backend devs | Async Motor queries, CORS origin handling, rate limiting middleware |
| **r/ReactJS** | Frontend engineers | Real-time LLM token streaming in React 18/19, Framer Motion animations |
| **r/Python** | General Python community | Open-source reference implementation, in-memory PDF/DOCX parsing |
| **r/LocalLlama** | AI / LLM developers | Low-latency Groq inference pipeline, contextual prompt assembly |
| **Hacker News (Show HN)** | Tech leaders & builders | "Show HN: SARVA AI – Full-stack AI chatbot reference implementation (React + FastAPI)" |
| **LinkedIn** | Recruiters, tech leads, devs | Value-first engineering breakdowns, architecture flowcharts, lessons learned |
| **Dev.to / Hashnode** | Technical blog readers | Step-by-step tutorials linking directly back to repository source files |

---

## 📝 3. 10 Educational Technical Post Templates

These posts focus on **teaching technical solutions** (architecture decisions, async performance, security design, document parsing) rather than promotional link-pushing.

---

### 📌 Post 1: Full-Stack Conversational AI Architecture
**Focus:** High-level system design & component isolation  
**Platforms:** LinkedIn / Twitter / Reddit (r/FastAPI)

```text
Building a full-stack AI chatbot involves more than wrapping an API call.

Key architectural challenges in full-stack AI apps:
1. Low-latency streaming: Getting LLM tokens to the UI in real time without lag.
2. Persistent state: Storing session metadata and message threads asynchronously.
3. Security gates: Enforcing httpOnly cookie JWT auth across backend routes.

In SARVA AI (open-source reference implementation built with React & FastAPI):
React SPA ──(JWT Cookie)──▶ FastAPI Backend ──▶ Groq LLM Streaming API
                                        └──▶ MongoDB Atlas (Motor Async)
                                        └──▶ In-Memory PDF/DOCX Parser

By decoupling text extraction, token streaming, and database persistence into distinct service modules, the codebase remains clean and extensible.

🔗 Repository & Architecture: https://github.com/karangarg-igt/sarva-ai
🔗 Live Demo: https://sarva-ai-one.vercel.app/

What architectural patterns do you use for full-stack AI apps?
```

---

### 📌 Post 2: Persistent Chat Memory with Async MongoDB (Motor)
**Focus:** Non-blocking database schema design  
**Platforms:** LinkedIn / Reddit (r/Python / r/MongoDB)

```text
How do you structure conversation memory in MongoDB without creating database bottlenecks?

When building the backend for SARVA AI (FastAPI + MongoDB Atlas), I wanted to ensure fetching conversation lists was fast even with long chat threads.

Schema & Query Strategy:
- `sessions` collection: Stores lightweight metadata (title, user_id, updated_at). Indexed by `user_id` + `updated_at`.
- `messages` collection: Stores individual prompt/response pairs and feedback. Indexed by `session_id` + `created_at`.

Using Motor (MongoDB's async Python driver), route handlers fetch session lists without loading heavy message content into memory until a user opens a specific chat session.

Explore the database initialization and schemas:
👉 https://github.com/karangarg-igt/sarva-ai/tree/main/backend/database

How do you organize chat history in your database models: single nested arrays or separate collections?
```

---

### 📌 Post 3: Lightweight Document Parsing for Instant PDF Analysis
**Focus:** RAG alternatives without vector DB overhead  
**Platforms:** LinkedIn / Twitter / Reddit (r/LocalLlama)

```text
Heavy vector databases (Chroma, Qdrant, Pinecone) are great for massive document sets, but for simple single-file Q&A, lightweight in-memory parsing is often faster and easier to operate.

In SARVA AI, I implemented an in-memory multi-format file parser using Python:
- `PyPDF` for PDF text extraction
- `python-docx` for Word document parsing
- `Pillow` for image file validation
- Custom prompt sanitization for text files

Workflow:
1. File uploaded via FastAPI `/api/files/upload` (with a 10MB file limit)
2. Extract raw text in-memory without writing temporary files to disk
3. Inject structured document context directly into the Groq LLM prompt
4. Stream contextual answers back to the UI

Review the file parsing service implementation:
👉 https://github.com/karangarg-igt/sarva-ai/blob/main/backend/services/file_service.py

What's your preference for short document Q&A: full vector search or direct context injection?
```

---

### 📌 Post 4: httpOnly Cookie JWT Security in FastAPI
**Focus:** Backend security & status gate middleware  
**Platforms:** LinkedIn / Reddit (r/FastAPI / r/webdev)

```text
Storing access tokens in browser `localStorage` leaves applications vulnerable to XSS attacks.

In SARVA AI, authentication is handled via httpOnly, SameSite cookies in FastAPI:

Security implementation details:
- User authentication via Bcrypt password hashing (`passlib`/`bcrypt`)
- JWT generation signed with `SECRET_KEY`
- Cookie set with `httponly=True`, `samesite="lax"`, `secure=True`
- Custom FastAPI auth middleware (`auth.py`) extracts and verifies tokens from cookies automatically
- Workspace status gate blocks unapproved organization accounts from accessing protected API routes

This keeps auth tokens inaccessible to client-side scripts while enforcing server-side access control.

View the auth middleware:
🔗 https://github.com/karangarg-igt/sarva-ai/blob/main/backend/middleware/auth.py

How do you handle JWT storage in full-stack React + Python applications?
```

---

### 📌 Post 5: Handling Real-Time LLM Token Streaming in React
**Focus:** Frontend state management & streaming UX  
**Platforms:** LinkedIn / Reddit (r/ReactJS)

```text
Token-by-token LLM streaming makes chat applications feel alive, but managing rapid state updates in React requires careful attention to re-renders.

Lessons learned while building the chat interface in SARVA AI:
1. State Updates: Use functional state accumulators (`setMessages(prev => ...)`) to append incoming SSE/stream chunks cleanly.
2. Code Blocks: Buffer incomplete Markdown tags to prevent visual flickering before rendering syntax highlighters.
3. Auto-Scroll: Use a `useRef` auto-scroll hook that automatically pauses when the user manually scrolls up to read history.

The frontend is built with React 19, Vite, and Framer Motion.

Check out the React chat components:
👉 https://github.com/karangarg-igt/sarva-ai/tree/main/frontend/src/components

What's your preferred approach for streaming AI responses: fetch ReadableStream, EventSource, or WebSockets?
```

---

### 📌 Post 6: Building Responsive Glassmorphic UIs with Vanilla CSS
**Focus:** Design tokens & CSS architecture  
**Platforms:** LinkedIn / Twitter / Reddit (r/css / r/ReactJS)

```text
Utility CSS frameworks are popular, but writing modular Vanilla CSS using custom properties (variables) gives you exact control over glassmorphism and theme switches.

For SARVA AI, I built a glassmorphic UI system powered by CSS variables:

Design implementation:
- Translucent card backgrounds using `backdrop-filter: blur(12px)`
- Centralized color variables in `index.css` for instant dark/light mode toggles
- Framer Motion page transitions and sidebar slide-in drawers
- Fully responsive breakpoints supporting mobile (320px) up to ultra-wide desktop layouts

Live App: https://sarva-ai-one.vercel.app/
CSS Tokens: https://github.com/karangarg-igt/sarva-ai/blob/main/frontend/src/index.css

Do you prefer Vanilla CSS variables or utility frameworks like Tailwind for dark mode styling?
```

---

### 📌 Post 7: Multi-Tenant Workspaces & Role-Based Access Control in Python
**Focus:** Enterprise RBAC & authorization schemas  
**Platforms:** LinkedIn / Reddit (r/FastAPI / r/Python)

```text
Single-user AI tools are straightforward, but multi-tenant SaaS tools require organization boundaries and permissions hierarchies.

In SARVA AI, I implemented multi-tenant organization workspaces in FastAPI:

Features:
1. Organization Registration: Automatically assigns creator as workspace `Head` (Owner).
2. Pending Member Queue: New signups require approval from `Head` or `HR` managers before accessing workspace endpoints.
3. Role Matrix: Implements permissions hierarchy (`Head` → `HR` → `Team Lead` → `Executive` → `Intern` → `Student`).
4. Activity Audit Logs: Records administrative actions in MongoDB for security audits.

Explore the organization routes and RBAC logic:
👉 https://github.com/karangarg-igt/sarva-ai/blob/main/backend/routes/org_routes.py

How do you manage multi-tenant permissions in FastAPI applications?
```

---

### 📌 Post 8: Protecting FastAPI Backends with IP Rate Limiting & CORS
**Focus:** Production backend protection middleware  
**Platforms:** LinkedIn / Reddit (r/FastAPI)

```text
Exposing an LLM backend endpoint without rate limiting can lead to API quota exhaustion or unexpected costs.

In SARVA AI (FastAPI + Groq), I implemented custom middleware for API protection:

Protection layers:
- IP-based sliding window rate limiter capping requests at 200 req/min per IP
- Exemption rules for static file serving and health check routes (`/health`)
- Dynamic CORS origin resolution loading from `FRONTEND_URL` environment variables
- File upload validation capping request payload size at 10MB

View the rate limiting middleware implementation:
🔗 https://github.com/karangarg-igt/sarva-ai/blob/main/backend/main.py

What rate limiting strategies do you use in FastAPI: custom memory buckets, Redis, or API gateway rules?
```

---

### 📌 Post 9: Why Open-Source Reference Implementations Matter
**Focus:** Open-source developer ecosystem & learning  
**Platforms:** LinkedIn / Dev.to / Hacker News (Show HN)

```text
There's often a big gap between simple 50-line tutorial scripts and massive, proprietary enterprise repositories.

Developers building AI tools need practical reference implementations showing how parts fit together:
- Connecting async MongoDB persistence to LLM streaming endpoints
- Structuring React state for persistent chat history
- In-memory document extraction and role-based auth

I built SARVA AI as an open-source reference project for full-stack AI development with React and FastAPI.

Feel free to inspect the architecture, fork the boilerplate for your own projects, or submit improvements!

⭐ Repository: https://github.com/karangarg-igt/sarva-ai
🚀 Live Web App: https://sarva-ai-one.vercel.app/

Feedback and questions are always welcome!
```

---

### 📌 Post 10: Open-Source Contribution Opportunities (Good First Issues)
**Focus:** Community onboarding & open-source collaboration  
**Platforms:** LinkedIn / Twitter / Reddit (r/opensource / r/Python / r/ReactJS)

```text
Looking to contribute to an open-source AI codebase? 🚀

SARVA AI has several `good first issue` tasks available for developers interested in React, FastAPI, and LLM integrations.

Suggested contributor tasks:
1. 🎨 Persist dark/light theme choice in localStorage
2. 📋 Add "Copied!" feedback toast to code block copy buttons
3. 💾 Implement chat history export (Download conversation as Markdown / JSON)
4. 🔑 Add GitHub OAuth 2.0 authentication
5. 🤖 Add model selector dropdown (Groq Llama 3 models, Mixtral, Gemma)
6. 🧪 Add automated pytest tests for FastAPI auth routes

Check out `CONTRIBUTING.md` and claim an issue on GitHub!

Repository: https://github.com/karangarg-igt/sarva-ai
Guidelines: https://github.com/karangarg-igt/sarva-ai/blob/main/CONTRIBUTING.md
```

---

## 📈 4. Growth Funnel & Metrics Tracking

Track organic engagement weekly via GitHub Insights:

$$\text{Developer Funnel}: \text{Technical Post} \longrightarrow \text{README View} \longrightarrow \text{Live Demo} \longrightarrow \text{Fork} \longrightarrow \text{Star} \longrightarrow \text{PR / Contributor}$$
