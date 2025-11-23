import React from 'react';
import PropTypes from 'prop-types';
import { KEY_DISPLAY_MAP } from '../constants/konami';
import './VirtualKeyboard.css';

const VirtualKeyboard = ({ onKeyPress, disabled }) => {
  const keys = [
    { code: 'ArrowUp', display: '↑', label: 'Up' },
    { code: 'ArrowDown', display: '↓', label: 'Down' },
    { code: 'ArrowLeft', display: '←', label: 'Left' },
    { code: 'ArrowRight', display: '→', label: 'Right' },
    { code: 'KeyB', display: 'B', label: 'B' },
    { code: 'KeyA', display: 'A', label: 'A' }
  ];

  const handleKeyClick = (keyCode) => {
    if (!disabled) {
      // Pass the keyCode directly to the handler
      onKeyPress(keyCode);
    }
  };

  const handleTouchStart = (e, keyCode) => {
    e.preventDefault();
    if (!disabled) {
      handleKeyClick(keyCode);
    }
  };

  return (
    <div className="virtual-keyboard" aria-label="Virtual keyboard">
      <div className="keyboard-row">
        <button
          className="virtual-key key-up"
          onClick={() => handleKeyClick('ArrowUp')}
          onTouchStart={(e) => handleTouchStart(e, 'ArrowUp')}
          disabled={disabled}
          aria-label="Up arrow"
        >
          <span className="key-display">↑</span>
          <span className="key-label">Up</span>
        </button>
      </div>
      
      <div className="keyboard-row">
        <button
          className="virtual-key key-left"
          onClick={() => handleKeyClick('ArrowLeft')}
          onTouchStart={(e) => handleTouchStart(e, 'ArrowLeft')}
          disabled={disabled}
          aria-label="Left arrow"
        >
          <span className="key-display">←</span>
          <span className="key-label">Left</span>
        </button>
        <button
          className="virtual-key key-down"
          onClick={() => handleKeyClick('ArrowDown')}
          onTouchStart={(e) => handleTouchStart(e, 'ArrowDown')}
          disabled={disabled}
          aria-label="Down arrow"
        >
          <span className="key-display">↓</span>
          <span className="key-label">Down</span>
        </button>
        <button
          className="virtual-key key-right"
          onClick={() => handleKeyClick('ArrowRight')}
          onTouchStart={(e) => handleTouchStart(e, 'ArrowRight')}
          disabled={disabled}
          aria-label="Right arrow"
        >
          <span className="key-display">→</span>
          <span className="key-label">Right</span>
        </button>
      </div>

      <div className="keyboard-row keyboard-letters">
        <button
          className="virtual-key key-letter key-b"
          onClick={() => handleKeyClick('KeyB')}
          onTouchStart={(e) => handleTouchStart(e, 'KeyB')}
          disabled={disabled}
          aria-label="B key"
        >
          <span className="key-display">B</span>
        </button>
        <button
          className="virtual-key key-letter key-a"
          onClick={() => handleKeyClick('KeyA')}
          onTouchStart={(e) => handleTouchStart(e, 'KeyA')}
          disabled={disabled}
          aria-label="A key"
        >
          <span className="key-display">A</span>
        </button>
      </div>
    </div>
  );
};

VirtualKeyboard.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

VirtualKeyboard.defaultProps = {
  disabled: false
};

export default VirtualKeyboard;

