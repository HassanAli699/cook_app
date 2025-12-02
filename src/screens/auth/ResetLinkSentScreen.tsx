import React, { useState, useEffect } from 'react';
import { Button } from '../../components/Button';
import { Mail, ExternalLink, Clock } from 'lucide-react';

interface ResetLinkSentScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  email?: string;
}

export function ResetLinkSentScreen({ onNavigate, email }: ResetLinkSentScreenProps) {
  const [showEmailApps, setShowEmailApps] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleOpenEmailApp = () => {
    setShowEmailApps(true);
  };

  const openEmailClient = (client: string) => {
    switch (client) {
      case 'gmail':
        // Open Gmail web app
        window.open('https://mail.google.com/', '_blank');
        break;
      case 'outlook':
        // Open Outlook web app
        window.open('https://outlook.live.com/', '_blank');
        break;
      case 'yahoo':
        // Open Yahoo Mail
        window.open('https://mail.yahoo.com/', '_blank');
        break;
      case 'apple':
        // For iOS devices, try to open Apple Mail
        window.location.href = 'message://';
        break;
      case 'default':
        // Try to open default mail client with mailto
        if (email) {
          window.location.href = `mailto:${email}`;
        }
        break;
    }
    
    // Close email apps selection
    setTimeout(() => {
      setShowEmailApps(false);
    }, 500);
  };

  const handleResendLink = () => {
    if (resendCountdown > 0) return;

    // Show success message
    setResendSuccess(true);
    setResendCountdown(60); // 60 second cooldown

    // Hide success message after 3 seconds
    setTimeout(() => {
      setResendSuccess(false);
    }, 3000);

    // TODO: Call API to resend the email
    // Example: await api.post('/auth/resend-reset-link', { email });
    console.log('Resending reset link to:', email);
  };

  if (showEmailApps) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-center p-6">
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-lg)] p-6 max-w-sm w-full">
          <div className="mb-6">
            <button
              onClick={() => setShowEmailApps(false)}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] mb-4"
            >
              ← Back
            </button>
            <h2 className="mb-2">Choose Email App</h2>
            <p className="text-sm text-[var(--color-text-secondary)]">
              Select your email provider to check for the reset link
            </p>
          </div>

          <div className="space-y-3">
            {/* Gmail */}
            <button
              onClick={() => openEmailClient('gmail')}
              className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                <Mail size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Gmail</p>
                <p className="text-sm text-[var(--color-text-secondary)]">mail.google.com</p>
              </div>
              <ExternalLink size={20} className="text-[var(--color-text-secondary)]" />
            </button>

            {/* Outlook */}
            <button
              onClick={() => openEmailClient('outlook')}
              className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Mail size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Outlook</p>
                <p className="text-sm text-[var(--color-text-secondary)]">outlook.live.com</p>
              </div>
              <ExternalLink size={20} className="text-[var(--color-text-secondary)]" />
            </button>

            {/* Yahoo Mail */}
            <button
              onClick={() => openEmailClient('yahoo')}
              className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Mail size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Yahoo Mail</p>
                <p className="text-sm text-[var(--color-text-secondary)]">mail.yahoo.com</p>
              </div>
              <ExternalLink size={20} className="text-[var(--color-text-secondary)]" />
            </button>

            {/* Apple Mail (iOS) */}
            <button
              onClick={() => openEmailClient('apple')}
              className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center">
                <Mail size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Apple Mail</p>
                <p className="text-sm text-[var(--color-text-secondary)]">iOS Mail App</p>
              </div>
              <ExternalLink size={20} className="text-[var(--color-text-secondary)]" />
            </button>

            {/* Default Mail Client */}
            <button
              onClick={() => openEmailClient('default')}
              className="w-full flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-xl hover:border-[var(--color-primary)] hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-lg flex items-center justify-center">
                <Mail size={24} className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Other Email App</p>
                <p className="text-sm text-[var(--color-text-secondary)]">Default mail client</p>
              </div>
              <ExternalLink size={20} className="text-[var(--color-text-secondary)]" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-center p-6">
      <div className="bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-lg)] p-8 text-center max-w-sm w-full">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success)]/80 mb-6">
          <span className="text-5xl">📧</span>
        </div>
        
        <h2 className="mb-3">Check Your Email</h2>
        
        {email && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-[var(--color-text-secondary)] mb-1">Reset link sent to:</p>
            <p className="font-medium text-[var(--color-primary)]">{email}</p>
          </div>
        )}
        
        <p className="text-[var(--color-text-secondary)] mb-8">
          We've sent a password reset link to your email. Please check your inbox and click the link to reset your password.
        </p>
        
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleOpenEmailApp}
          className="mb-4"
        >
          Open Email App
        </Button>

        {/* Resend Link Section */}
        <div className="mb-4">
          {resendSuccess && (
            <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">✓ Reset link sent successfully!</p>
            </div>
          )}
          
          <button
            onClick={handleResendLink}
            disabled={resendCountdown > 0}
            className={`text-sm ${
              resendCountdown > 0
                ? 'text-[var(--color-text-secondary)] cursor-not-allowed'
                : 'text-[var(--color-primary)] hover:underline'
            }`}
          >
            {resendCountdown > 0 ? (
              <span className="flex items-center justify-center gap-2">
                <Clock size={16} />
                Resend in {resendCountdown}s
              </span>
            ) : (
              'Didn\'t receive the email? Resend'
            )}
          </button>
        </div>

        <button
          onClick={() => onNavigate('login')}
          className="text-[var(--color-primary)] hover:underline"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}