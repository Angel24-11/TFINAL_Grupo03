import React from "react";

export default function LoadingSpinner({ message = "Cargando..." }) {
  return (
    <div className="loading-state">
      <div className="spinner" role="status" aria-label="Cargando" />
      <span>{message}</span>
    </div>
  );
}
