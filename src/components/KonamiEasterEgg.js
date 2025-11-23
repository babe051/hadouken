import React, { useState } from 'react';
import PropTypes from 'prop-types';
import useKonamiCode from '../hooks/useKonamiCode';
import './KonamiEasterEgg.css';

/**
 * KonamiEasterEgg - Alternative Konami code component
 * Shows a modal when Konami code is activated
 */
const KonamiEasterEgg = ({ onActivate }) => {
  const [isActivated, setIsActivated] = useState(false);

  const handleActivate = () => {
    setIsActivated(true);
    if (onActivate) {
      onActivate();
    }
  };

  useKonamiCode(handleActivate);

  if (!isActivated) return null;

  return (
    <div 
      className="konami-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="konami-title"
    >
      <div className="konami-modal">
        <h2 id="konami-title">🎉 FÉLICITATIONS !</h2>
        <p>Vous avez découvert le secret Konami ! 🕹️</p>
        <p>Code: ↑ ↑ ↓ ↓ ← → ← → B A</p>
        <button 
          className="close-btn"
          onClick={() => setIsActivated(false)}
          aria-label="Close dialog"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

KonamiEasterEgg.propTypes = {
  onActivate: PropTypes.func
};

export default KonamiEasterEgg;
