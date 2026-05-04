import { IconDot, IconShield, IconUsers } from "./Icons";

const STAT_CARDS = [
  { key: "total", label: "Population", color: "neutral", icon: IconUsers },
  { key: "healthy", label: "Sains", color: "healthy", icon: IconDot },
  { key: "infected", label: "Infectés", color: "infected", icon: IconDot },
  { key: "recovered", label: "Guéris", color: "recovered", icon: IconShield },
];

export function StatsPanel({ stats }) {
  return (
    <div className="stats-grid" aria-label="Statistiques de simulation">
      {STAT_CARDS.map((card) => {
        const value = stats[card.key];
        const percent = card.key === "total" ? 100 : (value / stats.total) * 100;

        return (
          <article className={`stat-card stat-card--${card.color}`} key={card.key}>
            <div className="stat-card__label">
              <card.icon size={14} />
              {card.label}
            </div>
            <div className="stat-card__value">{value}</div>
            <div className="stat-card__meta">{percent.toFixed(1)}%</div>
            <div className="stat-card__bar">
              <span style={{ width: `${Math.min(percent, 100)}%` }} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
