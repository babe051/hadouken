import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './ComboDisplay.css';

const ComboDisplay = ({ comboInfo, show }) => {
  const [displayRating, setDisplayRating] = useState(null);
  const [comboCount, setComboCount] = useState(0);

  useEffect(() => {
    if (comboInfo && comboInfo.rating && comboInfo.rating !== 'START') {
      setDisplayRating(comboInfo.rating);
      setComboCount(comboInfo.comboCount || 0);
      
      // Clear rating after animation
      const timer = setTimeout(() => {
        setDisplayRating(null);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [comboInfo]);

  if (!show || !displayRating) {
    return null;
  }

  const ratingConfig = {
    PERFECT: { text: 'PERFECT!', color: '#4CAF50', multiplier: comboInfo?.multiplier || 1.0 },
    GOOD: { text: 'GOOD!', color: '#2196F3', multiplier: comboInfo?.multiplier || 1.0 },
    OK: { text: 'OK', color: '#FF9800', multiplier: comboInfo?.multiplier || 1.0 },
    MISS: { text: 'MISS', color: '#F44336', multiplier: comboInfo?.multiplier || 1.0 }
  };

  const config = ratingConfig[displayRating] || ratingConfig.OK;

  return (
    <div className="combo-display">
      <div 
        className={`combo-rating combo-${displayRating.toLowerCase()}`}
        style={{ '--rating-color': config.color }}
      >
        <span className="combo-text">{config.text}</span>
        {comboCount > 0 && (
          <span className="combo-count">x{comboCount}</span>
        )}
        {comboInfo?.multiplier && comboInfo.multiplier > 1.0 && (
          <span className="combo-multiplier">×{comboInfo.multiplier.toFixed(1)}</span>
        )}
      </div>
    </div>
  );
};

ComboDisplay.propTypes = {
  comboInfo: PropTypes.object,
  show: PropTypes.bool
};

ComboDisplay.defaultProps = {
  show: true
};

export default ComboDisplay;

