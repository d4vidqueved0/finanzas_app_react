export const formatearFecha = (fecha: string) => {
  const tipoFecha = new Date(fecha);
  const fechaFormateada = tipoFecha.toLocaleDateString("es-CL", {dateStyle: "long"});
  return fechaFormateada;
};
