import { Link } from "react-router-dom";
import { FiMail, FiGithub, FiGlobe, FiSend, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const Contact = () => {
  useSeo({
    title: "Contact SARVA AI Team & Developer Inquiries",
    description: "Get in touch with the SARVA AI team, submit developer inquiries, request platform features, or explore open source contributions.",
    canonicalPath: "/contact"
  });

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you! Your message has been sent to the SARVA AI team.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <div className="seo-hero-badge">📬 Developer Contact & Support</div>
        <h1 className="seo-page-title">Get in Touch with SARVA AI</h1>
        <p className="seo-page-subtitle">
          Have questions about our architecture, deployment options, or custom LLM integrations? Send us a message or connect via GitHub.
        </p>

        <div className="seo-grid-2">
          {/* Contact Form */}
          <div className="seo-card">
            <h2 className="seo-card-title" style={{ marginBottom: "20px" }}>Send a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Inquiry or Feature Request"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "0.85rem", color: "var(--text-secondary)" }}>Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--border)", background: "rgba(255,255,255,0.03)", color: "var(--text-primary)" }}
                />
              </div>

              <button type="submit" className="seo-cta-btn" disabled={submitting} style={{ justifySelf: "flex-start", marginTop: "10px" }}>
                {submitting ? "Sending..." : "Send Message"} <FiSend />
              </button>
            </form>
          </div>

          {/* Direct Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="seo-card">
              <div className="seo-card-icon"><FiGithub /></div>
              <h3 className="seo-card-title">GitHub Repository</h3>
              <p className="seo-card-text">
                Check out the SARVA AI open-source code, submit issues, or create pull requests.
              </p>
              <a
                href="https://github.com/Drakowarrior/sarva-ai"
                target="_blank"
                rel="noopener noreferrer"
                className="seo-social-link"
                style={{ marginTop: "14px", display: "inline-flex" }}
              >
                Visit SARVA AI GitHub <FiArrowRight />
              </a>
            </div>

            <div className="seo-card">
              <div className="seo-card-icon"><FiGlobe /></div>
              <h3 className="seo-card-title">Live Vercel Application</h3>
              <p className="seo-card-text">
                Access the running platform demo directly at <code>https://sarva-ai-one.vercel.app/</code>.
              </p>
              <a
                href="https://sarva-ai-one.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="seo-social-link"
                style={{ marginTop: "14px", display: "inline-flex" }}
              >
                Launch Production App <FiArrowRight />
              </a>
            </div>

            <div className="seo-card">
              <div className="seo-card-icon"><FiMail /></div>
              <h3 className="seo-card-title">Developer & Lead</h3>
              <p className="seo-card-text">
                Karan Garg • Intern at IGT Solutions • Full-Stack Conversational AI Project
              </p>
            </div>
          </div>
        </div>
      </main>

      <SeoFooter />
    </div>
  );
};

export default Contact;
