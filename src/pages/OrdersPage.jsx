import PageHeading from "../components/PageHeading";
import { useApp } from "../context/AppContext";
import { money, statusLabel } from "../utils/formatters";

export default function OrdersPage({ staff = false, title }) {
  const { orders } = useApp();
  return (
    <>
      <PageHeading
        eyebrow="Seguimiento"
        title={title || (staff ? "Pedidos recibidos" : "Mis pedidos")}
      />
      <section className="panel table-panel desktop-table">
        <table>
          <thead>
            <tr>
              <th>Código</th>
              {staff && <th>Cliente</th>}
              <th>Pago</th>
              <th>Estado</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.id}</strong>
                  <small>{order.date}</small>
                </td>
                {staff && <td>{order.customer}</td>}
                <td>
                  {order.payment}
                  <small>{order.paymentStatus}</small>
                </td>
                <td>
                  <span className={`status ${order.status}`}>
                    {statusLabel(order.status)}
                  </span>
                </td>
                <td>
                  <strong>{money(order.total)}</strong>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
