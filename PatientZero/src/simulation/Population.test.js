// Purpose: Unit tests for population generation, validation, and initial statistics.
import { describe, expect, it } from "vitest";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";
import { Population } from "./Population";

const createStableRng = () => {
  let value = 0.1;

  // Returns a predictable sequence so generated populations are testable.
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

  it("keeps existing individuals when the population grows", () => {
    const population = new Population(
      { populationSize: 3, initialInfected: 1, simulationWidth: 100, simulationHeight: 80 },
      createStableRng(),
    );
    const initialIndividuals = population.generate();
    const firstIndividual = initialIndividuals[0];

    population.resize(5);

    expect(population.getTotal()).toBe(5);
    expect(population.getIndividuals()[0]).toBe(firstIndividual);
  });

  it("keeps remaining individuals when the population shrinks", () => {
    const population = new Population(
      { populationSize: 5, initialInfected: 1, simulationWidth: 100, simulationHeight: 80 },
      createStableRng(),
    );
    const initialIndividuals = population.generate();
    const firstIndividual = initialIndividuals[0];

    population.resize(3);

    expect(population.getTotal()).toBe(3);
    expect(population.getIndividuals()[0]).toBe(firstIndividual);
  });

  it("updates point velocities when movement speed changes", () => {
    const population = new Population(
      { populationSize: 3, initialInfected: 1, simulationWidth: 100, simulationHeight: 80, movementSpeed: 1 },
      createStableRng(),
    );

    population.generate();
    population.setMovementSpeed(3);

    population.getIndividuals().forEach((individual) => {
      expect(Math.abs(individual.vx)).toBeLessThanOrEqual(3);
      expect(Math.abs(individual.vy)).toBeLessThanOrEqual(3);
    });
  });

  it("rejects negative movement speed values", () => {
    expect(
      () => new Population({
        populationSize: 3,
        initialInfected: 1,
        simulationWidth: 100,
        simulationHeight: 80,
        movementSpeed: -1,
      }),
    ).toThrow("movementSpeed must be zero or greater.");
  });
});

