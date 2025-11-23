import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './AchievementNotification.css';

/**
 * AchievementNotification - Shows achievement unlock notification
 */
const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose(), 300); // Wait for fade out
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  return (
    <div 
      className={`achievement-notification ${isVisible ? 'visible' : ''}`}
      role="alert"
      aria-live="assertive"
    >
      <div className="achievement-notification-content">
        <div className="achievement-icon-large">{achievement.icon}</div>
        <div className="achievement-text">
          <div className="achievement-badge-text">Achievement Unlocked!</div>
          <div className="achievement-name">{achievement.name}</div>
          <div className="achievement-description">{achievement.description}</div>
        </div>
      </div>
      <div className="achievement-glow"></div>
    </div>
  );
};

AchievementNotification.propTypes = {
  achievement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
  }),
  onClose: PropTypes.func.isRequired
};

export default AchievementNotification;

