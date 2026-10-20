import "./MetricCard.css";

export type Accent = "cyan" | "violet" | "green" | "amber";

interface MetricCardProps {
  label: string;
  accent: Accent;
  description: string;
}

/**
 * Placeholder card. Collectors are not implemented yet, so this renders
 * no values on purpose. Do not add mock numbers here.
 */
export function MetricCard({ label, accent, description }: MetricCardProps) {
  return (
    <section className={`metric-card metric-card--${accent}`} aria-label={`${label} (not implemented)`}>
      <header className="metric-card__header">
        <span className="metric-card__dot" aria-hidden="true" />
        <h2 className="metric-card__label">{label}</h2>
      </header>
      <p className="metric-card__value" aria-hidden="true">
        --
      </p>
      <p className="metric-card__status">Not implemented yet</p>
      <p className="metric-card__desc">{description}</p>
    </section>
  );
}
