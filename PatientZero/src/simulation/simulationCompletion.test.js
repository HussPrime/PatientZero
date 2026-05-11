// Purpose: Unit tests for detecting the end of an epidemic simulation.
import { describe, expect, it } from "vitest";
import { isSimulationComplete } from "./simulationCompletion";

describe("isSimulationComplete", () => {
  it("ends the simulation when it has started and no infected individuals remain", () => {
    expect(isSimulationComplete({ healthy: 4, infected: 0, recovered: 6, total: 10 }, true)).toBe(true);
  });

  it("keeps the simulation active while infected individuals remain", () => {
    expect(isSimulationComplete({ healthy: 4, infected: 1, recovered: 5, total: 10 }, true)).toBe(false);
  });

  it("does not finish before the simulation has started", () => {
    expect(isSimulationComplete({ healthy: 10, infected: 0, recovered: 0, total: 10 }, false)).toBe(false);
  });
});
