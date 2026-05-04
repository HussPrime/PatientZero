const LEGEND_ITEMS = [
  { label: "Sain", state: "healthy" },
  { label: "Infecté", state: "infected" },
  { label: "Guéri", state: "recovered" },
];

export function Legend({ compact = false }) {
  return (
    <div className={compact ? "legend legend--compact" : "legend"}>
      {LEGEND_ITEMS.map((item) => (
        <span className="legend__item" key={item.state}>
          <span className={`legend__dot legend__dot--${item.state}`} />
          {item.label}
        </span>
      ))}
    </div>
  );
}

