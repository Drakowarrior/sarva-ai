import { Link } from "react-router-dom";
import { FiArrowRight, FiCode, FiCloud } from "react-icons/fi";
import SeoHeader from "../../components/SeoLayout/SeoHeader";
import SeoFooter from "../../components/SeoLayout/SeoFooter";
import useSeo from "../../hooks/useSeo";

const ArticleArchitectureDeployment = () => {
  useSeo({
    title: "Deploying Full-Stack AI Applications on Vercel + Render | SARVA AI",
    description: "Production deployment guide for hosting React SPAs on Vercel Edge Network and FastAPI microservices on Render cloud with CORS and health checks.",
    canonicalPath: "/blog/full-stack-ai-architecture",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://sarva-ai-one.vercel.app/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://sarva-ai-one.vercel.app/blog" },
            { "@type": "ListItem", "position": 3, "name": "Deploying AI Apps on Vercel + Render", "item": "https://sarva-ai-one.vercel.app/blog/full-stack-ai-architecture" }
          ]
        },
        {
          "@type": "TechArticle",
          "headline": "Deploying Full-Stack AI Applications on Vercel + Render",
          "description": "DevOps guide on hosting React SPAs and FastAPI backend microservices for AI applications.",
          "author": { "@type": "Person", "name": "Karan Garg" },
          "datePublished": "2026-08-02"
        }
      ]
    }
  });

  return (
    <div className="seo-page-container">
      <SeoHeader />

      <main className="seo-page-content" style={{ maxWidth: "880px" }}>
        <div className="seo-hero-badge">☁️ DevOps & Cloud Deployment</div>
        <h1 className="seo-page-title" style={{ fontSize: "2.4rem" }}>
          Deploying Full-Stack AI Applications on Vercel + Render
        </h1>
        
        <div style={{ display: "flex", gap: "16px", color: "var(--text-secondary)", fontSize: "0.88rem", marginBottom: "30px" }}>
          <span>By Karan Garg</span> • <span>August 02, 2026</span> • <span>9 min read</span>
        </div>

        <section className="seo-card" style={{ marginBottom: "28px" }}>
          <h2 className="seo-card-title">Production Hosting Topology</h2>
          <p className="seo-card-text">
            Deploying a full-stack AI application requires separating static client assets from heavy async API workloads. SARVA AI hosts its React 19 single-page application on the <strong>Vercel Edge Network</strong> (for zero-latency CDN distribution) while executing FastAPI microservices on <strong>Render Cloud</strong>.
          </p>
        </section>

        <section className="seo-card" style={{ textAlign: "center", marginTop: "36px" }}>
          <h3 className="seo-card-title">Read the Complete Case Study</h3>
          <p className="seo-card-text" style={{ marginBottom: "20px" }}>
            Explore the 12-section technical case study detailing the complete engineering journey of SARVA AI.
          </p>
          <div style={{ display: "flex", gap: "14px", justifyContent: "center" }}>
            <Link to="/case-study" className="seo-cta-btn" style={{ padding: "10px 22px" }}>
              Read Technical Case Study <FiArrowRight />
            </Link>
          </div>
        </section>
      </main>

      <SeoFooter />
    </div>
  );
};

export default ArticleArchitectureDeployment;
