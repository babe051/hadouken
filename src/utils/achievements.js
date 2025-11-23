/**
 * Achievement system for Konami Code game
 */

export const ACHIEVEMENTS = {
  FIRST_COMPLETE: {
    id: 'first_complete',
    name: 'First Steps',
    description: 'Complete the Konami Code for the first time',
    icon: '🎯',
    unlocked: false
  },
  SPEED_DEMON: {
    id: 'speed_demon',
    name: 'Speed Demon',
    description: 'Complete the code in under 3 seconds',
    icon: '⚡',
    unlocked: false,
    condition: (time) => time < 3000
  },
  LIGHTNING_FAST: {
    id: 'lightning_fast',
    name: 'Lightning Fast',
    description: 'Complete the code in under 5 seconds',
    icon: '⚡⚡',
    unlocked: false,
    condition: (time) => time < 5000
  },
  PERFECT_TIMING: {
    id: 'perfect_timing',
    name: 'Perfect Timing',
    description: 'Complete without any wrong keys',
    icon: '✨',
    unlocked: false,
    condition: (wrongKeys) => wrongKeys === 0
  },
  NIGHT_OWL: {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Complete after midnight',
    icon: '🦉',
    unlocked: false,
    condition: () => {
      const hour = new Date().getHours();
      return hour >= 0 && hour < 6;
    }
  },
  MASTER: {
    id: 'master',
    name: 'Konami Master',
    description: 'Complete 10 times',
    icon: '👑',
    unlocked: false,
    condition: (completions) => completions >= 10
  },
  PERFECT_STREAK: {
    id: 'perfect_streak',
    name: 'Perfect Streak',
    description: 'Complete 5 times in a row without errors',
    icon: '🔥',
    unlocked: false,
    condition: (perfectStreak) => perfectStreak >= 5
  }
};

/**
 * Load achievements from localStorage
 */
export const loadAchievements = () => {
  try {
    const stored = localStorage.getItem('hadouken_achievements');
    if (stored) {
      const parsed = JSON.parse(stored);
      // Merge with default achievements, preserving unlocked status
      const merged = { ...ACHIEVEMENTS };
      Object.keys(parsed).forEach(key => {
        if (merged[key]) {
          merged[key] = { ...merged[key], ...parsed[key] };
        }
      });
      return merged;
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to load achievements:', error);
    }
  }
  return { ...ACHIEVEMENTS };
};

/**
 * Save achievements to localStorage
 */
export const saveAchievements = (achievements) => {
  try {
    localStorage.setItem('hadouken_achievements', JSON.stringify(achievements));
  } catch (error) {
    console.warn('Failed to save achievements:', error);
  }
};

/**
 * Unlock an achievement
 */
export const unlockAchievement = (achievementId, achievements) => {
  // Find achievement by id in the achievements object
  let achievementKey = null;
  for (const key in achievements) {
    if (achievements[key] && achievements[key].id === achievementId) {
      achievementKey = key;
      break;
    }
  }

  if (!achievementKey || !achievements[achievementKey] || achievements[achievementKey].unlocked) {
    return achievements;
  }

  const updated = {
    ...achievements,
    [achievementKey]: {
      ...achievements[achievementKey],
      unlocked: true,
      unlockedAt: new Date().toISOString()
    }
  };

  saveAchievements(updated);
  return updated;
};

/**
 * Get statistics from localStorage
 */
export const getStats = () => {
  try {
    const stored = localStorage.getItem('hadouken_stats');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load stats:', error);
  }
  return {
    completions: 0,
    bestTime: null,
    totalAttempts: 0,
    wrongKeys: 0,
    perfectStreak: 0,
    currentPerfectStreak: 0
  };
};

/**
 * Save statistics to localStorage
 */
export const saveStats = (stats) => {
  try {
    localStorage.setItem('hadouken_stats', JSON.stringify(stats));
  } catch (error) {
    console.warn('Failed to save stats:', error);
  }
};

/**
 * Update statistics
 */
export const updateStats = (completionTime, wrongKeysCount) => {
  const stats = getStats();
  const updated = {
    ...stats,
    completions: stats.completions + 1,
    totalAttempts: stats.totalAttempts + 1,
    wrongKeys: stats.wrongKeys + wrongKeysCount,
    currentPerfectStreak: wrongKeysCount === 0 ? stats.currentPerfectStreak + 1 : 0,
    perfectStreak: wrongKeysCount === 0 
      ? Math.max(stats.perfectStreak, stats.currentPerfectStreak + 1)
      : stats.perfectStreak
  };

  if (!updated.bestTime || completionTime < updated.bestTime) {
    updated.bestTime = completionTime;
  }

  saveStats(updated);
  return updated;
};

