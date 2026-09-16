import { Check } from "lucide-react";
import Header from "./components/Header";
import { AppProvider, useApp } from "./context/AppContext";
import AdminPage from "./pages/AdminPage";
import AuthPage from "./pages/AuthPage";
import CartPage from "./pages/CartPage";
import CatalogPage from "./pages/CatalogPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import ReportsPage from "./pages/ReportsPage";

function Application() {
  const { page, user, cartCount, notice, go, logout } = useApp();
  if (!user) return <AuthPage />;
  const pages = {
    catalog: <CatalogPage />,
    cart: <CartPage />,
    checkout: <CheckoutPage />,
    orders: <OrdersPage staff={user.role === "staff"} />,
    admin: <AdminPage />,
    reports: <ReportsPage />,
  };
  return (
    <>
      <Header
        page={page}
        role={user.role}
        cartCount={cartCount}
        go={go}
        logout={logout}
      />
      <main className="page">
        {notice && (
          <div className="toast">
            <Check size={18} />
            {notice}
          </div>
        )}
        {pages[page] || <CatalogPage />}
      </main>
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Application />
    </AppProvider>
  );
}
