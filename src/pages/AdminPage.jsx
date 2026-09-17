import { useState } from "react";
import { ClipboardList, CreditCard, Package } from "lucide-react";
import PageHeading from "../components/PageHeading";
import Stat from "../components/Stat";
import { notifications } from "../data/demoData";
import { useApp } from "../context/AppContext";
import { money } from "../utils/formatters";

export default function AdminPage() {
  const { products, orders, createProduct, updateProduct, go } = useApp();
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });
  const submit = (event) => {
    event.preventDefault();
    createProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      description: "Producto saludable agregado al catálogo.",
    });
    setForm({ name: "", category: "", price: "", stock: "" });
  };
  return (
    <>
      <PageHeading
        eyebrow="Panel del vendedor"
        title={
          <>
            Pedidos, inventario
            <br />
            <i>y ventas del día.</i>
          </>
        }
      >
        <button className="button secondary" onClick={() => go("reports")}>
          Ver reportes
        </button>
      </PageHeading>
      <div className="stats-grid">
        <Stat
          icon={<ClipboardList />}
          label="Pedidos activos"
          value={orders.length}
        />
        <Stat
          icon={<CreditCard />}
          label="Ventas hoy"
          value={money(orders.reduce((sum, order) => sum + order.total, 0))}
        />
        <Stat
          icon={<Package />}
          label="Bajo stock"
          value={products.filter((product) => product.stock <= 5).length}
        />
      </div>
      <div className="admin-grid">
        <section className="panel">
          <h2>Nuevo producto</h2>
          <form className="stacked-form" onSubmit={submit}>
            {["name", "category", "price", "stock"].map((field) => (
              <label key={field}>
                {field === "name"
                  ? "Nombre"
                  : field === "category"
                    ? "Categoría"
                    : field === "price"
                      ? "Precio"
                      : "Stock"}
                <input
                  type={
                    field === "price" || field === "stock" ? "number" : "text"
                  }
                  value={form[field]}
                  onChange={(event) =>
                    setForm({ ...form, [field]: event.target.value })
                  }
                  required
                />
              </label>
            ))}
            <button className="button primary full">Guardar producto</button>
          </form>
        </section>
        <section className="panel">
          <h2>Notificaciones</h2>
          <div className="notification-list">
            {notifications.map((item) => (
              <p key={item.id}>
                <strong>{item.title}</strong>
                <span>{item.detail}</span>
              </p>
            ))}
          </div>
        </section>
      </div>
      <section className="panel table-panel inventory">
        <div className="panel-title">
          <h2>Inventario</h2>
          <span>{products.length} productos</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>
                  <input
                    className="table-input"
                    value={product.category}
                    onChange={(event) =>
                      updateProduct(product.id, { category: event.target.value })
                    }
                  />
                </td>
                <td>
                  <input
                    className="table-input"
                    type="number"
                    min="0"
                    value={product.price}
                    onChange={(event) =>
                      updateProduct(product.id, {
                        price: Number(event.target.value),
                      })
                    }
                    aria-label={`Precio de ${product.name}: ${money(product.price)}`}
                  />
                </td>
                <td>
                  <input
                    className={`table-input stock-input ${
                      product.stock <= 5 ? "stock-low" : ""
                    }`}
                    type="number"
                    min="0"
                    value={product.stock}
                    onChange={(event) =>
                      updateProduct(product.id, {
                        stock: Number(event.target.value),
                      })
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
