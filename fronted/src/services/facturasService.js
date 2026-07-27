import api from "./api";

export const listarFacturas = async () => {
  const { data } = await api.get("/facturas/");
  return data;
};

export const obtenerFactura = async (id) => {
  const { data } = await api.get(`/facturas/${id}`);
  return data;
};

export const emitirFactura = async (reservaId) => {
  const { data } = await api.post("/facturas/", { reserva_id: Number(reservaId) });
  return data;
};