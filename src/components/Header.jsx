import {
  BarChart3,
  ChevronRight,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  UserRound,
} from "lucide-react";

export default function Header({ page, role, cartCount, go, logout }) {
  return (
    <header className="topbar">
      <button
        className="brand"
        onClick={() => go(role === "staff" ? "admin" : "catalog")}
      >
        <span className="brand-mark">PS</span>
        <span>
          Punto <b>Saludable</b>
        </span>
      </button>
      <nav>
        {role === "staff" ? (
          <>
            <button
              className={page === "admin" ? "active" : ""}
              onClick={() => go("admin")}
            >
              <LayoutDashboard size={17} />
              Panel
            </button>
            <button onClick={() => go("orders")}>
              <ClipboardList size={17} />
              Pedidos
            </button>
            <button onClick={() => go("reports")}>
              <BarChart3 size={17} />
              Reportes
            </button>
          </>
        ) : (
          <>
            <button
              className={page === "catalog" ? "active" : ""}
              onClick={() => go("catalog")}
            >
              <ShoppingBag size={17} />
              Catálogo
            </button>
            <button
              className={page === "cart" ? "active cart-nav" : "cart-nav"}
              onClick={() => go("cart")}
            >
              <ShoppingCart size={17} />
              Carrito{cartCount > 0 && <em>{cartCount}</em>}
            </button>
            <button onClick={() => go("orders")}>
              <ClipboardList size={17} />
              Mis pedidos
            </button>
          </>
        )}
        <span className="divider" />
        <button className="user-button">
          <UserRound size={17} />
          {role === "staff" ? "Vendedor" : "María"} <ChevronRight size={15} />
        </button>
        <button className="logout" onClick={logout}>
          <LogOut size={16} />
        </button>
      </nav>
    </header>
  );
}
