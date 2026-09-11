# SARVA AI v1.0.0 — Production-Style Reference Release 🚀

We are pleased to announce the **v1.0.0 release of SARVA AI** — an open-source, production-style reference implementation for building full-stack conversational AI platforms, document analysis (RAG) tools, and multi-tenant AI chatbots using React, FastAPI, Groq LLM inference, and MongoDB Atlas.

---

## ✨ Release Highlights

### 💬 AI Conversational Engine
- **Groq LLM Streaming**: Real-time token streaming for low-latency response generation.
- **Persistent Memory**: Chat session management, renaming, deletion, and search powered by async MongoDB Motor.
- **In-Memory Document Analysis**: Upload PDF, Word (`.docx`), text (`.txt`), and image files directly into chat sessions for instant contextual analysis.
- **Markdown & Code Highlighting**: Rich rendering with copy-to-clipboard functionality on code snippets.
- **Shared Chat Sessions**: Generate shareable URLs to collaborate on conversations across user accounts.

### 🔐 Security & Multi-Tenant Workspaces
- **httpOnly Cookie JWT Authentication**: Secure session handling with client-side isolation and automatic status gating.
- **Organization Workspaces**: Multi-tenant workspace management with automatic Head/Owner assignment.
- **Approval Workflows**: Dedicated approval queue for Head & HR administrators to manage member requests.
- **Role-Based Access Control (RBAC)**: Permission matrix supporting `Head`, `HR`, `Team Lead`, `Executive`, `Intern`, and `Student`.
- **IP Rate Limiting & CORS Guard**: Middleware protection capping traffic at 200 requests/minute per IP.

### 🎨 Glassmorphic Frontend & UI/UX
- **React + Vite Architecture**: Fast hot reloading and modular component architecture.
- **Framer Motion Micro-Animations**: Smooth drawer toggles, page transitions, and skeleton loaders.
- **Responsive Layout**: Designed and tested across mobile, tablet, and desktop screens.

---

## 🛠 Tech Stack Overview

- **Frontend**: React, Vite, Framer Motion, Axios, Vanilla CSS
- **Backend**: Python 3.10+, FastAPI, Uvicorn, PyJWT, Bcrypt, PyPDF, python-docx
- **Database**: MongoDB Atlas (Motor async driver)
- **AI Engine**: Groq Cloud API

---

## 🚀 Quick Start

Check out the [Quick Start Guide in the README](README.md#-quick-start) to launch SARVA AI locally.

```bash
git clone https://github.com/karangarg-igt/sarva-ai.git
cd sarva-ai
```

---

## 🤝 Contributing

We welcome open-source contributions! Check out our [CONTRIBUTING.md](CONTRIBUTING.md) and [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) to get involved.

---

**Full Changelog**: https://github.com/karangarg-igt/sarva-ai/commits/v1.0.0
