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
});

