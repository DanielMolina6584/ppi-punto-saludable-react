import { ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AuthPage() {
  const { login, authError } = useApp();
  const submit = (event) => {
    event.preventDefault();
    login(event.currentTarget.email.value, event.currentTarget.password.value);
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
            Bienvenido de nuevo
          </span>
          <h2>Inicia sesión</h2>
          <p className="form-intro">
            Accede a tu catálogo y revisa tus pedidos.
          </p>
          <form onSubmit={submit}>
            <label>
              Correo electrónico
              <input
                name="email"
                type="email"
                required
                placeholder="tu@correo.com"
              />
            </label>
            <label>
              Contraseña
              <input
                name="password"
                type="password"
                required
                placeholder="Tu contraseña"
              />
            </label>
            {authError && <p className="auth-error">{authError}</p>}
            <button className="button primary full">
              Entrar <ChevronRight size={18} />
            </button>
          </form>
          <small className="demo-hint">
            Usuarios demo: maria@colegio.edu.co / maria123 o
            andres@colegio.edu.co / andres123
          </small>
        </div>
      </div>
    </div>
  );
}
