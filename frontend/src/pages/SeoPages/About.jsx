import { Link } from "react-router-dom";
import { FiInfo, FiTarget, FiUserCheck, FiCode, FiArrowRight } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import SeoBreadcrumbs from "../../components/SeoLayout/SeoBreadcrumbs";
import useSeo from "../../hooks/useSeo";

const About = () => {
  useSeo({
    title: "About SARVA AI — Platform Vision & Engineering Mission",
    description: "Built for scale, performance, and multi-model flexibility. Learn about SARVA AI's mission and full-stack software architecture.",
    canonicalPath: "/about",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
        { "@type": "ListItem", "position": 2, "name": "About", "item": "https://sarva-ai-one.vercel.app/about" }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content">
        <SeoBreadcrumbs items={[{ name: "About", path: "/about" }]} />
        <div className="seo-hero-badge">Platform Vision & Team</div>
        <h1 className="seo-page-title">About SARVA AI</h1>
        <p className="seo-page-subtitle">
          SARVA AI is an advanced enterprise conversational AI platform built to deliver intuitive reasoning, document intelligence, multi-model flexibility, and developer-centric workflows.
        </p>

        <section className="seo-card" style={{ marginBottom: "30px" }}>
          <h2 className="seo-card-title"><FiTarget className="seo-card-icon" /> Our Mission</h2>
          <p className="seo-card-text">
            Our mission is to democratize access to high-speed, enterprise-grade AI reasoning by providing a unified full-stack conversational platform. Whether analyzing technical resumes, inspecting complex codebases, or conducting deep research, SARVA AI streamlines interactions with state-of-the-art LLMs.
          </p>
        </section>

        <div className="seo-grid-2">
          <div className="seo-card">
            <div className="seo-card-icon"><FiCode aria-hidden="true" /></div>
            <h2 className="seo-card-title">Full-Stack Excellence</h2>
            <p className="seo-card-text">
              Built from scratch using React 19, FastAPI microservices, MongoDB Atlas, and Groq hardware acceleration to ensure zero friction between human intent and AI execution.
            </p>
          </div>

          <div className="seo-card">
            <div className="seo-card-icon"><FiUserCheck aria-hidden="true" /></div>
            <h2 className="seo-card-title">Developer & Enterprise Focus</h2>
            <p className="seo-card-text">
              Engineered with production requirements in mind: JWT authentication, organization dashboards, rate-limiting protection, audit feedback logs, and cross-platform responsiveness.
            </p>
          </div>
        </div>

        <section className="seo-card" style={{ marginTop: "40px", textAlign: "center" }}>
          <h2 className="seo-card-title">Want to see how SARVA AI works?</h2>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Explore our platform features or test out our live interactive chat experience.
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/features" className="seo-cta-btn" style={{ padding: "12px 24px" }}>
              Explore Features <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to="/chat" className="seo-social-link" style={{ padding: "12px 24px" }}>
              Try Live Demo <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default About;
