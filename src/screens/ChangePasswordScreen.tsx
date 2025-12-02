import React, { useState } from 'react';
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

interface ChangePasswordScreenProps {
  onNavigate: (screen: string) => void;
}

export function ChangePasswordScreen({ onNavigate }: ChangePasswordScreenProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  
  const [successMessage, setSuccessMessage] = useState('');

  // Password strength validation
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-green-500'
  ];

  // Password requirements
  const requirements = [
    { label: 'At least 8 characters', met: newPassword.length >= 8 },
    { label: 'Uppercase & lowercase letters', met: /[a-z]/.test(newPassword) && /[A-Z]/.test(newPassword) },
    { label: 'At least one number', met: /\d/.test(newPassword) },
    { label: 'Special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword) }
  ];

  const validateForm = () => {
    const newErrors: typeof errors = {};

    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (passwordStrength < 2) {
      newErrors.newPassword = 'Password is too weak. Include uppercase, lowercase, and numbers';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (currentPassword === newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // TODO: Call backend API to change password
      // Example:
      // try {
      //   const authToken = localStorage.getItem('authToken');
      //   const result = await api.post('/auth/change-password', 
      //     { 
      //       currentPassword, 
      //       newPassword 
      //     },
      //     {
      //       headers: { 'Authorization': `Bearer ${authToken}` }
      //     }
      //   );
      //   
      //   // Success - show message and navigate back
      //   setSuccessMessage('Password changed successfully!');
      //   
      //   // Clear form after 2 seconds and navigate back
      //   setTimeout(() => {
      //     setCurrentPassword('');
      //     setNewPassword('');
      //     setConfirmPassword('');
      //     setSuccessMessage('');
      //     onNavigate('settings');
      //   }, 2000);
      // } catch (error) {
      //   if (error.response?.status === 401) {
      //     // Current password is incorrect
      //     setErrors({ currentPassword: 'Current password is incorrect' });
      //   } else if (error.response?.status === 400) {
      //     // New password doesn't meet requirements
      //     setErrors({ newPassword: error.response.data.message || 'Password does not meet requirements' });
      //   } else {
      //     // Other errors
      //     setErrors({ currentPassword: 'Failed to change password. Please try again.' });
      //   }
      // }

      // TEMPORARY: Frontend-only implementation (remove when backend is ready)
      setSuccessMessage('Password changed successfully!');
      
      // Clear form after 2 seconds and navigate back
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccessMessage('');
        onNavigate('settings');
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="Change Password" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6">
        {successMessage ? (
          <Card className="p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--color-success)]/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-[var(--color-success)]" />
            </div>
            <h3 className="mb-2">Success!</h3>
            <p className="text-[var(--color-text-secondary)]">{successMessage}</p>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Security Notice */}
            <Card className="p-4 bg-blue-50 border border-blue-200">
              <div className="flex gap-3">
                <Lock size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-blue-900 mb-1">Security Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use at least 8 characters</li>
                    <li>• Mix uppercase and lowercase letters</li>
                    <li>• Include numbers and special characters</li>
                    <li>• Don't reuse passwords from other accounts</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Current Password */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block">
                  Current Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('forgot-password', { returnTo: 'change-password' })}
                  className="text-sm text-[var(--color-primary)] hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={errors.currentPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.currentPassword && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{errors.currentPassword}</span>
                </div>
              )}
            </Card>

            {/* New Password */}
            <Card className="p-6">
              <label className="block mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className={errors.newPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Password Requirements Checklist */}
              {newPassword && (
                <div className="mt-4 space-y-2">
                  {requirements.map((req, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-2 text-sm transition-colors ${
                        req.met ? 'text-green-600' : 'text-[var(--color-text-secondary)]'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                        req.met ? 'bg-[var(--color-success)]/20' : 'bg-[var(--color-border)]'
                      }`}>
                        {req.met ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <X size={14} className="text-gray-400" />
                        )}
                      </div>
                      <span>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Password Strength Indicator */}
              {newPassword && passwordStrength > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[var(--color-text-secondary)]">
                      Password Strength:
                    </span>
                    <span className={`text-sm font-semibold ${
                      passwordStrength === 1 ? 'text-orange-600' :
                      passwordStrength === 2 ? 'text-yellow-600' :
                      passwordStrength === 3 ? 'text-green-600' :
                      'text-green-700'
                    }`}>
                      {strengthLabels[passwordStrength - 1]}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength
                            ? strengthColors[passwordStrength - 1]
                            : 'bg-[var(--color-border)]'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {errors.newPassword && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{errors.newPassword}</span>
                </div>
              )}
            </Card>

            {/* Confirm Password */}
            <Card className="p-6">
              <label className="block mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {/* Match Indicator */}
              {confirmPassword && (
                <div className={`flex items-center gap-2 mt-2 text-sm ${
                  newPassword === confirmPassword ? 'text-green-600' : 'text-orange-600'
                }`}>
                  <CheckCircle size={16} />
                  <span>
                    {newPassword === confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </span>
                </div>
              )}
              
              {errors.confirmPassword && (
                <div className="flex items-center gap-2 mt-2 text-sm text-red-600">
                  <AlertCircle size={16} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </Card>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                fullWidth
                onClick={() => onNavigate('settings')}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" fullWidth>
                Change Password
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}