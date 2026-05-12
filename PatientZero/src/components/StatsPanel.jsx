// Purpose: Displays the live counts for each simulation state.
import { highlightElement } from "../utils/sectionNavigation";
import { IconHeart, IconMedicalCross, IconShield, IconTombstone, IconUsers } from "./Icons";

const STAT_CARDS = [
  { key: "total", label: "Population", color: "neutral", icon: IconUsers },
  { key: "healthy", label: "Sains", color: "healthy", icon: IconHeart },
  { key: "infected", label: "Infectés", color: "infected", icon: IconMedicalCross },
  { key: "recovered", label: "Guéris", color: "recovered", icon: IconShield },
  { key: "dead", label: "Morts", color: "dead", icon: IconTombstone },
];

// Highlights only the statistic card selected by the user.
const handleStatCardClick = (event) => {
  event.stopPropagation();
  highlightElement(event.currentTarget);
};

// Renders statistic cards from the latest population counters.
export function StatsPanel({ stats }) {
  return (
    <div className="stats-grid" aria-label="Statistiques de simulation">
      {STAT_CARDS.map((card) => {
        const value = stats[card.key] ?? 0;
        const percent = card.key === "total" ? 100 : (value / stats.total) * 100;

        // TODO: Guard against total = 0 if user validation later allows an empty population.
        return (
          <article className={`stat-card stat-card--${card.color}`} key={card.key} onClick={handleStatCardClick}>
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
