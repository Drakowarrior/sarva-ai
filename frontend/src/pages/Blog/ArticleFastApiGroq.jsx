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
    q: "What makes Groq LPUs faster than GPU-based inference?",
    a: "Groq's Language Processing Units use a Tensor Streaming Processor (TSP) architecture with a static execution scheduler. Unlike GPUs that use dynamic scheduling and cache hierarchies, Groq LPUs execute model weights in a deterministic, fully pipelined fashion. This eliminates memory bandwidth bottlenecks — the main cause of slow autoregressive token generation on GPUs — resulting in speeds of 300+ tokens per second compared to 20–80 tok/s on typical A100 GPU setups."
  },
  {
    q: "Which Groq model should I use for my AI chatbot?",
    a: "For quick conversational replies, llama-3.1-8b-instant gives the fastest responses with acceptable quality. For complex reasoning, code generation, or long-form answers, llama-3.3-70b-versatile delivers significantly better quality. For vision tasks (image analysis), use llama-3.2-11b-vision-preview. SARVA AI lets users switch models per conversation based on their needs."
  },
  {
    q: "How do I handle Groq API rate limits?",
    a: "Groq's free tier has rate limits per minute (TPM) and requests per minute (RPM). Implement exponential backoff retry logic for 429 rate-limit responses. For production workloads, consider maintaining a request queue with a concurrency limiter so high-traffic periods don't cause cascading failures."
  },
  {
    q: "Can I stream Groq responses token by token?",
    a: "Yes. Groq supports streaming via the stream=True parameter in their Python SDK. You can yield each chunk as a Server-Sent Event (SSE) from your FastAPI endpoint, and consume it on the React client using EventSource or fetch with ReadableStream to display tokens as they arrive."
  },
  {
    q: "Is the Groq API free to use?",
    a: "Groq offers a free tier with generous rate limits suitable for development and moderate production use. For higher-volume production applications, paid plans are available with higher RPM and TPM limits. Check groq.com for current pricing details."
  }
];

const ArticleFastApiGroq = () => {
  useSeo({
    title: "How to Build an AI Chatbot with Groq LPU & LLaMA 3.3 | SARVA AI",
    description: "Learn how to integrate Groq LPU hardware acceleration with FastAPI to build AI chatbots using Llama 3.3 70B. Covers async streaming, model selection, rate limit handling, error recovery, and 300+ tok/sec inference setup.",
    canonicalPath: "/blog/fastapi-groq-chatbot",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "Groq + LLaMA AI Chatbot", "item": "https://sarva-ai-one.vercel.app/blog/fastapi-groq-chatbot" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "How to Build an AI Chatbot with Groq and LLaMA",
          "description": "Technical guide explaining Groq LPU streaming integration with FastAPI backend and model selection strategies.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "publisher": { "@type": "Organization", "name": "SARVA AI" },
          "datePublished": "2026-08-12",
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
        <SeoBreadcrumbs items={[{ name: "Blog", path: "/blog" }, { name: "Groq + LLaMA AI Chatbot", path: "/blog/fastapi-groq-chatbot" }]} />

        <h1 className="seo-page-title" style={{ textAlign: "left", fontSize: "2.4rem", lineHeight: "1.25" }}>
          How to Build an AI Chatbot with Groq and LLaMA
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "16px 0 32px", fontSize: "0.88rem", color: "var(--text-secondary)" }}>
          <span>By <strong>Karan Garg</strong></span>
          <span>•</span>
          <span>August 12, 2026</span>
          <span>•</span>
          <span><FiClock /> 13 min read</span>
        </div>

        <TableOfContents articleSelector=".article-body-content" />

        <div className="article-body-content" style={{ fontSize: "1.05rem", lineHeight: "1.75", color: "var(--text-primary)" }}>
          <p>
            Low-latency token generation is the defining requirement for modern conversational AI. By leveraging <strong>Groq LPUs (Language Processing Units)</strong> alongside open-weights models like <strong>Llama 3.3 70B</strong>, developers can stream responses at speeds exceeding 300 tokens per second — roughly 10× faster than typical GPU-based inference. This guide covers the complete Groq + FastAPI integration used in <Link to="/ai-chatbot" style={{ color: "var(--accent)" }}>SARVA AI</Link>.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            1. Why Groq LPU Hardware Matters
          </h2>
          <p>
            Traditional GPU clusters suffer from memory bandwidth bottlenecks when running autoregressive LLM decoding. Groq's Tensor Streaming Architecture uses static execution schedules to deliver deterministic, high-throughput token streams. Here is what that means in practice:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>No memory hierarchy overhead:</strong> LPUs stream model weights directly through compute in a fixed pattern, eliminating cache miss latency.</li>
            <li><strong>Deterministic performance:</strong> Unlike GPUs with variable occupancy, Groq delivers consistent throughput — critical for real-time UX.</li>
            <li><strong>Developer-friendly API:</strong> Groq's SDK is compatible with OpenAI's API format, making migration from OpenAI straightforward.</li>
          </ul>
          <p>
            You can see the full technology stack that powers SARVA AI on the <Link to="/technology" style={{ color: "var(--accent)" }}>architecture page</Link>, including how Groq fits into the broader inference pipeline.
          </p>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            2. Setting Up the Groq Python SDK
          </h2>
          <p>
            Install the Groq Python client and set your API key as an environment variable:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`pip install groq

# .env
GROQ_API_KEY=gsk_your_key_here`}
          </pre>
          <p style={{ marginTop: "16px" }}>
            Then initialize the async client and define a basic completion function:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`from groq import AsyncGroq
import os

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))

async def generate_response(prompt_history: list, model: str = "llama-3.3-70b-versatile"):
    completion = await client.chat.completions.create(
        model=model,
        messages=prompt_history,
        temperature=0.7,
        max_tokens=2048
    )
    return completion.choices[0].message.content`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            3. Implementing Streaming Responses with SSE
          </h2>
          <p>
            For a real-time chat experience, use Groq's streaming mode and yield each token chunk as a Server-Sent Event from FastAPI. The React client then appends tokens to the UI as they arrive:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#a855f7" }}>
{`from fastapi.responses import StreamingResponse
import json

async def stream_ai_response(messages: list, model: str):
    """Generator yielding SSE-formatted token chunks"""
    stream = await client.chat.completions.create(
        model=model,
        messages=messages,
        stream=True,
        max_tokens=2048
    )
    async for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield f"data: {json.dumps({'token': delta})}\\n\\n"
    yield "data: [DONE]\\n\\n"

@router.post("/stream")
async def stream_chat(payload: ChatRequest, user_id: str = Depends(get_current_user)):
    messages = await build_message_context(payload.session_id, user_id, payload.message)
    return StreamingResponse(
        stream_ai_response(messages, payload.model),
        media_type="text/event-stream"
    )`}
          </pre>

          {/* SARVA AI Funnel CTA Banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15), rgba(168, 85, 247, 0.15))",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: "16px",
            padding: "24px",
            margin: "40px 0",
            textAlign: "center"
          }}>
            <h3 style={{ fontSize: "1.3rem", color: "var(--text-primary)", marginBottom: "8px" }}>
              Test Groq Token Streaming Live
            </h3>
            <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", marginBottom: "16px" }}>
              I implemented Groq acceleration in <strong>SARVA AI</strong>. Try asking a question to experience 300+ tok/sec inference in a production app!
            </p>
            <Link
              to="/auth"
              onClick={() => trackCtaClick("article_groq_llama", "Try SARVA AI")}
              className="seo-cta-btn"
              style={{ padding: "10px 24px", fontSize: "0.95rem", display: "inline-flex" }}
            >
              Try SARVA AI Free →
            </Link>
          </div>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            4. Model Selection Strategy
          </h2>
          <p>
            Different query types benefit from different models. SARVA AI uses a routing approach based on query characteristics:
          </p>
          <ul style={{ paddingLeft: "20px", margin: "16px 0" }}>
            <li><strong>llama-3.1-8b-instant:</strong> Simple conversational replies, quick factual questions — fastest response time.</li>
            <li><strong>llama-3.3-70b-versatile:</strong> Complex reasoning, code review, document analysis — best quality for demanding tasks.</li>
            <li><strong>llama-3.2-11b-vision-preview:</strong> Image analysis, screenshot understanding, visual document parsing.</li>
            <li><strong>Qwen / Mixtral variants:</strong> Available as fallbacks when Llama models are at capacity.</li>
          </ul>

          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#38bdf8" }}>
{`MODEL_REGISTRY = {
    "fast":    "llama-3.1-8b-instant",
    "default": "llama-3.3-70b-versatile",
    "vision":  "llama-3.2-11b-vision-preview",
}

def select_model(user_choice: str, has_image: bool) -> str:
    if has_image:
        return MODEL_REGISTRY["vision"]
    return MODEL_REGISTRY.get(user_choice, MODEL_REGISTRY["default"])`}
          </pre>

          <h2 style={{ fontSize: "1.6rem", marginTop: "40px", marginBottom: "12px", color: "var(--text-primary)" }}>
            5. Rate Limit Handling & Error Recovery
          </h2>
          <p>
            The Groq free tier enforces requests-per-minute (RPM) and tokens-per-minute (TPM) limits. Implement exponential backoff to gracefully handle 429 responses:
          </p>
          <pre style={{ background: "#090d16", padding: "16px", borderRadius: "12px", border: "1px solid var(--border)", fontSize: "0.88rem", overflowX: "auto", color: "#a855f7" }}>
{`import asyncio
from groq import RateLimitError

async def generate_with_retry(messages: list, model: str, max_retries: int = 3):
    for attempt in range(max_retries):
        try:
            return await generate_response(messages, model)
        except RateLimitError:
            wait_time = 2 ** attempt  # 1s, 2s, 4s
            await asyncio.sleep(wait_time)
    raise HTTPException(503, "AI service temporarily unavailable. Please try again.")`}
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
            <Link to="/blog/chat-with-pdf" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Chat With PDF Documents →
            </Link>
            <Link to="/blog/full-stack-ai-architecture" style={{ color: "var(--accent)", textDecoration: "none", background: "var(--bg-card)", padding: "10px 16px", borderRadius: "8px", border: "1px solid var(--border)", fontSize: "0.9rem", fontWeight: "500" }}>
              Full-Stack System Architecture →
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

export default ArticleFastApiGroq;
