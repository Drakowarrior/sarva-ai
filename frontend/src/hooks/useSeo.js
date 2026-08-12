import { useEffect } from "react";

/**
 * Hook to set page title, meta description, and canonical link dynamically for SEO
 */
export const useSeo = ({ title, description, canonicalPath = "" }) => {
  useEffect(() => {
    // 1. Set document title
    if (title) {
      document.title = title;
    }

    // 2. Set meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = description;

      // Update OG description as well
      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.content = description;
      }
    }

    // 3. Set canonical URL
    const baseUrl = "https://sarva-ai-one.vercel.app";
    const targetUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : window.location.href;
    
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = targetUrl;
  }, [title, description, canonicalPath]);
};

export default useSeo;
