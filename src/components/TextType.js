import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import './TextType.css';

/**
 * TextType - Typing effect component with delete animation
 */
const TextType = ({
  text,
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  deletingSpeed = 30,
  loop = true,
  className = '',
  showCursor = true,
  cursorCharacter = '|',
  cursorClassName = '',
  textColors = [],
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  // Use useMemo for textArray to ensure stability
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  useEffect(() => {
    let timeout;
    const currentText = textArray[currentTextIndex];

    const type = () => {
      const current = currentText;
      
      if (isDeleting) {
        // Deletion mode
        setDisplayedText(current.substring(0, displayedText.length - 1));
        
        if (displayedText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          timeout = setTimeout(() => setCurrentIndex(0), pauseDuration);
        } else {
          timeout = setTimeout(type, deletingSpeed);
        }
      } else {
        // Typing mode
        setDisplayedText(current.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        
        if (currentIndex === current.length) {
          if (textArray.length > 1 || loop) {
            timeout = setTimeout(() => setIsDeleting(true), pauseDuration);
          }
        } else {
          timeout = setTimeout(type, typingSpeed);
        }
      }
    };

    if (currentIndex === 0 && !isDeleting) {
      timeout = setTimeout(type, initialDelay);
    } else {
      timeout = setTimeout(type, isDeleting ? deletingSpeed : typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    textArray,
    currentTextIndex,
    typingSpeed,
    deletingSpeed,
    pauseDuration,
    initialDelay,
    loop,
    displayedText
  ]);

  const getCurrentColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  return (
    <span 
      className={`text-type ${className}`}
      style={{ color: getCurrentColor() }}
      aria-live="polite"
      {...props}
    >
      {displayedText}
      {showCursor && (
        <span className={`text-type-cursor ${cursorClassName}`} aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

TextType.propTypes = {
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]).isRequired,
  typingSpeed: PropTypes.number,
  initialDelay: PropTypes.number,
  pauseDuration: PropTypes.number,
  deletingSpeed: PropTypes.number,
  loop: PropTypes.bool,
  className: PropTypes.string,
  showCursor: PropTypes.bool,
  cursorCharacter: PropTypes.string,
  cursorClassName: PropTypes.string,
  textColors: PropTypes.arrayOf(PropTypes.string)
};

export default TextType;
