// Purpose: Root React component that wires the dashboard, settings, controls, and future simulation state together.
import { useMemo, useState } from "react";
import { ControlsPanel } from "./components/ControlsPanel";
import { DashboardLayout } from "./components/DashboardLayout";
import { EvolutionChart } from "./components/EvolutionChart";
import { Header } from "./components/Header";
import { LiveSettingsPanel } from "./components/LiveSettingsPanel";
import { SetupPanel } from "./components/SetupPanel";
import { SimulationCanvas } from "./components/SimulationCanvas";
import { StatsPanel } from "./components/StatsPanel";
import { DEFAULT_SETTINGS } from "./constants/defaultSettings";

const INITIAL_PARAMETERS = {
  populationSize: DEFAULT_SETTINGS.populationSize,
  initialInfected: DEFAULT_SETTINGS.initialInfected,
  infectionDuration: 120,
  initialSpeed: 2,
  transmissionRate: 28,
  recoveryRate: 12,
  infectionRadius: 18,
  randomMovement: true,
  simulationSpeed: 1,
};

// Renders the full application shell and owns the main simulation parameters.
function App() {
  const [status, setStatus] = useState("Prêt");
  const [tick, setTick] = useState(0);
  const [parameters, setParameters] = useState(INITIAL_PARAMETERS);

  const stats = useMemo(
    () => ({
      total: parameters.populationSize,
      healthy: parameters.populationSize - parameters.initialInfected,
      infected: parameters.initialInfected,
      recovered: 0,
    }),
    [parameters.initialInfected, parameters.populationSize],
  );

  // Updates one simulation parameter while preserving the others.
  const updateParameter = (name, value) => {
    setParameters((current) => ({ ...current, [name]: value }));
  };

  // Restores default values and clears the temporary simulation state.
  const resetParameters = () => {
    setParameters(INITIAL_PARAMETERS);
    setStatus("Prêt");
    setTick(0);
  };

  // Starts the first version of the simulation flow.
  const startSimulation = () => {
    // TODO: Generate the Population instance here before the p5.js canvas receives real individuals.
    setStatus("Simulation en cours");
    setTick(1);
  };

  // Stops the simulation without changing the configured parameters.
  const stopSimulation = () => {
    // TODO: Stop the logical update loop once propagation ticks are implemented.
    setStatus("Prêt");
  };

  return (
    <DashboardLayout
      header={<Header status={status} tick={tick} />}
      stats={<StatsPanel stats={stats} />}
      simulation={
        // TODO: Pass generated individuals here when Population.generate() is connected.
        <SimulationCanvas
          infectionRadius={parameters.infectionRadius}
        />
      }
      chart={
        // TODO: Replace this empty array with historical stats collected after each simulation tick.
        <EvolutionChart
          data={[]}
        />
      }
      controls={
        <ControlsPanel
          status={status}
          speed={parameters.simulationSpeed}
          onSpeedChange={(value) => updateParameter("simulationSpeed", value)}
          onPause={() => setStatus("Pause")}
          onStop={stopSimulation}
          onReset={resetParameters}
        />
      }
      liveSettings={
        <LiveSettingsPanel
          values={parameters}
          onChange={updateParameter}
        />
      }
      setup={
        <SetupPanel
          values={parameters}
          onChange={updateParameter}
          onReset={resetParameters}
          onStart={startSimulation}
        />
      }
    />
  );
}

export default App;
