import api from "./api";

export const listarPagos = async () => {
  const { data } = await api.get("/pagos/");
  return data;
};

export const registrarPago = async (pago) => {
  const { data } = await api.post("/pagos/", {
    factura_id: Number(pago.facturaId),
    monto: Number(pago.monto),
    metodo_pago: pago.metodoPago,
  });
  return data;
};