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
      event.currentTarget.delivery.value === "home"
        ? "Domicilio"
        : "Recoger en tienda",
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
          <h2>Entrega</h2>
          <div className="payment-options">
            <label>
              <input
                type="radio"
                name="delivery"
                value="pickup"
                defaultChecked
              />
              <span>
                <strong>Recoger</strong>
                <small>El pedido queda listo para reclamar.</small>
              </span>
            </label>
            <label>
              <input type="radio" name="delivery" value="home" />
              <span>
                <strong>Domicilio</strong>
                <small>El vendedor coordina la entrega.</small>
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
