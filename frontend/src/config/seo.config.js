/**
 * SARVA AI — Single source of truth for production SEO configuration.
 *
 * DOMAIN MIGRATION GUIDE:
 * When connecting a custom domain, change ONLY `SITE_URL` below.
 * Every canonical URL, sitemap URL, JSON-LD URL, and OG URL in useSeo.js
 * will automatically use the new domain.
 *
 * After changing SITE_URL you must also manually update:
 *   - frontend/public/sitemap.xml  (static XML, regenerate or update urls)
 *   - frontend/public/llms.txt     (static file, update URLs)
 *   - All JSON-LD @graph blocks inside page components (hardcoded for now)
 *
 * Long-term: pipe SITE_URL through a React Context so page-level JSON-LD
 * can also be domain-agnostic.
 */

export const SITE_URL = "https://sarva-ai-one.vercel.app";

export const SITE_NAME = "SARVA AI";

export const SITE_DESCRIPTION =
  "SARVA AI is a full-stack AI chatbot platform with persistent memory, PDF analysis, Groq LPU inference, and enterprise workspace management.";

export const DEFAULT_OG_IMAGE = `${SITE_URL}/logo.jpg`;

export const AUTHOR_NAME = "Karan Garg";

export const GITHUB_URL = "https://github.com/Drakowarrior/sarva-ai";
