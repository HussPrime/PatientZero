import { IconPlay, IconSettings, IconShield } from "./Icons";
import { RangeField } from "./RangeField";

export function SetupPanel({ values, onChange, onReset, onStart }) {
  return (
    <section className="panel setup-panel">
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
            onChange={(value) => onChange("populationSize", value)}
            step={10}
            suffix=" individus"
            value={values.populationSize}
          />
          <RangeField
            label="Patients zéro"
            max={20}
            min={1}
            onChange={(value) => onChange("initialInfected", value)}
            value={values.initialInfected}
          />
          <RangeField
            label="Durée moyenne de l'infection"
            max={400}
            min={20}
            onChange={(value) => onChange("infectionDuration", value)}
            step={10}
            suffix=" pas"
            value={values.infectionDuration}
          />
          <RangeField
            label="Vitesse initiale"
            max={5}
            min={1}
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
            onChange={(value) => onChange("transmissionRate", value)}
            suffix=" %"
            value={values.transmissionRate}
          />
          <RangeField
            label="Taux de guérison"
            max={100}
            min={0}
            onChange={(value) => onChange("recoveryRate", value)}
            suffix=" %"
            value={values.recoveryRate}
          />
          <RangeField
            label="Rayon d'infection"
            max={40}
            min={4}
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
          <button className="button button--danger" onClick={onStart} type="button">
            <IconPlay size={13} /> Démarrer la simulation
          </button>
        </div>
      </div>
    </section>
  );
}
