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
  const [authError, setAuthError] = useState("");

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
  const nextOrderId = () => {
    const highest = orders.reduce((max, order) => {
      const number = Number(String(order.id).replace("PS-", ""));
      return Number.isNaN(number) ? max : Math.max(max, number);
    }, 1048);
    return `PS-${highest + 1}`;
  };
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
    authError,
    go,
    login(email, password) {
      const authenticatedUser = demoUsers.find(
        (item) => item.email === email && item.password === password,
      );
      if (!authenticatedUser) {
        setAuthError("El correo o la contraseña no son correctos.");
        return false;
      }
      setAuthError("");
      setUser(authenticatedUser);
      go(authenticatedUser.role === "staff" ? "admin" : "catalog");
      return true;
    },
    logout() {
      setUser(null);
      setCart({});
      setAuthError("");
      setPage("login");
    },
    addToCart(product, quantity = 1) {
      if (product.stock <= 0) {
        inform(`${product.name} no tiene stock disponible`);
        return;
      }
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
        const product = products.find((item) => item.id === Number(id));
        if (quantity <= 0) delete next[id];
        else next[id] = Math.min(product?.stock || quantity, quantity);
        return next;
      });
    },
    placeOrder(payment, deliveryMethod) {
      const unavailable = cartItems.find(
        ({ product, quantity }) => quantity > product.stock,
      );
      if (unavailable) {
        inform(`Solo quedan ${unavailable.product.stock} unidades de ${unavailable.product.name}`);
        return false;
      }
      const order = {
        id: nextOrderId(),
        customer: user.name,
        customerId: user.id,
        status: "pendiente",
        payment,
        paymentStatus: "pendiente",
        deliveryMethod,
        total: cartTotal,
        date: "Ahora",
        items: `${cartCount} productos`,
        itemDetails: cartItems.map(({ product, quantity }) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity,
        })),
      };
      setOrders((current) => [order, ...current]);
      setProducts((current) =>
        current.map((product) => {
          const item = cartItems.find(({ product: cartProduct }) => cartProduct.id === product.id);
          if (!item) return product;
          return { ...product, stock: Math.max(0, product.stock - item.quantity) };
        }),
      );
      setCart({});
      inform("¡Pedido creado correctamente!");
      go("orders");
      return true;
    },
    createProduct(product) {
      setProducts((current) => [
        ...current,
        { ...product, id: Date.now(), image: images.bowl },
      ]);
      inform("Producto agregado al catálogo");
    },
    updateProduct(id, changes) {
      setProducts((current) =>
        current.map((product) =>
          product.id === id ? { ...product, ...changes } : product,
        ),
      );
      setCart((current) => {
        const next = { ...current };
        const updatedProduct = products.find((product) => product.id === id);
        const nextStock = changes.stock ?? updatedProduct?.stock;
        if (next[id] && nextStock !== undefined) {
          next[id] = Math.min(next[id], Number(nextStock));
          if (next[id] <= 0) delete next[id];
        }
        return next;
      });
    },
    updateOrderStatus(id, status) {
      setOrders((current) =>
        current.map((order) =>
          order.id === id ? { ...order, status } : order,
        ),
      );
      inform("Estado del pedido actualizado");
    },
    respondOrderModification(id, accepted, response = "") {
      const order = orders.find((item) => item.id === id);
      const request = order?.modificationRequest;
      if (!order || !request) return false;
      if (!accepted) {
        setOrders((current) =>
          current.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status: request.previousStatus || "pendiente",
                  modificationStatus: "rechazada",
                  modificationResponse: response,
                }
              : item,
          ),
        );
        inform("Solicitud rechazada");
        return true;
      }
      if (request.type === "items" && request.items?.length) {
        const missingStock = request.items.find((requestedItem) => {
          const currentItem = order.itemDetails?.find(
            (item) => item.id === requestedItem.id,
          );
          const product = products.find((item) => item.id === requestedItem.id);
          const available = (product?.stock || 0) + (currentItem?.quantity || 0);
          return requestedItem.quantity > available;
        });
        if (missingStock) {
          inform(`No hay stock suficiente para ${missingStock.name}`);
          return false;
        }
      }
      setOrders((current) =>
        current.map((item) => {
          if (item.id !== id) return item;
          const updatedOrder = {
            ...item,
            status: request.previousStatus || "pendiente",
            modificationStatus: "aceptada",
            modificationResponse: response,
          };
          if (request.type === "delivery") {
            updatedOrder.deliveryMethod = request.value;
          }
          if (request.type === "payment") {
            updatedOrder.payment = request.value;
            updatedOrder.paymentStatus =
              request.value === "Efectivo" ? "pendiente" : item.paymentStatus;
          }
          if (request.type === "items" && request.items?.length) {
            const itemDetails = request.items.filter(
              (requestedItem) => requestedItem.quantity > 0,
            );
            updatedOrder.itemDetails = itemDetails;
            updatedOrder.items = `${itemDetails.reduce(
              (sum, requestedItem) => sum + requestedItem.quantity,
              0,
            )} productos`;
            updatedOrder.total = itemDetails.reduce(
              (sum, requestedItem) =>
                sum + requestedItem.price * requestedItem.quantity,
              0,
            );
          }
          return updatedOrder;
        }),
      );
      if (request.type === "items" && request.items?.length) {
        setProducts((current) =>
          current.map((product) => {
            const previousItem = order.itemDetails?.find(
              (item) => item.id === product.id,
            );
            const nextItem = request.items.find((item) => item.id === product.id);
            const difference =
              (nextItem?.quantity || 0) - (previousItem?.quantity || 0);
            if (!difference) return product;
            return { ...product, stock: product.stock - difference };
          }),
        );
      }
      inform("Solicitud aceptada");
      return true;
    },
    cancelOrder(id, reason) {
      const order = orders.find((item) => item.id === id);
      if (!order || order.status === "cancelado") return;
      setOrders((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                status: "cancelado",
                cancellationReason: reason,
                modificationReason: "",
              }
            : item,
        ),
      );
      if (order.itemDetails?.length) {
        setProducts((current) =>
          current.map((product) => {
            const item = order.itemDetails.find((detail) => detail.id === product.id);
            if (!item) return product;
            return { ...product, stock: product.stock + item.quantity };
          }),
        );
      }
      inform("Pedido cancelado");
    },
    requestOrderModification(id, request) {
      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? {
                ...order,
                status: "modificacion_solicitada",
                modificationReason: request.reason,
                modificationRequest: {
                  ...request,
                  previousStatus: order.status,
                },
                modificationStatus: "pendiente",
                modificationResponse: "",
              }
            : order,
        ),
      );
      inform("Solicitud de modificación enviada");
    },
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp debe usarse dentro de AppProvider");
  return context;
};
