// src/components/CelebrationPage.js
// src/components/CelebrationPage.js
import React from 'react';
import GridScan from './GridScan';
import CurvedLoop from './CurvedLoop';
import ScrollVelocity from './ScrollVelocity';
import AnimatedContent from './AnimatedContent';
import './CelebrationPage.css';

const CelebrationPage = ({ onClose }) => {
  return (
    <div className="celebration-page">
      {/* BACKGROUND FIXE VIOLET + SCAN BLANC */}
      <div className="celebration-background">
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
      
      {/* CONTENU CENTRÉ AVEC NOS COMPOSANTS */}
      <div className="celebration-content">
        
        {/* ✅ CURVEDLOOP PETIT EN HAUT */}
        <div className="small-curved-text">
          <CurvedLoop 
            marqueeText="✦ FÉLICITATIONS ✦"
            speed={1.5}
            curveAmount={100}
            direction="left"
            interactive={false}
          />
        </div>

        {/* ✅ CONTENU PRINCIPAL AVEC ANIMATEDCONTENT */}
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
            <div className="celebration-icon">🎮</div>
            <h1 className="celebration-title">
              Code Konami Maîtrisé
            </h1>
            <p className="success-text">
              Achievement secret débloqué !
            </p>
          </div>
        </AnimatedContent>

        {/* ✅ SCROLLVELOCITY PETIT EN BAS */}
        <div className="small-scroll-text">
          <ScrollVelocity
            texts={['Better than Hadouken!', 'Legendary Player!']}
            velocity={30}
            className="small-scroll-style"
          />
        </div>

        {/* ✅ BADGE AVEC ANIMATION */}
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
          <div className="achievement-badge">
            ⭐ Master Unlocked ⭐
          </div>
        </AnimatedContent>

        {/* ✅ BOUTON SANS ANIMATION - TOUJOURS VISIBLE */}
        <button 
          className="styled-return-button"
          onClick={onClose}
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  );
};

export default CelebrationPage;