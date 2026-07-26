import api from "./api";

export const listarHabitaciones = async () => {
  const { data } = await api.get("/habitaciones/");
  return data.map(h => ({
    ...h,
    precio: h.precio_noche
  }));
};

export const registrarHabitacion = async (habitacion) => {
  const payload = {
    numero: habitacion.numero,
    tipo: habitacion.tipo ? habitacion.tipo.charAt(0).toUpperCase() + habitacion.tipo.slice(1) : "Simple",
    precio_noche: habitacion.precio,
    estado: habitacion.estado ? habitacion.estado.charAt(0).toUpperCase() + habitacion.estado.slice(1) : "Disponible"
  };
  const { data } = await api.post("/habitaciones/", payload);
  return data;
};

export const consultarDisponibilidad = async ({ fechaInicio, fechaFin, tipo }) => {
  const params = {
    fecha_entrada: fechaInicio ? `${fechaInicio}T00:00:00` : undefined,
    fecha_salida: fechaFin ? `${fechaFin}T00:00:00` : undefined,
  };
  if (tipo) {
    params.tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);
  }
  const { data } = await api.get("/habitaciones/disponibilidad", { params });
  return data.map(h => ({
    ...h,
    precio: h.precio_noche
  }));
};
