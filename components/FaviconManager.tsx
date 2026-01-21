import React, { useEffect } from 'react';

export const FaviconManager: React.FC = () => {
  useEffect(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Matrix Rain Logic for Favicon (32x32 pixel grid)
    const fontSize = 8;
    const columns = 4; // 32 / 8
    const drops: number[] = [1, 0, 3, 2]; // Initial diverse positions
    const chars = '01XYZ<>';

    const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);

    const draw = () => {
      // Fade out effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, 32, 32);

      ctx.fillStyle = '#06b6d4'; // Cyan
      ctx.font = 'bold 8px monospace';

      for (let i = 0; i < columns; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw Character
        ctx.fillText(text, x, y);

        // Reset
        if (y > 32 && Math.random() > 0.8) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Update Favicon
      link.href = canvas.toDataURL('image/png');
    };

    // Update every 100ms (10 FPS) sufficient for favicon tiny size
    const intervalId = setInterval(draw, 100);

    return () => {
      clearInterval(intervalId);
      link.href = ''; // Optional reset
    };
  }, []);

  return null;
};
