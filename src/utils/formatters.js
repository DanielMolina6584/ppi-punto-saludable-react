export const money = (value) => `$${value.toLocaleString("es-CO")}`;

export const statusLabel = (value) =>
  value.replace("_", " ").replace(/^\w/, (char) => char.toUpperCase());
