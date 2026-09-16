import { createContext, useContext, useMemo, useState } from "react";
import {
  demoUsers,
  images,
  initialOrders,
  initialProducts,
} from "../data/demoData";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [cart, setCart] = useState({});
  const [notice, setNotice] = useState("");

  const cartItems = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, quantity]) => ({
          product: products.find((item) => item.id === Number(id)),
          quantity,
        }))
        .filter((item) => item.product),
    [cart, products],
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const go = (destination) => {
    setPage(destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const inform = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

  const value = {
    page,
    user,
    products,
    orders,
    cartItems,
    cartCount,
    cartTotal,
    notice,
    go,
    login(role) {
      setUser(demoUsers.find((item) => item.role === role));
      go(role === "staff" ? "admin" : "catalog");
    },
    logout() {
      setUser(null);
      setCart({});
      setPage("login");
    },
    addToCart(product, quantity = 1) {
      setCart((current) => ({
        ...current,
        [product.id]: Math.min(
          product.stock,
          (current[product.id] || 0) + quantity,
        ),
      }));
      inform(`${product.name} fue agregado al carrito`);
    },
    changeQuantity(id, quantity) {
      setCart((current) => {
        const next = { ...current };
        if (quantity <= 0) delete next[id];
        else next[id] = quantity;
        return next;
      });
    },
    placeOrder(payment) {
      const order = {
        id: `PS-${1049 + orders.length}`,
        customer: user.name,
        status: "pendiente",
        payment,
        paymentStatus: "pendiente",
        total: cartTotal,
        date: "Ahora",
        items: `${cartCount} productos`,
      };
      setOrders((current) => [order, ...current]);
      setCart({});
      inform("¡Pedido creado correctamente!");
      go("orders");
    },
    createProduct(product) {
      setProducts((current) => [
        ...current,
        { ...product, id: Date.now(), image: images.bowl },
      ]);
      inform("Producto agregado al catálogo");
    },
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe usarse dentro de AppProvider");
  return context;
};
