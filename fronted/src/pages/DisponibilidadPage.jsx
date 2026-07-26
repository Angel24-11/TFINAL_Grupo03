import React, { useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import FormField from "../components/FormField";
import {
  IconCalendar, IconSearch, IconList, IconShield,
} from "../components/formIcons";
import { consultarDisponibilidad } from "../services/habitacionesService";

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);

const COLUMNS = [
  { key: "numero", label: "Número" },
  { key: "tipo", label: "Tipo" },
  { key: "precio", label: "Precio / noche" },
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
    <div className="page-content page--disponibilidad">
      <PageBanner
        theme="disponibilidad"
        icon={<CalendarIcon />}
        title="Disponibilidad"
        subtitle="Consulta habitaciones libres según fechas y tipo."
        stat={buscado && !loading ? { value: resultados.length, label: "Encontradas" } : null}
      />

      <Panel
        className="panel--form"
        title="Parámetros de búsqueda"
        subtitle="Selecciona el rango de fechas y tipo de habitación"
        icon={<IconSearch />}
      >
        <form onSubmit={handleBuscar} className="search-bar">
          <FormField label="Fecha de entrada" name="fechaInicio" icon={<IconCalendar />} required>
            <input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              value={filtros.fechaInicio}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Fecha de salida" name="fechaFin" icon={<IconCalendar />} required>
            <input
              id="fechaFin"
              name="fechaFin"
              type="date"
              value={filtros.fechaFin}
              onChange={handleChange}
              required
            />
          </FormField>
          <FormField label="Tipo de habitación" name="tipo" icon={<IconShield />}>
            <select id="tipo" name="tipo" value={filtros.tipo} onChange={handleChange}>
              <option value="">Todos los tipos</option>
              <option value="simple">Simple</option>
              <option value="doble">Doble</option>
              <option value="suite">Suite</option>
            </select>
          </FormField>
          <button type="submit" className="btn btn-primary">
            <IconSearch /> Buscar
          </button>
        </form>
      </Panel>

      {error && <p className="error-text">{error}</p>}
      {loading && <LoadingSpinner message="Buscando habitaciones disponibles..." />}

      {buscado && !loading && (
        <Panel
          title="Habitaciones disponibles"
          subtitle="Resultados para el rango seleccionado"
          icon={<IconList />}
          count={`${resultados.length} resultados`}
          noPadding
        >
          <DataTable
            columns={COLUMNS}
            data={resultados}
            emptyMessage="No hay habitaciones disponibles para ese rango de fechas."
          />
        </Panel>
      )}
    </div>
  );
}
