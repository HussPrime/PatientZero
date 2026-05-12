// Purpose: Root React component that wires the dashboard, settings, controls, and future simulation state together.
import { useMemo, useRef, useState } from "react";
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
import { appendChartHistoryPoint, createChartHistoryPoint } from "./simulation/chartHistory";
import { isSimulationComplete } from "./simulation/simulationCompletion";

const INITIAL_PARAMETERS = {
  populationSize: DEFAULT_SETTINGS.populationSize,
  initialInfected: DEFAULT_SETTINGS.initialInfected,
  infectionDuration: DEFAULT_SETTINGS.infectionDuration,
  movementSpeed: DEFAULT_SETTINGS.movementSpeed,
  transmissionRate: DEFAULT_SETTINGS.transmissionRate,
  infectionRadius: DEFAULT_SETTINGS.infectionRadius,
  simulationSpeed: DEFAULT_SETTINGS.simulationSpeed,
};

const POPULATION_PREVIEW_FIELDS = new Set(["populationSize", "initialInfected", "movementSpeed"]);
const CHART_SAMPLE_INTERVAL_FRAMES = 5;
const FINISHED_STATUS = "Simulation terminée";
const STOPPED_STATUS = "Simulation arrêtée";
const ACTIVE_STATUSES = ["Simulation en cours", "Pause"];
const ENDED_STATUSES = [FINISHED_STATUS, STOPPED_STATUS];

// Creates a generated population from the current UI parameters.
const createPopulationFromParameters = (parameters) => {
  const population = new Population({
    populationSize: parameters.populationSize,
    initialInfected: parameters.initialInfected,
    movementSpeed: parameters.movementSpeed,
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

  if (changedField === "movementSpeed") {
    population.setMovementSpeed(parameters.movementSpeed);
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
  const [simulationTimeSeconds, setSimulationTimeSeconds] = useState(0);
  const [chartHistory, setChartHistory] = useState([]);
  const [parameters, setParameters] = useState(INITIAL_PARAMETERS);
  const [population, setPopulation] = useState(() => createPopulationFromParameters(INITIAL_PARAMETERS));
  const simulationTimeRef = useRef(0);
  const frameCountRef = useRef(0);

  const stats = useMemo(
    () => population.getStats(),
    [population],
  );
  const isSimulationEnded = ENDED_STATUSES.includes(status);
  const isSetupDisabled = !["Prêt", ...ENDED_STATUSES].includes(status);
  const isSimulationRunning = status === "Simulation en cours";
  const isSimulationActive = ACTIVE_STATUSES.includes(status);
  const isSimulationStarted = [...ACTIVE_STATUSES, ...ENDED_STATUSES].includes(status);

  // Clears the elapsed session state without changing the selected parameters.
  const clearSimulationSession = () => {
    simulationTimeRef.current = 0;
    frameCountRef.current = 0;
    setSimulationTimeSeconds(0);
    setChartHistory([]);
  };

  // Updates one simulation parameter while preserving the others.
  const updateParameter = (name, value) => {
    const nextParameters = { ...parameters, [name]: value };

    setParameters(nextParameters);

    if (isSimulationEnded) {
      setPopulation(createPopulationFromParameters(nextParameters));
      setStatus("Prêt");
      clearSimulationSession();
      return;
    }

    if (POPULATION_PREVIEW_FIELDS.has(name)) {
      if (status === "Prêt") {
        clearSimulationSession();
      }

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
    clearSimulationSession();
  };

  // Restarts the simulation with the current parameters instead of restoring defaults.
  const replaySimulation = () => {
    setPopulation(createPopulationFromParameters(parameters));
    setStatus("Prêt");
    clearSimulationSession();
  };

  // Refreshes React state after p5.js has applied one simulation frame.
  const handleSimulationFrame = (timeStepSeconds = 0) => {
    const nextTimeSeconds = simulationTimeRef.current + timeStepSeconds;
    const nextFrameCount = frameCountRef.current + 1;

    simulationTimeRef.current = nextTimeSeconds;
    frameCountRef.current = nextFrameCount;
    setSimulationTimeSeconds(nextTimeSeconds);

    setPopulation((currentPopulation) => {
      const nextPopulation = new Population(currentPopulation.settings);

      nextPopulation.individuals = currentPopulation.getIndividuals().slice();
      const nextStats = nextPopulation.getStats();

      if (status === "Simulation en cours" && isSimulationComplete(nextStats, isSimulationStarted)) {
        setStatus(FINISHED_STATUS);
      }

      return nextPopulation;
    });

    if (nextFrameCount % CHART_SAMPLE_INTERVAL_FRAMES === 0) {
      setChartHistory((currentHistory) => appendChartHistoryPoint(
        currentHistory,
        createChartHistoryPoint(nextTimeSeconds, population.getStats()),
      ));
    }
  };

  // Starts the first version of the simulation flow.
  const startSimulation = () => {
    setStatus("Simulation en cours");
    setChartHistory((currentHistory) => (
      currentHistory.length === 0
        ? [
          createChartHistoryPoint(0, stats),
          createChartHistoryPoint(1, stats),
        ]
        : currentHistory
    ));
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
    setStatus(STOPPED_STATUS);
  };

  return (
    <DashboardLayout
      header={<Header status={status} simulationTimeSeconds={simulationTimeSeconds} />}
      stats={<StatsPanel stats={stats} />}
      simulation={
        <SimulationCanvas
          individuals={population?.getIndividuals() ?? []}
          infectionRadius={parameters.infectionRadius}
          endReason={status === STOPPED_STATUS ? "stopped" : "completed"}
          isFinished={status === FINISHED_STATUS || status === STOPPED_STATUS}
          isRunning={isSimulationRunning}
          parameters={parameters}
          simulationSpeed={parameters.simulationSpeed}
          stats={stats}
          timeSeconds={simulationTimeSeconds}
          onSimulationFrame={handleSimulationFrame}
          onToggleRun={toggleSimulation}
          onReplay={replaySimulation}
        />
      }
      chart={
        <EvolutionChart
          data={chartHistory}
          liveStats={stats}
          liveTimeSeconds={simulationTimeSeconds}
        />
      }
      controls={
        <ControlsPanel
          status={status}
          speed={parameters.simulationSpeed}
          onSpeedChange={(value) => updateParameter("simulationSpeed", value)}
          onToggleRun={toggleSimulation}
          onStop={stopSimulation}
          onReset={replaySimulation}
          isStopDisabled={status === FINISHED_STATUS || status === STOPPED_STATUS}
          stats={stats}
          timeSeconds={simulationTimeSeconds}
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
          isSimulationStarted={isSimulationActive}
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
