import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import { listarMovimientos } from "../services/movimientosService";

const LedgerIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "tipo", label: "Tipo" },
  { key: "descripcion", label: "Descripción" },
  { key: "monto_fmt", label: "Monto" },
  { key: "fecha", label: "Fecha" },
];

export default function MovimientosPage() {
  const [movimientos, setMovimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const cargarMovimientos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarMovimientos();
      setMovimientos(
        data.map((m) => ({
          ...m,
          monto_fmt: `$${Number(m.monto).toFixed(2)}`,
          fecha: m.fecha ? m.fecha.split("T")[0] : "",
        }))
      );
    } catch (err) {
      setError("No se pudo cargar el diario contable.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMovimientos();
  }, []);

  const ingresos = movimientos.filter((m) => (m.tipo || "").toLowerCase() === "ingreso").length;

  return (
    <div className="page-content page--movimientos">
      <PageBanner
        theme="movimientos"
        icon={<LedgerIcon />}
        title="Diario contable"
        subtitle="Movimientos de ingresos y egresos generados por el sistema."
        stat={{ value: movimientos.length, label: "Movimientos" }}
      />

      <Panel
        title="Movimientos registrados"
        subtitle={`${ingresos} ingresos de ${movimientos.length} movimientos`}
        count={`${movimientos.length} registros`}
        noPadding
      >
        {error && <p className="form-error">{error}</p>}
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={COLUMNS} data={movimientos} emptyMessage="No hay movimientos contables" />
        )}
      </Panel>
    </div>
  );
}