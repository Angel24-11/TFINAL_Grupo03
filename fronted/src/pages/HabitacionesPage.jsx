import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import { listarHabitaciones, registrarHabitacion } from "../services/habitacionesService";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "numero", label: "Número" },
  { key: "tipo", label: "Tipo" },
  { key: "precio", label: "Precio" },
  { key: "estado", label: "Estado" },
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

  const handleRegistrar = async (e) => {
    e.preventDefault();
    try {
      await registrarHabitacion({ ...form, precio: Number(form.precio) });
      setForm({ numero: "", tipo: "simple", precio: "", estado: "disponible" });
      cargarHabitaciones();
    } catch (err) {
      setError("No se pudo registrar la habitación.");
    }
  };

  return (
    <div className="page">
      <h1>Gestión de Habitaciones</h1>

      <form onSubmit={handleRegistrar} className="form-inline">
        <input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required />
        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="simple">Simple</option>
          <option value="doble">Doble</option>
          <option value="suite">Suite</option>
        </select>
        <input
          name="precio"
          type="number"
          step="0.01"
          placeholder="Precio por noche"
          value={form.precio}
          onChange={handleChange}
          required
        />
        <select name="estado" value={form.estado} onChange={handleChange}>
          <option value="disponible">Disponible</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Registrar habitación
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading ? <p>Cargando...</p> : <DataTable columns={COLUMNS} data={habitaciones} />}
    </div>
  );
}
