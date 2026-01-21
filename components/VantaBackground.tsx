import React, { useEffect, useRef, useState } from 'react';

interface VantaBackgroundProps {
  children: React.ReactNode;
}

export const VantaBackground: React.FC<VantaBackgroundProps> = ({ children }) => {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      // Dynamically import to avoid SSR issues
      import('vanta/dist/vanta.net.min').then((NET) => {
        import('three').then((THREE) => {
          setVantaEffect(
            NET.default({
              el: vantaRef.current,
              THREE: THREE,
              mouseControls: true,
              touchControls: true,
              gyroControls: false,
              minHeight: 200.0,
              minWidth: 200.0,
              scale: 1.0,
              scaleMobile: 1.0,
              color: 0x06b6d4,      // Cyan color
              backgroundColor: 0x020617, // Dark slate
              points: 8.0,
              maxDistance: 20.0,
              spacing: 18.0,
              showDots: true,
            })
          );
        });
      });
    }
    return () => {
      if (vantaEffect) {
        try {
          vantaEffect.destroy();
        } catch (e) {
          console.warn('Vanta cleanup error:', e);
        }
      }
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="relative min-h-screen">
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
