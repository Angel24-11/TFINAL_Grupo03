import React from "react";

function renderCell(col, row) {
  const value = row[col.key];

  if (typeof value === "boolean") {
    return (
      <span className={`badge ${value ? "badge-success" : "badge-danger"}`}>
        {value ? "Sí" : "No"}
      </span>
    );
  }

  if (col.key === "estado") {
    const cls =
      value === "Disponible" || value === "disponible"
        ? "badge-success"
        : value === "Mantenimiento" || value === "mantenimiento"
        ? "badge-warning"
        : "badge-danger";
    return <span className={`badge ${cls}`}>{value}</span>;
  }

  if (col.key === "nombre") {
    const initial = (value || "?").charAt(0).toUpperCase();
    return (
      <span className="cell-user">
        <span className="cell-avatar">{initial}</span>
        <span className="cell-name">{value}</span>
      </span>
    );
  }

  if (col.key === "numero") {
    return <span className="cell-room">#{value}</span>;
  }

  if (col.key === "precio") {
    const num = Number(value);
    const formatted = Number.isFinite(num) ? num.toFixed(2) : value;
    return <span className="cell-price">${formatted}</span>;
  }

  if (col.key === "rol" || col.key === "tipo") {
    return <span className="cell-tag">{value}</span>;
  }

  if (col.key === "email") {
    return <span className="cell-muted">{value}</span>;
  }

  return value;
}

export default function DataTable({ columns, data, actions, emptyMessage = "Sin registros" }) {
  if (!data || data.length === 0) {
    return (
      <div className="table-empty">
        <div className="table-empty-icon">📋</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="table-section">
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions && <th className="th-actions">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={row.id ?? i} style={{ animationDelay: `${i * 0.04}s` }}>
                {columns.map((col) => (
                  <td key={col.key} data-col={col.key}>
                    {renderCell(col, row)}
                  </td>
                ))}
                {actions && <td className="td-actions">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
