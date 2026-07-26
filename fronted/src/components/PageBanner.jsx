import React from "react";

export default function PageBanner({ icon, title, subtitle, stat, theme }) {
  return (
    <div className={`page-banner page-banner--${theme}`}>
      <div className="page-banner-icon">{icon}</div>
      <div className="page-banner-text">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      {stat && (
        <div className="page-banner-stat">
          <span className="page-banner-stat-value">{stat.value}</span>
          <span className="page-banner-stat-label">{stat.label}</span>
        </div>
      )}
    </div>
  );
}
