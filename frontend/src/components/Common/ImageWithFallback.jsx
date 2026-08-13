import { useState, useEffect } from "react";

/**
 * ImageWithFallback component
 * Guarantees zero broken images. When an image fails to load or URL is absent/invalid,
 * it renders a deterministic initials badge (e.g. "IGT Solutions" -> "I", "Kartik Singh" -> "KS").
 */
function ImageWithFallback({ src, alt, fallbackText, className = "", style = {}, ...props }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const getInitials = (text) => {
    if (!text) return "S";
    const cleanText = text.trim();
    if (!cleanText) return "S";
    const parts = cleanText.split(/\s+/);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(fallbackText || alt || "SARVA AI");

  if (hasError || !src || src.includes("default.png") || src.includes("placeholder")) {
    return (
      <div
        className={`image-fallback-badge ${className}`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "700",
          background: "linear-gradient(135deg, var(--accent) 0%, #8b5cf6 55%, #ec4899 100%)",
          color: "#ffffff",
          borderRadius: "50%",
          userSelect: "none",
          fontSize: "0.85rem",
          letterSpacing: "0.5px",
          boxShadow: "var(--shadow-sm)",
          flexShrink: 0,
          ...style
        }}
        {...props}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt || "Image"}
      className={className}
      style={{ objectFit: "cover", flexShrink: 0, ...style }}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}

export default ImageWithFallback;
