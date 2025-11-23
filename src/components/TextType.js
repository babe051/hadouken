import React, { useEffect, useState, useMemo } from 'react';
import './TextType.css';

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

  // CORRECTION : utilisation de useMemo pour textArray
  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  useEffect(() => {
    let timeout;
    const currentText = textArray[currentTextIndex];

    const type = () => {
      const current = currentText;
      
      if (isDeleting) {
        // Mode suppression
        setDisplayedText(current.substring(0, displayedText.length - 1));
        
        if (displayedText === '') {
          setIsDeleting(false);
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
          timeout = setTimeout(() => setCurrentIndex(0), pauseDuration);
        } else {
          timeout = setTimeout(type, deletingSpeed);
        }
      } else {
        // Mode écriture
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
    textArray, // ✅ Maintenant stable grâce à useMemo
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
      {...props}
    >
      {displayedText}
      {showCursor && (
        <span className={`text-type-cursor ${cursorClassName}`}>
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

export default TextType;