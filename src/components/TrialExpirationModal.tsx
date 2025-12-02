import React from 'react';
import { Crown, X, AlertCircle } from 'lucide-react';
import { Card } from './Card';
import { Button } from './Button';

interface TrialExpirationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  message: string;
  isExpired: boolean;
  daysRemaining?: number;
}

export function TrialExpirationModal({ 
  isOpen, 
  onClose, 
  onSubscribe, 
  message, 
  isExpired,
  daysRemaining 
}: TrialExpirationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center hover:bg-[var(--color-border)] transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            isExpired 
              ? 'bg-gradient-to-br from-red-400 to-red-600' 
              : 'bg-gradient-to-br from-amber-400 to-amber-600'
          }`}>
            {isExpired ? (
              <AlertCircle size={40} className="text-white" />
            ) : (
              <Crown size={40} className="text-white" />
            )}
          </div>

          {/* Title */}
          <h2 className="mb-3">
            {isExpired ? 'Trial Expired' : 'Trial Ending Soon'}
          </h2>

          {/* Message */}
          <p className="text-[var(--color-text-secondary)] mb-6">
            {message}
          </p>

          {/* Trial Info */}
          {!isExpired && daysRemaining !== undefined && (
            <div className="mb-6 p-4 bg-gradient-to-r from-amber-500/10 to-amber-600/10 border-2 border-amber-500/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertCircle size={20} className="text-amber-600" />
                <p className="font-semibold text-amber-700">
                  {daysRemaining} Day{daysRemaining !== 1 ? 's' : ''} Remaining
                </p>
              </div>
              <p className="text-sm text-amber-600">
                Subscribe now to avoid losing access
              </p>
            </div>
          )}

          {/* Premium Features Reminder */}
          <div className="mb-6 text-left">
            <p className="text-sm font-semibold mb-2">Premium Features You'll Lose:</p>
            <div className="space-y-2">
              {[
                'Unlimited AI recipe suggestions',
                'Voice-activated cooking assistant',
                'Auto-generated meal plans',
                'Smart inventory tracking',
                'Priority support'
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 flex-shrink-0" />
                  <p className="text-sm text-[var(--color-text-secondary)]">{feature}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="premium"
              size="lg"
              fullWidth
              onClick={onSubscribe}
              className="shadow-lg"
            >
              <Crown size={20} />
              Subscribe to Premium
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onClick={onClose}
            >
              {isExpired ? 'Continue with Basic' : 'Remind Me Later'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
