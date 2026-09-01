import { useEffect, useState } from "react";
import { FiList } from "react-icons/fi";

/**
 * Accessible Table of Contents component for long-form technical articles.
 * Dynamically queries article headings and renders an interactive anchor navigation menu.
 */
export function TableOfContents({ articleSelector = ".article-body-content" }) {
  const [headings, setHeadings] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const container = document.querySelector(articleSelector);
      if (!container) return;

      const headingNodes = Array.from(container.querySelectorAll("h2, h3"));
      const items = headingNodes.map((h, index) => {
        if (!h.id) {
          h.id = `section-${index + 1}-${h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
        }
        return {
          id: h.id,
          text: h.textContent,
          level: h.tagName.toLowerCase()
        };
      });

      setHeadings(items);
    }, 0);

    return () => clearTimeout(timer);
  }, [articleSelector]);

  if (headings.length < 2) return null;

  return (
    <nav className="toc-container" aria-label="Table of contents" style={{
      background: "var(--bg-card)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: "20px 24px",
      margin: "24px 0 32px",
      boxShadow: "var(--shadow-sm)"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        fontSize: "1rem",
        fontWeight: "700",
        color: "var(--text-primary)",
        marginBottom: "12px"
      }}>
        <FiList style={{ color: "var(--accent)" }} aria-hidden="true" />
        <span>Table of Contents</span>
      </div>
      <ol style={{
        margin: 0,
        paddingLeft: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        fontSize: "0.9rem"
      }}>
        {headings.map((item) => (
          <li
            key={item.id}
            style={{
              paddingLeft: item.level === "h3" ? "12px" : "0",
              listStyleType: item.level === "h3" ? "circle" : "decimal"
            }}
          >
            <a
              href={`#${item.id}`}
              style={{
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.15s ease"
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = "var(--accent)"}
              onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default TableOfContents;
