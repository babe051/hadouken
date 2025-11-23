'use client';
import { useEffect, useRef } from 'react';

function SplashCursor({
  SIM_RESOLUTION = 128,
  DYE_RESOLUTION = 1440,
  CAPTURE_RESOLUTION = 512,
  DENSITY_DISSIPATION = 3.5,
  VELOCITY_DISSIPATION = 2,
  PRESSURE = 0.1,
  PRESSURE_ITERATIONS = 20,
  CURL = 3,
  SPLAT_RADIUS = 0.2,
  SPLAT_FORCE = 6000,
  SHADING = true,
  COLOR_UPDATE_SPEED = 10,
  BACK_COLOR = { r: 0, g: 0, b: 0 },
  TRANSPARENT = true
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialisation WebGL
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    // Fonction pour redimensionner le canvas
    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * pixelRatio);
      canvas.height = Math.floor(canvas.clientHeight * pixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Variables pour l'animation fluide
    let lastTime = 0;
    let pointer = { x: 0.5, y: 0.5, dx: 0, dy: 0, moved: false };

    // Fonction pour générer des couleurs aléatoires
    const generateColor = () => {
      const hue = Math.random() * 360;
      return HSVtoRGB(hue / 360, 1.0, 1.0);
    };

    // Conversion HSV vers RGB
    function HSVtoRGB(h, s, v) {
      let r, g, b, i, f, p, q, t;
      i = Math.floor(h * 6);
      f = h * 6 - i;
      p = v * (1 - s);
      q = v * (1 - f * s);
      t = v * (1 - (1 - f) * s);
      
      switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
        default: break;
      }
      return { r: r * 0.15, g: g * 0.15, b: b * 0.15 };
    }

    // Fonction d'animation principale
    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016);
      lastTime = currentTime;

      // Effet visuel simple - particules qui suivent la souris
      if (pointer.moved) {
        const ctx = gl;
        ctx.clearColor(0, 0, 0, 0.1);
        ctx.clear(gl.COLOR_BUFFER_BIT);
        
        // Dessiner un effet de fluide simple
        for (let i = 0; i < 5; i++) {
          const radius = 20 + Math.random() * 30;
          const color = generateColor();
          
          // Simulation d'un effet de fluide basique
          const gradient = ctx.createRadialGradient(
            pointer.x * canvas.width, 
            pointer.y * canvas.height, 
            0,
            pointer.x * canvas.width, 
            pointer.y * canvas.height, 
            radius
          );
          
          gradient.addColorStop(0, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.8)`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          const tempCanvas = document.createElement('canvas');
          const tempCtx = tempCanvas.getContext('2d');
          tempCanvas.width = canvas.width;
          tempCanvas.height = canvas.height;
          
          tempCtx.fillStyle = gradient;
          tempCtx.fillRect(0, 0, canvas.width, canvas.height);
          
          ctx.drawImage(tempCanvas, 0, 0);
        }
        
        pointer.moved = false;
      }

      requestAnimationFrame(animate);
    };

    // Gestionnaires d'événements souris
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / canvas.clientWidth;
      pointer.y = (e.clientY - rect.top) / canvas.clientHeight;
      pointer.moved = true;
    };

    const handleMouseDown = (e) => {
      handleMouseMove(e);
      // Effet supplémentaire au clic
      pointer.moved = true;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    // Démarrer l'animation
    requestAnimationFrame(animate);

    // Nettoyage
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [
    // Suppression des dépendances inutiles
    // SIM_RESOLUTION, DYE_RESOLUTION, etc. ne sont plus utilisés
  ]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 50,
        pointerEvents: 'none',
        width: '100%',
        height: '100%'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100vw',
          height: '100vh',
          display: 'block'
        }}
      />
    </div>
  );
}

export default SplashCursor;