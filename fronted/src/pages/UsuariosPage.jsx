import React, { useEffect, useState } from "react";
import DataTable from "../components/DataTable";
import ConfirmModal from "../components/ConfirmModal";
import LoadingSpinner from "../components/LoadingSpinner";
import PageBanner from "../components/PageBanner";
import Panel from "../components/Panel";
import FormField from "../components/FormField";
import {
  IconUser, IconMail, IconKey, IconShield, IconForm, IconList, IconPlus,
} from "../components/formIcons";
import {
  listarUsuarios,
  crearUsuario,
  deshabilitarUsuario,
} from "../services/usuariosService";

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

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

  const activos = usuarios.filter((u) => u.activo).length;

  return (
    <div className="page-content page--usuarios">
      <PageBanner
        theme="usuarios"
        icon={<UsersIcon />}
        title="Usuarios"
        subtitle="Administra el personal, roles y permisos de acceso al sistema."
        stat={!loading ? { value: activos, label: "Activos" } : null}
      />

      <Panel
        className="panel--form"
        title="Registrar nuevo usuario"
        subtitle="Datos de acceso y rol del personal"
        icon={<IconForm />}
      >
        <form onSubmit={handleCrear} className="form-grid">
          <FormField
            label="Nombre completo"
            name="nombre"
            icon={<IconUser />}
            placeholder="Ej. Juan Pérez"
            value={form.nombre}
            onChange={handleChange}
            required
          />
          <FormField
            label="Correo electrónico"
            name="email"
            type="email"
            icon={<IconMail />}
            placeholder="usuario@hotel.com"
            value={form.email}
            onChange={handleChange}
            required
          />
          <FormField
            label="Contraseña"
            name="password"
            type="password"
            icon={<IconKey />}
            placeholder="Mínimo 6 caracteres"
            value={form.password}
            onChange={handleChange}
            required
          />
          <FormField label="Rol del usuario" name="rol" icon={<IconShield />} required>
            <select id="rol" name="rol" value={form.rol} onChange={handleChange}>
              <option value="administrador">Administrador</option>
              <option value="recepcionista">Recepcionista</option>
              <option value="contador">Contador</option>
            </select>
          </FormField>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              <IconPlus /> Crear usuario
            </button>
          </div>
        </form>
      </Panel>

      {error && <p className="error-text">{error}</p>}

      <Panel
        title="Equipo registrado"
        subtitle="Personal con acceso al sistema"
        icon={<IconList />}
        count={!loading ? `${usuarios.length} usuarios` : null}
        noPadding
      >
        {loading ? (
          <LoadingSpinner message="Cargando usuarios..." />
        ) : (
          <DataTable
            columns={COLUMNS}
            data={usuarios}
            actions={(row) => (
              <button
                className="btn btn-danger btn-sm"
                disabled={!row.activo}
                onClick={() => setConfirmId(row.id)}
              >
                Deshabilitar
              </button>
            )}
          />
        )}
      </Panel>

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
