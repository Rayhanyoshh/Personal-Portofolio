import React, { useEffect, useRef } from 'react';

interface VantaBackgroundProps {
  children: React.ReactNode;
}

export const VantaBackground: React.FC<VantaBackgroundProps> = ({ children }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  // Store vanta instance in a ref so it never triggers re-renders or re-runs the effect
  const vantaEffectRef = useRef<any>(null);

  useEffect(() => {
    // Guard: only init once, and only when the DOM node is available
    if (vantaEffectRef.current || !vantaRef.current) return;

    import('vanta/dist/vanta.net.min').then((NET) => {
      import('three').then((THREE) => {
        // Double-check that the component is still mounted before init
        if (!vantaRef.current) return;
        vantaEffectRef.current = NET.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0x06b6d4,       // Cyan
          backgroundColor: 0x020617, // Dark slate
          points: 8.0,
          maxDistance: 20.0,
          spacing: 18.0,
          showDots: true,
        });
      });
    });

    // Cleanup: destroy the vanta effect when the component unmounts
    return () => {
      if (vantaEffectRef.current) {
        try {
          vantaEffectRef.current.destroy();
        } catch (e) {
          console.warn('Vanta cleanup error:', e);
        }
        vantaEffectRef.current = null;
      }
    };
  }, []); // Empty deps — run only once on mount

  return (
    <div ref={vantaRef} className="relative min-h-screen">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
