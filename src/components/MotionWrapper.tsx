import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const getAnimationVariants = () => {
    const baseVariants = {
      hidden: {},
      visible: {
        transition: {
          duration,
          delay,
          ease: "easeOut" as const
        }
      }
    };

    switch (animation) {
      case 'fadeIn':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, ...baseVariants.visible }
        };
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, ...baseVariants.visible }
        };
      case 'slideLeft':
        return {
          hidden: { opacity: 0, x: 30 },
          visible: { opacity: 1, x: 0, ...baseVariants.visible }
        };
      case 'slideRight':
        return {
          hidden: { opacity: 0, x: -30 },
          visible: { opacity: 1, x: 0, ...baseVariants.visible }
        };
      case 'zoomIn':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, ...baseVariants.visible }
        };
      case 'bounceIn':
        return {
          hidden: { opacity: 0, scale: 0.3 },
          visible: { 
            opacity: 1, 
            scale: 1,
            transition: {
              duration,
              delay,
              type: "spring" as const,
              damping: 10,
              stiffness: 100
            }
          }
        };
      default:
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, ...baseVariants.visible }
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getAnimationVariants()}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;