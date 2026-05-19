// Purpose: Reusable range input with a visible value and filled track.

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// Renders a labeled slider and converts browser string values back to numbers.
export function RangeField({ label, value, min, max, step = 1, suffix = "", hint, disabled = false, onChange }) {
  const rawPercent = max === min ? 0 : ((value - min) / (max - min)) * 100;
  const percent = clamp(rawPercent, 0, 100);

  return (
    <label className="range-field">
      <span className="range-field__topline">
        <span>{label}</span>
        <strong>{value}{suffix}</strong>
      </span>
      <span className="range-field__track">
        <span style={{ width: `${percent}%` }} />
        <input
          disabled={disabled}
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

