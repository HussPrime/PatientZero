// Purpose: Provides the controls used to pause, stop, reset, and tune simulation speed.
import { IconBolt, IconPause, IconPlay, IconReset, IconStop } from "./Icons";

const SPEED_OPTIONS = [0.5, 1, 2, 3, 5];
const FINISHED_STATUS = "Simulation terminée";
const STOPPED_STATUS = "Simulation arrêtée";

// Renders command buttons and speed selection for the current session.
export function ControlsPanel({
  status,
  speed,
  onSpeedChange,
  onToggleRun,
  onStop,
  onReset,
  isStopDisabled = false,
}) {
  const speedIndex = Math.max(0, SPEED_OPTIONS.indexOf(speed));
  const isRunning = status === "Simulation en cours";
  const isPaused = status === "Pause";
  const isFinished = status === FINISHED_STATUS;
  const isStopped = status === STOPPED_STATUS;
  const mainActionLabel = isRunning
    ? "Pause"
    : isPaused
      ? "Reprendre"
      : isFinished || isStopped
        ? "Relancer"
        : "Démarrer";
  const mainActionClass = isRunning
    ? "button button--warning"
    : isPaused
      ? "button button--primary"
      : isFinished || isStopped
        ? "button button--success"
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
          {isRunning ? <IconPause size={12} /> : <IconPlay size={12} />}
          {mainActionLabel}
        </button>
        <button className="button button--ghost button--stop" disabled={isStopDisabled} onClick={onStop} type="button">
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
    </section>
  );
}
