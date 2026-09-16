import { useState } from "react";
import PageHeading from "../components/PageHeading";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/AppContext";

export default function CatalogPage() {
  const { products, addToCart } = useApp();
  const [category, setCategory] = useState("Todos");
  const categories = [
    "Todos",
    ...new Set(products.map((product) => product.category)),
  ];
  const visible = products.filter(
    (product) => category === "Todos" || product.category === category,
  );
  return (
    <>
      <PageHeading
        eyebrow="Catálogo disponible"
        title={
          <>
            Elige tu pedido
            <br />
            <i>para el descanso.</i>
          </>
        }
      />
      <div className="filters">
        {categories.map((item) => (
          <button
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="product-grid">
        {visible.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            openProduct={() => {}}
            addToCart={addToCart}
          />
        ))}
      </div>
    </>
  );
}
