import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import * as THREE from 'three';
import './ParticleSystem3D.css';

/**
 * ParticleSystem3D - 3D particle system using Three.js
 * Creates beautiful 3D particle effects
 */
const ParticleSystem3D = ({ 
  particleCount = 1000,
  color = '#ff00ff',
  speed = 1,
  size = 2,
  enabled = true
}) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const animationFrameRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const container = containerRef.current;
    if (!container) return;

    let scene, camera, renderer, particles, material, geometry;
    let cleanup = () => {};

    try {
      const width = Math.max(container.clientWidth || 1, 1);
      const height = Math.max(container.clientHeight || 1, 1);

      // Scene setup
      scene = new THREE.Scene();
      sceneRef.current = scene;

      // Camera setup
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.z = 500;
      cameraRef.current = camera;

      // Renderer setup
      renderer = new THREE.WebGLRenderer({ 
        alpha: true, 
        antialias: true 
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      // Particle system
      geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);

      const colorObj = new THREE.Color(color);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions in a sphere
        const radius = Math.random() * 400 + 100;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);
        
        positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = radius * Math.cos(phi);
        
        // Colors with variation
        const colorVariation = 0.3 + Math.random() * 0.7;
        colors[i3] = colorObj.r * colorVariation;
        colors[i3 + 1] = colorObj.g * colorVariation;
        colors[i3 + 2] = colorObj.b * colorVariation;
        
        // Random sizes
        sizes[i] = Math.random() * size + 1;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      // Shader material for glowing particles
      material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          pixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) }
        },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            
            // Animate particles
            mvPosition.x += sin(time * 0.001 + position.y * 0.01) * 10.0;
            mvPosition.y += cos(time * 0.001 + position.x * 0.01) * 10.0;
            
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          
          void main() {
            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float alpha = 1.0 - smoothstep(0.0, 0.5, distanceToCenter);
            
            // Glow effect
            alpha *= 1.5;
            alpha = min(alpha, 1.0);
            
            gl_FragColor = vec4(vColor, alpha);
          }
        `,
        transparent: true,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);
      particlesRef.current = particles;

      // Animation loop
      let time = 0;
      const animate = () => {
        if (!renderer || !scene || !camera) return;
        animationFrameRef.current = requestAnimationFrame(animate);
        
        time += 16 * speed; // ~60fps
        if (material && material.uniforms) {
          material.uniforms.time.value = time;
        }
        
        // Rotate camera for dynamic view
        camera.position.x = Math.sin(time * 0.0005) * 200;
        camera.position.y = Math.cos(time * 0.0003) * 200;
        camera.lookAt(0, 0, 0);
        
        // Rotate particles
        if (particles) {
          particles.rotation.x += 0.0005 * speed;
          particles.rotation.y += 0.001 * speed;
        }
        
        renderer.render(scene, camera);
      };
      animate();

      // Handle resize
      const handleResize = () => {
        if (!container || !camera || !renderer) return;
        const newWidth = Math.max(container.clientWidth || 1, 1);
        const newHeight = Math.max(container.clientHeight || 1, 1);
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup function
      cleanup = () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
          animationFrameRef.current = null;
        }
        window.removeEventListener('resize', handleResize);
        if (renderer && renderer.domElement && container && container.contains(renderer.domElement)) {
          try {
            container.removeChild(renderer.domElement);
          } catch (e) {
            // Element already removed
          }
        }
        if (geometry) {
          try {
            geometry.dispose();
          } catch (e) {
            // Already disposed
          }
        }
        if (material) {
          try {
            material.dispose();
          } catch (e) {
            // Already disposed
          }
        }
        if (renderer) {
          try {
            renderer.dispose();
          } catch (e) {
            // Already disposed
          }
        }
      };
    } catch (error) {
      // Silently fail if WebGL is not available or there's an error
      if (process.env.NODE_ENV === 'development') {
        console.warn('ParticleSystem3D initialization error:', error);
      }
    }

    return cleanup;
  }, [enabled, particleCount, color, speed, size]);

  if (!enabled) return null;

  return (
    <div 
      ref={containerRef} 
      className="particle-system-3d"
      aria-hidden="true"
    />
  );
};

ParticleSystem3D.propTypes = {
  particleCount: PropTypes.number,
  color: PropTypes.string,
  speed: PropTypes.number,
  size: PropTypes.number,
  enabled: PropTypes.bool
};

export default ParticleSystem3D;
