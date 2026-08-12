import { Link } from "react-router-dom";
import { FiGithub, FiExternalLink, FiShield, FiCpu, FiFileText } from "react-icons/fi";
import "./SeoLayout.css";

const SeoFooter = () => {
  return (
    <footer className="seo-footer">
      <div className="seo-footer-container">
        {/* Column 1: Brand & Bio */}
        <div className="seo-footer-col">
          <div className="seo-brand">
            <img src="/logo.jpg" alt="SARVA AI Logo" className="seo-brand-logo" />
            <span className="seo-brand-text">SARVA AI</span>
          </div>
          <p className="seo-footer-desc">
            Enterprise Conversational AI Platform delivering natural context-aware dialogue,
            multi-model LLM routing, resume/document analysis, and cloud security architecture.
          </p>
          <div className="seo-footer-socials">
            <a
              href="https://github.com/karangarg-9/SARVA_AI"
              target="_blank"
              rel="noopener noreferrer"
              className="seo-social-link"
              aria-label="GitHub Repository"
            >
              <FiGithub /> SARVA AI GitHub
            </a>
          </div>
        </div>

        {/* Column 2: Platform Links */}
        <div className="seo-footer-col">
          <h4 className="seo-footer-title">Platform</h4>
          <ul className="seo-footer-links">
            <li><Link to="/ai-chatbot">AI Chatbot</Link></li>
            <li><Link to="/enterprise-ai">Enterprise AI</Link></li>
            <li><Link to="/file-analysis">File Analysis</Link></li>
            <li><Link to="/features">Platform Features</Link></li>
            <li><Link to="/case-study">Engineering Case Study</Link></li>
          </ul>
        </div>

        {/* Column 3: Tech & Security */}
        <div className="seo-footer-col">
          <h4 className="seo-footer-title">Architecture</h4>
          <ul className="seo-footer-links">
            <li><Link to="/technology">Technology Stack</Link></li>
            <li><Link to="/security">Security & Privacy</Link></li>
            <li><Link to="/about">About Project</Link></li>
            <li><Link to="/contact">Developer Contact</Link></li>
            <li><a href="https://sarva-ai-one.vercel.app/" target="_blank" rel="noopener noreferrer">Live Vercel Demo <FiExternalLink /></a></li>
          </ul>
        </div>

        {/* Column 4: Quick Overview */}
        <div className="seo-footer-col">
          <h4 className="seo-footer-title">Key Capabilities</h4>
          <ul className="seo-footer-badges">
            <li><FiCpu /> Multi-LLM Engine (Llama 3.3, Gemma)</li>
            <li><FiFileText /> PDF & Vision Multimodal Parsing</li>
            <li><FiShield /> JWT & MongoDB Cloud Security</li>
          </ul>
        </div>
      </div>

      <div className="seo-footer-bottom">
        <p>© 2026 SARVA AI • Enterprise Conversational AI Platform • Developed by Karan Garg</p>
      </div>
    </footer>
  );
};

export default SeoFooter;
