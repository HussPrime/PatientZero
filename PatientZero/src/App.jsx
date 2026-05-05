// Purpose: Root React component that wires the dashboard, settings, controls, and future simulation state together.
import { useEffect, useMemo, useState } from "react";
import { ControlsPanel } from "./components/ControlsPanel";
import { DashboardLayout } from "./components/DashboardLayout";
import { EvolutionChart } from "./components/EvolutionChart";
import { Header } from "./components/Header";
import { LiveSettingsPanel } from "./components/LiveSettingsPanel";
import { SetupPanel } from "./components/SetupPanel";
import { SimulationCanvas } from "./components/SimulationCanvas";
import { StatsPanel } from "./components/StatsPanel";
import { DEFAULT_SETTINGS } from "./constants/defaultSettings";
import { Population } from "./simulation/Population";

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

const POPULATION_PREVIEW_FIELDS = new Set(["populationSize", "initialInfected", "initialSpeed"]);
const BASE_TICK_INTERVAL_MS = 1000;

// Creates a generated population from the current UI parameters.
const createPopulationFromParameters = (parameters) => {
  const population = new Population({
    populationSize: parameters.populationSize,
    initialInfected: parameters.initialInfected,
    minInitialSpeed: -parameters.initialSpeed,
    maxInitialSpeed: parameters.initialSpeed,
  });

  population.generate();
  return population;
};

// Applies setup changes without replacing every existing individual.
const updatePopulationPreview = (population, parameters, changedField) => {
  if (changedField === "populationSize") {
    population.resize(parameters.populationSize);
  }

  if (changedField === "initialInfected") {
    population.setInitialInfected(parameters.initialInfected);
  }

  if (changedField === "initialSpeed") {
    population.setInitialSpeed(parameters.initialSpeed);
  }

  return population;
};

// Moves the viewport to the visual simulation area after the layout updates.
const scrollToSimulationPanel = () => {
  requestAnimationFrame(() => {
    document.querySelector(".simulation-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  });
};

// Renders the full application shell and owns the main simulation parameters.
function App() {
  const [status, setStatus] = useState("Prêt");
  const [tick, setTick] = useState(0);
  const [parameters, setParameters] = useState(INITIAL_PARAMETERS);
  const [population, setPopulation] = useState(() => createPopulationFromParameters(INITIAL_PARAMETERS));

  const stats = useMemo(
    () => population.getStats(),
    [population],
  );
  const isSetupDisabled = status !== "Prêt";
  const isSimulationRunning = status === "Simulation en cours";
  const isSimulationStarted = status === "Simulation en cours" || status === "Pause";

  useEffect(() => {
    if (!isSimulationRunning) {
      return undefined;
    }

    const intervalMs = BASE_TICK_INTERVAL_MS / parameters.simulationSpeed;
    const intervalId = window.setInterval(() => {
      setTick((currentTick) => currentTick + 1);
    }, intervalMs);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isSimulationRunning, parameters.simulationSpeed]);

  // Updates one simulation parameter while preserving the others.
  const updateParameter = (name, value) => {
    const nextParameters = { ...parameters, [name]: value };

    setParameters(nextParameters);

    if (POPULATION_PREVIEW_FIELDS.has(name)) {
      setPopulation((currentPopulation) => {
        const nextPopulation = new Population(currentPopulation.settings);

        nextPopulation.individuals = currentPopulation.getIndividuals().slice();
        updatePopulationPreview(nextPopulation, nextParameters, name);
        return nextPopulation;
      });
    }
  };

  // Restores default values and clears the temporary simulation state.
  const resetParameters = () => {
    setParameters(INITIAL_PARAMETERS);
    setPopulation(createPopulationFromParameters(INITIAL_PARAMETERS));
    setStatus("Prêt");
    setTick(0);
  };

  // Starts the first version of the simulation flow.
  const startSimulation = () => {
    setStatus("Simulation en cours");
    setTick((currentTick) => (currentTick === 0 ? 1 : currentTick));
    scrollToSimulationPanel();
  };

  // Toggles the main run state from the controls panel.
  const toggleSimulation = () => {
    if (status === "Simulation en cours") {
      setStatus("Pause");
      return;
    }

    startSimulation();
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
        <SimulationCanvas
          individuals={population?.getIndividuals() ?? []}
          infectionRadius={parameters.infectionRadius}
          isRunning={isSimulationRunning}
          simulationSpeed={parameters.simulationSpeed}
          onToggleRun={toggleSimulation}
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
          onToggleRun={toggleSimulation}
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
          disabled={isSetupDisabled}
          isSimulationStarted={isSimulationStarted}
          values={parameters}
          onChange={updateParameter}
          onReset={resetParameters}
          onStop={stopSimulation}
          onStart={startSimulation}
        />
      }
    />
  );
}

export default App;
