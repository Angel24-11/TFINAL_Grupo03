import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";
import {
  listarUsuarios,
  crearUsuario,
  deshabilitarUsuario,
} from "../services/usuariosService";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "nombre", label: "Nombre" },
  { key: "email", label: "Email" },
  { key: "rol", label: "Rol" },
  { key: "activo", label: "Activo" },
];

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ nombre: "", email: "", password: "", rol: "recepcionista" });
  const [confirmId, setConfirmId] = useState(null);

  const cargarUsuarios = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError("No se pudo cargar la lista de usuarios.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();
    try {
      await crearUsuario(form);
      setForm({ nombre: "", email: "", password: "", rol: "recepcionista" });
      cargarUsuarios();
    } catch (err) {
      setError("No se pudo crear el usuario.");
    }
  };

  const handleDeshabilitar = async () => {
    try {
      await deshabilitarUsuario(confirmId);
      setConfirmId(null);
      cargarUsuarios();
    } catch (err) {
      setError("No se pudo deshabilitar el usuario.");
    }
  };

  return (
    <div className="page">
      <h1>Gestión de Usuarios</h1>

      <form onSubmit={handleCrear} className="form-inline">
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <select name="rol" value={form.rol} onChange={handleChange}>
          <option value="administrador">Administrador</option>
          <option value="recepcionista">Recepcionista</option>
          <option value="contador">Contador</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Crear usuario
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <DataTable
          columns={COLUMNS}
          data={usuarios}
          actions={(row) => (
            <button
              className="btn btn-danger"
              disabled={!row.activo}
              onClick={() => setConfirmId(row.id)}
            >
              Deshabilitar
            </button>
          )}
        />
      )}

      <ConfirmModal
        open={confirmId !== null}
        title="Deshabilitar usuario"
        message="¿Seguro que deseas deshabilitar este usuario? No podrá iniciar sesión."
        onConfirm={handleDeshabilitar}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
