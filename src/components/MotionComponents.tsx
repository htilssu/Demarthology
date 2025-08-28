import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Button with hover animations
export const MotionButton: React.FC<HTMLMotionProps<"button">> = ({ children, className = '', ...props }) => (
  <motion.button
    className={className}
    whileHover={{ 
      y: -2,
      boxShadow: "0 4px 12px rgba(20, 85, 102, 0.2)"
    }}
    whileTap={{ y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.button>
);

// Card with hover animations - simplified version without 'as' prop
export const MotionCard: React.FC<HTMLMotionProps<"div">> = ({ 
  children, 
  className = '', 
  ...props 
}) => (
  <motion.div
    className={className}
    whileHover={{ 
      y: -5,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
    }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    {children}
  </motion.div>
);

// Pulse animation component
export const MotionPulse: React.FC<HTMLMotionProps<"div">> = ({ children, className = '', ...props }) => (
  <motion.div
    className={className}
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ 
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut" as const
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Float animation component
export const MotionFloat: React.FC<HTMLMotionProps<"div">> = ({ children, className = '', ...props }) => (
  <motion.div
    className={className}
    animate={{ y: [0, -10, 0] }}
    transition={{ 
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut" as const
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Hover pulse effect
export const MotionHoverPulse: React.FC<HTMLMotionProps<"div">> = ({ children, className = '', ...props }) => (
  <motion.div
    className={className}
    whileHover={{ 
      scale: [1, 1.05, 1],
      transition: { duration: 0.6, ease: "easeInOut" as const }
    }}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger container for animating lists
export const MotionStagger: React.FC<{ children: React.ReactNode; className?: string; staggerDelay?: number }> = ({ 
  children, 
  className = '', 
  staggerDelay = 0.1 
}) => (
  <motion.div
    className={className}
    initial="hidden"
    animate="visible"
    variants={{
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay
        }
      }
    }}
  >
    {children}
  </motion.div>
);

// Stagger item for use within MotionStagger
export const MotionStaggerItem: React.FC<HTMLMotionProps<"div"> & { animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'zoomIn' }> = ({ 
  children, 
  className = '', 
  animation = 'fadeIn',
  ...props 
}) => {
  const variants = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 }
    },
    slideLeft: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 }
    },
    slideRight: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 }
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 }
    }
  };

  return (
    <motion.div
      className={className}
      variants={variants[animation]}
      transition={{ duration: 0.6, ease: "easeOut" as const }}
      {...props}
    >
      {children}
    </motion.div>
  );
};