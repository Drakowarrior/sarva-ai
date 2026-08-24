import React from "react";
import { Link } from "react-router-dom";

/**
 * SeoBreadcrumbs component for visual breadcrumbs.
 * @param {Array<{ name: string, path: string }>} items - List of breadcrumb links
 */
const SeoBreadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        fontSize: "0.86rem",
        color: "var(--text-secondary)",
        marginBottom: "20px",
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "6px"
      }}
    >
      <Link
        to="/"
        style={{
          color: "var(--accent)",
          textDecoration: "none",
          fontWeight: "500"
        }}
      >
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <span style={{ color: "var(--border)", userSelect: "none" }}>/</span>
            {isLast ? (
              <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>
                {item.name}
              </span>
            ) : (
              <Link
                to={item.path}
                style={{
                  color: "var(--accent)",
                  textDecoration: "none",
                  fontWeight: "500"
                }}
              >
                {item.name}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default SeoBreadcrumbs;
