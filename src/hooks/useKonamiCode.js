import { useState, useEffect } from 'react';

const useKonamiCode = (onActivate) => {
  const [keys, setKeys] = useState([]);
  
  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  useEffect(() => {
    const handleKeyDown = (event) => {
      const newKeys = [...keys, event.code];
      const recentKeys = newKeys.slice(-10);
      setKeys(recentKeys);
      
      if (JSON.stringify(recentKeys) === JSON.stringify(konamiCode)) {
        onActivate();
        setKeys([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys, onActivate]);

  return { keys };
};

export default useKonamiCode;