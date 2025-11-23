/**
 * Sound utility for playing unique sounds for each key press
 * Uses Web Audio API to generate tones dynamically
 */

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.isEnabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      // Create audio context (compatible with older browsers)
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.audioContext = new AudioContextClass();
      }
    } catch (error) {
      console.warn('Web Audio API not supported:', error);
      this.isEnabled = false;
    }
  }

  /**
   * Generate a unique tone for each key
   * @param {string} keyCode - The key code (e.g., 'ArrowUp', 'KeyB')
   * @param {number} duration - Duration in seconds (default: 0.1)
   */
  playKeySound(keyCode, duration = 0.1) {
    if (!this.isEnabled || !this.audioContext) return;

    // Resume audio context if suspended (browser autoplay policy)
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    // Map each key to a unique frequency
    const frequencyMap = {
      'ArrowUp': 523.25,    // C5
      'ArrowDown': 493.88,  // B4
      'ArrowLeft': 440.00,  // A4
      'ArrowRight': 392.00, // G4
      'KeyB': 349.23,       // F4
      'KeyA': 329.63        // E4
    };

    const frequency = frequencyMap[keyCode] || 440; // Default to A4

    // Create oscillator
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Set frequency and wave type
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine'; // Smooth sine wave

    // Create envelope for smooth sound
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Quick attack
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration); // Smooth decay

    // Play sound
    oscillator.start(now);
    oscillator.stop(now + duration);

    // Clean up
    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * Play success sound when Konami code is completed
   */
  playSuccessSound() {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;
    const duration = 0.6;

    // Play a chord progression (C major chord)
    const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5

    frequencies.forEach((freq, index) => {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.frequency.value = freq;
      oscillator.type = 'sine';

      const startTime = now + (index * 0.1); // Stagger the notes
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

      oscillator.start(startTime);
      oscillator.stop(startTime + duration);

      oscillator.onended = () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    });
  }

  /**
   * Play error/wrong key sound
   */
  playErrorSound() {
    if (!this.isEnabled || !this.audioContext) return;

    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const now = this.audioContext.currentTime;
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    // Low, descending tone for error
    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.linearRampToValueAtTime(100, now + 0.2);
    oscillator.type = 'sawtooth';

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);

    oscillator.onended = () => {
      oscillator.disconnect();
      gainNode.disconnect();
    };
  }

  /**
   * Enable or disable sounds
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
  }
}

// Create singleton instance
const soundManager = new SoundManager();

export default soundManager;

