import { ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { page, login, go } = useApp();
  const register = page === "register";
  const submit = (event) => {
    event.preventDefault();
    login(event.currentTarget.role.value);
  };
  return (
    <div className="auth-page">
      <div className="auth-hero">
        <div className="hero-brand">
          <span className="brand-mark">PS</span>Punto Saludable
        </div>
        <div>
          <span className="eyebrow">Proyecto integrador</span>
          <h1>
            Comer bien,
            <br />
            <i>sentirse mejor.</i>
          </h1>
          <p>Pedidos escolares saludables, fáciles y sin filas largas.</p>
        </div>
        <div className="hero-stat">
          <strong>+12</strong>
          <span>opciones frescas cada día</span>
        </div>
      </div>
      <div className="auth-form-wrap">
        <div className="auth-form">
          <span className="eyebrow">
            {register ? "Nuevo usuario" : "Bienvenido de nuevo"}
          </span>
          <h2>{register ? "Crea tu cuenta" : "Inicia sesión"}</h2>
          <p className="form-intro">
            Accede a tu catálogo y revisa tus pedidos.
          </p>
          <form onSubmit={submit}>
            {register && (
              <label>
                Nombre completo
                <input required placeholder="Tu nombre" />
              </label>
            )}
            <label>
              Correo electrónico
              <input type="email" required placeholder="tu@correo.com" />
            </label>
            <label>
              Contraseña
              <input type="password" required placeholder="••••••••" />
            </label>
            <label>
              Perfil de acceso
              <select name="role" defaultValue="buyer">
                <option value="buyer">Comprador</option>
                <option value="staff">Vendedor</option>
              </select>
            </label>
            <button className="button primary full">
              {register ? "Crear cuenta" : "Entrar"} <ChevronRight size={18} />
            </button>
          </form>
          <p className="switch-auth">
            {register ? "¿Ya tienes una cuenta?" : "¿Aún no tienes una cuenta?"}{" "}
            <button onClick={() => go(register ? "login" : "register")}>
              {register ? "Inicia sesión" : "Regístrate"}
            </button>
          </p>
          <small className="demo-hint">
            Demo local: escoge comprador o vendedor.
          </small>
        </div>
      </div>
    </div>
  );
}
