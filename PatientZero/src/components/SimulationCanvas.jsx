import { IconChip } from "./Icons";
import { Legend } from "./Legend";

export function SimulationCanvas() {
  return (
    <section className="panel simulation-panel">
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon">
            <IconChip size={15} />
          </span>
          <div>
            <h2>Zone de simulation</h2>
            <p>Canvas prêt pour le rendu p5.js</p>
          </div>
        </div>
        <span className="panel__badge">900 x 520</span>
      </div>

      <div className="simulation-canvas" aria-label="Zone de simulation temporaire">
        <div className="simulation-empty-state">Population non générée</div>
        <Legend />
      </div>
    </section>
  );
}
