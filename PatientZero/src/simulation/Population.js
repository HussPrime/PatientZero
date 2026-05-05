// Purpose: Creates and manages the full collection of individuals used by the simulation.
import { DEFAULT_SETTINGS } from "../constants/defaultSettings";
import { INDIVIDUAL_STATES } from "../constants/simulationStates";
import { Individual } from "./Individual";

export class Population {
  /**
   * @param {object} settings
   * @param {number} [settings.populationSize]
   * @param {number} [settings.initialInfected]
   * @param {number} [settings.simulationWidth]
   * @param {number} [settings.simulationHeight]
   * @param {number} [settings.minInitialSpeed]
   * @param {number} [settings.maxInitialSpeed]
   * @param {() => number} [rng]
   */
  constructor(settings = {}, rng = Math.random) {
    this.settings = { ...DEFAULT_SETTINGS, ...settings };
    this.rng = rng;
    this.individuals = [];

    this.validateSettings();
  }

  // Verifies that the population can be generated with coherent values.
  validateSettings() {
    const { populationSize, initialInfected, simulationWidth, simulationHeight } = this.settings;

    if (!Number.isInteger(populationSize) || populationSize < 0) {
      throw new Error("populationSize must be a positive integer or zero.");
    }

    if (!Number.isInteger(initialInfected) || initialInfected < 0) {
      throw new Error("initialInfected must be a positive integer or zero.");
    }

    if (initialInfected > populationSize) {
      throw new Error("initialInfected cannot be greater than populationSize.");
    }

    if (simulationWidth <= 0 || simulationHeight <= 0) {
      throw new Error("simulationWidth and simulationHeight must be greater than zero.");
    }
  }

  // Builds a new set of individuals and infects the configured patient zeros.
  generate() {
    const infectedIds = this.createInitialInfectedIds();

    this.individuals = Array.from({ length: this.settings.populationSize }, (_, id) => {
      const individual = new Individual({
        id,
        x: this.randomBetween(0, this.settings.simulationWidth),
        y: this.randomBetween(0, this.settings.simulationHeight),
        vx: this.randomBetween(this.settings.minInitialSpeed, this.settings.maxInitialSpeed),
        vy: this.randomBetween(this.settings.minInitialSpeed, this.settings.maxInitialSpeed),
      });

      if (infectedIds.has(id)) {
        individual.infect();
      }

      // TODO: Apply user-selected initialSpeed here instead of only using min/max defaults.
      return individual;
    });

    return this.individuals;
  }

  // Returns the current individuals without cloning them.
  getIndividuals() {
    return this.individuals;
  }

  // Returns the number of generated individuals.
  getTotal() {
    return this.individuals.length;
  }

  // Counts individuals by health state for the UI and future chart history.
  getStats() {
    return this.individuals.reduce(
      (stats, individual) => {
        if (individual.state === INDIVIDUAL_STATES.HEALTHY) {
          stats.healthy += 1;
        } else if (individual.state === INDIVIDUAL_STATES.INFECTED) {
          stats.infected += 1;
        } else if (individual.state === INDIVIDUAL_STATES.RECOVERED) {
          stats.recovered += 1;
        }

        return stats;
      },
      { healthy: 0, infected: 0, recovered: 0, total: this.getTotal() },
    );
  }

  // Regenerates the population from the current settings.
  reset() {
    return this.generate();
  }

  // Selects the initially infected ids with a Fisher-Yates shuffle.
  createInitialInfectedIds() {
    const ids = Array.from({ length: this.settings.populationSize }, (_, id) => id);

    for (let index = ids.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(this.rng() * (index + 1));
      [ids[index], ids[randomIndex]] = [ids[randomIndex], ids[index]];
    }

    return new Set(ids.slice(0, this.settings.initialInfected));
  }

  // Produces a random number inside the requested range.
  randomBetween(min, max) {
    return min + this.rng() * (max - min);
  }
}

