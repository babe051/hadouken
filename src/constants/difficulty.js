/**
 * Difficulty levels configuration
 */
export const DIFFICULTY_LEVELS = {
  EASY: {
    id: 'easy',
    name: 'Facile',
    sequenceLength: 5,
    multiplier: 1.0,
    color: '#4CAF50', // Green
    icon: '🌱'
  },
  NORMAL: {
    id: 'normal',
    name: 'Normal',
    sequenceLength: 10,
    multiplier: 1.5,
    color: '#2196F3', // Blue
    icon: '⭐'
  },
  HARD: {
    id: 'hard',
    name: 'Difficile',
    sequenceLength: 15,
    multiplier: 2.0,
    color: '#FF9800', // Orange
    icon: '🔥'
  },
  EXPERT: {
    id: 'expert',
    name: 'Expert',
    sequenceLength: 20,
    multiplier: 3.0,
    color: '#F44336', // Red
    icon: '💀'
  }
};

/**
 * Get difficulty by ID
 */
export const getDifficultyById = (id) => {
  return Object.values(DIFFICULTY_LEVELS).find(diff => diff.id === id) || DIFFICULTY_LEVELS.NORMAL;
};

/**
 * Load difficulty from localStorage
 */
export const loadDifficulty = () => {
  try {
    const stored = localStorage.getItem('hadouken_difficulty');
    if (stored) {
      return getDifficultyById(stored);
    }
  } catch (error) {
    // Fallback to normal
  }
  return DIFFICULTY_LEVELS.NORMAL;
};

/**
 * Save difficulty to localStorage
 */
export const saveDifficulty = (difficultyId) => {
  try {
    localStorage.setItem('hadouken_difficulty', difficultyId);
  } catch (error) {
    // Ignore
  }
};

