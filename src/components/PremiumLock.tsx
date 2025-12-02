import React from 'react';
import { Lock, Crown } from 'lucide-react';
import { Button } from './Button';

interface PremiumLockProps {
  feature?: string;
  onUpgrade?: () => void;
}

export function PremiumLock({ feature = 'This feature', onUpgrade }: PremiumLockProps) {
  return (
    <div className="premium-overlay">
      <div className="text-center px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] mb-4">
          <Crown size={32} className="text-white" />
        </div>
        <h4 className="mb-2">Premium Feature</h4>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          {feature} is available with Smart Chef Premium
        </p>
        {onUpgrade && (
          <Button variant="premium" size="sm" onClick={onUpgrade}>
            <Crown size={16} />
            Upgrade Now
          </Button>
        )}
      </div>
    </div>
  );
}

export function PremiumBadge({ className = '' }: { className?: string }) {
  return (
    <span className={`premium-badge ${className}`}>
      <Crown size={12} />
      Premium
    </span>
  );
}