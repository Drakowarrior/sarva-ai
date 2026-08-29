import React from "react";
import { Link } from "react-router-dom";

/**
 * SeoBreadcrumbs component for visual breadcrumbs.
 * @param {Array<{ name: string, path: string }>} items - List of breadcrumb links
 */
const SeoBreadcrumbs = ({ items = [] }) => {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="seo-breadcrumb">
      <Link to="/" className="breadcrumb-link">
        Home
      </Link>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <span className="breadcrumb-separator" aria-hidden="true">/</span>
            {isLast ? (
              <span className="breadcrumb-current" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link to={item.path} className="breadcrumb-link">
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
