/**
 * SARVA AI — Static Meta Pre-renderer
 *
 * Run automatically after `vite build` (see package.json build script).
 *
 * What this does:
 *   1. Reads the built dist/index.html (the React SPA shell)
 *   2. For every public route, creates a static HTML file at the correct path
 *      with the route-specific title, meta description, canonical, og:* and
 *      twitter:* tags injected into the <head>
 *   3. Vercel serves these static HTML files BEFORE the SPA rewrite applies,
 *      so Googlebot fetching /blog/chat-with-pdf directly gets a meaningful
 *      HTML shell with the correct metadata — even before JavaScript runs.
 *   4. React still hydrates on top of the static shell. Users see no difference.
 *
 * This does NOT require Next.js, SSR, or any framework change.
 * It is static site generation for the <head> only.
 *
 * Domain migration: update SITE_URL below (matches src/config/seo.config.js)
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, "../dist");
const SITE_URL = "https://sarva-ai-one.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/logo.jpg`;

/**
 * Per-route SEO metadata.
 * Keys must match the exact URL path (no trailing slash, except homepage "/").
 */
const ROUTES = [
  {
    path: "/",
    title: "SARVA AI – Enterprise AI Solutions & Intelligent Automation",
    description: "Explore SARVA AI's enterprise AI solutions for intelligent automation, secure workflows, AI chatbots, and document analysis.",
    type: "website",
  },
  {
    path: "/about",
    title: "About SARVA AI — Full-Stack Conversational AI Platform",
    description: "Learn about SARVA AI, a full-stack enterprise AI platform with persistent memory, PDF analysis, Groq LPU inference, and team workspace management.",
  },
  {
    path: "/features",
    title: "SARVA AI Features – Conversational AI, PDF Analysis & Memory",
    description: "Discover SARVA AI features: dynamic LLM model switching, document PDF parsing, MongoDB session memory, enterprise auth, and user feedback.",
  },
  {
    path: "/ai-chatbot",
    title: "AI Chatbot – Intelligent Conversations | SARVA AI",
    description: "SARVA AI Chatbot provides natural context-aware conversations, dynamic model selection, persistent session history, file interactions, and enterprise privacy.",
  },
  {
    path: "/enterprise-ai",
    title: "Enterprise AI Assistant & Conversational Platform | SARVA AI",
    description: "SARVA AI delivers enterprise conversational AI with JWT authentication, session management, file processing, FastAPI microservices, and cloud infrastructure.",
  },
  {
    path: "/file-analysis",
    title: "AI Document Analysis — Chat with PDFs & Code | SARVA AI",
    description: "Upload PDFs, documents, and code files for instant AI analysis, summarization, and interactive Q&A powered by FastAPI and Groq LLMs.",
  },
  {
    path: "/security",
    title: "Enterprise Security & Privacy Architecture | SARVA AI",
    description: "Learn how SARVA AI protects user data through JWT authentication, bcrypt password encryption, MongoDB session isolation, and HTTPS transport security.",
  },
  {
    path: "/technology",
    title: "SARVA AI Technology Stack | React, FastAPI & MongoDB",
    description: "Explore the SARVA AI tech stack architecture: React frontend, FastAPI async backend, MongoDB Atlas database, and Groq high-speed LLM inference engine.",
  },
  {
    path: "/contact",
    title: "Contact SARVA AI Team & Developer Inquiries",
    description: "Get in touch with the SARVA AI team, submit developer inquiries, request platform features, or explore open source contributions.",
  },
  {
    path: "/case-study",
    title: "SARVA AI Case Study – Building a Full-Stack Conversational AI Platform",
    description: "In-depth engineering case study on SARVA AI: Problem, Solution, Architecture, React frontend, FastAPI backend, MongoDB Atlas, JWT Auth, Groq LLMs, and Results.",
  },
  {
    path: "/blog",
    title: "Engineering Blog & Technical AI Guides | SARVA AI",
    description: "Technical engineering articles, architecture breakdowns, and guides on React 19, FastAPI, Groq LPUs, and AI document analysis.",
  },
  {
    path: "/blog/react-fastapi-ai-chatbot",
    title: "How to Build an AI Chatbot with React and FastAPI | SARVA AI",
    description: "A step-by-step engineering deep dive into building an ultra-fast full-stack conversational AI platform with React 19 and FastAPI.",
    type: "article",
  },
  {
    path: "/blog/fastapi-groq-chatbot",
    title: "How to Build an AI Chatbot with Groq and LLaMA | SARVA AI",
    description: "Learn how to integrate Groq LPUs for 300+ tokens/sec LLM streaming with Llama 3.3 70B models in a FastAPI backend.",
    type: "article",
  },
  {
    path: "/blog/chat-with-pdf",
    title: "Chat With PDF Using AI: FastAPI + Python Implementation Guide | SARVA AI",
    description: "Learn how to build a PDF chatbot with FastAPI and Python. Covers pypdf text extraction, context injection, chunking strategies, security, and limitations.",
    type: "article",
  },
  {
    path: "/blog/ai-document-analysis",
    title: "How to Build an AI Document Analysis System | SARVA AI",
    description: "Build automated document processing pipelines for PDF reports, DOCX files, and resume screening using FastAPI and Python.",
    type: "article",
  },
  {
    path: "/blog/full-stack-ai-architecture",
    title: "React + FastAPI + MongoDB: Full-Stack AI Architecture | SARVA AI",
    description: "Production guide for hosting React SPAs on Vercel Edge Network and FastAPI microservices on cloud infrastructure with MongoDB Atlas.",
    type: "article",
  },
  {
    path: "/blog/jwt-ai-chatbot",
    title: "How JWT Authentication Works in AI Chatbot Applications | SARVA AI",
    description: "Enforcing security compliance, bcrypt password hashing, token validation, and multi-tenant user data isolation in FastAPI AI chatbots.",
    type: "article",
  },
  {
    path: "/blog/chat-history-memory",
    title: "How to Build Conversational AI With Chat History and Memory | SARVA AI",
    description: "Designing a high-performance MongoDB Atlas database schema for multi-turn chat threads and persistent session state.",
    type: "article",
  },
];

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function injectMeta(html, route) {
  const { path, title, description, type = "website" } = route;
  const canonicalUrl = path === "/" ? `${SITE_URL}/` : `${SITE_URL}${path}`;
  const escapedTitle = escapeHtml(title);
  const escapedDescription = escapeHtml(description);
  const escapedUrl = escapeHtml(canonicalUrl);
  const escapedImage = escapeHtml(DEFAULT_IMAGE);

  const metaBlock = `
    <title>${escapedTitle}</title>
    <meta name="description" content="${escapedDescription}" />
    <link rel="canonical" href="${escapedUrl}" />
    <meta property="og:title" content="${escapedTitle}" />
    <meta property="og:description" content="${escapedDescription}" />
    <meta property="og:url" content="${escapedUrl}" />
    <meta property="og:type" content="${escapeHtml(type)}" />
    <meta property="og:image" content="${escapedImage}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapedTitle}" />
    <meta name="twitter:description" content="${escapedDescription}" />
    <meta name="twitter:image" content="${escapedImage}" />
    <meta name="robots" content="index, follow" />`;

  // Remove existing conflicting tags from the base index.html before injecting route-specific ones.
  // This ensures each static HTML file has clean, single-value meta tags.
  return html
    .replace(/<title>[^<]*<\/title>/, "")
    .replace(/<meta name="description"[^>]*\/?>/g, "")
    .replace(/<link rel="canonical"[^>]*\/?>/g, "")
    .replace(/<meta name="robots"[^>]*\/?>/g, "")
    .replace(/<meta property="og:title"[^>]*\/?>/g, "")
    .replace(/<meta property="og:description"[^>]*>/g, "")
    .replace(/<meta property="og:url"[^>]*\/?>/g, "")
    .replace(/<meta property="og:type"[^>]*\/?>/g, "")
    .replace(/<meta property="og:image"[^>]*\/?>/g, "")
    .replace(/<meta name="twitter:card"[^>]*\/?>/g, "")
    .replace(/<meta name="twitter:title"[^>]*\/?>/g, "")
    .replace(/<meta name="twitter:description"[^>]*>/g, "")
    .replace(/<meta name="twitter:image"[^>]*\/?>/g, "")
    .replace(/<\/head>/, `${metaBlock}\n  </head>`);
}

function ensureDir(filePath) {
  const dir = dirname(filePath);
  mkdirSync(dir, { recursive: true });
}

async function main() {
  let indexHtml;
  try {
    indexHtml = readFileSync(join(DIST_DIR, "index.html"), "utf-8");
  } catch (e) {
    console.error("❌ dist/index.html not found. Run `vite build` first.");
    process.exit(1);
  }

  console.log(`\n🔧 SARVA AI Static Meta Pre-renderer`);
  console.log(`   Generating ${ROUTES.length} static HTML shells...\n`);

  let success = 0;
  let errors = 0;

  for (const route of ROUTES) {
    try {
      const injected = injectMeta(indexHtml, route);

      let outPath;
      if (route.path === "/") {
        // Homepage: dist/index.html is already correct — overwrite with our injected version
        outPath = join(DIST_DIR, "index.html");
      } else {
        // Subpages: dist/about/index.html, dist/blog/chat-with-pdf/index.html, etc.
        outPath = join(DIST_DIR, route.path.slice(1), "index.html");
      }

      ensureDir(outPath);
      writeFileSync(outPath, injected, "utf-8");
      console.log(`   ✅ ${route.path} → ${outPath.replace(DIST_DIR, "dist")}`);
      success++;
    } catch (e) {
      console.error(`   ❌ Failed for ${route.path}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\n   Done: ${success} succeeded, ${errors} failed.\n`);

  if (errors > 0) {
    process.exit(1);
  }
}

main();
