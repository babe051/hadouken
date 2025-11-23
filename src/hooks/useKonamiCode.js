import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import soundManager from '../utils/sounds';
import { ComboTracker } from '../utils/combo';

/**
 * Custom hook to detect Konami Code sequence
 * @param {Function} onActivate - Callback function called when code is activated
 * @param {Array<string>} customSequence - Optional custom sequence to use instead of default Konami code
 * @param {Function} onCombo - Optional callback function called when combo is calculated
 * @returns {Object} Object containing current keys array, error state, and combo info
 */
const useKonamiCode = (onActivate, customSequence = null, onCombo = null) => {
  const [keys, setKeys] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [comboInfo, setComboInfo] = useState(null);
  const onActivateRef = useRef(onActivate);
  const onComboRef = useRef(onCombo);
  const comboTrackerRef = useRef(new ComboTracker());
  const lastKeyTimeRef = useRef(null);
  
  // Update refs when callbacks change
  useEffect(() => {
    onActivateRef.current = onActivate;
  }, [onActivate]);
  
  useEffect(() => {
    onComboRef.current = onCombo;
  }, [onCombo]);
  
  // Use custom sequence if provided, otherwise use default Konami code
  // Memoize to avoid recreating the array on every render
  const konamiCode = useMemo(() => {
    return customSequence || [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'KeyB', 'KeyA'
    ];
  }, [customSequence]);

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
    setHasError(false);
    setComboInfo(null);
    comboTrackerRef.current.reset();
    lastKeyTimeRef.current = null;
  }, []);

  // Reset when sequence changes
  useEffect(() => {
    setKeys([]);
    setHasError(false);
    setComboInfo(null);
    comboTrackerRef.current.reset();
    lastKeyTimeRef.current = null;
  }, [customSequence]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const keyCode = event.code;
      const expectedKey = konamiCode[keys.length];
      
      // If we have an error, only accept the correct key
      if (hasError) {
        if (keyCode === expectedKey) {
          // Correct key pressed - clear error and continue
          setHasError(false);
          
          // Calculate combo
          const currentTime = Date.now();
          const comboResult = comboTrackerRef.current.recordKeyPress(currentTime);
          setComboInfo(comboResult);
          
          if (onComboRef.current) {
            onComboRef.current(comboResult);
          }
          
          soundManager.playKeySound(keyCode);
          
          setKeys(prevKeys => {
            const newKeys = [...prevKeys, keyCode];
            const recentKeys = newKeys.slice(-konamiCode.length);
            
            // Use efficient array comparison instead of JSON.stringify
            if (arraysEqual(recentKeys, konamiCode)) {
              // Play success sound
              soundManager.playSuccessSound();
              // Use ref to avoid dependency issues
              if (onActivateRef.current) {
                const comboStats = comboTrackerRef.current.getStats();
                onActivateRef.current(comboStats);
              }
              return [];
            }
            
            return recentKeys;
          });
        } else {
          // Wrong key pressed while in error state - play error sound
          soundManager.playErrorSound();
        }
        return;
      }
      
      // Normal flow - check if the key is correct
      if (keyCode === expectedKey) {
        // Correct key - calculate combo
        const currentTime = Date.now();
        const comboResult = comboTrackerRef.current.recordKeyPress(currentTime);
        setComboInfo(comboResult);
        
        // Call combo callback if provided
        if (onComboRef.current) {
          onComboRef.current(comboResult);
        }
        
        soundManager.playKeySound(keyCode);
        
        setKeys(prevKeys => {
          const newKeys = [...prevKeys, keyCode];
          const recentKeys = newKeys.slice(-konamiCode.length);
          
          // Use efficient array comparison instead of JSON.stringify
          if (arraysEqual(recentKeys, konamiCode)) {
            // Play success sound
            soundManager.playSuccessSound();
            // Use ref to avoid dependency issues
            if (onActivateRef.current) {
              const comboStats = comboTrackerRef.current.getStats();
              onActivateRef.current(comboStats);
            }
            return [];
          }
          
          return recentKeys;
        });
      } else {
        // Wrong key - set error state and reset combo
        setHasError(true);
        comboTrackerRef.current.reset();
        setComboInfo(null);
        soundManager.playErrorSound();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [keys.length, hasError, konamiCode]); // Include konamiCode in deps

  return { keys, reset, hasError, comboInfo };
};

export default useKonamiCode;
