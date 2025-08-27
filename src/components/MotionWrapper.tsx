import React, { useEffect, useRef, useState } from 'react';

interface MotionWrapperProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn' | 'bounceIn';
  delay?: number;
  duration?: number;
  className?: string;
}

const MotionWrapper: React.FC<MotionWrapperProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay * 1000);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getAnimationClass = () => {
    if (!isVisible) return 'motion-hidden';
    
    switch (animation) {
      case 'fadeIn':
        return 'motion-fade-in';
      case 'slideUp':
        return 'motion-slide-up';
      case 'slideLeft':
        return 'motion-slide-left';
      case 'slideRight':
        return 'motion-slide-right';
      case 'zoomIn':
        return 'motion-zoom-in';
      case 'bounceIn':
        return 'motion-bounce-in';
      default:
        return 'motion-fade-in';
    }
  };

  return (
    <div
      ref={ref}
      className={`${getAnimationClass()} ${className}`}
      style={{ 
        animationDuration: `${duration}s`,
        animationFillMode: 'both'
      }}
    >
      {children}
    </div>
  );
};

export default MotionWrapper;