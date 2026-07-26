import React, { useState } from "react";
import DataTable from "../components/DataTable";
import { consultarDisponibilidad } from "../services/habitacionesService";

const COLUMNS = [
  { key: "numero", label: "Número" },
  { key: "tipo", label: "Tipo" },
  { key: "precio", label: "Precio" },
];

export default function DisponibilidadPage() {
  const [filtros, setFiltros] = useState({ fechaInicio: "", fechaFin: "", tipo: "" });
  const [resultados, setResultados] = useState([]);
  const [buscado, setBuscado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFiltros({ ...filtros, [e.target.name]: e.target.value });

  const handleBuscar = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await consultarDisponibilidad(filtros);
      setResultados(data);
      setBuscado(true);
    } catch (err) {
      setError("No se pudo consultar la disponibilidad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1>Consulta de Disponibilidad</h1>

      <form onSubmit={handleBuscar} className="form-inline">
        <label>
          Desde:
          <input
            name="fechaInicio"
            type="date"
            value={filtros.fechaInicio}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Hasta:
          <input
            name="fechaFin"
            type="date"
            value={filtros.fechaFin}
            onChange={handleChange}
            required
          />
        </label>
        <select name="tipo" value={filtros.tipo} onChange={handleChange}>
          <option value="">Todos los tipos</option>
          <option value="simple">Simple</option>
          <option value="doble">Doble</option>
          <option value="suite">Suite</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Buscar disponibilidad
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading && <p>Buscando...</p>}
      {buscado && !loading && (
        <DataTable
          columns={COLUMNS}
          data={resultados}
          emptyMessage="No hay habitaciones disponibles para ese rango de fechas."
        />
      )}
    </div>
  );
}
