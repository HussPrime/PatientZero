// Purpose: Hosts the settings that can be adjusted while the simulation is running.
import { IconSettings } from "./Icons";
import { RangeField } from "./RangeField";

// Renders runtime controls for epidemiological parameters.
export function LiveSettingsPanel({ values, onChange }) {
  // TODO: Disable or limit fields here if changing them mid-simulation would make the model incoherent.
  return (
    <section className="panel live-settings-panel">
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon">
            <IconSettings size={15} />
          </span>
          <div>
            <h2>Paramètres en direct</h2>
            <p>Réglages prêts à connecter</p>
          </div>
        </div>
      </div>

      <div className="settings-stack">
        <RangeField
          label="Facteur de transmission"
          max={100}
          min={0}
          onChange={(value) => onChange("transmissionRate", value)}
          suffix=" %"
          value={values.transmissionRate}
        />
        <RangeField
          label="Durée moyenne de l'infection"
          max={30}
          min={1}
          onChange={(value) => onChange("infectionDuration", value)}
          suffix=" s"
          value={values.infectionDuration}
        />
        <RangeField
          label="Taux de guérison"
          max={100}
          min={0}
          onChange={(value) => onChange("cureRate", value)}
          suffix=" %"
          value={values.cureRate}
        />
        <RangeField
          label="Rayon d'infection"
          max={40}
          min={4}
          onChange={(value) => onChange("infectionRadius", value)}
          suffix=" px"
          value={values.infectionRadius}
        />
        <RangeField
          label="Vitesse de déplacement"
          max={5}
          min={0}
          onChange={(value) => onChange("movementSpeed", value)}
          suffix="x"
          value={values.movementSpeed}
        />
      </div>
    </section>
  );
}
