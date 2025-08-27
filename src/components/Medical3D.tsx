import React from 'react';

const Medical3D: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* 3D Medical Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#145566] via-[#1a6b7d] to-[#0e3e46]">
        
        {/* DNA Helix Animation */}
        <div className="absolute top-1/4 left-1/4 animate-spin-slow">
          <div className="relative w-32 h-32">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-pulse"></div>
            <div className="absolute inset-2 border-4 border-white/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute inset-4 border-4 border-white/40 rounded-full animate-pulse delay-700"></div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        </div>

        {/* Medical Cross 3D */}
        <div className="absolute top-1/3 right-1/4 transform-gpu perspective-1000">
          <div className="relative w-16 h-16 animate-float">
            <div className="absolute inset-0 bg-white/20 rounded-sm transform rotate-45 animate-pulse"></div>
            <div className="absolute top-1/4 left-1/2 w-2 h-8 bg-white/40 transform -translate-x-1/2 rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-8 h-2 bg-white/40 transform -translate-y-1/2 rounded-full"></div>
          </div>
        </div>

        {/* Microscope 3D Element */}
        <div className="absolute bottom-1/4 left-1/6 transform-gpu">
          <div className="relative w-24 h-24 animate-bounce-slow">
            {/* Microscope Base */}
            <div className="absolute bottom-0 left-1/2 w-16 h-4 bg-white/20 transform -translate-x-1/2 rounded-full"></div>
            {/* Microscope Body */}
            <div className="absolute bottom-4 left-1/2 w-8 h-16 bg-white/30 transform -translate-x-1/2 rounded-t-full"></div>
            {/* Lens */}
            <div className="absolute top-2 left-1/2 w-6 h-6 bg-white/40 transform -translate-x-1/2 rounded-full animate-ping"></div>
          </div>
        </div>

        {/* Stethoscope 3D */}
        <div className="absolute top-1/2 right-1/6 transform-gpu">
          <div className="relative w-20 h-20 animate-sway">
            <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
            <div className="absolute top-1/4 left-1/4 w-2 h-8 bg-white/40 rounded-full transform rotate-45"></div>
            <div className="absolute top-1/4 right-1/4 w-2 h-8 bg-white/40 rounded-full transform -rotate-45"></div>
            <div className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-white/50 rounded-full transform -translate-x-1/2"></div>
          </div>
        </div>

        {/* Molecular Structure */}
        <div className="absolute bottom-1/3 right-1/3 animate-spin-reverse">
          <div className="relative w-28 h-28">
            {/* Central atom */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            {/* Orbiting atoms */}
            <div className="absolute top-2 left-1/2 w-3 h-3 bg-white/40 rounded-full transform -translate-x-1/2 animate-pulse"></div>
            <div className="absolute bottom-2 left-1/2 w-3 h-3 bg-white/40 rounded-full transform -translate-x-1/2 animate-pulse delay-300"></div>
            <div className="absolute top-1/2 left-2 w-3 h-3 bg-white/40 rounded-full transform -translate-y-1/2 animate-pulse delay-150"></div>
            <div className="absolute top-1/2 right-2 w-3 h-3 bg-white/40 rounded-full transform -translate-y-1/2 animate-pulse delay-450"></div>
          </div>
        </div>

        {/* Medical Pills Floating */}
        <div className="absolute top-3/4 left-1/3 animate-float-slow">
          <div className="relative w-12 h-6 bg-white/30 rounded-full">
            <div className="absolute left-0 top-0 w-6 h-6 bg-white/40 rounded-full"></div>
            <div className="absolute right-0 top-0 w-6 h-6 bg-white/20 rounded-full"></div>
          </div>
        </div>

        {/* Heart Rate Line Animation */}
        <div className="absolute bottom-1/4 right-1/4 w-32 h-16 animate-pulse">
          <svg viewBox="0 0 100 40" className="w-full h-full">
            <path
              d="M0,20 L20,20 L25,10 L30,30 L35,5 L40,35 L45,20 L100,20"
              stroke="white"
              strokeWidth="2"
              fill="none"
              className="opacity-40"
            />
          </svg>
        </div>

        {/* Skin Layer Visualization */}
        <div className="absolute top-1/6 right-1/8 transform-gpu">
          <div className="relative w-20 h-20 animate-layer-shift">
            <div className="absolute inset-0 bg-white/20 rounded-lg transform translate-z-0"></div>
            <div className="absolute inset-1 bg-white/30 rounded-lg transform translate-z-4"></div>
            <div className="absolute inset-2 bg-white/40 rounded-lg transform translate-z-8"></div>
          </div>
        </div>

        {/* Medical Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-2 h-2 bg-white/20 rounded-full animate-float-particle`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Medical3D;