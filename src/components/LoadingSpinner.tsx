import React from 'react';

export function LoadingSpinner({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="border-4 border-[var(--color-cream-dark)] border-t-[var(--color-primary)] rounded-full animate-spin"
        style={{ width: size, height: size }}
      />
    </div>
  );
}
