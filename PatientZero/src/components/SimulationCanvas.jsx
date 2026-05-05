// Purpose: Placeholder for the p5.js canvas that will render the moving population.
import { IconChip } from "./Icons";
import { Legend } from "./Legend";

// Renders the simulation panel until the p5.js instance is connected.
export function SimulationCanvas() {
  // TODO: Add containerRef and dataRef here so p5.js can read individuals without triggering React renders.
  // TODO: Initialize the p5.js sketch in useEffect and clean it up with instance.remove().
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
        {/* TODO: Replace this empty state with the real p5.js canvas output. */}
        <div className="simulation-empty-state">Population non générée</div>
        <Legend />
      </div>
    </section>
  );
}
