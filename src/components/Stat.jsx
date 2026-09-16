export default function Stat({ icon, label, value }) {
  return (
    <div className="stat">
      <span className="stat-icon">{icon}</span>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>↗ 12% vs. ayer</small>
    </div>
  );
}
