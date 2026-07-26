import React from "react";

export default function Panel({ title, subtitle, count, icon, children, noPadding, className = "" }) {
  return (
    <div className={`panel${className ? ` ${className}` : ""}`}>
      <div className="panel-head">
        <div className="panel-head-left">
          {icon && <div className="panel-head-icon">{icon}</div>}
          <div>
            <h2>{title}</h2>
            {subtitle && <p className="panel-head-sub">{subtitle}</p>}
          </div>
        </div>
        {count != null && <span className="panel-badge">{count}</span>}
      </div>
      <div className={`panel-body${noPadding ? " panel-body--flush" : ""}`}>
        {children}
      </div>
    </div>
  );
}
