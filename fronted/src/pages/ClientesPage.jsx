import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import {
  listarClientes,
  registrarCliente,
  historialReservasPorCliente,
} from "../services/clientesService";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "nombre", label: "Nombre" },
  { key: "cedula", label: "Cédula" },
  { key: "email", label: "Email" },
  { key: "telefono", label: "Teléfono" },
];

const RESERVA_COLUMNS = [
  { key: "id", label: "Reserva" },
  { key: "habitacion", label: "Habitación" },
  { key: "fecha_inicio", label: "Desde" },
  { key: "fecha_fin", label: "Hasta" },
  { key: "estado", label: "Estado" },
];

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: "", cedula: "", email: "", telefono: "" });

  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [cargandoReservas, setCargandoReservas] = useState(false);

  const cargarClientes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarClientes();
      setClientes(data);
    } catch (err) {
      setError("No se pudo cargar la lista de clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarClientes();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await registrarCliente(form);
      setForm({ nombre: "", cedula: "", email: "", telefono: "" });
      cargarClientes();
    } catch (err) {
      setError("No se pudo registrar el cliente.");
    }
  };

  const verHistorial = async (cliente) => {
    setClienteSeleccionado(cliente);
    setCargandoReservas(true);
    try {
      const data = await historialReservasPorCliente(cliente.id);
      setReservas(data);
    } catch (err) {
      setError("No se pudo cargar el historial de reservas.");
    } finally {
      setCargandoReservas(false);
    }
  };

  return (
    <div className="page">
      <h1>Gestión de Clientes</h1>

      <form onSubmit={handleRegistrar} className="form-inline">
        <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
        <input name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} />
        <button type="submit" className="btn btn-primary">
          Registrar cliente
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataTable
          columns={COLUMNS}
          data={clientes}
          actions={(row) => (
            <button className="btn btn-secondary" onClick={() => verHistorial(row)}>
              Ver historial
            </button>
          )}
        />
      )}

      {clienteSeleccionado && (
        <div className="subsection">
          <h2>Historial de reservas — {clienteSeleccionado.nombre}</h2>
          {cargandoReservas ? (
            <p>Cargando reservas...</p>
          ) : (
            <DataTable
              columns={RESERVA_COLUMNS}
              data={reservas}
              emptyMessage="Este cliente no tiene reservas registradas."
            />
          )}
        </div>
      )}
    </div>
  );
}
