import React, { useEffect, useRef, useState } from 'react';

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'rotate';
  delay?: number;
}

export const ScrollAnimation: React.FC<ScrollAnimationProps> = ({ 
  children, 
  className = '',
  animation = 'fade-up',
  delay = 0 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-1000 ease-out';
    
    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return `${baseClass} opacity-0 translate-y-12`;
        case 'fade-down':
          return `${baseClass} opacity-0 -translate-y-12`;
        case 'fade-left':
          return `${baseClass} opacity-0 translate-x-12`;
        case 'fade-right':
          return `${baseClass} opacity-0 -translate-x-12`;
        case 'scale':
          return `${baseClass} opacity-0 scale-75`;
        case 'rotate':
          return `${baseClass} opacity-0 rotate-12`;
        default:
          return `${baseClass} opacity-0`;
      }
    }
    
    return `${baseClass} opacity-100 translate-y-0 translate-x-0 scale-100 rotate-0`;
  };

  return (
    <div ref={elementRef} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
};
