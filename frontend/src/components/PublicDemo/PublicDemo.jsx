import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSend, FiZap, FiLock, FiArrowRight, FiRotateCcw, FiCheckCircle, FiShield, FiFileText, FiCpu, FiCode, FiGlobe, FiBookOpen, FiLayers } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import { 
  trackDemoStarted, 
  trackDemoPromptClicked, 
  trackDemoPromptSubmitted, 
  trackDemoCompleted,
  trackCtaClick 
} from "../../utils/analytics";
import "./PublicDemo.css";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const DEMO_PROMPTS = [
  {
    id: "python-code",
    category: "Coding",
    icon: <FiCode />,
    title: "Explain this Python code",
    prompt: "Explain how async/await concurrency works in Python with a quick 4-line code example."
  },
  {
    id: "pdf-analysis",
    category: "Documents",
    icon: <FiFileText />,
    title: "Analyze my PDF document",
    prompt: "How does SARVA AI parse PDF documents and feed structured context into LLM context windows?"
  },
  {
    id: "fastapi-debug",
    category: "Coding",
    icon: <FiZap />,
    title: "Help me debug FastAPI API",
    prompt: "Why am I getting a 422 Unprocessable Entity error in my FastAPI POST endpoint?"
  },
  {
    id: "summarize-doc",
    category: "Writing",
    icon: <FiBookOpen />,
    title: "Summarize this document",
    prompt: "Summarize the key architectural benefits of using Groq LPUs over standard cloud GPUs."
  },
  {
    id: "study-plan",
    category: "Learning",
    icon: <FiLayers />,
    title: "Create a study plan",
    prompt: "Create a 3-step study plan to master full-stack AI engineering with React and FastAPI."
  },
  {
    id: "ml-concept",
    category: "Analysis",
    icon: <FiCpu />,
    title: "Explain ML concept",
    prompt: "Explain the difference between RAG (Retrieval-Augmented Generation) and fine-tuning in simple terms."
  }
];

const PREDEFINED_FALLBACK_ANSWERS = {
  "python-code": "In Python, `async/await` enables non-blocking asynchronous execution. While one Task awaits I/O (like an API call or database query), the event loop runs other tasks:\n\n```python\nimport asyncio\n\nasync def fetch_data():\n    await asyncio.sleep(1) # Non-blocking delay\n    return {'status': 'success'}\n\nasyncio.run(fetch_data())\n```\n*In SARVA AI, we leverage FastAPI's async event loop to serve hundreds of concurrent AI stream connections.*",
  "pdf-analysis": "SARVA AI processes PDFs by extracting textual blocks, normalizing structural whitespace, chunking large sections into context windows, and injecting relevant metadata directly into the system prompt for high-accuracy document comprehension.",
  "fastapi-debug": "A `422 Unprocessable Entity` in FastAPI occurs when the request body fails Pydantic schema validation. Common causes:\n1. Missing required field in JSON payload\n2. Mismatched data type (e.g. string passed instead of int)\n3. Missing `Content-Type: application/json` header.",
  "summarize-doc": "Groq LPUs (Language Processing Units) achieve unprecedented token generation speeds (300+ tokens/sec) by utilizing deterministic instruction-level parallelism, eliminating memory bandwidth bottlenecks present in traditional GPU architectures.",
  "study-plan": "### 3-Step Full-Stack AI Roadmap\n1. **Frontend**: Master React SPA state, streaming SSE/WebSocket handlers, and tailwind/custom CSS.\n2. **Backend**: Build async FastAPI REST endpoints, JWT auth, and MongoDB Atlas context schemas.\n3. **AI Inference**: Integrate Groq API LPUs for low-latency Llama 3.3 model execution.",
  "ml-concept": "• **RAG**: Injects external retrieved documents directly into the prompt context at query time (no model retraining required).\n• **Fine-tuning**: Modifies model weights permanently on specialized training datasets."
};

const PublicDemo = ({ initialPrompt = "" }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "**Welcome to the SARVA AI Interactive Demo!**\n\nSelect a sample prompt below or type a query to test our conversational AI engine in real time. *(3 free demo turns per session)*"
    }
  ]);
  const [input, setInput] = useState(initialPrompt);
  const [isLoading, setIsLoading] = useState(false);
  const [demoTurnsUsed, setDemoTurnsUsed] = useState(0);
  const [sessionId] = useState(() => "demo_" + Math.random().toString(36).substring(2, 9));
  const MAX_TURNS = 3;

  useEffect(() => {
    trackDemoStarted("public_demo_widget");
  }, []);

  const handleSend = async (textToSend) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading || demoTurnsUsed >= MAX_TURNS) return;

    trackDemoPromptSubmitted(query.substring(0, 30));
    
    // Add user message
    const updatedMessages = [...messages, { role: "user", content: query }];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const newTurnsUsed = demoTurnsUsed + 1;
    setDemoTurnsUsed(newTurnsUsed);

    if (newTurnsUsed >= MAX_TURNS) {
      trackDemoCompleted(newTurnsUsed);
    }

    try {
      // Call dedicated public demo endpoint
      const response = await fetch(`${API_BASE_URL}/api/demo/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          prompt: query
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: data.reply }
        ]);
      } else {
        // Fallback response matching query
        const matchedPromptObj = DEMO_PROMPTS.find(p => p.prompt === query || p.title === query);
        const fallbackText = matchedPromptObj 
          ? PREDEFINED_FALLBACK_ANSWERS[matchedPromptObj.id] 
          : `SARVA AI Response for: "${query}"\n\nTo enjoy unlimited conversational depth, high-capacity Llama 3.3 70B models, and document parsing, create your free account today!`;
        
        setMessages([
          ...updatedMessages,
          { role: "assistant", content: fallbackText }
        ]);
      }
    } catch (err) {
      // Local fallback on network disconnect
      const matchedPromptObj = DEMO_PROMPTS.find(p => p.prompt === query || p.title === query);
      const fallbackText = matchedPromptObj 
        ? PREDEFINED_FALLBACK_ANSWERS[matchedPromptObj.id] 
        : `SARVA AI Interactive Demo Response for: "${query}"\n\n*Sign up for full access to SARVA AI with FastAPI & Groq backend.*`;

      setMessages([
        ...updatedMessages,
        { role: "assistant", content: fallbackText }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptClick = (promptObj) => {
    trackDemoPromptClicked(promptObj.title);
    setInput(promptObj.prompt);
    handleSend(promptObj.prompt);
  };

  const handleResetDemo = () => {
    setMessages([
      {
        role: "assistant",
        content: "Demo reset! Choose a prompt or enter a question below."
      }
    ]);
    setDemoTurnsUsed(0);
  };

  return (
    <div className="public-demo-container">
      {/* Top Banner Notice */}
      <div className="demo-notice-bar">
        <div className="demo-notice-info">
          <span className="demo-live-badge">
            <span className="pulse-dot"></span> Interactive Demo Mode
          </span>
          <span className="demo-turns-count">
            {MAX_TURNS - demoTurnsUsed} of {MAX_TURNS} free queries remaining
          </span>
        </div>
        {demoTurnsUsed > 0 && (
          <button onClick={handleResetDemo} className="demo-reset-btn" title="Reset Demo Session">
            <FiRotateCcw /> Reset Demo
          </button>
        )}
      </div>

      {/* Demo Conversation Viewport */}
      <div className="demo-chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`demo-msg-bubble ${msg.role}`}>
            <div className="demo-avatar">
              {msg.role === "assistant" ? "S" : "U"}
            </div>
            <div className="demo-msg-content">
              <div className="demo-sender-name">
                {msg.role === "assistant" ? "SARVA AI (Demo Engine)" : "You"}
              </div>
              <div className="demo-text">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="demo-msg-bubble assistant">
            <div className="demo-avatar">S</div>
            <div className="demo-msg-content">
              <div className="demo-typing">
                <span></span><span></span><span></span> Thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Pre-filled Sample Prompt Chips */}
      {demoTurnsUsed < MAX_TURNS && (
        <div className="demo-prompt-chips-container">
          <div className="demo-chips-label"><FiZap /> Try these example prompts:</div>
          <div className="demo-chips-grid">
            {DEMO_PROMPTS.map((p) => (
              <button
                key={p.id}
                onClick={() => handlePromptClick(p)}
                className="demo-prompt-chip"
                disabled={isLoading}
              >
                <span className="chip-icon">{p.icon}</span>
                <span className="chip-title">{p.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input or Registration Conversion Callout */}
      {demoTurnsUsed < MAX_TURNS ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="demo-input-form">
          <input
            type="text"
            placeholder="Type a demo question (e.g., How does JWT security work in AI apps?)..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={500}
            disabled={isLoading}
            className="demo-input-field"
          />
          <button type="submit" disabled={!input.trim() || isLoading} className="demo-send-btn">
            <FiSend />
          </button>
        </form>
      ) : (
        <div className="demo-cta-overlay">
          <div className="demo-cta-content">
            <FiCheckCircle className="demo-cta-check-icon" />
            <h3>You've experienced the power of SARVA AI!</h3>
            <p>Create your free account to unlock unlimited chat sessions, PDF document analysis, saved history, and model selection.</p>
            <div className="demo-cta-actions">
              <Link 
                to="/auth" 
                onClick={() => trackCtaClick("demo_widget", "Try SARVA AI Free")}
                className="seo-cta-btn demo-signup-btn"
              >
                Try SARVA AI Free <FiArrowRight />
              </Link>
              <button onClick={handleResetDemo} className="demo-secondary-btn">
                Try Demo Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PublicDemo;
