import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showSecret, setShowSecret] = useState(false);
  const [keyHistory, setKeyHistory] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const konamiCode = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown', 
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
    
    let currentKeys = [];

    const handleKeyDown = (e) => {
      currentKeys.push(e.code);
      currentKeys = currentKeys.slice(-10);
      setKeyHistory([...currentKeys]);
      
      if (JSON.stringify(currentKeys) === JSON.stringify(konamiCode)) {
        setIsAnimating(true);
        setTimeout(() => {
          setShowSecret(true);
          setIsAnimating(false);
        }, 1000);
        currentKeys = [];
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getKeyDisplay = (key) => {
    const keyMap = {
      'ArrowUp': '↑',
      'ArrowDown': '↓', 
      'ArrowLeft': '←',
      'ArrowRight': '→',
      'KeyB': 'B',
      'KeyA': 'A'
    };
    return keyMap[key] || key;
  };

  return (
    <div className={`app ${isAnimating ? 'konami-activating' : ''} ${showSecret ? 'konami-activated' : ''}`}>
      <div className="main-container">
        {/* Header avec effet néon */}
        <header className="header">
          <h1 className="neon-title">🎮 NUIT DE L'INFO</h1>
          <h2 className="subtitle">"This is better than Hadouken !"</h2>
        </header>

        {/* Zone de progression */}
        <div className="progress-section">
          <div className="key-display">
            {keyHistory.map((key, index) => (
              <span key={index} className="key-key key-appear">
                {getKeyDisplay(key)}
              </span>
            ))}
            {keyHistory.length === 0 && (
              <span className="placeholder">Touches apparaîtront ici...</span>
            )}
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(keyHistory.length / 10) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Instructions stylisées */}
        <div className="instructions">
          <div className="code-sequence">
            <span className="konami-key">↑</span>
            <span className="konami-key">↑</span>
            <span className="konami-key">↓</span>
            <span className="konami-key">↓</span>
            <span className="konami-key">←</span>
            <span className="konami-key">→</span>
            <span className="konami-key">←</span>
            <span className="konami-key">→</span>
            <span className="konami-key">B</span>
            <span className="konami-key">A</span>
          </div>
          <p className="hint">Utilise les touches directionnelles et lettres</p>
        </div>

        {/* Easter Egg Modal */}
        {showSecret && (
          <div className="easter-egg-overlay">
            <div className="easter-egg-modal">
              <div className="celebration">🎉</div>
              <h2>FÉLICITATIONS !</h2>
              <p className="success-message">
                Vous avez maîtrisé le Konami Code !<br/>
                <strong>This is truly better than Hadouken !</strong>
              </p>
              <div className="achievement">
                <span className="badge">🏆 Achievement Unlocked</span>
              </div>
              <button 
                className="close-button"
                onClick={() => setShowSecret(false)}
              >
                Fermer la Magie
              </button>
            </div>
          </div>
        )}

        {/* Animation de fond pendant activation */}
        {isAnimating && (
          <div className="activation-animation">
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
            <div className="particle"></div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;