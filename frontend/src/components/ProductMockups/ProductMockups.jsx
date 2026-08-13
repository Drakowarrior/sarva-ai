import React, { useState } from "react";
import { 
  FiMessageSquare, FiCpu, FiFileText, FiDatabase, FiLock, 
  FiCheckCircle, FiCopy, FiCheck, FiDownload, FiTerminal, 
  FiLayers, FiCode, FiUser, FiShare2, FiZap, FiSearch, FiPlus, FiBriefcase 
} from "react-icons/fi";
import "./ProductMockups.css";

const CODE_EXAMPLE = `from fastapi import FastAPI, Depends
from groq import AsyncGroq

app = FastAPI(title="SARVA AI Engine")
client = AsyncGroq(api_key=GROQ_API_KEY)

@app.post("/api/chat/stream")
async def stream_ai_response(prompt: str):
    response = await client.chat.completions.create(
        model="meta-llama/llama-4-scout-17b-16e-instruct",
        messages=[{"role": "user", "content": prompt}],
        stream=True
    )
    return StreamingResponse(response_generator(response))`;

const TECHNICAL_LOG = `# Initializing async Groq LPU stream pipeline...
[INFO] Model: meta-llama/llama-4-scout-17b-16e-instruct
[INFO] Session ID: sess_94a8c1f92e
[SUCCESS] JWT Authentication verified for user_id: 66ab91c8e
➔ Stream initialized: 314.5 tokens/sec`;

export const ChatPreview = () => {
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Llama 4 Scout (17B)");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mockup-window">
      {/* Window Topbar Header */}
      <div className="mockup-header">
        <div className="mockup-header-left">
          <div className="mockup-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="mockup-title">SARVA AI Workspace OS</span>
        </div>
        <div className="mockup-model-badge">
          <FiCpu /> {selectedModel} <span style={{ opacity: 0.7 }}>· Active</span>
        </div>
      </div>

      {/* Main App Layout Grid */}
      <div className="mockup-body">
        {/* Sidebar Mockup */}
        <div className="mockup-sidebar">
          <div className="mockup-new-chat-btn">
            <FiPlus /> New Thread
          </div>
          <div className="mockup-sidebar-header">Active Threads</div>
          <div className="mockup-thread-item active">
            <FiMessageSquare /> Async FastAPI Architecture
          </div>
          <div className="mockup-thread-item">
            <FiFileText /> Architecture_Spec.pdf
          </div>
          <div className="mockup-thread-item">
            <FiCode /> React State & Groq Streaming
          </div>
          <div className="mockup-thread-item">
            <FiLayers /> Team Member Directory
          </div>
        </div>

        {/* Chat Feed */}
        <div className="mockup-chat-feed">
          {/* User Message */}
          <div className="mockup-msg user">
            <div className="mockup-avatar">KG</div>
            <div className="mockup-bubble user">
              <div className="mockup-attachment">
                <FiFileText /> <code>Architecture_Spec.pdf</code> (240 KB)
              </div>
              How do I structure a production-grade async FastAPI backend connected to MongoDB Atlas and Groq LPUs?
            </div>
          </div>

          {/* AI Response */}
          <div className="mockup-msg ai">
            <div className="mockup-avatar ai">✦</div>
            <div className="mockup-bubble ai">
              <p>Here is the recommended production architecture for <strong>FastAPI + Groq LPU + MongoDB Atlas</strong>:</p>

              <div className="mockup-code-box">
                <div className="mockup-code-header">
                  <span>fastapi_groq_engine.py</span>
                  <button onClick={handleCopy} className="mockup-copy-btn" type="button">
                    {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy Code</>}
                  </button>
                </div>
                <pre><code>{CODE_EXAMPLE}</code></pre>
              </div>

              <div className="mockup-highlights">
                <span><FiCheckCircle /> 300+ Tokens/sec LPU Throughput</span>
                <span><FiCheckCircle /> JWT Bearer Auth Guard</span>
                <span><FiCheckCircle /> MongoDB Multi-tenant Isolation</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DocumentPreview = () => {
  return (
    <div className="mockup-window">
      <div className="mockup-header">
        <div className="mockup-header-left">
          <div className="mockup-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="mockup-title">SARVA AI — Document Intelligence Engine</span>
        </div>
        <span className="mockup-model-badge" style={{ color: "#ec4899", background: "rgba(236,72,153,0.12)", borderColor: "rgba(236,72,153,0.3)" }}>
          <FiFileText /> PyPDF Engine Parsed
        </span>
      </div>

      <div className="mockup-body" style={{ minHeight: "280px", padding: "20px", background: "rgba(15,23,42,0.4)" }}>
        <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {/* Document File View */}
          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "0.85rem", fontWeight: "700", color: "#38bdf8" }}>
              <FiFileText style={{ fontSize: "1.2rem" }} /> Q3_Financial_Analysis_2026.pdf
            </div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>24 Pages · Parsed in 120ms · 4,800 tokens extracted</div>
            <div style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", fontSize: "0.8rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>
              "...Total enterprise operational revenue increased by 34% YoY with gross margins reaching 82% following full integration of AI workflow automation..."
            </div>
          </div>

          {/* AI Extracted Key Takeaways */}
          <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "0.85rem", fontWeight: "700", color: "#10b981", display: "flex", alignItems: "center", gap: "6px" }}>
              <FiCheckCircle /> AI Extracted Executive Summary
            </div>
            <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.8rem", color: "var(--text-primary)", display: "flex", flexDirection: "column", gap: "6px" }}>
              <li><strong>Revenue Growth:</strong> 34% YoY enterprise operational surge.</li>
              <li><strong>Margin Optimization:</strong> 82% gross margins via automated pipelines.</li>
              <li><strong>Action Item:</strong> Deploy organization workspace access across 4 departments.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export const WorkspacePreview = () => {
  return (
    <div className="mockup-window">
      <div className="mockup-header">
        <div className="mockup-header-left">
          <div className="mockup-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="mockup-title">SARVA AI — Organization Control Center</span>
        </div>
        <span className="mockup-model-badge" style={{ color: "#10b981", background: "rgba(16,185,129,0.12)", borderColor: "rgba(16,185,129,0.3)" }}>
          ● IGT Solutions Workspace
        </span>
      </div>

      <div className="mockup-body" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "14px", background: "rgba(15,23,42,0.4)" }}>
        {/* Workspace Invite Box */}
        <div style={{ padding: "14px 18px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(56, 189, 248, 0.1))", border: "1px solid rgba(16,185,129,0.25)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <span style={{ fontSize: "0.7rem", fontWeight: "700", color: "#10b981", textTransform: "uppercase" }}>WORKSPACE CODE</span>
            <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-primary)", letterSpacing: "1px" }}>INV-IGT123</div>
          </div>
          <div style={{ padding: "6px 12px", borderRadius: "8px", background: "rgba(16,185,129,0.2)", color: "#10b981", fontSize: "0.75rem", fontWeight: "700" }}>
            ✓ Copied
          </div>
        </div>

        {/* Member Directory Row Preview */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(0,0,0,0.2)", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#38bdf8", color: "#000", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.8rem" }}>KG</div>
              <div>
                <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block" }}>Karan Garg <span style={{ color: "#38bdf8", fontSize: "0.7rem" }}>(Head)</span></strong>
                <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>Artificial Intelligence · karan@igt.com</span>
              </div>
            </div>
            <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "6px", background: "rgba(16,185,129,0.15)", color: "#10b981", fontWeight: "700" }}>● Active</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "rgba(0,0,0,0.2)", borderRadius: "10px", border: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#8b5cf6", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "0.8rem" }}>VG</div>
              <div>
                <strong style={{ fontSize: "0.85rem", color: "var(--text-primary)", display: "block" }}>Vaani Garg</strong>
                <span style={{ fontSize: "0.72rem", color: "var(--text-tertiary)" }}>Software Development · vaani@igt.com</span>
              </div>
            </div>
            <span style={{ fontSize: "0.7rem", padding: "2px 8px", borderRadius: "6px", background: "rgba(139,92,246,0.15)", color: "#8b5cf6", fontWeight: "700" }}>Executive</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TechnicalPreview = () => {
  return (
    <div className="mockup-window">
      <div className="mockup-header">
        <div className="mockup-header-left">
          <div className="mockup-dots">
            <span className="dot red"></span>
            <span className="dot yellow"></span>
            <span className="dot green"></span>
          </div>
          <span className="mockup-title">SARVA AI — Async System Execution</span>
        </div>
        <span className="mockup-model-badge">
          <FiTerminal /> Groq Low-Latency Engine
        </span>
      </div>

      <div className="mockup-body" style={{ padding: "20px", background: "#090d16" }}>
        <div style={{ width: "100%", fontFamily: "'Courier New', Courier, monospace", fontSize: "0.82rem", color: "#38bdf8", display: "flex", flexDirection: "column", gap: "6px" }}>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}><code>{TECHNICAL_LOG}</code></pre>
        </div>
      </div>
    </div>
  );
};

export const ChatInterfaceMockup = ChatPreview;

export const ArchitectureDiagramMockup = () => {
  return (
    <div className="arch-diagram-card">
      <div className="arch-header">
        <h3><FiLayers /> Full-Stack AI System Architecture</h3>
        <p>Production execution pipeline powering SARVA AI</p>
      </div>

      <div className="arch-flow-grid">
        <div className="arch-node frontend">
          <div className="arch-icon"><FiCode /></div>
          <h4>React SPA</h4>
          <span>Vite 6 + React 19</span>
          <p>Context State, SSE Stream, CSS</p>
        </div>

        <div className="arch-arrow">➔</div>

        <div className="arch-node security">
          <div className="arch-icon"><FiLock /></div>
          <h4>JWT Auth</h4>
          <span>OAuth2 Bearer</span>
          <p>Role Security & Session Tokens</p>
        </div>

        <div className="arch-arrow">➔</div>

        <div className="arch-node backend">
          <div className="arch-icon"><FiTerminal /></div>
          <h4>FastAPI Backend</h4>
          <span>Python Async Engine</span>
          <p>PyPDF Parser, Chunking</p>
        </div>

        <div className="arch-arrow">➔</div>

        <div className="arch-node llm">
          <div className="arch-icon"><FiCpu /></div>
          <h4>Groq LPUs</h4>
          <span>Llama 4 Scout (17B)</span>
          <p>300+ tok/sec Low Latency</p>
        </div>

        <div className="arch-arrow">➔</div>

        <div className="arch-node db">
          <div className="arch-icon"><FiDatabase /></div>
          <h4>MongoDB Atlas</h4>
          <span>Cloud Cluster</span>
          <p>Persistent Session Memory</p>
        </div>
      </div>
    </div>
  );
};
