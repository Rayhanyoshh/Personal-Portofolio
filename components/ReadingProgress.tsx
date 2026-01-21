import React, { useEffect, useState } from 'react';

export const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calculateProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight - windowHeight;
      const scrolled = window.scrollY;
      const progress = (scrolled / documentHeight) * 100;
      setProgress(Math.min(100, Math.max(0, progress)));
    };

    calculateProgress();
    window.addEventListener('scroll', calculateProgress, { passive: true });
    return () => window.removeEventListener('scroll', calculateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900/50 z-[100] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 transition-all duration-150 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};
