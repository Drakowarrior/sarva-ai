import { useEffect } from "react";

/**
 * Enhanced Hook to set page title, meta description, canonical link, OpenGraph tags,
 * Twitter card tags, and JSON-LD structured data dynamically for SEO optimization.
 */
export const useSeo = ({ 
  title, 
  description, 
  canonicalPath = "", 
  jsonLd = null,
  type = "website",
  noindex = false
}) => {
  useEffect(() => {
    const baseUrl = "https://sarva-ai-one.vercel.app";
    const currentPath = canonicalPath || window.location.pathname;
    const targetUrl = `${baseUrl}${currentPath === "/" ? "" : currentPath}`;

    // 1. Set Document Title
    if (title) {
      document.title = title;
    }

    // Helper function to set or create meta tag
    const setMetaTag = (selector, attributeName, attributeValue, contentValue) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // Robots meta tag
    if (noindex) {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('meta[name="robots"]', 'name', 'robots', 'index, follow');
    }

    // 2. Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', 'name', 'description', description);
      setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
      setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    // 3. OpenGraph Title & Twitter Title
    if (title) {
      setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
      setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    }

    // 4. OpenGraph URL, Type & Images
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', targetUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', `${baseUrl}/logo.jpg`);
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', `${baseUrl}/logo.jpg`);

    // 5. Set Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = targetUrl;

    // 6. JSON-LD Structured Data Injection
    const scriptId = "seo-json-ld-script";
    let existingScript = document.getElementById(scriptId);

    if (jsonLd) {
      if (!existingScript) {
        existingScript = document.createElement("script");
        existingScript.id = scriptId;
        existingScript.type = "application/ld+json";
        document.head.appendChild(existingScript);
      }
      existingScript.text = JSON.stringify(jsonLd);
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      // Clean up script on unmount if needed
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonicalPath, jsonLd, type, noindex]);
};

export default useSeo;
