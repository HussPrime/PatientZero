// Purpose: Provides the controls used to pause, stop, reset, and tune simulation speed.
import { IconBolt, IconPlay, IconReset, IconStop } from "./Icons";

const SPEED_OPTIONS = [1, 2, 3, 4, 5];

// Renders command buttons and speed selection for the current session.
export function ControlsPanel({ status, speed, onSpeedChange, onToggleRun, onStop, onReset }) {
  const speedIndex = Math.max(0, SPEED_OPTIONS.indexOf(speed));
  const isRunning = status === "Simulation en cours";
  const isPaused = status === "Pause";
  const mainActionLabel = isRunning ? "Pause" : isPaused ? "Reprendre" : "Démarrer";
  const mainActionClass = isRunning
    ? "button button--warning"
    : isPaused
      ? "button button--primary"
      : "button button--success";

  return (
    <section className="panel controls-panel">
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon">
            <IconBolt size={15} />
          </span>
          <div>
            <h2>Contrôles</h2>
            <p>Commandes de simulation</p>
          </div>
        </div>
      </div>

      <div className="control-actions">
        <button className={mainActionClass} onClick={onToggleRun} type="button">
          {isRunning ? null : <IconPlay size={12} />}
          {mainActionLabel}
        </button>
        <button className="button button--ghost button--stop" onClick={onStop} type="button">
          <IconStop size={12} /> Stop
        </button>
        <button className="button button--ghost button--wide" onClick={onReset} type="button">
          <IconReset size={13} /> Réinitialiser
        </button>
      </div>

      <div className="speed-selector" aria-label="Vitesse de simulation">
        <span>Vitesse</span>
        <div className="speed-selector__options" style={{ "--speed-index": speedIndex }}>
          {SPEED_OPTIONS.map((option) => (
            <button
              className={speed === option ? "speed-selector__button is-active" : "speed-selector__button"}
              key={option}
              onClick={() => onSpeedChange(option)}
              type="button"
            >
              x{option}
            </button>
          ))}
        </div>
      </div>

      <div className="session-summary">
        <span>Session</span>
        <strong>{status}</strong>
        <small>Modèle SIR, sans propagation active pour cette étape.</small>
      </div>
    </section>
  );
}
