import dayjs from "dayjs";

export const formatearFecha = (fecha: string) => {
  if (!fecha) return "";
  const fechaFormateada = dayjs(fecha).format("D [de] MMMM [de] YYYY");
  return fechaFormateada;
};
