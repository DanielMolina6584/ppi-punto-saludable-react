
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { money } from "../utils/formatters";

export default function ProductCard({ product, openProduct, addToCart }) {
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setQuantity((current) =>
      Math.min(current, Math.max(1, product.stock))
    );
  }, [product.stock]);

  useEffect(() => {
    setImageError(false);
  }, [product.image]);

  return (
    <article className="product-card">
      <button
        className="image-button"
        onClick={() => openProduct(product)}
      >
        {product.image && !imageError ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width="400"
            height="300"
            onError={() => {
              console.error("No se pudo cargar la imagen del producto:", {
                nombre: product.name,
                imagen: product.image,
              });
              setImageError(true);
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              minHeight: "180px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f1f5f1",
              color: "#64748b",
              borderRadius: "8px",
            }}
          >
            Imagen no disponible
          </div>
        )}

        <span className="tag">{product.category}</span>
      </button>

      <div className="product-body">
        <button
          className="product-title"
          onClick={() => openProduct(product)}
        >
          {product.name}
        </button>

        <p>{product.description}</p>

        <div className="product-meta">
          <strong>{money(product.price * quantity)}</strong>
          <span>{product.stock} disponibles</span>
        </div>

        <div className="card-actions">
          <div className="quantity">
            <button
              onClick={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
              aria-label="Disminuir cantidad"
            >
              <Minus size={15} />
            </button>

            <span>{quantity}</span>

            <button
              onClick={() =>
                setQuantity((current) =>
                  Math.min(product.stock, current + 1)
                )
              }
              disabled={product.stock <= 0}
              aria-label="Aumentar cantidad"
            >
              <Plus size={15} />
            </button>
          </div>

          <button
            className="button primary add"
            onClick={() => addToCart(product, quantity)}
            disabled={product.stock <= 0}
          >
            <ShoppingCart size={16} />
            {product.stock > 0 ? "Agregar" : "Sin stock"}
          </button>
        </div>
      </div>
    </article>
  );
}
