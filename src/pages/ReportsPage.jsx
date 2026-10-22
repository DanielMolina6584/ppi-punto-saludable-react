import {
  ArrowLeft,
  BarChart3,
  ClipboardList,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";
import PageHeading from "../components/PageHeading";
import Stat from "../components/Stat";
import { useApp } from "../context/AppContext";
import { money, statusLabel } from "../utils/formatters";

const CSV_SEPARATOR = ";";

const csvCell = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  return /[";\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toCsv = (rows) =>
  rows.map((row) => row.map(csvCell).join(CSV_SEPARATOR)).join("\r\n");

const downloadCsv = (filename, content) => {
  // El BOM hace que Excel abra el archivo como UTF-8 y respete los acentos.
  const blob = new Blob(["﻿", content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function ReportsPage() {
  const { orders, go } = useApp();
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  const average = orders.length ? Math.round(total / orders.length) : 0;

  const downloadSummary = () => {
    const rows = [
      ["Resumen del periodo"],
      ["Indicador", "Valor"],
      ["Total vendido", total],
      ["Pedidos", orders.length],
      ["Promedio", average],
      [],
      ["Detalle de pedidos"],
      [
        "Código",
        "Fecha",
        "Cliente",
        "Estado",
        "Pago",
        "Estado del pago",
        "Entrega",
        "Productos",
        "Total",
      ],
      ...orders.map((order) => [
        order.id,
        order.date,
        order.customer,
        statusLabel(order.status),
        order.payment,
        order.paymentStatus,
        order.deliveryMethod || "Recoger en tienda",
        order.items,
        order.total,
      ]),
    ];
    const today = new Date().toISOString().slice(0, 10);
    downloadCsv(`resumen-periodo-${today}.csv`, toCsv(rows));
  };

  return (
    <>
      <PageHeading eyebrow="Reporte de ventas" title="Resumen del periodo">
        <div className="section-actions">
          <button className="button secondary" onClick={() => go("admin")}>
            <ArrowLeft size={16} /> Volver
          </button>
          <button
            className="button primary"
            onClick={downloadSummary}
            disabled={!orders.length}
            title="Descarga el resumen en formato CSV compatible con Excel"
          >
            <FileSpreadsheet size={16} /> Descargar Excel
          </button>
        </div>
      </PageHeading>
      <div className="stats-grid">
        <Stat
          icon={<TrendingUp />}
          label="Total vendido"
          value={money(total)}
        />
        <Stat icon={<ClipboardList />} label="Pedidos" value={orders.length} />
        <Stat icon={<BarChart3 />} label="Promedio" value={money(average)} />
      </div>
    </>
  );
}
