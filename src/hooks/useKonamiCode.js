import { useState, useEffect, useRef, useCallback } from 'react';
import soundManager from '../utils/sounds';

/**
 * Custom hook to detect Konami Code sequence
 * @param {Function} onActivate - Callback function called when code is activated
 * @returns {Object} Object containing current keys array
 */
const useKonamiCode = (onActivate) => {
  const [keys, setKeys] = useState([]);
  const onActivateRef = useRef(onActivate);
  
  // Update ref when callback changes
  useEffect(() => {
    onActivateRef.current = onActivate;
  }, [onActivate]);
  
  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
  ];

  // Efficient array comparison function
  const arraysEqual = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  // Check if key is part of Konami code
  const isKonamiKey = (keyCode) => {
    return konamiCode.includes(keyCode);
  };

  // Reset function to clear keys
  const reset = useCallback(() => {
    setKeys([]);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyCode = event.code;
      
      // Play sound for Konami code keys
      if (isKonamiKey(keyCode)) {
        soundManager.playKeySound(keyCode);
      } else {
        // Play error sound for wrong keys
        soundManager.playErrorSound();
      }

      setKeys(prevKeys => {
        const newKeys = [...prevKeys, keyCode];
        const recentKeys = newKeys.slice(-10);
        
        // Use efficient array comparison instead of JSON.stringify
        if (arraysEqual(recentKeys, konamiCode)) {
          // Play success sound
          soundManager.playSuccessSound();
          // Use ref to avoid dependency issues
          if (onActivateRef.current) {
            onActivateRef.current();
          }
          return [];
        }
        
        return recentKeys;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []); // Empty deps - using ref for callback

  return { keys, reset };
};

export default useKonamiCode;
