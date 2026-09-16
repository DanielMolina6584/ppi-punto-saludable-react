import { Check } from "lucide-react";
import OrderSummary from "../components/OrderSummary";
import PageHeading from "../components/PageHeading";
import { useApp } from "../context/AppContext";

export default function CheckoutPage() {
  const { cartTotal, placeOrder } = useApp();
  const submit = (event) => {
    event.preventDefault();
    placeOrder(
      event.currentTarget.payment.value === "cash"
        ? "Efectivo"
        : "Transferencia",
    );
  };
  return (
    <>
      <PageHeading eyebrow="Finalización" title="Confirma tu pedido" />
      <div className="checkout-layout">
        <form className="panel checkout-card" onSubmit={submit}>
          <h2>Información de pago</h2>
          <div className="payment-options">
            <label>
              <input type="radio" name="payment" value="cash" defaultChecked />
              <span>
                <strong>Efectivo</strong>
                <small>Paga al reclamar tu pedido.</small>
              </span>
            </label>
            <label>
              <input type="radio" name="payment" value="transfer" />
              <span>
                <strong>Transferencia</strong>
                <small>Reportada para verificación.</small>
              </span>
            </label>
          </div>
          <button className="button primary full">
            Confirmar pedido <Check size={17} />
          </button>
        </form>
        <OrderSummary total={cartTotal} />
      </div>
    </>
  );
}
