export const money = (value) => `$${value.toLocaleString("es-CO")}`;

export const statusLabel = (value) => {
  const labels = {
    pendiente: "Pendiente",
    en_preparacion: "En preparación",
    listo: "Listo",
    entregado: "Entregado",
    cancelado: "Cancelado",
    modificacion_solicitada: "Modificación solicitada",
  };
  return (
    labels[value] ||
    value
      .split("_")
      .join(" ")
      .replace(/^\w/, (char) => char.toUpperCase())
  );
};
