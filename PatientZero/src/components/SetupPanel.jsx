// Purpose: Provides the initial configuration form before a simulation is started.
import { IconPlay, IconSettings, IconShield, IconStop } from "./Icons";
import { RangeField } from "./RangeField";

// Renders editable setup fields and the start/reset actions.
export function SetupPanel({
  values,
  disabled = false,
  isSimulationStarted = false,
  onChange,
  onReset,
  onStop,
  onStart,
}) {
  // TODO: Display validation messages here when impossible parameter combinations are rejected.
  const panelClassName = [
    "panel",
    "setup-panel",
    disabled ? "setup-panel--disabled" : "",
    isSimulationStarted ? "setup-panel--started" : "",
  ].filter(Boolean).join(" ");

  return (
    <section className={panelClassName}>
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon panel-title__icon--danger">
            <IconSettings size={17} />
          </span>
          <div>
            <h2>Configuration de la simulation</h2>
            <p>Paramétrez la population et les variables épidémiologiques avant lancement.</p>
          </div>
        </div>
      </div>

      {isSimulationStarted ? (
        <div className="setup-stop-overlay">
          <div className="setup-stop-overlay__content">
            <p>Arrêtez la simulation pour modifier ces paramètres.</p>
            <button className="button button--ghost button--stop setup-stop-button" onClick={onStop} type="button">
              <IconStop size={12} /> Stopper la simulation
            </button>
          </div>
        </div>
      ) : null}

      <div className="setup-grid">
        <div className="setup-column">
          <h3>Population</h3>
          <RangeField
            label="Taille de la population"
            max={800}
            min={50}
            disabled={disabled}
            onChange={(value) => onChange("populationSize", value)}
            step={10}
            suffix=" individus"
            value={values.populationSize}
          />
          <RangeField
            label="Patients zéro"
            max={20}
            min={1}
            disabled={disabled}
            onChange={(value) => onChange("initialInfected", value)}
            value={values.initialInfected}
          />
          <RangeField
            label="Vitesse de déplacement"
            max={5}
            min={0}
            disabled={disabled}
            onChange={(value) => onChange("movementSpeed", value)}
            suffix="x"
            value={values.movementSpeed}
          />
        </div>

        <div className="setup-column">
          <h3>Épidémiologie</h3>
          <RangeField
            label="Facteur de transmission"
            max={100}
            min={0}
            disabled={disabled}
            onChange={(value) => onChange("transmissionRate", value)}
            suffix=" %"
            value={values.transmissionRate}
          />
          <RangeField
            label="Durée moyenne de l'infection"
            max={30}
            min={1}
            disabled={disabled}
            onChange={(value) => onChange("infectionDuration", value)}
            suffix=" s"
            value={values.infectionDuration}
          />
          <RangeField
            label="Rayon d'infection"
            max={40}
            min={4}
            disabled={disabled}
            onChange={(value) => onChange("infectionRadius", value)}
            suffix=" px"
            value={values.infectionRadius}
          />
        </div>
      </div>

      <div className="setup-actions">
        <span><IconShield size={13} /> Modèle SIR, données locales, simulation côté client.</span>
        <div>
          <button className="button button--ghost" onClick={onReset} type="button">
            Réinitialiser les paramètres
          </button>
          <button className="button button--danger" disabled={disabled} onClick={onStart} type="button">
            <IconPlay size={13} /> Démarrer la simulation
          </button>
        </div>
      </div>
    </section>
  );
}
