import React, { useEffect, useRef } from 'react';

export const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - reduced set for performance
    const chars = '01アイウエオ</>{}[]';
    const charArray = chars.split('');

    const fontSize = 16;
    const columns = Math.floor(canvas.width / fontSize);

    // Array to track y position of each column
    const drops: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }

    const draw = () => {
      // Semi-transparent black to create fade effect
      ctx.fillStyle = 'rgba(2, 6, 23, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Cyan color for text
      ctx.fillStyle = '#06b6d4';
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        
        // Draw character
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        
        // Varying opacity
        ctx.fillStyle = `rgba(6, 182, 212, ${Math.random() * 0.4 + 0.1})`;
        
        ctx.fillText(char, x, y);

        // Reset drop randomly after it goes off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 80); // Increased from 50ms to 80ms

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-15"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
