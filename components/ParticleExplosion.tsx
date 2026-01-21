import React, { useEffect, useRef } from 'react';

export const ParticleExplosion: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      color: string;
      size: number;
      type?: 'spark' | 'shockwave';
    }[] = [];

    const createGunshot = (x: number, y: number) => {
      // 1. Sparks (Sharp lines flying out)
      const sparkCount = 8;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 6; // High speed
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1.0,
          color: Math.random() > 0.6 ? '#facc15' : '#06b6d4', // Yellow or Cyan
          size: Math.random() * 4 + 2, // Length of spark
          type: 'spark'
        });
      }

      // 2. Shockwave (Expanding ring)
       particles.push({
          x, 
          y, 
          vx: 0, 
          vy: 0, 
          life: 1.0, 
          color: '#ffffff', 
          size: 5, // Start radius
          type: 'shockwave'
       });
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        if (p.type === 'shockwave') {
            // Draw expanding ring
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.life * 0.5})`;
            ctx.lineWidth = 3;
            ctx.stroke();
            p.size += 8; // Expand very fast
            p.life -= 0.15; // Die fast
        } else {
            // Draw spark (Line)
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.06;
            
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            // Trail logic
            ctx.lineTo(p.x - p.vx * 1.5, p.y - p.vy * 1.5); 
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = p.life;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
        }

        if (p.life <= 0) {
          particles.splice(i, 1);
        }
      }

      requestAnimationFrame(animate);
    };

    const handleMouseDown = (e: MouseEvent) => {
      createGunshot(e.clientX, e.clientY);
    };

    window.addEventListener('mousedown', handleMouseDown);
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
