/**
 * Konami Code constants
 */
export const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export const KONAMI_CODE_LENGTH = KONAMI_CODE.length;

export const KEY_DISPLAY_MAP = {
  'ArrowUp': '↑',
  'ArrowDown': '↓',
  'ArrowLeft': '←',
  'ArrowRight': '→',
  'KeyB': 'B',
  'KeyA': 'A'
};

export const MESSAGES = {
  TITLE: "🎮 NUIT DE L'INFO",
  SUBTITLE: '"This is better than Hadouken !"',
  PLACEHOLDER: "Keys will appear here...",
  INSTRUCTIONS: "Use arrow keys and letters",
  CONGRATULATIONS: "CONGRATULATIONS!",
  SUCCESS_MESSAGE: "You have mastered the Konami Code!",
  SUCCESS_SUBTITLE: "This is truly better than Hadouken !",
  ACHIEVEMENT: "🏆 Achievement Unlocked",
  CLOSE_BUTTON: "Close Magic"
};

export const ANIMATION_TIMING = {
  ACTIVATION_DURATION: 1000,
  PARTICLE_COUNT: 5
};

/**
 * Available keys for sequences
 */
export const AVAILABLE_KEYS = [
  'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'
];

/**
 * Generate a random sequence of keys
 * @param {number} length - Length of the sequence (default: 10)
 * @returns {Array<string>} Array of key codes
 */
export const generateRandomSequence = (length = 10) => {
  const sequence = [];
  for (let i = 0; i < length; i++) {
    const randomKey = AVAILABLE_KEYS[Math.floor(Math.random() * AVAILABLE_KEYS.length)];
    sequence.push(randomKey);
  }
  return sequence;
};

/**
 * Convert a sequence of key codes to display symbols
 * @param {Array<string>} sequence - Array of key codes
 * @returns {Array<string>} Array of display symbols
 */
export const sequenceToDisplay = (sequence) => {
  return sequence.map(key => KEY_DISPLAY_MAP[key] || key);
};

