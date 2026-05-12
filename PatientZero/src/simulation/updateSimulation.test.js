// Purpose: Unit tests for one logical propagation step.
import { describe, expect, it } from "vitest";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";
import { Individual } from "./Individual";
import { getSimulationTimeStepSeconds, updateSimulation } from "./updateSimulation";

const createUpdateSettings = (overrides = {}) => ({
  infectionDuration: 4,
  infectionRadius: 5,
  simulationSpeed: 1,
  transmissionRate: 100,
  ...overrides,
});

describe("updateSimulation", () => {
  it("converts real frame duration and speed into simulated seconds", () => {
    expect(getSimulationTimeStepSeconds(createUpdateSettings({ simulationSpeed: 1 }))).toBeCloseTo(1 / 30);
    expect(getSimulationTimeStepSeconds(createUpdateSettings({ simulationSpeed: 5 }))).toBeCloseTo(5 / 30);
    expect(getSimulationTimeStepSeconds(createUpdateSettings({
      frameDurationSeconds: 1,
      simulationSpeed: 5,
    }))).toBeCloseTo(5);
  });

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

  it("keeps a healthy individual healthy when transmission fails inside the radius", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    const healthyIndividual = new Individual({ id: 2, x: 3, y: 4 });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual, healthyIndividual], createUpdateSettings(), () => 1);

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

  it("does not evaluate infection twice for a candidate already infected during the same tick", () => {
    const firstInfected = new Individual({ id: 1, x: 0, y: 0 });
    const secondInfected = new Individual({ id: 2, x: 1, y: 0 });
    const healthyIndividual = new Individual({ id: 3, x: 2, y: 0 });
    let rngCalls = 0;

    firstInfected.infect();
    secondInfected.infect();

    updateSimulation(
      [firstInfected, secondInfected, healthyIndividual],
      createUpdateSettings(),
      () => {
        rngCalls += 1;
        return 0;
      },
    );

    expect(healthyIndividual.state).toBe(INDIVIDUAL_STATES.INFECTED);
    expect(rngCalls).toBe(1);
  });

  it("keeps an already infected individual infected until the duration is reached", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual], createUpdateSettings({ infectionDuration: 4 }), () => 0);

    expect(infectedIndividual.state).toBe(INDIVIDUAL_STATES.INFECTED);
  });

  it("uses zero as the elapsed infection time fallback", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();
    infectedIndividual.infectionTime = null;

    updateSimulation([infectedIndividual], createUpdateSettings({ transmissionRate: 0 }), () => 0.99);

    expect(infectedIndividual.infectionTime).toBeCloseTo(1 / 30);
  });

  it("increments infection time in seconds at x1 and recovers when the duration is reached", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();
    infectedIndividual.infectionTime = 3.99;

    updateSimulation([infectedIndividual], createUpdateSettings({ transmissionRate: 0 }), () => 0.99);

    expect(infectedIndividual.infectionTime).toBeCloseTo(4.023);
    expect(infectedIndividual.state).toBe(INDIVIDUAL_STATES.RECOVERED);
  });

  it("increments infection time proportionally when simulation speed is higher", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();

    updateSimulation([infectedIndividual], createUpdateSettings({
      simulationSpeed: 5,
      transmissionRate: 0,
    }), () => 0.99);

    expect(infectedIndividual.infectionTime).toBeCloseTo(5 / 30);
  });

  it("kills infected individuals at the end of the duration when cure rate is zero", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();
    infectedIndividual.infectionTime = 3.99;

    updateSimulation([infectedIndividual], createUpdateSettings({
      cureRate: 0,
      transmissionRate: 0,
    }), () => 0.99);

    expect(infectedIndividual.state).toBe(INDIVIDUAL_STATES.DEAD);
  });

  it("recovers infected individuals at the end of the duration when cure rate is complete", () => {
    const infectedIndividual = new Individual({ id: 1, x: 0, y: 0 });
    infectedIndividual.infect();
    infectedIndividual.infectionTime = 3.99;

    updateSimulation([infectedIndividual], createUpdateSettings({
      cureRate: 100,
      transmissionRate: 0,
    }), () => 0);

    expect(infectedIndividual.state).toBe(INDIVIDUAL_STATES.RECOVERED);
  });
});
