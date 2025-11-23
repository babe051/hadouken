import React from 'react';
import PropTypes from 'prop-types';
import { THEMES } from '../constants/themes';
import './ThemeSelector.css';

const ThemeSelector = ({ currentTheme, onThemeChange, disabled }) => {
  const themes = Object.values(THEMES);

  return (
    <div className="theme-selector">
      <label className="theme-label">Thème:</label>
      <div className="theme-buttons">
        {themes.map((theme) => (
          <button
            key={theme.id}
            className={`theme-button ${currentTheme.id === theme.id ? 'active' : ''}`}
            onClick={() => !disabled && onThemeChange(theme)}
            disabled={disabled}
            style={{
              '--theme-accent': theme.colors.accent,
              '--theme-primary': theme.colors.primary,
              borderColor: currentTheme.id === theme.id ? theme.colors.accent : 'transparent'
            }}
            aria-label={`Sélectionner thème ${theme.name}`}
          >
            <span className="theme-icon">{theme.icon}</span>
            <span className="theme-name">{theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

ThemeSelector.propTypes = {
  currentTheme: PropTypes.object.isRequired,
  onThemeChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

ThemeSelector.defaultProps = {
  disabled: false
};

export default ThemeSelector;

