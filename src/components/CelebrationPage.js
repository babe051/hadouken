import React from 'react';
import PropTypes from 'prop-types';
import GridScan from './GridScan';
import CurvedLoop from './CurvedLoop';
import ScrollVelocity from './ScrollVelocity';
import AnimatedContent from './AnimatedContent';
import ParticleSystem3D from './ParticleSystem3D';
import soundManager from '../utils/sounds';
import './CelebrationPage.css';

/**
 * CelebrationPage - Advanced celebration page shown after Konami code activation
 * Features animated grid scan background, curved text, and scroll velocity effects
 */
const CelebrationPage = ({ onClose }) => {
  const handleKeyDown = React.useCallback((e) => {
    // Allow closing with Escape key
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Prevent body scroll when celebration page is open
  React.useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div 
      className="celebration-page"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
      aria-describedby="celebration-message"
      onClick={(e) => {
        // Prevent clicks from propagating to elements behind
        e.stopPropagation();
      }}
      onMouseDown={(e) => {
        // Prevent mouse events from propagating
        e.stopPropagation();
      }}
    >
      {/* Enhanced 3D Particle System for celebration */}
      <ParticleSystem3D 
        particleCount={1500}
        color="#ffffff"
        speed={1.2}
        size={4}
        enabled={true}
      />

      {/* Fixed purple background with white scan */}
      <div className="celebration-background" aria-hidden="true">
        <GridScan
          sensitivity={0.7}
          lineThickness={1.2}
          linesColor="#ffffff"
          gridScale={0.08}
          scanColor="#ffffff"
          scanOpacity={0.6}
          enablePost={false}
          noiseIntensity={0.005}
          scanGlow={0.8}
          scanSoftness={1.5}
          scanDuration={3.0}
          scanDelay={1.0}
        />
      </div>
      
      {/* Centered content with components */}
      <div className="celebration-content">
        {/* Small curved text at top */}
        <div className="small-curved-text" aria-hidden="true">
          <CurvedLoop 
            marqueeText="✦ FÉLICITATIONS ✦"
            speed={1.5}
            curveAmount={100}
            direction="left"
            interactive={false}
          />
        </div>

        {/* Main content with AnimatedContent */}
        <AnimatedContent
          distance={50}
          direction="vertical"
          duration={1.2}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity={true}
          scale={1.05}
          threshold={0.1}
          delay={0.3}
        >
          <div className="main-content">
            <div className="celebration-icon" aria-hidden="true">🎮</div>
            <h1 id="celebration-title" className="celebration-title">
              Code Konami Maîtrisé
            </h1>
            <p id="celebration-message" className="success-text">
              Achievement secret débloqué !
            </p>
          </div>
        </AnimatedContent>

        {/* Small scroll velocity text at bottom */}
        <div className="small-scroll-text" aria-hidden="true">
          <ScrollVelocity
            texts={['Better than Hadouken!', 'Legendary Player!']}
            velocity={30}
            className="small-scroll-style"
          />
        </div>

        {/* Badge with animation */}
        <AnimatedContent
          distance={40}
          direction="horizontal"
          duration={1.0}
          ease="power3.out"
          initialOpacity={0}
          animateOpacity={true}
          scale={1.02}
          threshold={0.2}
          delay={0.8}
        >
          <div className="achievement-badge" aria-label="Achievement unlocked">
            ⭐ Master Unlocked ⭐
          </div>
        </AnimatedContent>

        {/* Return button - always visible */}
        <button 
          className="styled-return-button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            // Play click sound
            soundManager.playKeySound('KeyA', 0.15);
            onClose();
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
          }}
          aria-label="Return to home"
          type="button"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

CelebrationPage.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default CelebrationPage;
