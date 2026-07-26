import React from "react";

export default function DataTable({ columns, data, actions, emptyMessage = "Sin registros" }) {
  if (!data || data.length === 0) {
    return <p className="table-empty">{emptyMessage}</p>;
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id ?? i}>
              {columns.map((col) => (
                <td key={col.key}>
                  {typeof row[col.key] === "boolean" ? (
                    <span className={`badge ${row[col.key] ? "badge-success" : "badge-danger"}`}>
                      {row[col.key] ? "Sí" : "No"}
                    </span>
                  ) : col.key === "estado" ? (
                    <span className={`badge ${
                      row[col.key] === "Disponible" || row[col.key] === "disponible" 
                        ? "badge-success" 
                        : row[col.key] === "Mantenimiento" || row[col.key] === "mantenimiento"
                        ? "badge-warning" 
                        : "badge-danger"
                    }`}>
                      {row[col.key]}
                    </span>
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              {actions && <td>{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
