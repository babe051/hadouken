/**
 * Combo and multiplier system
 */

const COMBO_THRESHOLDS = {
  PERFECT: 500, // ms between keys for perfect timing
  GOOD: 1000,   // ms between keys for good timing
  OK: 2000      // ms between keys for ok timing
};

const COMBO_MULTIPLIERS = {
  PERFECT: 2.0,
  GOOD: 1.5,
  OK: 1.0,
  MISS: 0.5
};

/**
 * Calculate combo multiplier based on timing between keys
 * @param {number} timeBetweenKeys - Time in milliseconds between key presses
 * @returns {Object} { multiplier, rating, comboCount }
 */
export const calculateCombo = (timeBetweenKeys) => {
  if (timeBetweenKeys <= COMBO_THRESHOLDS.PERFECT) {
    return {
      multiplier: COMBO_MULTIPLIERS.PERFECT,
      rating: 'PERFECT',
      comboCount: 1
    };
  } else if (timeBetweenKeys <= COMBO_THRESHOLDS.GOOD) {
    return {
      multiplier: COMBO_MULTIPLIERS.GOOD,
      rating: 'GOOD',
      comboCount: 1
    };
  } else if (timeBetweenKeys <= COMBO_THRESHOLDS.OK) {
    return {
      multiplier: COMBO_MULTIPLIERS.OK,
      rating: 'OK',
      comboCount: 0
    };
  } else {
    return {
      multiplier: COMBO_MULTIPLIERS.MISS,
      rating: 'MISS',
      comboCount: 0
    };
  }
};

/**
 * Calculate final score with combo multiplier
 * @param {number} baseScore - Base score (time-based)
 * @param {number} comboMultiplier - Combo multiplier
 * @param {number} difficultyMultiplier - Difficulty multiplier
 * @returns {number} Final score
 */
export const calculateScore = (baseScore, comboMultiplier, difficultyMultiplier) => {
  return Math.floor(baseScore * comboMultiplier * difficultyMultiplier);
};

/**
 * Track combo state
 */
export class ComboTracker {
  constructor() {
    this.lastKeyTime = null;
    this.currentCombo = 0;
    this.maxCombo = 0;
    this.totalMultiplier = 1.0;
    this.ratings = [];
  }

  /**
   * Record a key press and calculate combo
   * @param {number} currentTime - Current timestamp
   * @returns {Object} Combo information
   */
  recordKeyPress(currentTime) {
    if (this.lastKeyTime === null) {
      this.lastKeyTime = currentTime;
      return {
        multiplier: 1.0,
        rating: 'START',
        comboCount: 0
      };
    }

    const timeBetween = currentTime - this.lastKeyTime;
    const combo = calculateCombo(timeBetween);
    
    this.lastKeyTime = currentTime;
    
    if (combo.comboCount > 0) {
      this.currentCombo += combo.comboCount;
      this.maxCombo = Math.max(this.maxCombo, this.currentCombo);
    } else {
      this.currentCombo = 0;
    }

    // Update total multiplier (average of all ratings)
    this.ratings.push(combo.multiplier);
    this.totalMultiplier = this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length;

    return {
      ...combo,
      comboCount: this.currentCombo,
      maxCombo: this.maxCombo,
      totalMultiplier: this.totalMultiplier
    };
  }

  /**
   * Reset combo tracker
   */
  reset() {
    this.lastKeyTime = null;
    this.currentCombo = 0;
    this.maxCombo = 0;
    this.totalMultiplier = 1.0;
    this.ratings = [];
  }

  /**
   * Get current stats
   */
  getStats() {
    return {
      currentCombo: this.currentCombo,
      maxCombo: this.maxCombo,
      totalMultiplier: this.totalMultiplier,
      averageRating: this.ratings.length > 0 
        ? this.ratings.reduce((a, b) => a + b, 0) / this.ratings.length 
        : 1.0
    };
  }
}

