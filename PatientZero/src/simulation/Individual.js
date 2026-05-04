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

  isHealthy() {
    return this.state === INDIVIDUAL_STATES.HEALTHY;
  }

  isInfected() {
    return this.state === INDIVIDUAL_STATES.INFECTED;
  }

  isRecovered() {
    return this.state === INDIVIDUAL_STATES.RECOVERED;
  }

  getState() {
    return this.state
  }

  infect() {
    if (this.isRecovered()) {
      return;
    }

    this.state = INDIVIDUAL_STATES.INFECTED;
    this.infectionTime = 0;
  }

  recover() {
    this.state = INDIVIDUAL_STATES.RECOVERED;
  }

  move(width, height) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) {
      this.vx *= -1;
      this.x = Math.min(Math.max(this.x, 0), width);
    }

    if (this.y < 0 || this.y > height) {
      this.vy *= -1;
      this.y = Math.min(Math.max(this.y, 0), height);
    }
  }

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

