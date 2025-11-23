import React from 'react';
import PropTypes from 'prop-types';
import { DIFFICULTY_LEVELS } from '../constants/difficulty';
import './DifficultySelector.css';

const DifficultySelector = ({ currentDifficulty, onDifficultyChange, disabled }) => {
  const difficulties = Object.values(DIFFICULTY_LEVELS);

  return (
    <div className="difficulty-selector">
      <label className="difficulty-label">Difficulté:</label>
      <div className="difficulty-buttons">
        {difficulties.map((difficulty) => (
          <button
            key={difficulty.id}
            className={`difficulty-button ${currentDifficulty.id === difficulty.id ? 'active' : ''}`}
            onClick={() => !disabled && onDifficultyChange(difficulty)}
            disabled={disabled}
            style={{
              '--difficulty-color': difficulty.color,
              borderColor: currentDifficulty.id === difficulty.id ? difficulty.color : 'transparent'
            }}
            aria-label={`Sélectionner difficulté ${difficulty.name}`}
          >
            <span className="difficulty-icon">{difficulty.icon}</span>
            <span className="difficulty-name">{difficulty.name}</span>
            <span className="difficulty-length">{difficulty.sequenceLength} touches</span>
          </button>
        ))}
      </div>
    </div>
  );
};

DifficultySelector.propTypes = {
  currentDifficulty: PropTypes.object.isRequired,
  onDifficultyChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

DifficultySelector.defaultProps = {
  disabled: false
};

export default DifficultySelector;

