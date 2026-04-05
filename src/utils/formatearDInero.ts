export function formatearDinero(dinero: number) {
  if (isNaN(dinero)) return;
  const dineroFormateado = Intl.NumberFormat("es-CL", {
    currency: "CLP",
    style: "currency",
  }).format(dinero);

  return dineroFormateado;
}
