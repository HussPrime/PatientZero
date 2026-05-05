// Purpose: Placeholder for the p5.js canvas that will render the moving population.
import { useEffect, useRef } from "react";
import P5 from "p5";
import { IconChip } from "./Icons";
import { Legend } from "./Legend";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";

const CANVAS_WIDTH = 900;
const CANVAS_HEIGHT = 520;
const INDIVIDUAL_RADIUS = 4;
const MIN_CANVAS_WIDTH = 320;
const MIN_CANVAS_HEIGHT = 260;

const STATE_COLORS = {
  [INDIVIDUAL_STATES.HEALTHY]: "#43a047",
  [INDIVIDUAL_STATES.INFECTED]: "#e53935",
  [INDIVIDUAL_STATES.RECOVERED]: "#1e88e5",
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

// Renders the p5.js simulation panel and applies the current run speed.
export function SimulationCanvas({
  individuals = [],
  infectionRadius = 18,
  isRunning = false,
  simulationSpeed = 1,
  onToggleRun,
}) {
  const containerRef = useRef(null);
  const dataRef = useRef({ individuals, infectionRadius, isRunning, simulationSpeed });

  useEffect(() => {
    dataRef.current.individuals = individuals;
    dataRef.current.infectionRadius = infectionRadius;
    dataRef.current.isRunning = isRunning;
    dataRef.current.simulationSpeed = simulationSpeed;
  }, [individuals, infectionRadius, isRunning, simulationSpeed]);

  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }

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
        p.clear();
        const {
          individuals: currentIndividuals,
          infectionRadius: currentRadius,
          isRunning: currentIsRunning,
          simulationSpeed: currentSpeed,
        } = dataRef.current;

        if (currentIndividuals.length === 0) {
          p.noStroke();
          p.fill("#7b8699");
          return;
        }

        currentIndividuals.forEach((individual) => {
          if (currentIsRunning) {
            individual.move(CANVAS_WIDTH, CANVAS_HEIGHT, currentSpeed, INDIVIDUAL_RADIUS);
          }

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
      resizeObserver.disconnect();
      instance.remove();
    };
  }, []);

  // Toggles play/pause when the user activates the simulation area.
  const handleCanvasKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggleRun();
    }
  };

  return (
    <section className="panel simulation-panel">
      <div className="panel__header">
        <div className="panel-title">
          <span className="panel-title__icon">
            <IconChip size={15} />
          </span>
          <div>
            <h2>Zone de simulation</h2>
            <p>Canvas prêt pour le rendu p5.js</p>
          </div>
        </div>
        <span className="panel__badge">Responsive</span>
      </div>

      <div
        ref={containerRef}
        className="simulation-canvas"
        aria-label="Zone de simulation, cliquer pour démarrer ou mettre en pause"
        onClick={onToggleRun}
        onKeyDown={handleCanvasKeyDown}
        role="button"
        tabIndex={0}
      >
        {individuals.length === 0 ? <div className="simulation-empty-state">Population non générée</div> : null}
        <Legend />
      </div>
    </section>
  );
}
