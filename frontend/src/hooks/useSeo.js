import { useEffect } from "react";

/**
 * Single-source-of-truth Hook to manage document title, meta descriptions, canonical URLs,
 * OpenGraph & Twitter Card tags, and JSON-LD structured data dynamically.
 */
export const useSeo = ({ 
  title, 
  description, 
  canonicalPath = "", 
  canonical = "",
  jsonLd = null,
  structuredData = null,
  type = "website",
  image = null,
  noindex = false,
  robots = null
}) => {
  useEffect(() => {
    const baseUrl = "https://sarva-ai-one.vercel.app";
    const rawPath = canonical || canonicalPath || window.location.pathname;
    const pathWithoutOrigin = rawPath.startsWith("http")
      ? rawPath.replace(baseUrl, "")
      : rawPath;
    
    // Strip query parameters, hash fragments, and trailing slashes
    const strippedPath = pathWithoutOrigin.split("?")[0].split("#")[0].replace(/\/+$/, "");
    const normalizedPath = strippedPath === "" 
      ? "/" 
      : (strippedPath.startsWith("/") ? strippedPath : `/${strippedPath}`);

    const targetUrl = `${baseUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;
    const targetImage = image ? (image.startsWith("http") ? image : `${baseUrl}${image.startsWith("/") ? "" : "/"}${image}`) : `${baseUrl}/logo.jpg`;

    // 1. Set Document Title
    if (title) {
      document.title = title;
    }

    // Helper function to set or create meta tag safely
    const setMetaTag = (selector, attributeName, attributeValue, contentValue) => {
      if (!contentValue) return;
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", contentValue);
    };

    // 2. Robots meta tag
    let robotsValue = "index, follow";
    if (robots) {
      robotsValue = robots;
    } else if (noindex) {
      robotsValue = "noindex, follow";
    }
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsValue);

    // 3. Meta Description
    if (description) {
      setMetaTag('meta[name="description"]', 'name', 'description', description);
      setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
      setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    }

    // 4. OpenGraph Title & Twitter Title
    if (title) {
      setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
      setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    }

    // 5. OpenGraph & Twitter Metadata
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', targetUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', type);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', targetImage);
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', targetImage);

    // 6. Set Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.rel = "canonical";
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = targetUrl;

    // 7. JSON-LD Structured Data Injection
    const schemaPayload = jsonLd || structuredData;
    const scriptId = "seo-json-ld-script";
    let existingScript = document.getElementById(scriptId);

    if (schemaPayload) {
      if (!existingScript) {
        existingScript = document.createElement("script");
        existingScript.id = scriptId;
        existingScript.type = "application/ld+json";
        document.head.appendChild(existingScript);
      }
      existingScript.text = JSON.stringify(schemaPayload);
    } else if (existingScript) {
      existingScript.remove();
    }

    return () => {
      // Clean up dynamic script on unmount
      const scriptToRemove = document.getElementById(scriptId);
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, canonicalPath, canonical, jsonLd, structuredData, type, image, noindex, robots]);
};

export default useSeo;
