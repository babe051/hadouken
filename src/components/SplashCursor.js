import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * SplashCursor - Creates a visual cursor effect using 2D canvas
 * Note: Simplified implementation using 2D canvas instead of WebGL
 */
function SplashCursor({
  enabled = true
}) {
  const canvasRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use 2D canvas context instead of WebGL
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Function to resize canvas
    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      canvas.width = Math.floor(canvas.clientWidth * pixelRatio);
      canvas.height = Math.floor(canvas.clientHeight * pixelRatio);
      ctx.scale(pixelRatio, pixelRatio);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Variables for smooth animation
    let lastTime = 0;
    const pointer = { x: 0.5, y: 0.5, moved: false };

    // Function to generate random colors
    const generateColor = () => {
      const hue = Math.random() * 360;
      return HSVtoRGB(hue / 360, 1.0, 1.0);
    };

    // Convert HSV to RGB
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

    // Main animation function
    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const deltaTime = Math.min((currentTime - lastTime) / 1000, 0.016);
      lastTime = currentTime;

      // Simple visual effect - particles following mouse
      if (pointer.moved) {
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        
        // Draw simple fluid effect
        for (let i = 0; i < 5; i++) {
          const radius = 20 + Math.random() * 30;
          const color = generateColor();
          
          const gradient = ctx.createRadialGradient(
            pointer.x * canvas.clientWidth, 
            pointer.y * canvas.clientHeight, 
            0,
            pointer.x * canvas.clientWidth, 
            pointer.y * canvas.clientHeight, 
            radius
          );
          
          gradient.addColorStop(0, `rgba(${Math.floor(color.r * 255)}, ${Math.floor(color.g * 255)}, ${Math.floor(color.b * 255)}, 0.8)`);
          gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
        }
        
        pointer.moved = false;
      }

      rafIdRef.current = requestAnimationFrame(animate);
    };

    // Mouse event handlers
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / canvas.clientWidth;
      pointer.y = (e.clientY - rect.top) / canvas.clientHeight;
      pointer.moved = true;
    };

    const handleMouseDown = (e) => {
      handleMouseMove(e);
      pointer.moved = true;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);

    // Start animation
    rafIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
    };
  }, [enabled]);

  if (!enabled) return null;

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
      aria-hidden="true"
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

SplashCursor.propTypes = {
  enabled: PropTypes.bool
};

export default SplashCursor;
