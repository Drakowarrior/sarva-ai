import { Link } from "react-router-dom";
import { FiMail, FiGithub, FiGlobe, FiSend, FiArrowRight } from "react-icons/fi";
import { useState } from "react";
import toast from "react-hot-toast";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const Contact = () => {
  useSeo({
    title: "Contact SARVA AI — Developer Team & Platform Support",
    description: "Get in touch with the core engineering team for platform inquiries, feature requests, and enterprise support.",
    canonicalPath: "/contact",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Contact", "item": "https://sarva-ai-one.vercel.app/contact" }
          ]
        },
        {
          "@type": "ContactPage",
          "name": "Contact SARVA AI",
          "url": "https://sarva-ai-one.vercel.app/contact"
        }
      ]
    }
  });

  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Thank you for your message! Our team will get back to you soon.");
      setForm({ name: "", email: "", subject: "", message: "" });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
        <div className="seo-hero-badge">Developer Contact & Support</div>
        <h1 className="seo-page-title">Get in Touch with SARVA AI</h1>
        <p className="seo-page-subtitle">
          Have questions about our architecture, deployment options, or custom LLM integrations? Send us a message or connect via GitHub.
        </p>

        <div className="seo-grid-2">
          {/* Contact Form */}
          <div className="seo-card">
            <h2 className="seo-card-title" style={{ marginBottom: "20px" }}>Send a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="contact-name" style={{ fontSize: "var(--sarva-text-sm)", color: "var(--sarva-text-secondary)" }}>Name</label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--sarva-radius-md)", border: "1px solid var(--sarva-border)", background: "var(--sarva-surface)", color: "var(--sarva-text-primary)" }}
                />
              </div>

              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="contact-email" style={{ fontSize: "var(--sarva-text-sm)", color: "var(--sarva-text-secondary)" }}>Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--sarva-radius-md)", border: "1px solid var(--sarva-border)", background: "var(--sarva-surface)", color: "var(--sarva-text-primary)" }}
                />
              </div>

              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="contact-subject" style={{ fontSize: "var(--sarva-text-sm)", color: "var(--sarva-text-secondary)" }}>Subject</label>
                <input
                  id="contact-subject"
                  type="text"
                  required
                  placeholder="Inquiry or Feature Request"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--sarva-radius-md)", border: "1px solid var(--sarva-border)", background: "var(--sarva-surface)", color: "var(--sarva-text-primary)" }}
                />
              </div>

              <div className="form-group" style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label htmlFor="contact-message" style={{ fontSize: "var(--sarva-text-sm)", color: "var(--sarva-text-secondary)" }}>Message</label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  placeholder="How can we help you?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "var(--sarva-radius-md)", border: "1px solid var(--sarva-border)", background: "var(--sarva-surface)", color: "var(--sarva-text-primary)" }}
                />
              </div>

              <button type="submit" className="seo-cta-btn" disabled={submitting} style={{ justifySelf: "flex-start", marginTop: "10px" }}>
                {submitting ? "Sending..." : "Send Message"} <FiSend aria-hidden="true" />
              </button>
            </form>
          </div>

          {/* Direct Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div className="seo-card">
              <div className="seo-card-icon"><FiGithub aria-hidden="true" /></div>
              <h2 className="seo-card-title">GitHub Repository</h2>
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
                Visit SARVA AI GitHub <FiArrowRight aria-hidden="true" />
              </a>
            </div>

            <div className="seo-card">
              <div className="seo-card-icon"><FiGlobe aria-hidden="true" /></div>
              <h2 className="seo-card-title">Live Vercel Application</h2>
              <p className="seo-card-text">
                Access the running platform demo directly at{" "}
                <a
                  href="https://sarva-ai-one.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "var(--sarva-text-accent)", textDecoration: "underline" }}
                >
                  https://sarva-ai-one.vercel.app/
                </a>.
              </p>
              <a
                href="https://sarva-ai-one.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="seo-social-link"
                style={{ marginTop: "14px", display: "inline-flex" }}
              >
                Launch Production App <FiArrowRight aria-hidden="true" />
              </a>
            </div>

            <div className="seo-card">
              <div className="seo-card-icon"><FiMail aria-hidden="true" /></div>
              <h2 className="seo-card-title">Developer & Lead</h2>
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
