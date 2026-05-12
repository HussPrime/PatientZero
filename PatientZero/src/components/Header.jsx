// Purpose: Displays the app identity, current run status, and simulated time.
import { formatChartTimeAsSeconds } from "../simulation/chartHistory";

const NAVIGATION_ITEMS = [
  { href: "#stats", label: "Statistiques" },
  { href: "#simulation", label: "Simulation" },
  { href: "#chart", label: "Graphique" },
  { href: "#controls", label: "Contrôles" },
  { href: "#live-settings", label: "Direct" },
  { href: "#setup", label: "Paramètres" },
];

// Scrolls a dashboard section into the center of the viewport.
const scrollToCenteredSection = (event, href) => {
  const targetId = href.replace("#", "");
  const target = document.getElementById(targetId);

  if (!target) {
    return;
  }

  event.preventDefault();
  window.history.pushState(null, "", href);
  target.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};

// Renders the top header with status-dependent visual feedback.
export function Header({ status, simulationTimeSeconds = 0 }) {
  const isRunning = status === "Simulation en cours";
  const isPaused = status === "Pause";
  const logoPath = `${import.meta.env.BASE_URL}Logo-Patient-Zero.png`;
  const formattedTime = formatChartTimeAsSeconds(simulationTimeSeconds);

  return (
    <header className="app-header">
      <div className="brand">
        <img className="brand__logo" src={logoPath} alt="Logo Patient Zero" />
        <div>
          <h1>Patient Zero</h1>
          <p>Epidemic Simulator</p>
        </div>
      </div>

      <div className="main-nav-shell">
        <nav className="main-nav" aria-label="Navigation principale">
          {NAVIGATION_ITEMS.map((item) => (
            <a
              className="main-nav__link"
              href={item.href}
              key={item.href}
              onClick={(event) => scrollToCenteredSection(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <span className="main-nav__scroll-hint">Faire défiler</span>
      </div>

      <div className="header-metrics">
        <div className="header-status">
          <span
            className={[
              "header-status__dot",
              isRunning ? "header-status__dot--running" : "",
              isPaused ? "header-status__dot--paused" : "",
            ].join(" ")}
          />
          <span>{status}</span>
        </div>

        <div className="tick-counter">Temps écoulé = {formattedTime}</div>
      </div>
    </header>
  );
}
