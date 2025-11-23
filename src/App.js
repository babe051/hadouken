import React, { useState } from 'react';
import useKonamiCode from './hooks/useKonamiCode';
import CelebrationPage from './components/CelebrationPage';
import ErrorBoundary from './components/ErrorBoundary';
import { KEY_DISPLAY_MAP, KONAMI_CODE_LENGTH, MESSAGES } from './constants/konami';
import './App.css';

/**
 * Main App component featuring Konami Code easter egg
 */
function App() {
  const [showSecret, setShowSecret] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleKonamiActivate = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowSecret(true);
      setIsAnimating(false);
    }, 1000);
  };

  const { keys: keyHistory, reset: resetKonamiCode } = useKonamiCode(handleKonamiActivate);

  const getKeyDisplay = (key) => {
    return KEY_DISPLAY_MAP[key] || key;
  };

  const handleCloseCelebration = () => {
    setShowSecret(false);
    setIsAnimating(false);
    // Reset Konami code to allow playing again
    resetKonamiCode();
  };

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
        className={`app ${isAnimating ? 'konami-activating' : ''}`}
        role="main"
        aria-label="Konami Code Game"
      >
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
              aria-valuemax={KONAMI_CODE_LENGTH}
              aria-label="Konami code progress"
            >
              <div 
                className="progress-fill" 
                style={{ width: `${(keyHistory.length / KONAMI_CODE_LENGTH) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Styled instructions */}
          <div className="instructions">
            <div className="code-sequence" aria-label="Konami code sequence">
              {['↑', '↑', '↓', '↓', '←', '→', '←', '→', 'B', 'A'].map((key, index) => (
                <span 
                  key={index}
                  className="konami-key"
                  aria-label={`Step ${index + 1}: ${key}`}
                >
                  {key}
                </span>
              ))}
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
