// Purpose: Builds the lightweight history consumed by the Chart.js evolution graph.

// Creates one chart point from the current simulated time and population counters.
export function createChartHistoryPoint(timeSeconds, stats) {
  return {
    timeSeconds,
    healthy: stats.healthy,
    infected: stats.infected,
    recovered: stats.recovered,
  };
}

// Adds one point per displayed second, replacing the latest point when the second already exists.
export function appendChartHistoryPoint(history, point) {
  const pointSecond = Math.floor(point.timeSeconds);
  const normalizedPoint = { ...point, timeSeconds: pointSecond };
  const existingPointIndex = history.findIndex((historyPoint) => (
    Math.floor(historyPoint.timeSeconds) === pointSecond
  ));

  if (existingPointIndex === -1) {
    return [...history, normalizedPoint];
  }

  if (pointSecond === 0) {
    return history;
  }

  return history.map((historyPoint, index) => (
    index === existingPointIndex ? normalizedPoint : historyPoint
  ));
}

// Converts simulated seconds into a readable label for the chart axis.
export function formatChartTimeAsSeconds(timeSeconds) {
  return `${Math.floor(timeSeconds)}s`;
}

// Keeps the visible chart duration at least as wide as the requested minimum.
export function getChartMaxSeconds(history, minimumSeconds = 10) {
  const lastPoint = history.at(-1);

  if (!lastPoint) {
    return minimumSeconds;
  }

  return Math.max(minimumSeconds, Math.ceil(lastPoint.timeSeconds));
}

// Formats one tooltip line with the count and its share of the current population.
export function formatChartTooltipLine(label, count, total) {
  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return `${label}: ${count} individus (${percentage} %)`;
}

// Creates axis labels where each displayed second appears only once.
export function createUniqueChartTimeLabels(history) {
  const displayedSeconds = new Set();

  return history.map((point) => {
    const second = Math.floor(point.timeSeconds);

    if (displayedSeconds.has(second)) {
      return "";
    }

    displayedSeconds.add(second);
    return formatChartTimeAsSeconds(point.timeSeconds);
  });
}
