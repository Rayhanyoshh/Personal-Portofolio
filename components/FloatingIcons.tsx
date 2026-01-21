import React, { useEffect, useState } from 'react';

interface FloatingIcon {
  id: number;
  icon: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  rotation: number;
}

const techIcons = [
  '⚛️', '🔷', '🟢', '🔶', '💠', '⬡', '◈', '❖',
  '</>', '{ }', '[ ]', '( )', '##', '::',
  'JS', 'TS', 'PY', 'C#', 'SQL', 'API'
];

export const FloatingIcons: React.FC = () => {
  const [icons, setIcons] = useState<FloatingIcon[]>([]);

  useEffect(() => {
    // Generate random floating icons - reduced count for performance
    const generateIcons = () => {
      const newIcons: FloatingIcon[] = [];
      for (let i = 0; i < 12; i++) { // Reduced from 20 to 12
        newIcons.push({
          id: i,
          icon: techIcons[Math.floor(Math.random() * techIcons.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 16 + 14, // Slightly larger
          speed: Math.random() * 25 + 15, // Slower
          opacity: Math.random() * 0.25 + 0.1, // More subtle
          rotation: Math.random() * 360,
        });
      }
      setIcons(newIcons);
    };

    generateIcons();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {icons.map((icon) => (
        <div
          key={icon.id}
          className="absolute font-tech text-cyan-500 animate-float"
          style={{
            left: `${icon.x}%`,
            top: `${icon.y}%`,
            fontSize: `${icon.size}px`,
            opacity: icon.opacity,
            transform: `rotate(${icon.rotation}deg)`,
            animation: `float ${icon.speed}s ease-in-out infinite`,
            animationDelay: `${icon.id * 0.5}s`,
          }}
        >
          {icon.icon}
        </div>
      ))}
      
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(5deg);
          }
          50% {
            transform: translateY(-10px) rotate(-5deg);
          }
          75% {
            transform: translateY(-30px) rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
};
