import React, { useState } from 'react';
import useKonamiCode from '../hooks/useKonamiCode';
import './KonamiEasterEgg.css';

const KonamiEasterEgg = () => {
  const [isActivated, setIsActivated] = useState(false);

  const handleActivate = () => {
    setIsActivated(true);
    console.log('Konami Code activé !');
  };

  useKonamiCode(handleActivate);

  if (!isActivated) return null;

  return (
    <div className="konami-overlay">
      <div className="konami-modal">
        <h2>🎉 FÉLICITATIONS !</h2>
        <p>Vous avez découvert le secret Konami ! 🕹️</p>
        <p>Code: ↑ ↑ ↓ ↓ ← → ← → B A</p>
        <button 
          className="close-btn"
          onClick={() => setIsActivated(false)}
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default KonamiEasterEgg;