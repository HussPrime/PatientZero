// Purpose: Provides the initial configuration form before a simulation is started.
import { IconPlay, IconSettings, IconShield } from "./Icons";
import { RangeField } from "./RangeField";

// Renders editable setup fields and the start/reset actions.
export function SetupPanel({ values, disabled = false, onChange, onReset, onStart }) {
  // TODO: Display validation messages here when impossible parameter combinations are rejected.
  return (
    <section className={disabled ? "panel setup-panel setup-panel--disabled" : "panel setup-panel"}>
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
            label="Durée moyenne de l'infection"
            max={400}
            min={20}
            disabled={disabled}
            onChange={(value) => onChange("infectionDuration", value)}
            step={10}
            suffix=" pas"
            value={values.infectionDuration}
          />
          <RangeField
            label="Vitesse initiale"
            max={5}
            min={1}
            disabled={disabled}
            onChange={(value) => onChange("initialSpeed", value)}
            suffix="x"
            value={values.initialSpeed}
          />
        </div>

        <div className="setup-column">
          <h3>Épidémiologie</h3>
          <RangeField
            label="Probabilité de transmission"
            max={100}
            min={0}
            disabled={disabled}
            onChange={(value) => onChange("transmissionRate", value)}
            suffix=" %"
            value={values.transmissionRate}
          />
          <RangeField
            label="Taux de guérison"
            max={100}
            min={0}
            disabled={disabled}
            onChange={(value) => onChange("recoveryRate", value)}
            suffix=" %"
            value={values.recoveryRate}
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
          <label className="toggle-row">
            <span>
              <strong>Déplacement aléatoire</strong>
              <small>Mouvement visuel prévu pour p5.js</small>
            </span>
            <input
              checked={values.randomMovement}
              disabled={disabled}
              onChange={(event) => onChange("randomMovement", event.target.checked)}
              type="checkbox"
            />
          </label>
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
