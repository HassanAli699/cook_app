import React, { useState } from 'react';
import { Lock, CheckCircle, Eye, EyeOff, AlertCircle, Check, X } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Header } from '../../components/Header';

interface NewPasswordScreenProps {
  onNavigate: (screen: string) => void;
  email?: string;
}

export function NewPasswordScreen({ onNavigate, email }: NewPasswordScreenProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });

  // Password validation criteria
  const passwordCriteria = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const isPasswordValid = Object.values(passwordCriteria).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!password) {
      newErrors.push('Password is required');
    } else if (!isPasswordValid) {
      newErrors.push('Password does not meet all requirements');
    }

    if (!confirmPassword) {
      newErrors.push('Please confirm your password');
    } else if (password !== confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleReset = () => {
    setTouched({ password: true, confirmPassword: true });

    if (!validateForm()) {
      return;
    }

    // TODO: Call API to reset password with token
    // Example:
    // try {
    //   const urlParams = new URLSearchParams(window.location.search);
    //   const token = urlParams.get('token');
    //   await api.post('/auth/reset-password', { 
    //     token, 
    //     newPassword: password 
    //   });
    //   setShowSuccess(true);
    //   setTimeout(() => {
    //     onNavigate('login');
    //   }, 2500);
    // } catch (error) {
    //   setErrors(['Failed to reset password. Link may have expired.']);
    // }

    // Simulate API call for now
    setShowSuccess(true);
    setTimeout(() => {
      onNavigate('login');
    }, 2500);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setErrors([]);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setErrors([]);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex flex-col items-center justify-center p-6">
        <div className="bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-lg)] p-8 text-center max-w-sm w-full animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-[var(--color-success)] to-[var(--color-success)]/80 mb-6">
            <CheckCircle size={48} className="text-white" />
          </div>
          
          <h2 className="mb-3">Password Reset!</h2>
          <p className="text-[var(--color-text-secondary)]">
            Your password has been successfully reset. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header onBack={() => onNavigate('login')} />
      
      <div className="p-6 pt-8">
        <div className="mb-8">
          <h1 className="mb-2">Create New Password</h1>
          <p className="text-[var(--color-text-secondary)]">
            Your new password must be different from previously used passwords.
          </p>
          
          {email && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-[var(--color-text-secondary)] mb-1">Resetting password for:</p>
              <p className="text-sm font-medium text-[var(--color-primary)]">{email}</p>
            </div>
          )}
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl shadow-[var(--shadow-md)] p-6">
          <div className="space-y-4 mb-6">
            {/* New Password Input */}
            <div>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, password: true })}
                  icon={<Lock size={20} />}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg space-y-1.5">
                  <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">
                    Password must contain:
                  </p>
                  
                  <div className={`flex items-center gap-2 text-xs ${passwordCriteria.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.minLength ? <Check size={14} /> : <X size={14} />}
                    <span>At least 8 characters</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs ${passwordCriteria.hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.hasUpperCase ? <Check size={14} /> : <X size={14} />}
                    <span>One uppercase letter (A-Z)</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs ${passwordCriteria.hasLowerCase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.hasLowerCase ? <Check size={14} /> : <X size={14} />}
                    <span>One lowercase letter (a-z)</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs ${passwordCriteria.hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.hasNumber ? <Check size={14} /> : <X size={14} />}
                    <span>One number (0-9)</span>
                  </div>
                  
                  <div className={`flex items-center gap-2 text-xs ${passwordCriteria.hasSpecialChar ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordCriteria.hasSpecialChar ? <Check size={14} /> : <X size={14} />}
                    <span>One special character (!@#$%^&*)</span>
                  </div>
                </div>
              )}
            </div>
            
            {/* Confirm Password Input */}
            <div>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                  onBlur={() => setTouched({ ...touched, confirmPassword: true })}
                  icon={<Lock size={20} />}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Password Match Indicator */}
              {confirmPassword && (
                <div className={`mt-2 flex items-center gap-2 text-xs ${doPasswordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                  {doPasswordsMatch ? <Check size={14} /> : <X size={14} />}
                  <span>{doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && touched.password && touched.confirmPassword && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
              {errors.map((error, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-red-700">
                  <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleReset}
            disabled={!isPasswordValid || !doPasswordsMatch}
          >
            Reset Password
          </Button>
        </div>
      </div>
    </div>
  );
}