import api from "./api";

export const listarClientes = async () => {
  const { data } = await api.get("/clientes/");
  return data.map(c => ({
    ...c,
    email: c.correo
  }));
};

export const registrarCliente = async (cliente) => {
  const payload = {
    cedula: cliente.cedula,
    nombre: cliente.nombre,
    correo: cliente.email,
    telefono: cliente.telefono || "",
    direccion: cliente.direccion || "No especificada" // Dirección es obligatoria en el backend
  };
  const { data } = await api.post("/clientes/", payload);
  return data;
};

export const obtenerCliente = async (id) => {
  const { data } = await api.get(`/clientes/${id}`);
  return data;
};

export const historialReservasPorCliente = async (clienteId) => {
  const { data } = await api.get(`/clientes/${clienteId}/historial`);
  // Mapeamos a los nombres de atributos que espera DataTable de ClientesPage
  return (data.historial_reservas || []).map(r => ({
    ...r,
    habitacion: r.habitacion_id,
    fecha_inicio: r.fecha_checkin ? r.fecha_checkin.split("T")[0] : "",
    fecha_fin: r.fecha_checkout ? r.fecha_checkout.split("T")[0] : ""
  }));
};
