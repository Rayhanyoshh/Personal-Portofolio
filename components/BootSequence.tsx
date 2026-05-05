import React, { useState, useEffect } from 'react';

interface BootLine {
  text: string;
  type: 'system' | 'success' | 'warning' | 'info' | 'ascii';
  delay: number;
}

const BOOT_LINES: BootLine[] = [
  { text: 'BIOS v3.0.1 — POST Check', type: 'system', delay: 0 },
  { text: '[ OK ] CPU: Neural-Core i9 @ 4.2GHz', type: 'success', delay: 200 },
  { text: '[ OK ] RAM: 64GB DDR5 Allocated', type: 'success', delay: 350 },
  { text: '[ OK ] GPU: RTX-Holographic Initialized', type: 'success', delay: 500 },
  { text: 'Loading kernel modules...', type: 'system', delay: 700 },
  { text: '[ OK ] Module: three.js renderer', type: 'success', delay: 900 },
  { text: '[ OK ] Module: vanta.net background', type: 'success', delay: 1050 },
  { text: '[ OK ] Module: matrix-rain overlay', type: 'success', delay: 1200 },
  { text: '[WARN] Firewall: Portfolio mode — all ports open', type: 'warning', delay: 1400 },
  { text: 'Establishing neural link...', type: 'info', delay: 1600 },
  { text: '[ OK ] Identity: RAYHAN YOSHARA', type: 'success', delay: 1900 },
  { text: '[ OK ] Role: Software Developer', type: 'success', delay: 2050 },
  { text: '', type: 'ascii', delay: 2300 },
  { text: 'System ready. Welcome, Operator.', type: 'info', delay: 2500 },
];

const TOTAL_BOOT_TIME = 3200; // ms before fade out starts

export const BootSequence: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  // Reveal lines one by one
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    BOOT_LINES.forEach((line, index) => {
      const timer = setTimeout(() => {
        setVisibleLines(index + 1);
      }, line.delay);
      timers.push(timer);
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  // Progress bar
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / (TOTAL_BOOT_TIME - 400)) * 100, 100);
      setProgress(pct);

      if (pct >= 100) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Fade out and complete
  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, TOTAL_BOOT_TIME);

    const completeTimer = setTimeout(() => {
      onComplete();
    }, TOTAL_BOOT_TIME + 800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  const getLineColor = (type: BootLine['type']) => {
    switch (type) {
      case 'success': return 'text-green-400';
      case 'warning': return 'text-amber-400';
      case 'info': return 'text-cyan-400';
      case 'ascii': return 'text-cyan-500';
      default: return 'text-slate-400';
    }
  };

  return (
    <div
      className={`fixed inset-0 z-[10001] bg-slate-950 flex flex-col items-center justify-center transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)',
        }}
      />

      {/* Boot terminal */}
      <div className="w-full max-w-2xl px-6">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse shadow-[0_0_8px_#06b6d4]" />
          <span className="font-tech text-xs text-cyan-500/60 tracking-[0.3em] uppercase">
            System Boot Sequence
          </span>
        </div>

        {/* Lines */}
        <div className="space-y-1 font-mono text-sm mb-8 min-h-[320px]">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div
              key={i}
              className={`${getLineColor(line.type)} animate-[fadeSlideIn_0.2s_ease-out]`}
            >
              {line.text === '' ? (
                <pre className="text-[10px] leading-[12px] text-cyan-600/60 my-2">
{`  ╔══════════════════════════════════════╗
  ║     R A Y H A N . L O G             ║
  ║     Portfolio System v3.0            ║
  ╚══════════════════════════════════════╝`}
                </pre>
              ) : (
                <span>{line.text}</span>
              )}
            </div>
          ))}

          {/* Blinking cursor at end */}
          {visibleLines > 0 && (
            <span className="inline-block w-2 h-4 bg-cyan-500 animate-pulse" />
          )}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between font-tech text-[10px] text-slate-500 uppercase tracking-widest">
            <span>Loading modules</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-100 shadow-[0_0_10px_#06b6d4]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skip hint */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setFadeOut(true);
              setTimeout(onComplete, 500);
            }}
            className="font-tech text-[10px] text-slate-600 hover:text-cyan-500 transition-colors tracking-widest uppercase"
          >
            [ Press to skip ]
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
