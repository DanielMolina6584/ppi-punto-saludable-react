import { useState } from "react";
import PageHeading from "../components/PageHeading";
import { useApp } from "../context/AppContext";
import { money, statusLabel } from "../utils/formatters";

const initialModificationForm = {
  type: "delivery",
  delivery: "Domicilio",
  payment: "Efectivo",
  reason: "",
  note: "",
  items: [],
};

const changeTypeLabel = {
  delivery: "Entrega",
  payment: "Pago",
  items: "Productos",
  other: "Otro cambio",
};

const describeModification = (request) => {
  if (!request) return "";
  if (request.type === "delivery") return `Entrega: ${request.value}`;
  if (request.type === "payment") return `Pago: ${request.value}`;
  if (request.type === "items") {
    const itemSummary = request.items
      ?.map((item) => `${item.name}: ${item.quantity}`)
      .join(" · ");
    return itemSummary || request.note;
  }
  return request.note;
};

export default function OrdersPage({ staff = false, title }) {
  const {
    orders,
    products,
    user,
    updateOrderStatus,
    cancelOrder,
    requestOrderModification,
    respondOrderModification,
  } = useApp();
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [modifyModal, setModifyModal] = useState(null);
  const [modificationForm, setModificationForm] = useState(
    initialModificationForm,
  );
  const [reviewModal, setReviewModal] = useState(null);
  const [reviewResponse, setReviewResponse] = useState("");

  const visibleOrders = staff
    ? orders
    : orders.filter(
        (order) => order.customerId === user.id || order.customer === user.name,
      );
  const canAct = (order) =>
    !["cancelado", "entregado"].includes(order.status);

  const openCancel = (order) => {
    setCancelModal(order);
    setCancelReason("");
  };
  const openModification = (order) => {
    setModifyModal(order);
    setModificationForm({
      ...initialModificationForm,
      delivery: order.deliveryMethod === "Domicilio" ? "Recoger en tienda" : "Domicilio",
      payment: order.payment === "Efectivo" ? "Transferencia" : "Efectivo",
      items: (order.itemDetails || []).map((item) => ({ ...item })),
    });
  };
  const openReview = (order) => {
    setReviewModal(order);
    setReviewResponse("");
  };
  const closeModals = () => {
    setCancelModal(null);
    setModifyModal(null);
    setReviewModal(null);
    setCancelReason("");
    setReviewResponse("");
  };
  const submitCancel = (event) => {
    event.preventDefault();
    if (!cancelReason.trim()) return;
    cancelOrder(cancelModal.id, cancelReason.trim());
    closeModals();
  };
  const submitModification = (event) => {
    event.preventDefault();
    if (!modificationForm.reason.trim()) return;
    const request = {
      type: modificationForm.type,
      label: changeTypeLabel[modificationForm.type],
      reason: modificationForm.reason.trim(),
      note: modificationForm.note.trim(),
    };
    if (modificationForm.type === "delivery") {
      request.value = modificationForm.delivery;
    }
    if (modificationForm.type === "payment") {
      request.value = modificationForm.payment;
    }
    if (modificationForm.type === "items") {
      request.items = modificationForm.items.map((item) => ({
        ...item,
        quantity: Math.max(0, Number(item.quantity)),
      }));
      request.note = modificationForm.note.trim();
    }
    request.summary = describeModification(request);
    request.createdAt = "Ahora";
    requestOrderModification(modifyModal.id, request);
    closeModals();
  };
  const submitReview = (accepted) => {
    const handled = respondOrderModification(
      reviewModal.id,
      accepted,
      reviewResponse.trim(),
    );
    if (handled) closeModals();
  };
  const updateRequestedItem = (id, quantity) => {
    setModificationForm((current) => ({
      ...current,
      items: current.items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, Number(quantity)) }
          : item,
      ),
    }));
  };

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
              <th>Entrega</th>
              <th>Total</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {visibleOrders.map((order) => (
              <tr key={order.id}>
                <td>
                  <strong>{order.id}</strong>
                  <small>{order.date}</small>
                  <small>{order.items}</small>
                </td>
                {staff && <td>{order.customer}</td>}
                <td>
                  {order.payment}
                  <small>{order.paymentStatus}</small>
                </td>
                <td>
                  {staff ? (
                    <select
                      className={`order-status-select ${order.status}`}
                      value={order.status}
                      onChange={(event) => {
                        if (event.target.value === "cancelado") {
                          openCancel(order);
                          return;
                        }
                        updateOrderStatus(order.id, event.target.value);
                      }}
                      disabled={order.status === "cancelado"}
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en_preparacion">En preparación</option>
                      <option value="listo">Listo</option>
                      <option value="entregado">Entregado</option>
                      <option value="modificacion_solicitada">
                        Modificación solicitada
                      </option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  ) : (
                    <span className={`status ${order.status}`}>
                      {statusLabel(order.status)}
                    </span>
                  )}
                  {order.cancellationReason && (
                    <small>Motivo: {order.cancellationReason}</small>
                  )}
                  {order.modificationRequest && (
                    <small>
                      Solicitud: {describeModification(order.modificationRequest)}
                    </small>
                  )}
                  {order.modificationResponse && (
                    <small>Respuesta: {order.modificationResponse}</small>
                  )}
                </td>
                <td>{order.deliveryMethod || "Recoger en tienda"}</td>
                <td>
                  <strong>{money(order.total)}</strong>
                </td>
                <td>
                  <div className="table-actions">
                    {staff ? (
                      <>
                        {order.status === "modificacion_solicitada" && (
                          <button
                            className="button small"
                            onClick={() => openReview(order)}
                          >
                            Revisar
                          </button>
                        )}
                        <button
                          className="button small danger"
                          onClick={() => openCancel(order)}
                          disabled={order.status === "cancelado"}
                        >
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="button small"
                          onClick={() => openModification(order)}
                          disabled={!canAct(order)}
                        >
                          Modificar
                        </button>
                        <button
                          className="button small danger"
                          onClick={() => openCancel(order)}
                          disabled={!canAct(order)}
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {cancelModal && (
        <div className="modal-backdrop" role="presentation">
          <form className="order-modal" onSubmit={submitCancel}>
            <div className="modal-heading">
              <span className="eyebrow">Cancelar pedido</span>
              <h2>{cancelModal.id}</h2>
              <p>Cuéntanos el motivo para dejar el pedido cancelado.</p>
            </div>
            <label>
              Motivo de cancelación
              <textarea
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                placeholder="Ej: ya no necesito el pedido, cambio de horario..."
                required
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="button secondary" onClick={closeModals}>
                Volver
              </button>
              <button className="button primary danger">Cancelar pedido</button>
            </div>
          </form>
        </div>
      )}

      {modifyModal && (
        <div className="modal-backdrop" role="presentation">
          <form className="order-modal wide" onSubmit={submitModification}>
            <div className="modal-heading">
              <span className="eyebrow">Modificar pedido</span>
              <h2>{modifyModal.id}</h2>
              <p>Selecciona qué quieres cambiar y deja el motivo para el vendedor.</p>
            </div>
            <label>
              ¿Qué quieres cambiar?
              <select
                value={modificationForm.type}
                onChange={(event) =>
                  setModificationForm({
                    ...modificationForm,
                    type: event.target.value,
                  })
                }
              >
                <option value="delivery">Forma de entrega</option>
                <option value="payment">Forma de pago</option>
                <option value="items">Productos o cantidades</option>
                <option value="other">Otro cambio</option>
              </select>
            </label>

            {modificationForm.type === "delivery" && (
              <div className="modal-options">
                {["Domicilio", "Recoger en tienda"].map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name="delivery"
                      value={option}
                      checked={modificationForm.delivery === option}
                      onChange={(event) =>
                        setModificationForm({
                          ...modificationForm,
                          delivery: event.target.value,
                        })
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {modificationForm.type === "payment" && (
              <div className="modal-options">
                {["Efectivo", "Transferencia"].map((option) => (
                  <label key={option}>
                    <input
                      type="radio"
                      name="payment"
                      value={option}
                      checked={modificationForm.payment === option}
                      onChange={(event) =>
                        setModificationForm({
                          ...modificationForm,
                          payment: event.target.value,
                        })
                      }
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {modificationForm.type === "items" && (
              <div className="item-change-list">
                {modificationForm.items.length ? (
                  modificationForm.items.map((item) => {
                    const product = products.find((productItem) => productItem.id === item.id);
                    const maxQuantity = (product?.stock || 0) + item.quantity;
                    return (
                      <label key={item.id}>
                        <span>
                          {item.name}
                          <small>Máximo disponible: {maxQuantity}</small>
                        </span>
                        <input
                          type="number"
                          min="0"
                          max={maxQuantity}
                          value={item.quantity}
                          onChange={(event) =>
                            updateRequestedItem(item.id, event.target.value)
                          }
                        />
                      </label>
                    );
                  })
                ) : (
                  <label>
                    Productos o cantidades que quieres cambiar
                    <textarea
                      value={modificationForm.note}
                      onChange={(event) =>
                        setModificationForm({
                          ...modificationForm,
                          note: event.target.value,
                        })
                      }
                      placeholder="Ej: cambiar el jugo por parfait o reducir una unidad."
                      required
                    />
                  </label>
                )}
              </div>
            )}

            {modificationForm.type === "other" && (
              <label>
                ¿Qué cambio necesitas?
                <textarea
                  value={modificationForm.note}
                  onChange={(event) =>
                    setModificationForm({
                      ...modificationForm,
                      note: event.target.value,
                    })
                  }
                  placeholder="Ej: cambiar la hora de entrega, agregar una nota..."
                  required
                />
              </label>
            )}

            <label>
              ¿Por qué quieres cambiarlo?
              <textarea
                value={modificationForm.reason}
                onChange={(event) =>
                  setModificationForm({
                    ...modificationForm,
                    reason: event.target.value,
                  })
                }
                placeholder="Escribe el motivo para que el vendedor lo revise."
                required
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="button secondary" onClick={closeModals}>
                Volver
              </button>
              <button className="button primary">Enviar solicitud</button>
            </div>
          </form>
        </div>
      )}

      {reviewModal && (
        <div className="modal-backdrop" role="presentation">
          <div className="order-modal">
            <div className="modal-heading">
              <span className="eyebrow">Revisar solicitud</span>
              <h2>{reviewModal.id}</h2>
              <p>{reviewModal.customer} quiere modificar este pedido.</p>
            </div>
            <div className="request-card">
              <strong>{reviewModal.modificationRequest?.label}</strong>
              <span>{describeModification(reviewModal.modificationRequest)}</span>
              <small>Motivo: {reviewModal.modificationRequest?.reason}</small>
            </div>
            <label>
              Respuesta para el cliente
              <textarea
                value={reviewResponse}
                onChange={(event) => setReviewResponse(event.target.value)}
                placeholder="Opcional: deja una nota breve sobre la decisión."
              />
            </label>
            <div className="modal-actions">
              <button type="button" className="button secondary" onClick={closeModals}>
                Después
              </button>
              <button
                type="button"
                className="button secondary danger-text"
                onClick={() => submitReview(false)}
              >
                Rechazar
              </button>
              <button
                type="button"
                className="button primary"
                onClick={() => submitReview(true)}
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
