// Purpose: Applies one logical epidemic propagation tick to the current population.
import {
  calculateDistance,
  isWithinInfectionRadius,
  shouldInfect,
  shouldRecover,
} from "./infectionRules";

const DEFAULT_UPDATE_SETTINGS = {
  contactDuration: 1,
  infectionDuration: 4,
  infectionRadius: 18,
  referenceContactDuration: 1,
  recoveryRate: 0,
  simulationSpeed: 1,
  transmissionRate: 0,
};
const FRAMES_PER_SECOND_AT_X1 = 30;
const FRAME_DURATION_SECONDS = 1 / FRAMES_PER_SECOND_AT_X1;

// Updates infection, infection duration, and recovery for one simulation tick.
export function updateSimulation(individuals, settings = {}, rng = Math.random) {
  const nextSettings = { ...DEFAULT_UPDATE_SETTINGS, ...settings };
  const timeStepSeconds = FRAME_DURATION_SECONDS * nextSettings.simulationSpeed;
  const infectedIndividuals = individuals.filter((individual) => individual.isInfected());
  const newlyInfected = new Set();

  infectedIndividuals.forEach((infectedIndividual) => {
    individuals.forEach((candidate) => {
      if (!candidate.isHealthy() || newlyInfected.has(candidate)) {
        return;
      }

      if (!isWithinInfectionRadius(infectedIndividual, candidate, nextSettings.infectionRadius)) {
        return;
      }

      if (shouldInfect({
        contactDuration: nextSettings.contactDuration * timeStepSeconds,
        distance: calculateDistance(infectedIndividual, candidate),
        infectionRadius: nextSettings.infectionRadius,
        referenceContactDuration: nextSettings.referenceContactDuration,
        transmissionProbability: nextSettings.transmissionRate / 100,
      }, rng)) {
        newlyInfected.add(candidate);
      }
    });
  });

  infectedIndividuals.forEach((individual) => {
    individual.infectionTime = (individual.infectionTime ?? 0) + timeStepSeconds;

    if (shouldRecover(individual, nextSettings.infectionDuration)) {
      individual.recover();
    }
  });

  newlyInfected.forEach((individual) => {
    individual.infect();
  });

  return individuals;
}
