// Purpose: Public export surface for the simulation domain classes.
export {
  calculateDistance,
  calculateDeathProbability,
  calculateInfectionProbability,
  clamp,
  isWithinInfectionRadius,
  shouldDie,
  shouldInfect,
  shouldRecover,
} from "./infectionRules";
export { Individual } from "./Individual";
export { Population } from "./Population";
export { updateSimulation } from "./updateSimulation";

