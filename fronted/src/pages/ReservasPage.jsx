import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import { listarReservas, crearReserva, hacerCheckin, hacerCheckout } from "../services/reservasService";
import { listarClientes } from "../services/clientesService";
import { listarHabitaciones } from "../services/habitacionesService";

const BookingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/><path d="M9 16l2 2 4-4"/>
  </svg>
);

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "cliente", label: "Cliente" },
  { key: "habitacion", label: "Habitación" },
  { key: "checkin_fmt", label: "Check-in" },
  { key: "checkout_fmt", label: "Check-out" },
  { key: "estado", label: "Estado" },
];

export default function ReservasPage() {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);
  const [form, setForm] = useState({ clienteId: "", habitacionId: "", fechaCheckin: "", fechaCheckout: "" });

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const [resReservas, resClientes, resHabitaciones] = await Promise.all([
        listarReservas(),
        listarClientes(),
        listarHabitaciones(),
      ]);
      setClientes(resClientes);
      setHabitaciones(resHabitaciones);
      const nombreCliente = (id) => resClientes.find((c) => c.id === id)?.nombre || `#${id}`;
      const numHabitacion = (id) => resHabitaciones.find((h) => h.id === id)?.numero || `#${id}`;
      setReservas(
        resReservas.map((r) => ({
          ...r,
          cliente: nombreCliente(r.cliente_id),
          habitacion: numHabitacion(r.habitacion_id),
          checkin_fmt: r.fecha_checkin ? r.fecha_checkin.replace("T", " ").slice(0, 16) : "",
          checkout_fmt: r.fecha_checkout ? r.fecha_checkout.replace("T", " ").slice(0, 16) : "",
        }))
      );
    } catch {
      setError("No se pudieron cargar las reservas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCrear = async (e) => {
    e.preventDefault();
    setError(null);
    setExito(null);
    if (!form.clienteId || !form.habitacionId || !form.fechaCheckin || !form.fechaCheckout) {
      setError("Completa todos los campos de la reserva.");
      return;
    }
    try {
      const reserva = await crearReserva(form);
      setExito(`Reserva #${reserva.id} creada en estado ${reserva.estado}.`);
      setForm({ clienteId: "", habitacionId: "", fechaCheckin: "", fechaCheckout: "" });
      cargarDatos();
    } catch (err) {
      const detalle = err.response?.data?.detail;
      setError(typeof detalle === "string" ? detalle : "No se pudo crear la reserva.");
    }
  };

  const accion = async (fn, reservaId, mensajeOk) => {
    setError(null);
    setExito(null);
    try {
      await fn(reservaId);
      setExito(mensajeOk);
      cargarDatos();
    } catch (err) {
      const detalle = err.response?.data?.detail;
      setError(typeof detalle === "string" ? detalle : "No se pudo completar la operación.");
    }
  };

  const renderAcciones = (row) => {
    const estado = (row.estado || "").toLowerCase();
    if (estado.includes("activa")) {
      return (
        <button onClick={() => accion(hacerCheckin, row.id, `Check-in de la reserva #${row.id} realizado [RF08].`)}>
          Check-in
        </button>
      );
    }
    if (estado.includes("check")) {
      return (
        <button onClick={() => accion(hacerCheckout, row.id, `Check-out de la reserva #${row.id} realizado; habitación liberada [RF09].`)}>
          Check-out
        </button>
      );
    }
    return <span>—</span>;
  };

  return (
    <div className="page-content page--reservas">
      <PageBanner
        theme="reservas"
        icon={<BookingIcon />}
        title="Reservas"
        subtitle="Ciclo completo: creación, check-in y check-out de reservas."
        stat={{ value: reservas.length, label: "Reservas" }}
      />

      <Panel
        title="Nueva reserva"
        subtitle="Selecciona el huésped, la habitación y las fechas de estadía [RF06]."
        icon={<BookingIcon />}
      >
        <form onSubmit={handleCrear} style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <select name="clienteId" value={form.clienteId} onChange={handleChange}>
            <option value="">— Cliente —</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre} ({c.cedula})</option>
            ))}
          </select>
          <select name="habitacionId" value={form.habitacionId} onChange={handleChange}>
            <option value="">— Habitación —</option>
            {habitaciones.map((h) => (
              <option key={h.id} value={h.id}>{h.numero} · {h.tipo} · ${h.precio_noche}/noche</option>
            ))}
          </select>
          <label>Check-in <input type="datetime-local" name="fechaCheckin" value={form.fechaCheckin} onChange={handleChange} /></label>
          <label>Check-out <input type="datetime-local" name="fechaCheckout" value={form.fechaCheckout} onChange={handleChange} /></label>
          <button type="submit">Crear reserva</button>
        </form>
        {error && <p className="form-error">{error}</p>}
        {exito && <p className="form-success">{exito}</p>}
      </Panel>

      <Panel
        title="Reservas registradas"
        subtitle="Usa las acciones para ejecutar el check-in y check-out"
        count={`${reservas.length} reservas`}
        noPadding
      >
        {loading ? (
          <LoadingSpinner />
        ) : (
          <DataTable columns={COLUMNS} data={reservas} actions={renderAcciones} emptyMessage="No hay reservas registradas" />
        )}
      </Panel>
    </div>
  );
}