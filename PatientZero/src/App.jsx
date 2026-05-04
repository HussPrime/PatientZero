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

  const updateParameter = (name, value) => {
    setParameters((current) => ({ ...current, [name]: value }));
  };

  const resetParameters = () => {
    setParameters(INITIAL_PARAMETERS);
    setStatus("Prêt");
    setTick(0);
  };

  const startSimulation = () => {
    setStatus("Simulation en cours");
    setTick(1);
  };

  const stopSimulation = () => {
    setStatus("Prêt");
  };

  return (
    <DashboardLayout
      header={<Header status={status} tick={tick} />}
      stats={<StatsPanel stats={stats} />}
      simulation={
        <SimulationCanvas
          infectionRadius={parameters.infectionRadius}
        />
      }
      chart={<EvolutionChart data={[]} />}
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
