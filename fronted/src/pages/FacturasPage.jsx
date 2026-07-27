import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import { listarFacturas, emitirFactura } from "../services/facturasService";

const InvoiceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "reserva_id", label: "Reserva" },
  { key: "fecha", label: "Emisión" },
  { key: "subtotal_fmt", label: "Subtotal" },
  { key: "impuestos_fmt", label: "Impuestos" },
  { key: "total_fmt", label: "Total" },
  { key: "estado", label: "Estado" },
];

export default function FacturasPage() {
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [reservaId, setReservaId] = useState("");

  const cargarFacturas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarFacturas();
      setFacturas(
        data.map((f) => ({
          ...f,
          fecha: f.fecha_emision ? f.fecha_emision.split("T")[0] : "",
          subtotal_fmt: `$${Number(f.subtotal).toFixed(2)}`,
          impuestos_fmt: `$${Number(f.impuestos).toFixed(2)}`,
          total_fmt: `$${Number(f.total).toFixed(2)}`,
        }))
      );
    } catch (err) {
      setError("No se pudo cargar la lista de facturas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarFacturas();
  }, []);

  const handleEmitir = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);
    if (!reservaId) {
      setError("Ingresa el ID de una reserva completada.");
      return;
    }
    try {
      const factura = await emitirFactura(reservaId);
      setExito(`Factura #${factura.id} emitida por $${Number(factura.total).toFixed(2)}.`);
      setReservaId("");
      cargarFacturas();
    } catch (err) {
      const detalle = err.response?.data?.detail;
      setError(typeof detalle === "string" ? detalle : "No se pudo emitir la factura.");
    }
  };

  return (
    <div className="page-content page--facturas">
      <PageBanner
        theme="facturas"
        icon={<InvoiceIcon />}
        title="Facturación"
        subtitle="Emite facturas desde reservas completadas y consulta su detalle."
        stat={{ value: facturas.length, label: "Emitidas" }}
      />

      <Panel
        title="Emitir factura"
        subtitle="Indica la reserva completada (check-out realizado) a facturar."
        icon={<InvoiceIcon />}
      >
        <form onSubmit={handleEmitir} style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <input
            type="number"
            min="1"
            placeholder="ID de reserva"
            value={reservaId}
            onChange={(e) => setReservaId(e.target.value)}
          />
          <button type="submit">Emitir factura [RF10]</button>
        </form>
        {error && <p className="form-error">{error}</p>}
        {exito && <p className="form-success">{exito}</p>}
      </Panel>

      <Panel
        title="Facturas emitidas"
        subtitle="Listado completo de facturas del sistema"
        count={`${facturas.length} facturas`}
        noPadding
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={COLUMNS} data={facturas} emptyMessage="No hay facturas registradas" />
        )}
      </Panel>
    </div>
  );
}