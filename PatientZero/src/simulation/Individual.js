// Purpose: Represents one person in the epidemic simulation and stores their movement and health state.
import { INDIVIDUAL_STATES } from "../constants/simulationStates";

export class Individual {
  /**
   * @param {object} options
   * @param {number} options.id
   * @param {number} options.x
   * @param {number} options.y
   * @param {number} [options.vx]
   * @param {number} [options.vy]
   * @param {string} [options.state]
   * @param {number|null} [options.infectionTime]
   */
  constructor({
    id,
    x,
    y,
    vx = 0,
    vy = 0,
    state = INDIVIDUAL_STATES.HEALTHY,
    infectionTime = null,
  }) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.state = state;
    this.infectionTime = state === INDIVIDUAL_STATES.INFECTED ? 0 : infectionTime;
  }

  // Checks whether the individual can still be infected.
  isHealthy() {
    return this.state === INDIVIDUAL_STATES.HEALTHY;
  }

  // Checks whether the individual is currently contagious.
  isInfected() {
    return this.state === INDIVIDUAL_STATES.INFECTED;
  }

  // Checks whether the individual has finished the infection cycle.
  isRecovered() {
    return this.state === INDIVIDUAL_STATES.RECOVERED;
  }

  // Checks whether the individual has died after the infection cycle.
  isDead() {
    return this.state === INDIVIDUAL_STATES.DEAD;
  }

  // Returns the current health state.
  getState() {
    return this.state
  }

  // Marks the individual as infected unless they are already protected from reinfection.
  infect() {
    if (this.isRecovered() || this.isDead()) {
      return;
    }

    this.state = INDIVIDUAL_STATES.INFECTED;
    this.infectionTime = 0;
  }

  // Marks the individual as recovered after the infection duration.
  recover() {
    this.state = INDIVIDUAL_STATES.RECOVERED;
  }

  // Marks the individual as dead after the infection duration.
  die() {
    this.state = INDIVIDUAL_STATES.DEAD;
  }

  // Moves the individual and bounces them back inside the simulation bounds.
  move(width, height, speedMultiplier = 1, radius = 0) {
    if (this.isDead()) {
      return;
    }

    this.x += this.vx * speedMultiplier;
    this.y += this.vy * speedMultiplier;

    const minX = radius;
    const maxX = width - radius;
    const minY = radius;
    const maxY = height - radius;

    if (this.x < minX || this.x > maxX) {
      this.vx *= -1;
      this.x = Math.min(Math.max(this.x, minX), maxX);
    }

    if (this.y < minY || this.y > maxY) {
      this.vy *= -1;
      this.y = Math.min(Math.max(this.y, minY), maxY);
    }
  }

  // Converts the class instance to plain data for React, tests, or chart history.
  toJSON() {
    return {
      id: this.id,
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      state: this.state,
      infectionTime: this.infectionTime,
    };
  }
}

