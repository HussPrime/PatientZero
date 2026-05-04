import { IconBolt, IconReset, IconStop } from "./Icons";

const SPEED_OPTIONS = [1, 2, 3, 4, 5];

export function ControlsPanel({ status, speed, onSpeedChange, onPause, onStop, onReset }) {
  const speedIndex = Math.max(0, SPEED_OPTIONS.indexOf(speed));

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
        <button className="button button--accent" onClick={onPause} type="button">
          Pause
        </button>
        <button className="button button--ghost" onClick={onStop} type="button">
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
