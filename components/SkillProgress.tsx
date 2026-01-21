import React, { useState, useEffect, useRef } from 'react';

interface SkillProgressProps {
  skill: string;
  level: number; // 0-100
  yearsOfExperience?: number;
  index: number;
}

export const SkillProgress: React.FC<SkillProgressProps> = ({ 
  skill, 
  level, 
  yearsOfExperience,
  index 
}) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const skillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (skillRef.current) {
      observer.observe(skillRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      // Stagger animation based on index
      const timeout = setTimeout(() => {
        setProgress(level);
      }, index * 100);
      
      return () => clearTimeout(timeout);
    }
  }, [isVisible, level, index]);

  return (
    <div
      ref={skillRef}
      className="group relative bg-slate-900/50 border border-slate-800 hover:border-cyan-500/50 p-4 transition-all duration-300 cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/0 group-hover:border-cyan-500 transition-colors"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/0 group-hover:border-cyan-500 transition-colors"></div>

      {/* Skill Name & Level */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-tech text-sm text-cyan-100">{skill}</span>
        <span className="font-tech text-xs text-cyan-500">{Math.round(progress)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-cyan-600 to-blue-500 transition-all duration-1000 ease-out rounded-full relative"
          style={{ width: `${progress}%` }}
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      </div>

      {/* Expanded Info */}
      {isExpanded && yearsOfExperience && (
        <div className="mt-3 pt-3 border-t border-slate-800 animate-[slideDown_0.3s_ease-out]">
          <p className="font-tech text-xs text-slate-400">
            {yearsOfExperience} {yearsOfExperience === 1 ? 'year' : 'years'} of experience
          </p>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 100px;
          }
        }
      `}</style>
    </div>
  );
};
