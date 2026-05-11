// Purpose: Unit tests for pure infection distance, probability, and recovery rules.
import { describe, expect, it } from "vitest";
import { Individual } from "./Individual";
import {
  calculateDistance,
  calculateInfectionProbability,
  isWithinInfectionRadius,
  shouldInfect,
  shouldRecover,
} from "./infectionRules";

const createIndividual = (x, y) => new Individual({ id: 1, x, y });

const createProbabilitySettings = (overrides = {}) => ({
  contactDuration: 1,
  distance: 10,
  infectionRadius: 20,
  referenceContactDuration: 1,
  transmissionProbability: 0.25,
  ...overrides,
});

describe("infectionRules", () => {
  it("calculates horizontal distance between two individuals", () => {
    expect(calculateDistance(createIndividual(0, 0), createIndividual(5, 0))).toBe(5);
  });

  it("calculates vertical distance between two individuals", () => {
    expect(calculateDistance(createIndividual(0, 0), createIndividual(0, 7))).toBe(7);
  });

  it("calculates diagonal distance between two individuals", () => {
    expect(calculateDistance(createIndividual(0, 0), createIndividual(3, 4))).toBe(5);
  });

  it("returns zero when two individuals have the same position", () => {
    expect(calculateDistance(createIndividual(12, 8), createIndividual(12, 8))).toBe(0);
  });

  it("detects whether two individuals are inside the infection radius", () => {
    expect(isWithinInfectionRadius(createIndividual(0, 0), createIndividual(3, 4), 5)).toBe(true);
    expect(isWithinInfectionRadius(createIndividual(0, 0), createIndividual(6, 0), 5)).toBe(false);
  });

  it("returns zero probability when the distance is greater than the infection radius", () => {
    const probability = calculateInfectionProbability(createProbabilitySettings({
      distance: 21,
      infectionRadius: 20,
    }));

    expect(probability).toBe(0);
  });

  it("returns a probability between zero and one", () => {
    const probability = calculateInfectionProbability(createProbabilitySettings());

    expect(probability).toBeGreaterThanOrEqual(0);
    expect(probability).toBeLessThanOrEqual(1);
  });

  it("returns a higher probability when the distance is short", () => {
    const nearProbability = calculateInfectionProbability(createProbabilitySettings({ distance: 2 }));
    const farProbability = calculateInfectionProbability(createProbabilitySettings({ distance: 18 }));

    expect(nearProbability).toBeGreaterThan(farProbability);
  });

  it("returns a lower probability when the distance is close to the radius", () => {
    const middleProbability = calculateInfectionProbability(createProbabilitySettings({ distance: 10 }));
    const edgeProbability = calculateInfectionProbability(createProbabilitySettings({ distance: 20 }));

    expect(edgeProbability).toBeLessThan(middleProbability);
  });

  it("returns zero probability when transmissionProbability is zero", () => {
    const probability = calculateInfectionProbability(createProbabilitySettings({
      transmissionProbability: 0,
    }));

    expect(probability).toBe(0);
  });

  it("returns a probability close to one when transmission is high and distance is very short", () => {
    const probability = calculateInfectionProbability(createProbabilitySettings({
      distance: 0,
      infectionRadius: 20,
      transmissionProbability: 1,
    }));

    expect(probability).toBeCloseTo(1);
  });

  it("throws an explicit error when infectionRadius is invalid", () => {
    expect(() => calculateInfectionProbability(createProbabilitySettings({
      infectionRadius: 0,
    }))).toThrow("infectionRadius must be greater than 0.");
  });

  it("throws an explicit error when referenceContactDuration is invalid", () => {
    expect(() => calculateInfectionProbability(createProbabilitySettings({
      referenceContactDuration: 0,
    }))).toThrow("referenceContactDuration must be greater than 0.");
  });

  it("throws an explicit error when contactDuration is negative", () => {
    expect(() => calculateInfectionProbability(createProbabilitySettings({
      contactDuration: -1,
    }))).toThrow("contactDuration must be greater than or equal to 0.");
  });

  it("throws an explicit error when transmissionProbability is greater than one", () => {
    expect(() => calculateInfectionProbability(createProbabilitySettings({
      transmissionProbability: 1.01,
    }))).toThrow("transmissionProbability must be between 0 and 1.");
  });

  it("respects the formula-based transmission probability", () => {
    const certainContext = createProbabilitySettings({
      distance: 1,
      infectionRadius: 20,
      transmissionProbability: 1,
    });
    const impossibleContext = { ...certainContext, transmissionProbability: 0 };

    expect(shouldInfect(certainContext, () => 0.99)).toBe(true);
    expect(shouldInfect(impossibleContext, () => 0)).toBe(false);
  });

  it("recovers infected individuals after the configured duration", () => {
    const individual = new Individual({ id: 1, x: 0, y: 0 });
    individual.infect();
    individual.infectionTime = 10;

    expect(shouldRecover(individual, 10)).toBe(true);
  });

  it("does not recover infected individuals before the configured duration", () => {
    const individual = new Individual({ id: 1, x: 0, y: 0 });
    individual.infect();
    individual.infectionTime = 9.99;

    expect(shouldRecover(individual, 10)).toBe(false);
  });

  it("does not recover individuals that are not infected", () => {
    const individual = new Individual({ id: 1, x: 0, y: 0 });

    expect(shouldRecover(individual, 0)).toBe(false);
  });
});
