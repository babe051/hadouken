import React, { useState, useEffect, useRef } from 'react';
import useKonamiCode from './hooks/useKonamiCode';
import CelebrationPage from './components/CelebrationPage';
import ErrorBoundary from './components/ErrorBoundary';
import TimerDisplay from './components/TimerDisplay';
import AchievementNotification from './components/AchievementNotification';
import ParticleSystem3D from './components/ParticleSystem3D';
import { KEY_DISPLAY_MAP, KONAMI_CODE_LENGTH, MESSAGES, generateRandomSequence, sequenceToDisplay } from './constants/konami';
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
  const [currentSequence, setCurrentSequence] = useState(() => generateRandomSequence(KONAMI_CODE_LENGTH));
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

  const handleKonamiActivate = () => {
    const completionTime = keyPressStartTime ? Date.now() - keyPressStartTime : null;
    
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

  const { keys: keyHistory, reset: resetKonamiCode, hasError } = useKonamiCode(handleKonamiActivate, currentSequence);

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

  const handleCloseCelebration = () => {
    setShowSecret(false);
    setIsAnimating(false);
    setKeyPressStartTime(null);
    setIsTimerActive(false);
    setWrongKeysCount(0);
    // Generate a new random sequence
    setCurrentSequence(generateRandomSequence(KONAMI_CODE_LENGTH));
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
          color="#ff00ff"
          speed={0.8}
          size={3}
          enabled={true}
        />

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

        <div className="main-container">
          {/* Header with neon effect */}
          <header className="header">
            <h1 className="neon-title">{MESSAGES.TITLE}</h1>
            <h2 className="subtitle">{MESSAGES.SUBTITLE}</h2>
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
                style={{ width: `${(keyHistory.length / currentSequence.length) * 100}%` }}
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
