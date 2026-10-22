import { useState } from "react";
import { ClipboardList, CreditCard, Package, ImagePlus } from "lucide-react";
import PageHeading from "../components/PageHeading";
import Stat from "../components/Stat";
import { notifications } from "../data/demoData";
import { useApp } from "../context/AppContext";
import { money } from "../utils/formatters";

// Redimensiona y comprime la imagen antes de guardarla.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("No se pudo leer la imagen."));
    reader.onload = () => {
      image.onerror = () => reject(new Error("Imagen no válida."));
      image.onload = () => {
        const maxSize = 1000;
        const scale = Math.min(
          1,
          maxSize / Math.max(image.width, image.height),
        );
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * scale);
        canvas.height = Math.round(image.height * scale);

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("No se pudo procesar la imagen."));
          return;
        }

        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.75));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

export default function AdminPage() {
  const { products, orders, createProduct, updateProduct, go } = useApp();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
  });

  const [image, setImage] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecciona un archivo de imagen válido.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("La imagen debe pesar menos de 10 MB.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageLoading(true);

    try {
      const compressedImage = await compressImage(file);
      setImage(compressedImage);
    } catch {
      setError("No se pudo procesar la imagen. Intenta con otra.");
    } finally {
      setImageLoading(false);
    }
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");

    if (imageLoading) {
      setError("Espera a que termine de procesarse la imagen.");
      return;
    }

    createProduct({
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      description: "Producto saludable agregado al catálogo.",
      image: image || undefined,
    });

    setForm({ name: "", category: "", price: "", stock: "" });
    setImage("");
    event.currentTarget.reset();
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
                  min={
                    field === "price" || field === "stock" ? "0" : undefined
                  }
                  step={field === "price" ? "any" : "1"}
                  value={form[field]}
                  onChange={(event) =>
                    setForm({ ...form, [field]: event.target.value })
                  }
                  required
                />
              </label>
            ))}

            <label>
              <span>
                <ImagePlus size={17} /> Imagen del producto
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            {image && (
              <div>
                <img
                  src={image}
                  alt="Vista previa del producto"
                  style={{
                    display: "block",
                    width: "100%",
                    maxWidth: "240px",
                    maxHeight: "200px",
                    objectFit: "contain",
                    borderRadius: "12px",
                    marginTop: "8px",
                  }}
                />
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setImage("")}
                >
                  Quitar imagen
                </button>
              </div>
            )}

            {imageLoading && <p>Procesando imagen...</p>}
            {error && <p role="alert">{error}</p>}

            <button
              className="button primary full"
              type="submit"
              disabled={imageLoading}
            >
              Guardar producto
            </button>
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
                      updateProduct(product.id, {
                        category: event.target.value,
                      })
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
                    aria-label={`Precio de ${product.name}`}
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