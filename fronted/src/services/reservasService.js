import api from "./api";

export const listarReservas = async () => {
  const { data } = await api.get("/reservas/");
  return data;
};

export const crearReserva = async (reserva) => {
  const { data } = await api.post("/reservas/", {
    cliente_id: Number(reserva.clienteId),
    habitacion_id: Number(reserva.habitacionId),
    fecha_checkin: reserva.fechaCheckin,
    fecha_checkout: reserva.fechaCheckout,
  });
  return data;
};

export const hacerCheckin = async (reservaId) => {
  const { data } = await api.put(`/reservas/${reservaId}/checkin`);
  return data;
};

export const hacerCheckout = async (reservaId) => {
  const { data } = await api.put(`/reservas/${reservaId}/checkout`);
  return data;
};