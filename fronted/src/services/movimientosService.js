import api from "./api";

export const listarMovimientos = async () => {
  const { data } = await api.get("/movimientos/");
  return data;
};