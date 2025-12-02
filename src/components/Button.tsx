import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  children,
  ...props 
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md hover:shadow-lg active:scale-[0.98]',
    secondary: 'bg-[var(--color-secondary)] hover:bg-[var(--color-warm-brown)] text-white shadow-md hover:shadow-lg active:scale-[0.98]',
    outline: 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white active:scale-[0.98]',
    ghost: 'text-[var(--color-text-primary)] hover:bg-[var(--color-cream-dark)] active:scale-[0.98]',
    premium: 'bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] text-white shadow-md hover:shadow-lg active:scale-[0.98]',
    destructive: 'bg-[var(--color-error)] hover:bg-[var(--color-error)]/90 text-white shadow-md hover:shadow-lg active:scale-[0.98]'
  };
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
