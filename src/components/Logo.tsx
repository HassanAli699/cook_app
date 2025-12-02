import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  variant?: 'default' | 'light';
}

export function Logo({ size = 'md', showText = false, className = '', variant = 'default' }: LogoProps) {
  const sizes = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      {/* Smart Chef Logo */}
      <div className={`${sizes[size]} relative`}>
        <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Background Circle with Gradient */}
          <circle cx="60" cy="60" r="56" fill="url(#logoGradient)" />
          
          {/* Inner Glow */}
          <circle cx="60" cy="60" r="52" fill="url(#innerGlow)" opacity="0.4" />
          
          {/* Main Logo Symbol - Stylized Chef Hat + Flame */}
          <g transform="translate(60, 60)">
            {/* Flame/Heat element - represents cooking passion */}
            <g transform="translate(0, -28)">
              {/* Outer flame - Tomato Orange */}
              <path
                d="M 0 -8 Q -4 -13 -2.5 -18 Q -1 -21 0 -19.5 Q 1 -21 2.5 -18 Q 4 -13 0 -8 Z"
                fill="#E85C3C"
                opacity="0.95"
              />
              {/* Middle flame - Sunset Orange */}
              <path
                d="M 0 -8 Q -2.5 -11 -1.5 -15 Q -0.5 -17.5 0 -16.5 Q 0.5 -17.5 1.5 -15 Q 2.5 -11 0 -8 Z"
                fill="#F47F3E"
                opacity="0.9"
              />
              {/* Inner flame - Golden yellow */}
              <path
                d="M 0 -8 Q -1.2 -10 -0.8 -13 Q 0 -15 0 -14 Q 0 -15 0.8 -13 Q 1.2 -10 0 -8 Z"
                fill="#FFD700"
                opacity="0.95"
              />
            </g>
            
            {/* Chef Hat - Modern & Sleek Design */}
            <g>
              {/* Hat Crown/Top - White with slight cream tint */}
              <path
                d="M -22 -5 C -24 -15, -18 -22, -10 -24 C -6 -25, -3 -26, 0 -25 C 3 -26, 6 -25, 10 -24 C 18 -22, 24 -15, 22 -5 Z"
                fill="#FFF8F3"
                opacity="0.98"
              />
              
              {/* Hat Band - Clean professional look */}
              <rect
                x="-24"
                y="-5"
                width="48"
                height="10"
                rx="3"
                fill="#FFF8F3"
              />
              
              {/* Bottom Rim */}
              <ellipse
                cx="0"
                cy="5"
                rx="26"
                ry="3"
                fill="#FFF8F3"
                opacity="0.95"
              />
              
              {/* Elegant Pleats/Details - Sage Green accents */}
              <line x1="-14" y1="-18" x2="-14" y2="-5" stroke="#5E8C6A" strokeWidth="1.5" opacity="0.3" />
              <line x1="-7" y1="-21" x2="-7" y2="-5" stroke="#5E8C6A" strokeWidth="1.5" opacity="0.25" />
              <line x1="0" y1="-22" x2="0" y2="-5" stroke="#5E8C6A" strokeWidth="1.5" opacity="0.3" />
              <line x1="7" y1="-21" x2="7" y2="-5" stroke="#5E8C6A" strokeWidth="1.5" opacity="0.25" />
              <line x1="14" y1="-18" x2="14" y2="-5" stroke="#5E8C6A" strokeWidth="1.5" opacity="0.3" />
              
              {/* Shine/Highlight */}
              <ellipse
                cx="-10"
                cy="-18"
                rx="5"
                ry="4"
                fill="white"
                opacity="0.5"
              />
            </g>
            
            {/* Utensils - Crossed spoon and fork with color */}
            <g transform="translate(0, 12)">
              {/* Fork - Left side - Sage Green */}
              <g transform="translate(-10, 0) rotate(-25)">
                {/* Shadow for depth */}
                <rect x="-1.5" y="0" width="3" height="22" rx="1.5" fill="black" opacity="0.2" transform="translate(0.5, 0.5)" />
                {/* Main fork body */}
                <rect x="-1.5" y="0" width="3" height="22" rx="1.5" fill="#5E8C6A" />
                {/* Fork tines */}
                <rect x="-4" y="0" width="1.5" height="8" rx="0.75" fill="#5E8C6A" />
                <rect x="2.5" y="0" width="1.5" height="8" rx="0.75" fill="#5E8C6A" />
                <rect x="-1.5" y="0" width="1.5" height="8" rx="0.75" fill="#5E8C6A" />
                {/* Highlight */}
                <rect x="-0.5" y="2" width="1" height="16" rx="0.5" fill="white" opacity="0.3" />
              </g>
              
              {/* Spoon - Right side - Sunset Orange */}
              <g transform="translate(10, 0) rotate(25)">
                {/* Shadow for depth */}
                <rect x="-1.5" y="5" width="3" height="17" rx="1.5" fill="black" opacity="0.2" transform="translate(0.5, 0.5)" />
                <ellipse cx="0" cy="2.5" rx="3.5" ry="4" fill="black" opacity="0.2" transform="translate(0.5, 0.5)" />
                {/* Main spoon body */}
                <rect x="-1.5" y="5" width="3" height="17" rx="1.5" fill="#F47F3E" />
                <ellipse cx="0" cy="2.5" rx="3.5" ry="4" fill="#F47F3E" />
                {/* Highlight */}
                <ellipse cx="-0.8" cy="1.5" rx="1.2" ry="1.5" fill="white" opacity="0.4" />
                <rect x="-0.5" y="7" width="1" height="12" rx="0.5" fill="white" opacity="0.3" />
              </g>
            </g>
          </g>
          
          {/* Outer Ring - Premium feel with gradient */}
          <circle cx="60" cy="60" r="56" stroke="url(#ringGradient)" strokeWidth="2" fill="none" opacity="0.6" />
          
          {/* Gradient Definitions */}
          <defs>
            {/* Main background gradient */}
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E85C3C" />
              <stop offset="50%" stopColor="#F47F3E" />
              <stop offset="100%" stopColor="#E85C3C" />
            </linearGradient>
            
            {/* Inner glow */}
            <radialGradient id="innerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#E85C3C" stopOpacity="0" />
            </radialGradient>
            
            {/* Ring gradient */}
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5E8C6A" />
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="100%" stopColor="#5E8C6A" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      {/* App Name */}
      {showText && (
        <div className="text-center">
          <h2 className={`${textSizes[size]} ${variant === 'light' ? 'text-white' : 'text-[var(--color-text-primary)]'} tracking-tight`}>
            Smart Chef
          </h2>
        </div>
      )}
    </div>
  );
}