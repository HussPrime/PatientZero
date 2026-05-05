// Purpose: Contains small inline SVG icons used by dashboard controls and labels.
// Renders the shared SVG wrapper used by every icon component.
function Icon({ children, size = 16, fill = "none" }) {
  return (
    <svg
      aria-hidden="true"
      fill={fill}
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
      width={size}
    >
      {children}
    </svg>
  );
}

// Renders an activity line icon for the evolution chart.
export function IconActivity(props) {
  return (
    <Icon {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </Icon>
  );
}

// Renders a bolt icon for simulation controls.
export function IconBolt(props) {
  return (
    <Icon {...props}>
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </Icon>
  );
}

// Renders a chip icon for the canvas panel.
export function IconChip(props) {
  return (
    <Icon {...props}>
      <path d="M9 3h6M9 21h6M3 9v6M21 9v6M5 5h14v14H5z" />
      <path d="M9 9h6v6H9z" />
    </Icon>
  );
}

// Renders a clock icon for future time-related UI.
export function IconClock(props) {
  return (
    <Icon {...props}>
      <path d="M12 12m-9 0a9 9 0 1 0 18 0 9 9 0 1 0-18 0" />
      <path d="M12 7v5l3 2" />
    </Icon>
  );
}

// Renders a filled dot used for state color indicators.
export function IconDot(props) {
  return (
    <Icon fill="currentColor" {...props}>
      <circle cx="12" cy="12" r="6" stroke="none" />
    </Icon>
  );
}

// Renders a play icon for the start action.
export function IconPlay(props) {
  return (
    <Icon fill="currentColor" {...props}>
      <path d="M7 4v16l13-8L7 4Z" stroke="none" />
    </Icon>
  );
}

// Renders a pause icon for temporarily stopping the running simulation.
export function IconPause(props) {
  return (
    <Icon fill="currentColor" {...props}>
      <path d="M7 5h4v14H7z" stroke="none" />
      <path d="M13 5h4v14h-4z" stroke="none" />
    </Icon>
  );
}

// Renders a reset icon for clearing the session.
export function IconReset(props) {
  return (
    <Icon {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </Icon>
  );
}

// Renders a settings icon for parameter panels.
export function IconSettings(props) {
  return (
    <Icon {...props}>
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
      <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5h0a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v0a1.6 1.6 0 0 0 1.5 1h.1a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" />
    </Icon>
  );
}

// Renders a shield icon for recovered or protected states.
export function IconShield(props) {
  return (
    <Icon {...props}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
    </Icon>
  );
}

// Renders a stop icon for ending the simulation.
export function IconStop(props) {
  return (
    <Icon fill="currentColor" {...props}>
      <path d="M6 6h12v12H6z" stroke="none" />
    </Icon>
  );
}

// Renders a users icon for total population.
export function IconUsers(props) {
  return (
    <Icon {...props}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.9" />
      <path d="M16 3.1a4 4 0 0 1 0 7.8" />
    </Icon>
  );
}

