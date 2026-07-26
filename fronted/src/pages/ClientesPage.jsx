import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import FormField from "../components/FormField";
import {
  IconUser, IconId, IconMail, IconPhone, IconForm, IconList, IconHistory, IconPlus,
} from "../components/formIcons";
import {
  listarClientes,
  registrarCliente,
  historialReservasPorCliente,
} from "../services/clientesService";

const ClientsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

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
    <div className="page-content page--clientes">
      <PageBanner
        theme="clientes"
        icon={<ClientsIcon />}
        title="Clientes"
        subtitle="Registra huéspedes y consulta su historial de estancias."
        stat={!loading ? { value: clientes.length, label: "Registrados" } : null}
      />

      <div className="page-layout-split">
        <div className="content-layout">
          <Panel
            className="panel--form"
            title="Nuevo huésped"
            subtitle="Completa los datos del cliente"
            icon={<IconForm />}
          >
            <form onSubmit={handleRegistrar} className="form-stack">
              <FormField
                label="Nombre completo"
                name="nombre"
                icon={<IconUser />}
                placeholder="Nombre y apellido"
                value={form.nombre}
                onChange={handleChange}
                required
              />
              <FormField
                label="Cédula / Pasaporte"
                name="cedula"
                icon={<IconId />}
                placeholder="0000000000"
                value={form.cedula}
                onChange={handleChange}
                required
              />
              <FormField
                label="Correo electrónico"
                name="email"
                type="email"
                icon={<IconMail />}
                placeholder="cliente@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
              <FormField
                label="Teléfono"
                name="telefono"
                icon={<IconPhone />}
                placeholder="0987654321"
                value={form.telefono}
                onChange={handleChange}
                hint="Campo opcional para contacto directo"
              />
              <div className="form-divider" />
              <div className="form-submit">
                <button type="submit" className="btn btn-primary">
                  <IconPlus /> Registrar cliente
                </button>
              </div>
            </form>
          </Panel>
        </div>

        <div className="content-layout">
          {error && <p className="error-text">{error}</p>}

          <Panel
            title="Directorio de huéspedes"
            subtitle="Listado completo de clientes registrados"
            icon={<IconList />}
            count={!loading ? `${clientes.length} clientes` : null}
            noPadding
          >
            {loading ? (
              <LoadingSpinner message="Cargando clientes..." />
            ) : (
              <DataTable
                columns={COLUMNS}
                data={clientes}
                actions={(row) => (
                  <button className="btn btn-action btn-sm" onClick={() => verHistorial(row)}>
                    <IconHistory /> Historial
                  </button>
                )}
              />
            )}
          </Panel>

          {clienteSeleccionado && (
            <div className="subsection">
              <div className="subsection-head">
                <h2>
                  <IconHistory />
                  Historial de {clienteSeleccionado.nombre}
                </h2>
                <button
                  type="button"
                  className="subsection-close"
                  onClick={() => setClienteSeleccionado(null)}
                  aria-label="Cerrar historial"
                >
                  ×
                </button>
              </div>
              <div className="subsection-body">
                {cargandoReservas ? (
                  <LoadingSpinner message="Cargando reservas..." />
                ) : (
                  <DataTable
                    columns={RESERVA_COLUMNS}
                    data={reservas}
                    emptyMessage="Este cliente no tiene reservas registradas."
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
