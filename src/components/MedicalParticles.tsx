import React from 'react';
import { motion } from 'framer-motion';

interface MedicalParticlesProps {
  density?: 'light' | 'medium' | 'heavy';
  className?: string;
}

const MedicalParticles: React.FC<MedicalParticlesProps> = ({ 
  density = 'light',
  className = ''
}) => {
  const getParticleCount = () => {
    switch (density) {
      case 'light': return 8;
      case 'medium': return 12;
      case 'heavy': return 16;
      default: return 8;
    }
  };

  const particles = Array.from({ length: getParticleCount() }, (_, i) => {
    const delay = Math.random() * 10;
    const duration = 15 + Math.random() * 10;
    const rotateDuration = 8 + Math.random() * 4;
    const size = 20 + Math.random() * 30;
    const left = Math.random() * 100;
    const opacity = 0.1 + Math.random() * 0.2;

    // Medical icons as Unicode symbols
    const medicalIcons = ['⚕️', '🔬', '💊', '🩺', '🧬', '⚗️', '🏥', '💉'];
    const icon = medicalIcons[Math.floor(Math.random() * medicalIcons.length)];

    return (
      <motion.div
        key={i}
        className="absolute pointer-events-none select-none"
        style={{
          left: `${left}%`,
          fontSize: `${size}px`,
          opacity,
        }}
        initial={{ 
          y: '100vh', 
          scale: 0 
        }}
        animate={{ 
          y: '-20vh', 
          scale: [0, 1, 1, 0] 
        }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.1, 0.9, 1]
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: rotateDuration,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {icon}
        </motion.div>
      </motion.div>
    );
  });

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${className}`}>
      {particles}
    </div>
  );
};

export default MedicalParticles;