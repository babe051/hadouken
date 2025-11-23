import React, { useState, useEffect, useRef } from 'react';
import useKonamiCode from './hooks/useKonamiCode';
import CelebrationPage from './components/CelebrationPage';
import ErrorBoundary from './components/ErrorBoundary';
import TimerDisplay from './components/TimerDisplay';
import AchievementNotification from './components/AchievementNotification';
import ParticleSystem3D from './components/ParticleSystem3D';
import DifficultySelector from './components/DifficultySelector';
import ThemeSelector from './components/ThemeSelector';
import ComboDisplay from './components/ComboDisplay';
import { KEY_DISPLAY_MAP, KONAMI_CODE_LENGTH, MESSAGES, generateRandomSequence, sequenceToDisplay } from './constants/konami';
import { loadDifficulty, saveDifficulty, DIFFICULTY_LEVELS } from './constants/difficulty';
import { loadTheme, saveTheme, THEMES } from './constants/themes';
import { calculateScore } from './utils/combo';
import { 
  ACHIEVEMENTS, 
  loadAchievements, 
  unlockAchievement, 
  updateStats, 
  getStats 
} from './utils/achievements';
import soundManager from './utils/sounds';
import './App.css';

/**
 * Main App component featuring Konami Code easter egg
 * Now with achievements, timer, and 3D effects!
 */
function App() {
  const [showSecret, setShowSecret] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [achievements, setAchievements] = useState(() => loadAchievements());
  const [currentAchievement, setCurrentAchievement] = useState(null);
  const [timerStart, setTimerStart] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [wrongKeysCount, setWrongKeysCount] = useState(0);
  const [keyPressStartTime, setKeyPressStartTime] = useState(null);
  const [difficulty, setDifficulty] = useState(() => loadDifficulty());
  const [theme, setTheme] = useState(() => loadTheme());
  const [currentSequence, setCurrentSequence] = useState(() => generateRandomSequence(loadDifficulty().sequenceLength));
  const [comboInfo, setComboInfo] = useState(null);
  const [finalScore, setFinalScore] = useState(null);
  const appRef = useRef(null);

  // Load stats on mount
  useEffect(() => {
    const stats = getStats();
    // Unlock first complete if already completed
    if (stats.completions > 0 && !achievements.FIRST_COMPLETE?.unlocked) {
      const updated = unlockAchievement('first_complete', achievements);
      setAchievements(updated);
    }
  }, []);

  const handleKonamiActivate = (comboStats = null) => {
    const completionTime = keyPressStartTime ? Date.now() - keyPressStartTime : null;
    
    // Calculate final score with combo and difficulty multipliers
    if (completionTime && comboStats) {
      const baseScore = Math.max(0, 10000 - completionTime); // Base score decreases with time
      const score = calculateScore(baseScore, comboStats.totalMultiplier || 1.0, difficulty.multiplier);
      setFinalScore(score);
    }
    
    // Update statistics (only if we have a valid time)
    const stats = completionTime !== null 
      ? updateStats(completionTime, wrongKeysCount)
      : updateStats(0, wrongKeysCount);
    
    // Check and unlock achievements
    let newAchievements = { ...achievements };
    let unlockedAny = false;

    // Speed achievements
    if (completionTime !== null && completionTime > 0) {
      if (ACHIEVEMENTS.SPEED_DEMON.condition(completionTime) && !newAchievements.SPEED_DEMON?.unlocked) {
        newAchievements = unlockAchievement('speed_demon', newAchievements);
        setCurrentAchievement(ACHIEVEMENTS.SPEED_DEMON);
        unlockedAny = true;
      } else if (ACHIEVEMENTS.LIGHTNING_FAST.condition(completionTime) && !newAchievements.LIGHTNING_FAST?.unlocked) {
        newAchievements = unlockAchievement('lightning_fast', newAchievements);
        setCurrentAchievement(ACHIEVEMENTS.LIGHTNING_FAST);
        unlockedAny = true;
      }
    }

    // Perfect timing achievement
    if (ACHIEVEMENTS.PERFECT_TIMING.condition(wrongKeysCount) && !newAchievements.PERFECT_TIMING?.unlocked) {
      newAchievements = unlockAchievement('perfect_timing', newAchievements);
      if (!unlockedAny) {
        setCurrentAchievement(ACHIEVEMENTS.PERFECT_TIMING);
        unlockedAny = true;
      }
    }

    // Night owl achievement
    if (ACHIEVEMENTS.NIGHT_OWL.condition() && !newAchievements.NIGHT_OWL?.unlocked) {
      newAchievements = unlockAchievement('night_owl', newAchievements);
      if (!unlockedAny) {
        setCurrentAchievement(ACHIEVEMENTS.NIGHT_OWL);
        unlockedAny = true;
      }
    }

    // Master achievement
    if (ACHIEVEMENTS.MASTER.condition(stats.completions) && !newAchievements.MASTER?.unlocked) {
      newAchievements = unlockAchievement('master', newAchievements);
      if (!unlockedAny) {
        setCurrentAchievement(ACHIEVEMENTS.MASTER);
        unlockedAny = true;
      }
    }

    // Perfect streak achievement
    if (ACHIEVEMENTS.PERFECT_STREAK.condition(stats.perfectStreak) && !newAchievements.PERFECT_STREAK?.unlocked) {
      newAchievements = unlockAchievement('perfect_streak', newAchievements);
      if (!unlockedAny) {
        setCurrentAchievement(ACHIEVEMENTS.PERFECT_STREAK);
        unlockedAny = true;
      }
    }

    // First complete achievement
    if (!newAchievements.FIRST_COMPLETE?.unlocked) {
      newAchievements = unlockAchievement('first_complete', newAchievements);
      if (!unlockedAny) {
        setCurrentAchievement(ACHIEVEMENTS.FIRST_COMPLETE);
        unlockedAny = true;
      }
    }

    setAchievements(newAchievements);
    setIsTimerActive(false);
    setIsAnimating(true);
    
    // Screen shake effect
    if (appRef.current) {
      appRef.current.style.animation = 'screenShake 0.5s';
      setTimeout(() => {
        if (appRef.current) {
          appRef.current.style.animation = '';
        }
      }, 500);
    }

    setTimeout(() => {
      setShowSecret(true);
      setIsAnimating(false);
    }, 1000);
  };

  const handleCombo = (comboData) => {
    setComboInfo(comboData);
  };

  const { keys: keyHistory, reset: resetKonamiCode, hasError, comboInfo: hookComboInfo } = useKonamiCode(handleKonamiActivate, currentSequence, handleCombo);

  // Start timer when first key is pressed
  useEffect(() => {
    if (keyHistory.length === 1 && !keyPressStartTime) {
      setKeyPressStartTime(Date.now());
      setIsTimerActive(true);
      setTimerStart(Date.now());
      setWrongKeysCount(0);
    }
  }, [keyHistory.length, keyPressStartTime]);

  const getKeyDisplay = (key) => {
    return KEY_DISPLAY_MAP[key] || key;
  };

  const handleDifficultyChange = (newDifficulty) => {
    setDifficulty(newDifficulty);
    saveDifficulty(newDifficulty.id);
    // Generate new sequence with new length
    setCurrentSequence(generateRandomSequence(newDifficulty.sequenceLength));
    resetKonamiCode();
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    saveTheme(newTheme.id);
    // Apply theme styles
    applyThemeStyles(newTheme);
  };

  const applyThemeStyles = (themeToApply) => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', themeToApply.colors.primary);
    root.style.setProperty('--theme-secondary', themeToApply.colors.secondary);
    root.style.setProperty('--theme-tertiary', themeToApply.colors.tertiary);
    root.style.setProperty('--theme-accent', themeToApply.colors.accent);
    root.style.setProperty('--theme-text', themeToApply.colors.text);
    root.style.setProperty('--theme-particle', themeToApply.colors.particle);
  };

  // Apply theme on mount and when theme changes
  useEffect(() => {
    applyThemeStyles(theme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme.id]);

  // Update sequence when difficulty changes (only if not in active game)
  useEffect(() => {
    if (!isTimerActive && keyHistory.length === 0) {
      setCurrentSequence(generateRandomSequence(difficulty.sequenceLength));
    }
  }, [difficulty.id, isTimerActive, keyHistory.length]);

  const handleCloseCelebration = () => {
    setShowSecret(false);
    setIsAnimating(false);
    setKeyPressStartTime(null);
    setIsTimerActive(false);
    setWrongKeysCount(0);
    setFinalScore(null);
    setComboInfo(null);
    // Generate a new random sequence with current difficulty
    setCurrentSequence(generateRandomSequence(difficulty.sequenceLength));
    resetKonamiCode();
  };

  const handleCloseAchievement = () => {
    setCurrentAchievement(null);
  };

  // Track wrong keys
  useEffect(() => {
    if (keyHistory.length > 0) {
      const expectedKey = currentSequence[keyHistory.length - 1];
      const actualKey = keyHistory[keyHistory.length - 1];
      
      if (actualKey !== expectedKey) {
        setWrongKeysCount(prev => prev + 1);
      }
    }
  }, [keyHistory, currentSequence]);

  // Show celebration page when secret is activated
  if (showSecret) {
    return (
      <ErrorBoundary>
        <CelebrationPage onClose={handleCloseCelebration} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div 
        ref={appRef}
        className={`app ${isAnimating ? 'konami-activating' : ''}`}
        role="main"
        aria-label="Konami Code Game"
      >
        {/* 3D Particle System */}
        <ParticleSystem3D 
          particleCount={800}
          color={theme.colors.particle}
          speed={0.8}
          size={3}
          enabled={true}
        />

        {/* Combo Display */}
        <ComboDisplay comboInfo={hookComboInfo || comboInfo} show={!!hookComboInfo || !!comboInfo} />

        {/* Timer Display */}
        <TimerDisplay 
          startTime={timerStart}
          isActive={isTimerActive}
        />

        {/* Achievement Notification */}
        {currentAchievement && (
          <AchievementNotification 
            achievement={currentAchievement}
            onClose={handleCloseAchievement}
          />
        )}

        <div className="main-container" style={{
          background: `linear-gradient(135deg, ${theme.colors.primary}, ${theme.colors.secondary}, ${theme.colors.tertiary})`
        }}>
          {/* Difficulty and Theme Selectors */}
          <div className="settings-section">
            <DifficultySelector 
              currentDifficulty={difficulty}
              onDifficultyChange={handleDifficultyChange}
              disabled={isTimerActive || keyHistory.length > 0}
            />
            <ThemeSelector 
              currentTheme={theme}
              onThemeChange={handleThemeChange}
              disabled={isTimerActive}
            />
          </div>

          {/* Header with neon effect */}
          <header className="header">
            <h1 className="neon-title" style={{ color: theme.colors.text }}>{MESSAGES.TITLE}</h1>
            <h2 className="subtitle" style={{ color: theme.colors.text }}>{MESSAGES.SUBTITLE}</h2>
            {finalScore !== null && (
              <div className="final-score" style={{ color: theme.colors.accent }}>
                Score: {finalScore.toLocaleString()} pts
              </div>
            )}
          </header>

          {/* Progress section */}
          <div className="progress-section" aria-live="polite" aria-atomic="true">
            <div className="key-display" role="status" aria-label="Key sequence progress">
              {keyHistory.map((key, index) => (
                <span 
                  key={index} 
                  className="key-key key-appear"
                  aria-label={`Key ${index + 1}: ${getKeyDisplay(key)}`}
                  style={{
                    animation: `keyPulse 0.3s ease-out`,
                    boxShadow: `0 0 20px rgba(255, 235, 59, 0.6)`
                  }}
                >
                  {getKeyDisplay(key)}
                </span>
              ))}
              {keyHistory.length === 0 && (
                <span className="placeholder" aria-hidden="true">
                  {MESSAGES.PLACEHOLDER}
                </span>
              )}
            </div>
            
            <div 
              className="progress-bar"
              role="progressbar"
              aria-valuenow={keyHistory.length}
              aria-valuemin={0}
              aria-valuemax={currentSequence.length}
              aria-label="Konami code progress"
            >
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${(keyHistory.length / currentSequence.length) * 100}%`,
                  background: `linear-gradient(90deg, ${theme.colors.progressStart}, ${theme.colors.progressEnd})`
                }}
              ></div>
            </div>
          </div>

          {/* Styled instructions */}
          <div className="instructions">
            <div className="code-sequence" aria-label="Konami code sequence">
              {sequenceToDisplay(currentSequence).map((key, index) => {
                const isCompleted = keyHistory.length > index;
                const isCurrent = keyHistory.length === index;
                const isError = hasError && isCurrent;
                
                return (
                  <span 
                    key={index}
                    className={`konami-key ${isCompleted ? 'key-completed' : ''} ${isError ? 'key-error' : ''}`}
                    aria-label={`Step ${index + 1}: ${key}`}
                    style={{
                      background: isCompleted ? 'rgba(76, 175, 80, 0.3)' : theme.colors.keyBg,
                      borderColor: isCompleted ? '#4CAF50' : theme.colors.keyBorder,
                      color: theme.colors.text
                    }}
                  >
                    {key}
                  </span>
                );
              })}
            </div>
            <p className="hint">{MESSAGES.INSTRUCTIONS}</p>
          </div>

          {/* Activation animation */}
          {isAnimating && (
            <div 
              className="activation-animation"
              aria-live="polite"
              aria-label="Activating Konami code"
            >
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="particle" aria-hidden="true"></div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;
