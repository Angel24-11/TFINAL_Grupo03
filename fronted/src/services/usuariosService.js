import api from "./api";

export const listarUsuarios = async () => {
  const { data } = await api.get("/usuarios/");
  return data.map(u => ({
    ...u,
    email: u.correo,
    activo: true // El backend no retorna un campo "activo", asumimos true para posibilitar deshabilitar
  }));
};

export const crearUsuario = async (usuario) => {
  const payload = {
    nombre: usuario.nombre,
    correo: usuario.email,
    password: usuario.password,
    rol: usuario.rol ? usuario.rol.charAt(0).toUpperCase() + usuario.rol.slice(1) : "Recepcionista"
  };
  const { data } = await api.post("/usuarios/", payload);
  return data;
};

export const deshabilitarUsuario = async (id) => {
  // El backend implementa DELETE /api/v1/usuarios/{usuario_id} para deshabilitar
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
};

export const obtenerUsuario = async (id) => {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
};
