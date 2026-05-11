// Purpose: Displays the app identity, current run status, and simulated time.
import { formatChartTimeAsSeconds } from "../simulation/chartHistory";

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

      <div className="tick-counter">t = {formattedTime}</div>
    </header>
  );
}
