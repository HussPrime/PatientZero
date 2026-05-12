// Purpose: Contains pure infection and recovery rules used by the simulation update loop.

const MIN_DISTANCE = 1;

// Keeps probabilities and intermediate risks inside a valid numeric range.
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Throws a clear error when a numeric simulation parameter is incoherent.
function assertPositiveNumber(value, name) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${name} must be greater than 0.`);
  }
}

// Throws a clear error when a numeric simulation parameter is negative.
function assertNonNegativeNumber(value, name) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be greater than or equal to 0.`);
  }
}

// Calculates the direct distance between two individuals.
export function calculateDistance(firstIndividual, secondIndividual) {
  const deltaX = firstIndividual.x - secondIndividual.x;
  const deltaY = firstIndividual.y - secondIndividual.y;

  return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
}

// Checks whether two individuals are close enough for a possible transmission.
export function isWithinInfectionRadius(firstIndividual, secondIndividual, infectionRadius) {
  return calculateDistance(firstIndividual, secondIndividual) <= infectionRadius;
}

// Calculates the contamination probability from the adapted distance/contact formula.
export function calculateInfectionProbability({
  contactDuration,
  distance,
  infectionRadius,
  referenceContactDuration,
  transmissionProbability,
}) {
  assertNonNegativeNumber(contactDuration, "contactDuration");
  assertNonNegativeNumber(distance, "distance");
  assertPositiveNumber(infectionRadius, "infectionRadius");
  assertPositiveNumber(referenceContactDuration, "referenceContactDuration");
  assertNonNegativeNumber(transmissionProbability, "transmissionProbability");

  if (transmissionProbability > 1) {
    throw new Error("transmissionProbability must be between 0 and 1.");
  }

  if (distance > infectionRadius) {
    return 0;
  }

  const safeDistance = Math.max(distance, MIN_DISTANCE);
  const distanceRatio = safeDistance / infectionRadius;
  const baseRisk = transmissionProbability / (distanceRatio ** 2);
  const clampedBaseRisk = clamp(baseRisk, 0, 1);
  const contactRatio = contactDuration / referenceContactDuration;
  const probability = 1 - ((1 - clampedBaseRisk) ** contactRatio);

  return clamp(probability, 0, 1);
}

// Converts the cure rate selected by the user into the complementary death probability.
export function calculateDeathProbability({ cureRate }) {
  assertNonNegativeNumber(cureRate, "cureRate");

  if (cureRate > 100) {
    throw new Error("cureRate must be between 0 and 100.");
  }

  return 1 - (cureRate / 100);
}

// Decides whether an infected individual transmits the disease during this tick.
export function shouldInfect(infectionContext, rng = Math.random) {
  const probability = calculateInfectionProbability(infectionContext);

  return rng() < probability;
}

// Decides whether an infected individual dies when their infection duration ends.
export function shouldDie(deathContext, rng = Math.random) {
  const probability = calculateDeathProbability(deathContext);

  return rng() < probability;
}

// Decides whether an infected individual has reached the configured infection duration.
export function shouldRecover(individual, infectionDuration) {
  if (!individual.isInfected()) {
    return false;
  }

  return individual.infectionTime >= infectionDuration;
}
