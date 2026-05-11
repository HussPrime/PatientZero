// Purpose: Unit tests for the chart history helpers used by the evolution graph.
import { describe, expect, it } from "vitest";
import {
  appendChartHistoryPoint,
  createChartHistoryPoint,
  createUniqueChartTimeLabels,
  formatChartTimeAsSeconds,
  formatChartTooltipLine,
  getChartMaxSeconds,
} from "./chartHistory";

describe("chartHistory", () => {
  it("creates a chart point from the current simulated time and stats", () => {
    const point = createChartHistoryPoint(1.2, {
      healthy: 8,
      infected: 3,
      recovered: 1,
      total: 12,
    });

    expect(point).toEqual({
      timeSeconds: 1.2,
      healthy: 8,
      infected: 3,
      recovered: 1,
    });
  });

  it("adds a chart point when its second is not already present", () => {
    const history = [
      createChartHistoryPoint(1, { healthy: 3, infected: 1, recovered: 0 }),
      createChartHistoryPoint(2, { healthy: 2, infected: 2, recovered: 0 }),
    ];
    const point = createChartHistoryPoint(3, { healthy: 1, infected: 2, recovered: 1 });

    expect(appendChartHistoryPoint(history, point)).toEqual([
      createChartHistoryPoint(1, { healthy: 3, infected: 1, recovered: 0 }),
      createChartHistoryPoint(2, { healthy: 2, infected: 2, recovered: 0 }),
      createChartHistoryPoint(3, { healthy: 1, infected: 2, recovered: 1 }),
    ]);
  });

  it("replaces the existing chart point on the matching whole second", () => {
    const history = [
      createChartHistoryPoint(1.1, { healthy: 3, infected: 1, recovered: 0 }),
      createChartHistoryPoint(2, { healthy: 2, infected: 2, recovered: 0 }),
    ];
    const point = createChartHistoryPoint(1.8, { healthy: 1, infected: 3, recovered: 0 });

    expect(appendChartHistoryPoint(history, point)).toEqual([
      createChartHistoryPoint(1, { healthy: 1, infected: 3, recovered: 0 }),
      createChartHistoryPoint(2, { healthy: 2, infected: 2, recovered: 0 }),
    ]);
  });

  it("places new chart points exactly on whole seconds", () => {
    const history = [
      createChartHistoryPoint(0, { healthy: 3, infected: 1, recovered: 0 }),
    ];
    const point = createChartHistoryPoint(2.8, { healthy: 1, infected: 2, recovered: 1 });

    expect(appendChartHistoryPoint(history, point)).toEqual([
      createChartHistoryPoint(0, { healthy: 3, infected: 1, recovered: 0 }),
      createChartHistoryPoint(2, { healthy: 1, infected: 2, recovered: 1 }),
    ]);
  });

  it("keeps the initial zero-second point when more zero-second data is recorded", () => {
    const history = [
      createChartHistoryPoint(0, { healthy: 3, infected: 1, recovered: 0 }),
    ];
    const point = createChartHistoryPoint(0.8, { healthy: 2, infected: 2, recovered: 0 });

    expect(appendChartHistoryPoint(history, point)).toEqual([
      createChartHistoryPoint(0, { healthy: 3, infected: 1, recovered: 0 }),
    ]);
  });

  it("formats chart time as seconds for display", () => {
    expect(formatChartTimeAsSeconds(0)).toBe("0s");
    expect(formatChartTimeAsSeconds(1)).toBe("1s");
    expect(formatChartTimeAsSeconds(1.25)).toBe("1s");
    expect(formatChartTimeAsSeconds(1.5)).toBe("1s");
  });

  it("displays each second only once in chart labels", () => {
    const history = [
      createChartHistoryPoint(1, { healthy: 3, infected: 1, recovered: 0 }),
      createChartHistoryPoint(1.2, { healthy: 3, infected: 1, recovered: 0 }),
      createChartHistoryPoint(1.9, { healthy: 2, infected: 2, recovered: 0 }),
      createChartHistoryPoint(2, { healthy: 1, infected: 2, recovered: 1 }),
      createChartHistoryPoint(2.4, { healthy: 1, infected: 1, recovered: 2 }),
      createChartHistoryPoint(3, { healthy: 1, infected: 0, recovered: 3 }),
    ];

    expect(createUniqueChartTimeLabels(history)).toEqual(["1s", "", "", "2s", "", "3s"]);
  });

  it("keeps the chart duration at least ten seconds wide", () => {
    expect(getChartMaxSeconds([])).toBe(10);
    expect(getChartMaxSeconds([
      createChartHistoryPoint(4.2, { healthy: 3, infected: 1, recovered: 0 }),
    ])).toBe(10);
    expect(getChartMaxSeconds([
      createChartHistoryPoint(12.2, { healthy: 3, infected: 1, recovered: 0 }),
    ])).toBe(13);
  });

  it("formats detailed chart tooltip lines", () => {
    expect(formatChartTooltipLine("Sains", 75, 100)).toBe("Sains: 75 individus (75 %)");
    expect(formatChartTooltipLine("Infectés", 0, 0)).toBe("Infectés: 0 individus (0 %)");
  });
});
