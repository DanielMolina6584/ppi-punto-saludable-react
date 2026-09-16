export default function Empty({ icon, title, text, action }) {
  return (
    <div className="empty-state">
      {icon}
      <h2>{title}</h2>
      <p>{text}</p>
      <button className="button primary" onClick={action}>
        Ver catálogo
      </button>
    </div>
  );
}
