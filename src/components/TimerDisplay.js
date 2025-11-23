import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import './TimerDisplay.css';

/**
 * TimerDisplay - Shows timer for speed run challenges
 */
const TimerDisplay = ({ startTime, isActive, onTimeUpdate }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && startTime) {
      intervalRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setCurrentTime(elapsed);
        if (onTimeUpdate) {
          onTimeUpdate(elapsed);
        }
      }, 10); // Update every 10ms for smooth display

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      setCurrentTime(0);
    }
  }, [isActive, startTime, onTimeUpdate]);

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${seconds}.${milliseconds.toString().padStart(2, '0')}s`;
  };

  if (!isActive && currentTime === 0) return null;

  return (
    <div className="timer-display" aria-live="polite">
      <div className="timer-label">Time</div>
      <div className="timer-value">{formatTime(currentTime)}</div>
      {isActive && <div className="timer-pulse"></div>}
    </div>
  );
};

TimerDisplay.propTypes = {
  startTime: PropTypes.number,
  isActive: PropTypes.bool.isRequired,
  onTimeUpdate: PropTypes.func
};

export default TimerDisplay;

