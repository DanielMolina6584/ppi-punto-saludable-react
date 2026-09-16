import { ChevronRight } from "lucide-react";
import { money } from "../utils/formatters";

export default function OrderSummary({ total, onCheckout }) {
  return (
    <aside className="panel order-summary">
      <h2>Resumen del pedido</h2>
      <div className="summary-item">
        <span>Subtotal</span>
        <strong>{money(total)}</strong>
      </div>
      <div className="summary-item">
        <span>Entrega</span>
        <strong className="green">Gratis</strong>
      </div>
      <div className="summary-total">
        <span>Total</span>
        <strong>{money(total)}</strong>
      </div>
      {onCheckout && (
        <button className="button primary full" onClick={onCheckout}>
          Finalizar pedido <ChevronRight size={17} />
        </button>
      )}
    </aside>
  );
}
