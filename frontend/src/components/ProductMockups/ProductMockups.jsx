import React, { useState } from "react";
import { FiMessageSquare, FiCpu, FiFileText, FiDatabase, FiLock, FiCheckCircle, FiCopy, FiCheck, FiDownload, FiTerminal, FiLayers, FiCode } from "react-icons/fi";
import "./ProductMockups.css";

export const ChatInterfaceMockup = () => {
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Llama 3.3 70B Versatile");

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mockup-window">
      {/* Window Header */}
      <div className="mockup-header">
        <div className="mockup-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <div className="mockup-title">SARVA AI — Interactive Workspace</div>
        <div className="mockup-model-badge">
          <FiCpu /> {selectedModel}
        </div>
      </div>

      {/* Main Body */}
      <div className="mockup-body">
        {/* Sidebar Preview */}
        <div className="mockup-sidebar">
          <div className="mockup-sidebar-header">Recent Threads</div>
          <div className="mockup-thread-item active">
            <FiMessageSquare /> FastAPI Architecture
          </div>
          <div className="mockup-thread-item">
            <FiFileText /> Quarterly PDF Report
          </div>
          <div className="mockup-thread-item">
            <FiCode /> React Hook Debugging
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
              How do I structure JWT authentication in a FastAPI backend connected to React?
            </div>
          </div>

          {/* AI Message */}
          <div className="mockup-msg ai">
            <div className="mockup-avatar ai">🤖</div>
            <div className="mockup-bubble ai">
              <p>Here is the standard production flow for <strong>JWT Authentication</strong> using FastAPI and React:</p>
              
              <div className="mockup-code-box">
                <div className="mockup-code-header">
                  <span>fastapi_auth.py</span>
                  <button onClick={handleCopy} className="mockup-copy-btn">
                    {copied ? <><FiCheck /> Copied</> : <><FiCopy /> Copy</>}
                  </button>
                </div>
                <pre><code>{`from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload.get("sub")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")`}</code></pre>
              </div>

              <div className="mockup-highlights">
                <span><FiCheckCircle /> Bcrypt Password Hashing</span>
                <span><FiCheckCircle /> Stateless Session Tokens</span>
                <span><FiCheckCircle /> MongoDB Atlas User Store</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
          <p>Context State, SSE Stream, Tailwind/CSS</p>
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
          <p>PyPDF Parser, Document Chunking</p>
        </div>

        <div className="arch-arrow">➔</div>

        <div className="arch-node llm">
          <div className="arch-icon"><FiCpu /></div>
          <h4>Groq LPUs</h4>
          <span>Llama 3.3 70B</span>
          <p>300+ tok/sec Low Latency</p>
        </div>

        <div className="arch-arrow">➔</div>

        <div className="arch-node db">
          <div className="arch-icon"><FiDatabase /></div>
          <h4>MongoDB Atlas</h4>
          <span>Cloud Cluster</span>
          <p>Persistent Multi-turn Memory</p>
        </div>
      </div>
    </div>
  );
};
