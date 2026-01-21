import React, { useRef, useEffect, useState } from 'react';
import { CRTConfig, Particle } from '../types';

interface RetroCanvasProps {
  config: CRTConfig;
}

const RetroCanvas: React.FC<RetroCanvasProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const [fps, setFps] = useState(0);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const initParticles = () => {
      const particles: Particle[] = [];
      const w = window.innerWidth;
      const h = window.innerHeight;
      
      // Single Hero Particle
      particles.push({
        x: w / 2,
        y: h / 2,
        vx: (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 5),
        vy: (Math.random() > 0.5 ? 1 : -1) * (10 + Math.random() * 5),
        radius: 40, // Much larger radius for the single ball
        color: '', 
        hue: 120, // Start Green
      });
      
      particlesRef.current = particles;
    };
    initParticles();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const animate = (time: number) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(Math.round((frameCount * 1000) / (time - lastTime)));
        frameCount = 0;
        lastTime = time;
      }

      if (!config.power) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        requestRef.current = requestAnimationFrame(animate);
        return;
      }

      // 1. Trail / Decay Logic
      // FIX: Removed the '* 0.4' multiplier to allow full range of persistence.
      // If decay is 0.95 (5% persistence), alpha is 0.95, clearing 95% of previous frame.
      const alpha = config.phosphorDecay;
      
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Render Particles
      // Use 'lighter' (additive mixing) to simulate light combining
      ctx.globalCompositeOperation = 'lighter';

      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce with radius accounting
        if (p.x < p.radius || p.x > canvas.width - p.radius) {
             p.vx *= -1;
             p.x = Math.max(p.radius, Math.min(canvas.width - p.radius, p.x));
        }
        if (p.y < p.radius || p.y > canvas.height - p.radius) {
             p.vy *= -1;
             p.y = Math.max(p.radius, Math.min(canvas.height - p.radius, p.y));
        }

        // Lock Hue to Green (120)
        p.hue = 120; 

        // --- DRAWING STRATEGY ---
        const aberration = config.chromaticAberration * 8;

        if (aberration > 1) {
             // Separate RGB Beams
             // RED
             ctx.fillStyle = `rgba(255, 0, 0, 0.8)`;
             ctx.beginPath();
             ctx.arc(p.x - aberration, p.y, p.radius, 0, Math.PI * 2);
             ctx.fill();
             
             // BLUE
             ctx.fillStyle = `rgba(0, 0, 255, 0.8)`;
             ctx.beginPath();
             ctx.arc(p.x + aberration, p.y, p.radius, 0, Math.PI * 2);
             ctx.fill();
             
             // GREEN (Center)
             ctx.fillStyle = `rgba(0, 255, 0, 0.8)`;
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
             ctx.fill();
        } else {
             // Combined Beam - Darker Green
             // Using 45% Lightness instead of 90% to avoid the "white" core look
             const coreColor = `hsla(${p.hue}, 100%, 45%, 1)`; 
             const glowColor = `hsla(${p.hue}, 100%, 20%, 0.4)`;

             // Large Outer Glow
             ctx.fillStyle = glowColor;
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
             ctx.fill();

             // Core
             ctx.fillStyle = coreColor;
             ctx.beginPath();
             ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
             ctx.fill();
        }
      });

      // Reset composite for Text
      ctx.globalCompositeOperation = 'source-over';

      // 3. HUD Rendering
      const drawOSD = (text: string, x: number, y: number, size = 32) => {
         ctx.font = `${size}px "VT323"`;
         ctx.textAlign = 'center'; // Center alignment
         
         // Glow
         ctx.shadowBlur = 10;
         ctx.shadowColor = '#0f0';
         
         // Fill
         ctx.fillStyle = '#ccffcc';
         ctx.fillText(text, x, y);
         
         // Remove shadow for next ops
         ctx.shadowBlur = 0;
      };

      // Calculate Center
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Random "glitch" offset for text occasionally
      const jitterX = Math.random() > 0.98 ? (Math.random() - 0.5) * 4 : 0;
      const jitterY = Math.random() > 0.98 ? (Math.random() - 0.5) * 2 : 0;
      
      // Render centered text
      drawOSD(`INPUT: AUX-RGB`, centerX + jitterX, centerY + jitterY, 48);
      drawOSD(`FPS: ${fps}`, centerX, centerY + 40, 24);
      
      // Draw a "Rec" indicator blinking (Keep in corner)
      if (Math.floor(Date.now() / 500) % 2 === 0) {
          ctx.fillStyle = '#f00';
          ctx.shadowColor = '#f00';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(canvas.width - 60, 60, 10, 0, Math.PI*2);
          ctx.fill();
          ctx.shadowBlur = 0;
          
          ctx.font = '24px "VT323"';
          ctx.textAlign = 'left';
          ctx.fillStyle = '#f00';
          ctx.fillText("REC", canvas.width - 40, 68);
      }

      // 4. Scanline Beam
      const scanY = (time / 8.33) % canvas.height; // ~8ms per scan roughly
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fillRect(0, scanY, canvas.width, 30);

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [config, fps]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full object-cover"
      style={{
        filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.4))'
      }}
    />
  );
};

export default RetroCanvas;