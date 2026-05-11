// Purpose: Detects when an epidemic simulation has no active infection left.

// Returns true when the simulation has started and no individual is currently infected.
export function isSimulationComplete(stats, hasStarted) {
  return hasStarted && stats.infected === 0;
}
