// Purpose: Unit tests for one logical propagation step.
import { describe, expect, it } from "vitest";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";
import { Individual } from "./Individual";
import { updateSimulation } from "./updateSimulation";

const createUpdateSettings = (overrides = {}) => ({
  infectionDuration: 4,
  infectionRadius: 5,
  simulationSpeed: 1,
  transmissionRate: 100,
  ...overrides,
});

describe("updateSimulation", () => {
  it("infects a healthy individual inside the radius when transmission is certain", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    const healthyIndividual = new Individual({ id: 2, x: 3, y: 4 });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual, healthyIndividual], createUpdateSettings(), () => 0);

    expect(healthyIndividual.state).toBe(INDIVIDUAL_STATES.INFECTED);
  });

  it("does not infect a healthy individual outside the radius", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    const healthyIndividual = new Individual({ id: 2, x: 20, y: 20 });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual, healthyIndividual], createUpdateSettings(), () => 0);

    expect(healthyIndividual.state).toBe(INDIVIDUAL_STATES.HEALTHY);
  });

  it("does not infect a recovered individual again", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    const recoveredIndividual = new Individual({
      id: 2,
      x: 3,
      y: 4,
      state: INDIVIDUAL_STATES.RECOVERED,
    });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual, recoveredIndividual], createUpdateSettings(), () => 0);

    expect(recoveredIndividual.state).toBe(INDIVIDUAL_STATES.RECOVERED);
  });

  it("keeps an already infected individual infected until the duration is reached", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual], createUpdateSettings({ infectionDuration: 4 }), () => 0);

    expect(infectedIndividual.state).toBe(INDIVIDUAL_STATES.INFECTED);
  });

  it("increments infection time in seconds at x1 and recovers when the duration is reached", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();
    infectedIndividual.infectionTime = 3.99;

    updateSimulation([infectedIndividual], createUpdateSettings({ transmissionRate: 0 }), () => 0.99);

    expect(infectedIndividual.infectionTime).toBeCloseTo(4.023);
    expect(infectedIndividual.state).toBe(INDIVIDUAL_STATES.RECOVERED);
  });

  it("increments infection time faster when simulation speed is higher", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual], createUpdateSettings({
      simulationSpeed: 5,
      transmissionRate: 0,
    }), () => 0.99);

    expect(infectedIndividual.infectionTime).toBeCloseTo(5 / 30);
  });
});
