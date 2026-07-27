import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import { listarPagos, registrarPago } from "../services/pagosService";

const PayIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
    <line x1="1" y1="10" x2="23" y2="10"/>
  </svg>
);

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "factura_id", label: "Factura" },
  { key: "monto_fmt", label: "Monto" },
  { key: "metodo_pago", label: "Método" },
  { key: "fecha", label: "Fecha" },
];

const METODOS = ["Efectivo", "Tarjeta", "Transferencia"];

export default function PagosPage() {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [form, setForm] = useState({ facturaId: "", monto: "", metodoPago: "Efectivo" });

  const cargarPagos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarPagos();
      setPagos(
        data.map((p) => ({
          ...p,
          monto_fmt: `$${Number(p.monto).toFixed(2)}`,
          fecha: p.fecha_pago ? p.fecha_pago.split("T")[0] : "",
        }))
      );
    } catch (err) {
      setError("No se pudo cargar la lista de pagos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPagos();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);
    if (!form.facturaId || !form.monto) {
      setError("Completa la factura y el monto a pagar.");
      return;
    }
    try {
      const pago = await registrarPago(form);
      setExito(`Pago #${pago.id} registrado por $${Number(pago.monto).toFixed(2)} (${pago.metodo_pago}).`);
      setForm({ facturaId: "", monto: "", metodoPago: "Efectivo" });
      cargarPagos();
    } catch (err) {
      const detalle = err.response?.data?.detail;
      setError(typeof detalle === "string" ? detalle : "No se pudo registrar el pago.");
    }
  };

  return (
    <div className="page-content page--pagos">
      <PageBanner
        theme="pagos"
        icon={<PayIcon />}
        title="Pagos"
        subtitle="Registra pagos sobre facturas emitidas y genera su comprobante."
        stat={{ value: pagos.length, label: "Registrados" }}
      />

      <Panel
        title="Registrar pago"
        subtitle="Indica la factura, el monto y el método de pago."
        icon={<PayIcon />}
      >
        <form onSubmit={handleRegistrar} style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <input
            type="number"
            min="1"
            name="facturaId"
            placeholder="ID de factura"
            value={form.facturaId}
            onChange={handleChange}
          />
          <input
            type="number"
            min="0"
            step="0.01"
            name="monto"
            placeholder="Monto ($)"
            value={form.monto}
            onChange={handleChange}
          />
          <select name="metodoPago" value={form.metodoPago} onChange={handleChange}>
            {METODOS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <button type="submit">Registrar pago [RF11]</button>
        </form>
        {error && <p className="form-error">{error}</p>}
        {exito && <p className="form-success">{exito}</p>}
      </Panel>

      <Panel
        title="Pagos registrados"
        subtitle="Historial de pagos del sistema"
        count={`${pagos.length} pagos`}
        noPadding
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={COLUMNS} data={pagos} emptyMessage="No hay pagos registrados" />
        )}
      </Panel>
    </div>
  );
}