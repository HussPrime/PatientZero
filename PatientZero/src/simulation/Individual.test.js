// Purpose: Unit tests for the individual state transitions.
import { describe, expect, it } from "vitest";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";
import { Individual } from "./Individual";

describe("Individual", () => {
  it("starts healthy by default", () => {
    const individual = new Individual({ id: 1, x: 10, y: 20 });

    expect(individual.isHealthy()).toBe(true);
    expect(individual.infectionTime).toBeNull();
  });

  it("can become infected", () => {
    const individual = new Individual({ id: 1, x: 10, y: 20 });

    individual.infect();

    expect(individual.state).toBe(INDIVIDUAL_STATES.INFECTED);
    expect(individual.infectionTime).toBe(0);
  });

  it("does not infect a recovered individual", () => {
    const individual = new Individual({ id: 1, x: 10, y: 20 });

    individual.recover();
    individual.infect();

    expect(individual.isRecovered()).toBe(true);
  });

  it("uses the speed multiplier when moving", () => {
    const individual = new Individual({ id: 1, x: 10, y: 20, vx: 2, vy: -1 });

    individual.move(100, 100, 3);

    expect(individual.x).toBe(16);
    expect(individual.y).toBe(17);
  });

  it("bounces using the circle radius as the visible boundary", () => {
    const individual = new Individual({ id: 1, x: 96, y: 4, vx: 2, vy: -2 });

    individual.move(100, 100, 1, 5);

    expect(individual.x).toBe(95);
    expect(individual.y).toBe(5);
    expect(individual.vx).toBe(-2);
    expect(individual.vy).toBe(2);
  });
});

