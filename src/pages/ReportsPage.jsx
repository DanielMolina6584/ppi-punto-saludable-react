import { ArrowLeft, BarChart3, ClipboardList, TrendingUp } from "lucide-react";
import PageHeading from "../components/PageHeading";
import Stat from "../components/Stat";
import { useApp } from "../context/AppContext";
import { money } from "../utils/formatters";

export default function ReportsPage() {
  const { orders, go } = useApp();
  const total = orders.reduce((sum, order) => sum + order.total, 0);
  return (
    <>
      <PageHeading eyebrow="Reporte de ventas" title="Resumen del periodo">
        <button className="button secondary" onClick={() => go("admin")}>
          <ArrowLeft size={16} /> Volver
        </button>
      </PageHeading>
      <div className="stats-grid">
        <Stat
          icon={<TrendingUp />}
          label="Total vendido"
          value={money(total)}
        />
        <Stat icon={<ClipboardList />} label="Pedidos" value={orders.length} />
        <Stat
          icon={<BarChart3 />}
          label="Promedio"
          value={money(Math.round(total / orders.length))}
        />
      </div>
    </>
  );
}
