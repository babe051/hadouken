/**
 * Visual themes configuration
 */
export const THEMES = {
  DARK: {
    id: 'dark',
    name: 'Sombre',
    icon: '🌙',
    colors: {
      primary: '#0f0c29',
      secondary: '#302b63',
      tertiary: '#24243e',
      accent: '#ff00de',
      text: '#ffffff',
      particle: '#ff00ff',
      keyBg: 'rgba(255, 255, 255, 0.1)',
      keyBorder: 'rgba(255, 255, 255, 0.2)',
      progressStart: '#ff6b6b',
      progressEnd: '#ffd93d'
    }
  },
  NEON: {
    id: 'neon',
    name: 'Néon',
    icon: '💡',
    colors: {
      primary: '#0a0a0a',
      secondary: '#1a0033',
      tertiary: '#330033',
      accent: '#00ffff',
      text: '#00ffff',
      particle: '#00ffff',
      keyBg: 'rgba(0, 255, 255, 0.1)',
      keyBorder: 'rgba(0, 255, 255, 0.5)',
      progressStart: '#00ffff',
      progressEnd: '#ff00ff'
    }
  },
  RETRO: {
    id: 'retro',
    name: 'Rétro',
    icon: '🎮',
    colors: {
      primary: '#1a1a2e',
      secondary: '#16213e',
      tertiary: '#0f3460',
      accent: '#e94560',
      text: '#f5f5f5',
      particle: '#e94560',
      keyBg: 'rgba(233, 69, 96, 0.2)',
      keyBorder: 'rgba(233, 69, 96, 0.6)',
      progressStart: '#e94560',
      progressEnd: '#f5a623'
    }
  },
  PURPLE: {
    id: 'purple',
    name: 'Violet',
    icon: '💜',
    colors: {
      primary: '#0f0c29',
      secondary: '#302b63',
      tertiary: '#24243e',
      accent: '#9d4edd',
      text: '#ffffff',
      particle: '#9d4edd',
      keyBg: 'rgba(157, 78, 221, 0.2)',
      keyBorder: 'rgba(157, 78, 221, 0.5)',
      progressStart: '#9d4edd',
      progressEnd: '#c77dff'
    }
  }
};

/**
 * Get theme by ID
 */
export const getThemeById = (id) => {
  return THEMES[id.toUpperCase()] || THEMES.DARK;
};

/**
 * Load theme from localStorage
 */
export const loadTheme = () => {
  try {
    const stored = localStorage.getItem('hadouken_theme');
    if (stored) {
      return getThemeById(stored);
    }
  } catch (error) {
    // Fallback to dark
  }
  return THEMES.DARK;
};

/**
 * Save theme to localStorage
 */
export const saveTheme = (themeId) => {
  try {
    localStorage.setItem('hadouken_theme', themeId);
  } catch (error) {
    // Ignore
  }
};

