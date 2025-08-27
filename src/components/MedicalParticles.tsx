import React from 'react';

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
    const size = 20 + Math.random() * 30;
    const left = Math.random() * 100;
    const opacity = 0.1 + Math.random() * 0.2;

    // Medical icons as Unicode symbols
    const medicalIcons = ['⚕️', '🔬', '💊', '🩺', '🧬', '⚗️', '🏥', '💉'];
    const icon = medicalIcons[Math.floor(Math.random() * medicalIcons.length)];

    return (
      <div
        key={i}
        className="absolute pointer-events-none select-none"
        style={{
          left: `${left}%`,
          fontSize: `${size}px`,
          opacity,
          animation: `medicalFloat ${duration}s linear infinite`,
          animationDelay: `${delay}s`,
        }}
      >
        <div
          style={{
            animation: `medicalRotate ${8 + Math.random() * 4}s linear infinite`,
          }}
        >
          {icon}
        </div>
      </div>
    );
  });

  return (
    <>
      <style>
        {`
          @keyframes medicalFloat {
            0% {
              transform: translateY(100vh) scale(0);
            }
            10% {
              transform: translateY(90vh) scale(1);
            }
            90% {
              transform: translateY(-10vh) scale(1);
            }
            100% {
              transform: translateY(-20vh) scale(0);
            }
          }
          
          @keyframes medicalRotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .medical-particles * {
              animation: none !important;
            }
          }
        `}
      </style>
      <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 medical-particles ${className}`}>
        {particles}
      </div>
    </>
  );
};

export default MedicalParticles;