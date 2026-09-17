import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { money } from "../utils/formatters";

export default function ProductCard({ product, openProduct, addToCart }) {
  const [quantity, setQuantity] = useState(1);
  useEffect(() => {
    setQuantity((current) => Math.min(current, Math.max(1, product.stock)));
  }, [product.stock]);
  return (
    <article className="product-card">
      <button className="image-button" onClick={() => openProduct(product)}>
        <img src={product.image} alt={product.name} />
        <span className="tag">{product.category}</span>
      </button>
      <div className="product-body">
        <button className="product-title" onClick={() => openProduct(product)}>
          {product.name}
        </button>
        <p>{product.description}</p>
        <div className="product-meta">
          <strong>{money(product.price * quantity)}</strong>
          <span>{product.stock} disponibles</span>
        </div>
        <div className="card-actions">
          <div className="quantity">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus size={15} />
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={product.stock <= 0}
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
