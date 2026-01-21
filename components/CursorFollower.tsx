import React, { useEffect, useState, useRef } from 'react';

interface CursorState {
  x: number;
  y: number;
  isHovering: boolean;
  isClicking: boolean;
}

export const CursorFollower: React.FC = () => {
  const [cursor, setCursor] = useState<CursorState>({
    x: 0,
    y: 0,
    isHovering: false,
    isClicking: false,
  });
  const [isVisible, setIsVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrameId: number;

    const updateCursor = (e: MouseEvent) => {
      // Use RAF for smooth animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }

      animationFrameId = requestAnimationFrame(() => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Direct transform for better performance
        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }
        if (dotRef.current) {
          dotRef.current.style.transform = `translate(${x}px, ${y}px)`;
        }

        setCursor(prev => ({ ...prev, x, y }));
        setIsVisible(true);
      });
    };

    const handleMouseDown = () => setCursor(prev => ({ ...prev, isClicking: true }));
    const handleMouseUp = () => setCursor(prev => ({ ...prev, isClicking: false }));
    const handleMouseLeave = () => setIsVisible(false);

    // Throttled hover detection for better performance
    let hoverTimeout: NodeJS.Timeout;
    const handleMouseOver = (e: MouseEvent) => {
      if (hoverTimeout) clearTimeout(hoverTimeout);
      hoverTimeout = setTimeout(() => {
        const target = e.target as HTMLElement;
        const isInteractive = target.closest('a, button, [role="button"], input, textarea, select');
        setCursor(prev => ({ ...prev, isHovering: !!isInteractive }));
      }, 50);
    };

    document.addEventListener('mousemove', updateCursor, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Hide default cursor
    document.body.style.cursor = 'none';

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (hoverTimeout) clearTimeout(hoverTimeout);
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.body.style.cursor = 'auto';
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Tactical Sights - Rotating Outer Ring */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          width: cursor.isHovering ? 40 : cursor.isClicking ? 28 : 32, // Reduced from 60/45/50
          height: cursor.isHovering ? 40 : cursor.isClicking ? 28 : 32,
          marginLeft: cursor.isHovering ? -20 : cursor.isClicking ? -14 : -16,
          marginTop: cursor.isHovering ? -20 : cursor.isClicking ? -14 : -16,
          willChange: 'transform',
          transition: 'width 0.1s, height 0.1s, margin 0.1s',
        }}
      >
        {/* Outer Scope Ring */}
        <div 
          className={`relative w-full h-full rounded-full border border-cyan-500/80 transition-all duration-200 ${
             cursor.isClicking ? 'scale-90 bg-cyan-500/10' : 'scale-100'
          }`}
          style={{ animation: 'spin 10s linear infinite' }}
        >
            {/* Compass Ticks */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-cyan-500"></div>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-cyan-500"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-2 bg-cyan-500"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-2 bg-cyan-500"></div>
        </div>
      </div>

      {/* Inner Crosshair (Fixed) */}
      <div
         className="fixed top-0 left-0 pointer-events-none z-[10000] mix-blend-screen"
         ref={(el) => {
            if (el && dotRef.current) {
                // Manual sync to avoid lag, but here we just use the same ref logic if possible or separate
                el.style.transform = dotRef.current.style.transform;
            }
         }}
         style={{
            // We reuse the transform from the main effect, but we need a separate ref really. 
            // For simplicity, let's just use the dotRef logic in JS or CSS.
            // Actually, let's keep it simple and attach to the dotRef directly if possible.
            // But since we can't easily share ref, let's just make the inner dot the crosshair.
         }}
      >
      </div>

      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[10000]"
        style={{
          width: 14, // Reduced from 20
          height: 14,
          marginLeft: -7,
          marginTop: -7,
          willChange: 'transform',
        }}
      >
         {/* Center Dot */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444] ${cursor.isHovering ? 'bg-cyan-400 shadow-cyan-400' : ''}`} />
         
         {/* Cross Lines */}
         <div className={`absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500/50 -translate-y-1/2 ${cursor.isClicking ? 'w-0' : 'w-full'} transition-all`} />
         <div className={`absolute top-0 left-1/2 h-full w-[1px] bg-cyan-500/50 -translate-x-1/2 ${cursor.isClicking ? 'h-0' : 'h-full'} transition-all`} />
      </div>

      <style>{`
        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};
