import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import { libroDiario, registroHuespedes, reporteOcupacion } from "../services/reportesService";

const ReportIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
);

const COLS_DIARIO = [
  { key: "id", label: "ID" },
  { key: "tipo", label: "Tipo" },
  { key: "descripcion", label: "Descripción" },
  { key: "monto_fmt", label: "Monto" },
  { key: "fecha_fmt", label: "Fecha" },
];

const COLS_HUESPEDES = [
  { key: "reserva_id", label: "Reserva" },
  { key: "cliente_nombre", label: "Huésped" },
  { key: "cliente_cedula", label: "Cédula" },
  { key: "habitacion_numero", label: "Habitación" },
  { key: "checkin_fmt", label: "Check-in" },
  { key: "checkout_fmt", label: "Check-out" },
  { key: "estado", label: "Estado" },
];

const COLS_OCUPACION = [
  { key: "tipo", label: "Tipo de habitación" },
  { key: "total_habitaciones", label: "Total" },
  { key: "ocupadas", label: "Ocupadas" },
  { key: "porcentaje_fmt", label: "% Ocupación" },
];

const hoy = new Date().toISOString().split("T")[0];
const haceUnMes = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

export default function ReportesPage() {
  const [fechas, setFechas] = useState({ inicio: haceUnMes, fin: hoy });
  const [diario, setDiario] = useState(null);
  const [huespedes, setHuespedes] = useState(null);
  const [ocupacion, setOcupacion] = useState(null);
  const [loadingOcupacion, setLoadingOcupacion] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    reporteOcupacion()
      .then(setOcupacion)
      .catch(() => setError("No se pudo cargar el reporte de ocupación."))
      .finally(() => setLoadingOcupacion(false));
  }, []);

  const handleFecha = (e) => setFechas({ ...fechas, [e.target.name]: e.target.value });

  const generarDiario = async () => {
    setError(null);
    try {
      const data = await libroDiario(fechas.inicio, fechas.fin);
      setDiario({
        ...data,
        movimientos: data.movimientos.map((m) => ({
          ...m,
          monto_fmt: `$${Number(m.monto).toFixed(2)}`,
          fecha_fmt: m.fecha ? m.fecha.split("T")[0] : "",
        })),
      });
    } catch {
      setError("No se pudo generar el libro diario.");
    }
  };

  const generarHuespedes = async () => {
    setError(null);
    try {
      const data = await registroHuespedes(fechas.inicio, fechas.fin);
      setHuespedes({
        ...data,
        huespedes: data.huespedes.map((h) => ({
          ...h,
          checkin_fmt: h.fecha_checkin ? h.fecha_checkin.split("T")[0] : "",
          checkout_fmt: h.fecha_checkout ? h.fecha_checkout.split("T")[0] : "",
        })),
      });
    } catch {
      setError("No se pudo generar el registro de huéspedes.");
    }
  };

  return (
    <div className="page-content page--reportes">
      <PageBanner
        theme="reportes"
        icon={<ReportIcon />}
        title="Reportes"
        subtitle="Libro diario, registro de huéspedes y ocupación por tipo."
        stat={ocupacion ? { value: `${ocupacion.porcentaje_general}%`, label: "Ocupación" } : undefined}
      />

      <Panel
        title="Período de consulta"
        subtitle="Rango de fechas para el libro diario y el registro de huéspedes."
        icon={<ReportIcon />}
      >
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <label>Desde <input type="date" name="inicio" value={fechas.inicio} onChange={handleFecha} /></label>
          <label>Hasta <input type="date" name="fin" value={fechas.fin} onChange={handleFecha} /></label>
          <button onClick={generarDiario}>Libro diario [RF13]</button>
          <button onClick={generarHuespedes}>Registro de huéspedes [RF14]</button>
        </div>
        {error && <p className="form-error">{error}</p>}
      </Panel>

      {diario && (
        <Panel
          title="Libro diario"
          subtitle={`Ingresos: $${Number(diario.total_ingresos).toFixed(2)} · Egresos: $${Number(diario.total_egresos).toFixed(2)} · Balance: $${Number(diario.balance).toFixed(2)}`}
          count={`${diario.movimientos.length} movimientos`}
          noPadding
        >
          <DataTable columns={COLS_DIARIO} data={diario.movimientos} emptyMessage="Sin movimientos en el período" />
        </Panel>
      )}

      {huespedes && (
        <Panel
          title="Registro de huéspedes"
          subtitle={`Estadías en el período consultado`}
          count={`${huespedes.total_estadias} estadías`}
          noPadding
        >
          <DataTable columns={COLS_HUESPEDES} data={huespedes.huespedes} emptyMessage="Sin estadías en el período" />
        </Panel>
      )}

      <Panel
        title="Ocupación por tipo de habitación"
        subtitle={ocupacion ? `${ocupacion.total_ocupadas} de ${ocupacion.total_habitaciones} habitaciones ocupadas (${ocupacion.porcentaje_general}% general)` : "Cargando..."}
        noPadding
      >
        {loadingOcupacion ? (
          <LoadingSpinner />
        ) : ocupacion ? (
          <DataTable
            columns={COLS_OCUPACION}
            data={ocupacion.detalle_por_tipo.map((t) => ({
              ...t,
              porcentaje_fmt: `${t.porcentaje_ocupacion}%`,
            }))}
            emptyMessage="Sin habitaciones registradas"
          />
        ) : null}
      </Panel>
    </div>
  );
}