// Purpose: Placeholder for the p5.js canvas that will render the moving population.
import { useEffect, useRef, useState } from "react";
import P5 from "p5";
import { IconChip, IconClose, IconReset } from "./Icons";
import { Legend } from "./Legend";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";
import { getSimulationTimeStepSeconds, updateSimulation } from "../simulation/updateSimulation";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 520;
const INDIVIDUAL_RADIUS = 4;
const MIN_CANVAS_WIDTH = 320;
const MIN_CANVAS_HEIGHT = 260;
const TARGET_FRAME_DURATION_SECONDS = 1 / 30;

const STATE_COLORS = {
  [INDIVIDUAL_STATES.HEALTHY]: "#43a047",
  [INDIVIDUAL_STATES.INFECTED]: "#e53935",
  [INDIVIDUAL_STATES.RECOVERED]: "#1e88e5",
  [INDIVIDUAL_STATES.DEAD]: "#334155",
};

const RESULT_BAR_COLORS = {
  infected: "#e53935",
  recovered: "#1e88e5",
  dead: "#020617",
};

// Reads the visible container size used by the responsive p5.js canvas.
const getCanvasSize = (element) => ({
  width: Math.max(MIN_CANVAS_WIDTH, Math.floor(element.clientWidth)),
  height: Math.max(MIN_CANVAS_HEIGHT, Math.floor(element.clientHeight)),
});

// Keeps a rendered point fully inside the p5.js canvas.
const clampToCanvas = (p, value, max, radius) => p.constrain(value, radius, max - radius);

// Draws one individual with the simple dot style used by the first canvas version.
const drawIndividual = (p, individual, infectionRadius) => {
  const color = STATE_COLORS[individual.state] ?? STATE_COLORS[INDIVIDUAL_STATES.HEALTHY];
  const scaleX = p.width / CANVAS_WIDTH;
  const scaleY = p.height / CANVAS_HEIGHT;
  const scale = Math.min(scaleX, scaleY);
  const radius = Math.max(3, INDIVIDUAL_RADIUS * scale);
  const x = clampToCanvas(p, individual.x * scaleX, p.width, radius);
  const y = clampToCanvas(p, individual.y * scaleY, p.height, radius);

  if (individual.state === INDIVIDUAL_STATES.INFECTED) {
    p.noStroke();
    p.fill(229, 57, 53, 30);
    p.circle(x, y, infectionRadius * scale * 2);
  }

  p.noStroke();
  p.fill(color);
  p.circle(x, y, radius * 2);
};

// Builds one continuous gradient where each state color is positioned from its final share.
const createResultBarGradient = ({ infected = 0, recovered = 0, dead = 0 }) => {
  const total = infected + recovered + dead;
  const segments = [
    { count: infected, color: RESULT_BAR_COLORS.infected },
    { count: recovered, color: RESULT_BAR_COLORS.recovered },
    { count: dead, color: RESULT_BAR_COLORS.dead },
  ].filter((segment) => segment.count > 0);

  if (segments.length === 0) {
    return "transparent";
  }

  if (segments.length === 1) {
    return segments[0].color;
  }

  let cumulative = 0;
  const colorStops = segments.flatMap((segment, index) => {
    const start = (cumulative / total) * 100;
    const middle = ((cumulative + (segment.count / 2)) / total) * 100;

    cumulative += segment.count;

    if (index === 0) {
      return [`${segment.color} 0%`, `${segment.color} ${middle}%`];
    }

    if (index === segments.length - 1) {
      return [`${segment.color} ${middle}%`, `${segment.color} 100%`];
    }

    return [`${segment.color} ${middle}%`, `${segment.color} ${start + ((cumulative / total) * 100 - start) / 2}%`];
  });

  return `linear-gradient(90deg, ${colorStops.join(", ")})`;
};

// Renders the p5.js simulation panel and applies the current run speed.
export function SimulationCanvas({
  endReason = "completed",
  individuals = [],
  infectionRadius = 18,
  isFinished = false,
  isRunning = false,
  parameters,
  simulationSpeed = 1,
  stats,
  timeSeconds = 0,
  onSimulationFrame,
  onReplay,
  onToggleRun,
}) {
  const containerRef = useRef(null);
  const [dismissedResultKey, setDismissedResultKey] = useState(null);
  const dataRef = useRef({
    individuals,
    infectionRadius,
    isRunning,
    onSimulationFrame,
    parameters,
    simulationSpeed,
  });

  useEffect(() => {
    dataRef.current.individuals = individuals;
    dataRef.current.infectionRadius = infectionRadius;
    dataRef.current.isRunning = isRunning;
    dataRef.current.onSimulationFrame = onSimulationFrame;
    dataRef.current.parameters = parameters;
    dataRef.current.simulationSpeed = simulationSpeed;
  }, [individuals, infectionRadius, isRunning, onSimulationFrame, parameters, simulationSpeed]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

    let isDisposed = false;

    const sketch = (p) => {
      p.setup = () => {
        const size = getCanvasSize(containerRef.current);
        const canvas = p.createCanvas(size.width, size.height);
        canvas.elt.style.position = "absolute";
        canvas.elt.style.inset = "0";
        canvas.elt.style.width = "100%";
        canvas.elt.style.height = "100%";
        canvas.elt.style.zIndex = "0";
        p.frameRate(30);
      };

      p.windowResized = () => {
        const size = getCanvasSize(containerRef.current);
        p.resizeCanvas(size.width, size.height);
      };

      p.draw = () => {
        if (isDisposed) {
          return;
        }

        p.clear();
        const {
          individuals: currentIndividuals,
          infectionRadius: currentRadius,
          isRunning: currentIsRunning,
          onSimulationFrame: currentOnSimulationFrame,
          parameters: currentParameters,
          simulationSpeed: currentSpeed,
        } = dataRef.current;

        if (currentIndividuals.length === 0) {
          p.noStroke();
          p.fill("#7b8699");
          return;
        }

        if (currentIsRunning) {
          const frameDurationSeconds = Number.isFinite(p.deltaTime)
            ? p.deltaTime / 1000
            : TARGET_FRAME_DURATION_SECONDS;
          const movementMultiplier = currentSpeed * (frameDurationSeconds / TARGET_FRAME_DURATION_SECONDS);
          const nextParameters = { ...currentParameters, frameDurationSeconds };
          const timeStepSeconds = getSimulationTimeStepSeconds(nextParameters);

          currentIndividuals.forEach((individual) => {
            individual.move(CANVAS_WIDTH, CANVAS_HEIGHT, movementMultiplier, INDIVIDUAL_RADIUS);
          });

          updateSimulation(currentIndividuals, nextParameters);
          currentOnSimulationFrame?.(timeStepSeconds);
        }

        currentIndividuals.forEach((individual) => {
          drawIndividual(p, individual, currentRadius);
        });
      };
    };

    const instance = new P5(sketch, containerRef.current);
    const resizeObserver = new ResizeObserver(() => {
      const size = getCanvasSize(containerRef.current);
      instance.resizeCanvas(size.width, size.height);
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      isDisposed = true;
      instance.noLoop();
      resizeObserver.disconnect();
      instance.remove();
    };
  }, []);

  // Toggles play/pause when the user activates the simulation area.
  const handleCanvasClick = () => {
    onToggleRun();
  };

  // Toggles play/pause from the keyboard while the simulation is not ended.
  const handleCanvasKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCanvasClick();
    }
  };

  const affectedCount = (stats?.recovered ?? 0) + (stats?.infected ?? 0) + (stats?.dead ?? 0);
  const affectedPercent = stats?.total > 0 ? Math.round((affectedCount / stats.total) * 100) : 0;
  const resultBarGradient = createResultBarGradient({
    infected: stats?.infected ?? 0,
    recovered: stats?.recovered ?? 0,
    dead: stats?.dead ?? 0,
  });
  const finalTime = Math.floor(timeSeconds);
  const isStopped = endReason === "stopped";
  const resultKey = [
    endReason,
    finalTime,
    stats?.healthy ?? 0,
    stats?.infected ?? 0,
    stats?.recovered ?? 0,
    stats?.dead ?? 0,
  ].join(":");
  const shouldShowResult = isFinished && dismissedResultKey !== resultKey;

  return (
    <section className="panel simulation-panel">
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon">
            <IconChip size={15} />
          </span>
          <div>
            <h2>Zone de simulation</h2>
            <p>Population en mouvement, propagation en temps réel</p>
          </div>
        </div>
        <span className="panel__badge">Interactif</span>
      </div>

      <div
        ref={containerRef}
        className="simulation-canvas"
        aria-label="Zone de simulation, cliquer pour démarrer ou mettre en pause"
        onClick={handleCanvasClick}
        onKeyDown={handleCanvasKeyDown}
        role="button"
        tabIndex={0}
      >
        {individuals.length === 0 ? <div className="simulation-empty-state">Population non générée</div> : null}
        <Legend />
        {shouldShowResult ? (
          <div
            className={`simulation-result ${isStopped ? "is-stopped" : "is-complete"}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Fermer le résumé de fin"
              className="simulation-result__close"
              onClick={(event) => {
                event.stopPropagation();
                setDismissedResultKey(resultKey);
              }}
              type="button"
            >
              <IconClose size={15} />
            </button>
            <span className="simulation-result__eyebrow">{isStopped ? "Simulation arrêtée" : "Simulation terminée"}</span>
            <strong>{isStopped ? "Simulation stoppée manuellement" : "Plus aucun individu infecté"}</strong>
            <p>
              {affectedPercent} % de la population a été touchée après {finalTime}s.
            </p>
            <div className="simulation-result__metrics" aria-label="Résumé de fin de simulation">
              <span>
                <strong>{affectedCount}</strong>
                Touchés
              </span>
              <span>
                <strong>{stats.recovered}</strong>
                Guéris
              </span>
              <span>
                <strong>{stats.dead ?? 0}</strong>
                Morts
              </span>
              <span>
                <strong>{stats.infected}</strong>
                Infectés
              </span>
              <span>
                <strong>{stats.healthy}</strong>
                Sains
              </span>
            </div>
            <div
              className="simulation-result__bar"
              aria-label={`${affectedPercent} % de la population touchée: ${stats.infected} infectés, ${stats.recovered} guéris, ${stats.dead ?? 0} morts`}
              style={{ "--affected-percent": `${affectedPercent}%` }}
            >
              <span
                className="simulation-result__bar-fill"
                style={{ background: resultBarGradient }}
              />
            </div>
            <button
                className="button button--primary"
                onClick={(event) => {
                  event.stopPropagation();
                  onReplay();
                }}
                type="button"
              >
              <IconReset size={13} />
              Rejouer une simulation
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
