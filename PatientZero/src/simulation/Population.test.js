import { describe, expect, it } from "vitest";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";
import { Population } from "./Population";

const createStableRng = () => {
  let value = 0.1;

  return () => {
    value = (value + 0.23) % 1;
    return value;
  };
};

describe("Population", () => {
  it("generates the requested number of individuals", () => {
    const population = new Population(
      { populationSize: 12, initialInfected: 2, simulationWidth: 100, simulationHeight: 80 },
      createStableRng(),
    );

    population.generate();

    expect(population.getTotal()).toBe(12);
  });

  it("generates exactly the requested initial infected count", () => {
    const population = new Population(
      { populationSize: 20, initialInfected: 5, simulationWidth: 100, simulationHeight: 80 },
      createStableRng(),
    );

    population.generate();

    expect(population.getStats()).toEqual({
      healthy: 15,
      infected: 5,
      recovered: 0,
      total: 20,
    });
  });

  it("does not generate recovered individuals initially", () => {
    const population = new Population(
      { populationSize: 10, initialInfected: 3, simulationWidth: 100, simulationHeight: 80 },
      createStableRng(),
    );

    const individuals = population.generate();

    expect(individuals.some((individual) => individual.state === INDIVIDUAL_STATES.RECOVERED)).toBe(false);
  });

  it("rejects more initial infected individuals than the population size", () => {
    expect(
      () => new Population({ populationSize: 3, initialInfected: 4, simulationWidth: 100, simulationHeight: 80 }),
    ).toThrow("initialInfected cannot be greater than populationSize.");
  });
});

