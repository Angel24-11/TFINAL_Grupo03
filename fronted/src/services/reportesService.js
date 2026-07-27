import api from "./api";

export const libroDiario = async (fechaInicio, fechaFin) => {
  const { data } = await api.get("/reportes/libro-diario", {
    params: {
      fecha_inicio: `${fechaInicio}T00:00:00`,
      fecha_fin: `${fechaFin}T23:59:59`,
    },
  });
  return data;
};

export const registroHuespedes = async (fechaInicio, fechaFin) => {
  const { data } = await api.get("/reportes/registro-huespedes", {
    params: {
      fecha_inicio: `${fechaInicio}T00:00:00`,
      fecha_fin: `${fechaFin}T23:59:59`,
    },
  });
  return data;
};

export const reporteOcupacion = async () => {
  const { data } = await api.get("/reportes/ocupacion");
  return data;
};