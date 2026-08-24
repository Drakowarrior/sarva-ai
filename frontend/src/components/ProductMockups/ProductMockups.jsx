import React, { useState } from "react";
import { 
  FiMessageSquare, FiCpu, FiFileText, FiDatabase, FiLock, 
  FiCheckCircle, FiCopy, FiCheck, FiDownload, FiTerminal, 
  FiLayers, FiCode, FiUser, FiShare2, FiZap, FiSearch, FiPlus, FiBriefcase, FiChevronRight 
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
-> Stream initialized: 314.5 tokens/sec`;

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
            <div className="mockup-avatar ai">S</div>
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
        <span className="mockup-model-badge doc-badge">
          <FiFileText /> PyPDF Engine Parsed
        </span>
      </div>

      <div className="mockup-body mockup-doc-body">
        <div className="mockup-doc-grid">
          {/* Document File View */}
          <div className="mockup-doc-card">
            <div className="mockup-doc-title">
              <FiFileText className="doc-icon" /> Q3_Financial_Analysis_2026.pdf
            </div>
            <div className="mockup-doc-sub">24 Pages · Parsed in 120ms · 4,800 tokens extracted</div>
            <div className="mockup-doc-snippet">
              "...Total enterprise operational revenue increased by 34% YoY with gross margins reaching 82% following full integration of AI workflow automation..."
            </div>
          </div>

          {/* AI Extracted Key Takeaways */}
          <div className="mockup-summary-card">
            <div className="mockup-summary-title">
              <FiCheckCircle /> AI Extracted Executive Summary
            </div>
            <ul className="mockup-summary-list">
              <li><strong>Revenue Growth:</strong> 34% YoY enterprise operational surge.</li>
              <li><strong>Margin Optimization:</strong> 82% gross margins via automated pipelines.</li>
              <li><strong>Action Item:</strong> Deploy organization workspace access across departments.</li>
            </ul>
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

      <div className="mockup-body mockup-tech-body">
        <div className="mockup-tech-log">
          <pre><code>{TECHNICAL_LOG}</code></pre>
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

        <div className="arch-arrow"><FiChevronRight /></div>

        <div className="arch-node security">
          <div className="arch-icon"><FiLock /></div>
          <h4>JWT Auth</h4>
          <span>OAuth2 Bearer</span>
          <p>Role Security & Session Tokens</p>
        </div>

        <div className="arch-arrow"><FiChevronRight /></div>

        <div className="arch-node backend">
          <div className="arch-icon"><FiTerminal /></div>
          <h4>FastAPI Backend</h4>
          <span>Python Async Engine</span>
          <p>PyPDF Parser, Chunking</p>
        </div>

        <div className="arch-arrow"><FiChevronRight /></div>

        <div className="arch-node llm">
          <div className="arch-icon"><FiCpu /></div>
          <h4>Groq LPUs</h4>
          <span>Llama 4 Scout (17B)</span>
          <p>300+ tok/sec Low Latency</p>
        </div>

        <div className="arch-arrow"><FiChevronRight /></div>

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
