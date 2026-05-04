import { IconSettings } from "./Icons";
import { RangeField } from "./RangeField";

export function LiveSettingsPanel({ values, onChange }) {
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
      </div>
    </section>
  );
}
