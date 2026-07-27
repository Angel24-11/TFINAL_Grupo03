import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import FormField from "../components/FormField";
import {
  IconHash, IconDollar, IconForm, IconList, IconPlus, IconShield,
} from "../components/formIcons";
import { listarHabitaciones, registrarHabitacion } from "../services/habitacionesService";

const RoomsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 10h18"/><path d="M3 14h18"/><rect x="3" y="6" width="18" height="12" rx="2"/>
    <path d="M7 6v12"/><path d="M17 6v12"/>
  </svg>
);

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "numero", label: "Número" },
  { key: "tipo", label: "Tipo" },
  { key: "precio", label: "Precio" },
  { key: "estado", label: "Estado" },
];

const TIPOS = [
  { value: "simple", label: "Simple" },
  { value: "doble", label: "Doble" },
  { value: "suite", label: "Suite" },
];

export default function HabitacionesPage() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ numero: "", tipo: "simple", precio: "", estado: "disponible" });

  const cargarHabitaciones = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarHabitaciones();
      setHabitaciones(data);
    } catch (err) {
      setError("No se pudo cargar la lista de habitaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHabitaciones();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const setTipo = (tipo) => setForm({ ...form, tipo });

  const handleRegistrar = async (e) => {
    e.preventDefault();
    setError(null);
    if (!form.numero || form.numero.trim() === "") {
      setError("El número de habitación es requerido.");
      return;
    }
    const precioNum = Number(form.precio);
    if (isNaN(precioNum) || precioNum <= 0) {
      setError("El precio por noche debe ser un número mayor a cero.");
      return;
    }
    try {
      await registrarHabitacion({ ...form, precio: precioNum });
      setForm({ numero: "", tipo: "simple", precio: "", estado: "disponible" });
      cargarHabitaciones();
    } catch (err) {
      setError("No se pudo registrar la habitación.");
    }
  };

  const disponibles = habitaciones.filter(
    (h) => h.estado === "disponible" || h.estado === "Disponible"
  ).length;

  return (
    <div className="page-content page--habitaciones">
      <PageBanner
        theme="habitaciones"
        icon={<RoomsIcon />}
        title="Habitaciones"
        subtitle="Administra el inventario, tipos y tarifas de habitaciones."
        stat={!loading ? { value: disponibles, label: "Disponibles" } : null}
      />

      <div className="page-layout-split">
        <div className="content-layout">
          <Panel
            className="panel--form"
            title="Agregar habitación"
            subtitle="Registra una nueva unidad al inventario"
            icon={<IconForm />}
          >
            <form onSubmit={handleRegistrar} className="form-stack">
              <FormField
                label="Número de habitación"
                name="numero"
                icon={<IconHash />}
                placeholder="Ej. 101"
                value={form.numero}
                onChange={handleChange}
                required
              />

              <div className="form-field">
                <span className="form-label">Tipo de habitación</span>
                <div className="room-chips">
                  {TIPOS.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`room-chip${form.tipo === t.value ? " active" : ""}`}
                      onClick={() => setTipo(t.value)}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                label="Precio por noche"
                name="precio"
                type="number"
                step="0.01"
                min="0"
                icon={<IconDollar />}
                placeholder="0.00"
                value={form.precio}
                onChange={handleChange}
                required
              />

              <FormField label="Estado inicial" name="estado" icon={<IconShield />} required>
                <select id="estado" name="estado" value={form.estado} onChange={handleChange}>
                  <option value="disponible">Disponible</option>
                  <option value="mantenimiento">Mantenimiento</option>
                </select>
              </FormField>

              <div className="form-divider" />
              <div className="form-submit">
                <button type="submit" className="btn btn-primary">
                  <IconPlus /> Registrar habitación
                </button>
              </div>
            </form>
          </Panel>
        </div>

        <div className="content-layout">
          {error && <p className="error-text">{error}</p>}

          <Panel
            title="Inventario completo"
            subtitle="Todas las habitaciones del hotel"
            icon={<IconList />}
            count={!loading ? `${habitaciones.length} habitaciones` : null}
            noPadding
          >
            {loading ? (
              <LoadingSpinner message="Cargando habitaciones..." />
            ) : (
              <DataTable columns={COLUMNS} data={habitaciones} />
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
