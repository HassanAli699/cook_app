import React, { useState } from 'react';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  returnTo?: string;
}

export function ForgotPasswordScreen({ onNavigate, returnTo = 'login' }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSendLink = () => {
    // Clear previous error
    setError('');

    // Validate email is not empty
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Show loading state
    setIsLoading(true);
    
    // TODO: Call API to send password reset email
    // Example: 
    // try {
    //   await api.post('/auth/forgot-password', { email });
    //   onNavigate('reset-link-sent', { email });
    // } catch (error) {
    //   setError('Failed to send reset link. Please try again.');
    //   setIsLoading(false);
    // }
    
    // Simulate API call for now
    setTimeout(() => {
      setIsLoading(false);
      // Pass email to the next screen
      onNavigate('reset-link-sent', { email });
    }, 1000);
  };

  const handleBack = () => {
    // Clear returnTo when going back
    onNavigate(returnTo, { returnTo: '' });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendLink();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header onBack={handleBack} />
      
      <div className="p-6 pt-8">
        <div className="mb-8">
          <h1 className="mb-2">Forgot Password?</h1>
          <p className="text-[var(--color-text-secondary)]">
            Don't worry! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-md)] p-6">
          <div className="mb-6">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(''); // Clear error when user types
              }}
              onKeyPress={handleKeyPress}
              icon={<Mail size={20} />}
            />
            
            {/* Error Message */}
            {error && (
              <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleSendLink}
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-sm text-[var(--color-text-secondary)]">
              We'll email you a link to reset your password
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}