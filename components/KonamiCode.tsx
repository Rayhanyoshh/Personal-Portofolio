import React, { useEffect, useState } from 'react';

interface KonamiCodeProps {
  onUnlock: () => void;
}

const KONAMI_CODE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'KeyB',
  'KeyA',
];

// Map keys to normalize inputs
const normalizeKey = (e: KeyboardEvent) => {
  // Allow 'b' or 'B' or 'KeyB'
  if (e.key.toLowerCase() === 'b' || e.code === 'KeyB') return 'KeyB';
  if (e.key.toLowerCase() === 'a' || e.code === 'KeyA') return 'KeyA';
  if (e.key === 'ArrowUp' || e.code === 'ArrowUp') return 'ArrowUp';
  if (e.key === 'ArrowDown' || e.code === 'ArrowDown') return 'ArrowDown';
  if (e.key === 'ArrowLeft' || e.code === 'ArrowLeft') return 'ArrowLeft';
  if (e.key === 'ArrowRight' || e.code === 'ArrowRight') return 'ArrowRight';
  return e.code; // Fallback
};

export const KonamiCode: React.FC<KonamiCodeProps> = ({ onUnlock }) => {
  const [keys, setKeys] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const normalized = normalizeKey(e);
      
      setKeys(prevKeys => {
        const newKeys = [...prevKeys, normalized].slice(-10);
        
        if (newKeys.join(',') === KONAMI_CODE.join(',') && !unlocked) {
          setUnlocked(true);
          onUnlock();
        }
        
        return newKeys;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [unlocked, onUnlock]);

  if (unlocked) return null;

  return null;
};

// Easter Egg Component
export const EasterEggModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[10002] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-[fadeIn_0.3s_ease-out]">
      <div className="relative bg-slate-900 border-2 border-cyan-500 rounded-lg p-8 max-w-md shadow-[0_0_50px_rgba(6,182,212,0.5)] animate-[scaleIn_0.4s_ease-out]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        {/* Content */}
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4 animate-bounce">🎮</div>
          <h2 className="font-hero text-3xl font-bold text-cyan-400 uppercase tracking-wider">
            Konami Code Unlocked!
          </h2>
          <p className="text-slate-300 font-tech text-sm leading-relaxed">
            You found the secret! 🎉
            <br />
            <br />
            Thanks for exploring my portfolio with such attention to detail.
            <br />
            <br />
            This shows you're the kind of person who goes the extra mile.
            <br />
            <br />
            Let's build something amazing together! 🚀
          </p>
          <div className="pt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-black font-tech text-sm rounded transition-all hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};
