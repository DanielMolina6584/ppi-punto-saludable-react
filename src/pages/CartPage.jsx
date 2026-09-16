import { Minus, Plus, ShoppingCart } from "lucide-react";
import Empty from "../components/Empty";
import OrderSummary from "../components/OrderSummary";
import PageHeading from "../components/PageHeading";
import { useApp } from "../context/AppContext";
import { money } from "../utils/formatters";

export default function CartPage() {
  const { cartItems, cartTotal, changeQuantity, go } = useApp();
  if (!cartItems.length)
    return (
      <>
        <PageHeading eyebrow="Carrito de compras" title="Tu pedido" />
        <Empty
          icon={<ShoppingCart />}
          title="Tu carrito está vacío"
          text="Explora el catálogo y agrega tus favoritos."
          action={() => go("catalog")}
        />
      </>
    );
  return (
    <>
      <PageHeading
        eyebrow="Carrito de compras"
        title={
          <>
            Revisa tu pedido
            <br />
            <i>antes de finalizar.</i>
          </>
        }
      >
        <button className="button secondary" onClick={() => go("catalog")}>
          Seguir comprando
        </button>
      </PageHeading>
      <div className="cart-layout">
        <section className="panel table-panel">
          <div className="panel-title">
            <h2>Productos en tu carrito</h2>
            <span>{cartItems.length} productos</span>
          </div>
          {cartItems.map(({ product, quantity }) => (
            <div className="cart-item" key={product.id}>
              <img src={product.image} alt="" />
              <div className="cart-item-info">
                <strong>{product.name}</strong>
                <span>{product.category}</span>
                <button
                  className="remove"
                  onClick={() => changeQuantity(product.id, 0)}
                >
                  Quitar
                </button>
              </div>
              <div className="quantity">
                <button
                  onClick={() => changeQuantity(product.id, quantity - 1)}
                >
                  <Minus size={15} />
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() =>
                    changeQuantity(
                      product.id,
                      Math.min(product.stock, quantity + 1),
                    )
                  }
                >
                  <Plus size={15} />
                </button>
              </div>
              <strong>{money(product.price * quantity)}</strong>
            </div>
          ))}
        </section>
        <OrderSummary total={cartTotal} onCheckout={() => go("checkout")} />
      </div>
    </>
  );
}
