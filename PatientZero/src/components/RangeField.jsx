// Purpose: Reusable range input with a visible value and filled track.
// Renders a labeled slider and converts browser string values back to numbers.
export function RangeField({ label, value, min, max, step = 1, suffix = "", hint, onChange }) {
  const percent = ((value - min) / (max - min)) * 100;

  // TODO: Clamp percent between 0 and 100 if live validation allows temporary out-of-range values.
  return (
    <label className="range-field">
      <span className="range-field__topline">
        <span>{label}</span>
        <strong>{value}{suffix}</strong>
      </span>
      <span className="range-field__track">
        <span style={{ width: `${percent}%` }} />
        <input
          min={min}
          max={max}
          onChange={(event) => onChange(Number(event.target.value))}
          step={step}
          type="range"
          value={value}
        />
      </span>
      {hint && <span className="range-field__hint">{hint}</span>}
    </label>
  );
}

