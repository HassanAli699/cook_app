import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';
import { Check, X } from 'lucide-react';

interface SignupScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export function SignupScreen({ onNavigate }: SignupScreenProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  // Password strength validation (same as ChangePasswordScreen)
  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(password);

  // Password requirements (same as ChangePasswordScreen)
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'Uppercase & lowercase letters', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
    { label: 'At least one number', met: /\d/.test(password) },
    { label: 'Special character (!@#$%^&*)', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  // Name validation
  const validateName = (name: string) => {
    if (!name.trim()) {
      return 'Full name is required';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

  // Email validation
  const validateEmail = (email: string) => {
    if (!email.trim()) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  // Password validation (same as ChangePasswordScreen)
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (passwordStrength < 2) {
      return 'Password is too weak. Include uppercase, lowercase, and numbers';
    }
    return '';
  };

  // Confirm password validation
  const validateConfirmPassword = (confirmPassword: string) => {
    if (!confirmPassword) {
      return 'Please confirm your password';
    }
    if (confirmPassword !== password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    if (touched.name) {
      setNameError(validateName(value));
    }
  };

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setEmailError(validateEmail(value));
    }
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setPasswordError(validatePassword(value));
    }
    if (touched.confirmPassword && confirmPassword) {
      setConfirmPasswordError(value !== confirmPassword ? 'Passwords do not match' : '');
    }
  };

  // Handle confirm password change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setConfirmPasswordError(validateConfirmPassword(value));
    }
  };

  // Handle blur events
  const handleNameBlur = () => {
    setTouched({ ...touched, name: true });
    setNameError(validateName(name));
  };

  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    setEmailError(validateEmail(email));
  };

  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    setPasswordError(validatePassword(password));
  };

  const handleConfirmPasswordBlur = () => {
    setTouched({ ...touched, confirmPassword: true });
    setConfirmPasswordError(validateConfirmPassword(confirmPassword));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      name.trim() !== '' &&
      email.trim() !== '' &&
      password !== '' &&
      confirmPassword !== '' &&
      validateName(name) === '' &&
      validateEmail(email) === '' &&
      validatePassword(password) === '' &&
      validateConfirmPassword(confirmPassword) === ''
    );
  };

  const handleSignup = () => {
    // Validate all fields
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);
    const confirmPasswordErr = validateConfirmPassword(confirmPassword);

    setNameError(nameErr);
    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setConfirmPasswordError(confirmPasswordErr);
    setTouched({ name: true, email: true, password: true, confirmPassword: true });

    // If valid, proceed
    if (!nameErr && !emailErr && !passwordErr && !confirmPasswordErr) {
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col">
      {/* Logo Section */}
      <div className="pt-16 pb-8 px-6 text-center">
        <Logo size="lg" showText />
        <h1 className="text-[var(--color-text-primary)] mb-2">Create Account</h1>
        <p className="text-[var(--color-text-secondary)]">
          Join Smart Chef today
        </p>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-[var(--color-surface)] rounded-t-3xl shadow-[var(--shadow-lg)] p-6">
        <div className="space-y-4 mb-6">
          <div>
            <Input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={handleNameChange}
              onBlur={handleNameBlur}
              icon={<span className="text-[var(--color-text-secondary)]">👤</span>}
            />
            {nameError && touched.name && (
              <p className="text-[var(--color-error)] text-sm mt-1">{nameError}</p>
            )}
          </div>
          
          <div>
            <Input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={handleEmailChange}
              onBlur={handleEmailBlur}
              icon={<span className="text-[var(--color-text-secondary)]">📧</span>}
            />
            {emailError && touched.email && (
              <p className="text-[var(--color-error)] text-sm mt-1">{emailError}</p>
            )}
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              icon={<span className="text-[var(--color-text-secondary)]">🔒</span>}
            />
            {passwordError && touched.password && (
              <p className="text-[var(--color-error)] text-sm mt-1">{passwordError}</p>
            )}
            {!passwordError && password && (
              <div className="text-[var(--color-text-secondary)] text-xs mt-1">
                {requirements.map((req, index) => (
                  <div key={index} className="flex items-center">
                    {req.met ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <X className="w-4 h-4 mr-1 text-red-500" />}
                    {req.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              icon={<span className="text-[var(--color-text-secondary)]">🔒</span>}
            />
            {confirmPasswordError && touched.confirmPassword && (
              <p className="text-[var(--color-error)] text-sm mt-1">{confirmPasswordError}</p>
            )}
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleSignup}
          disabled={!isFormValid()}
          className="mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Account
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[var(--color-border)]" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[var(--color-surface)] text-[var(--color-text-secondary)]">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={() => onNavigate('google-oauth', { googleAuthReturnScreen: 'signup' })}
          className="mb-6"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </Button>

        <div className="text-center">
          <p className="text-[var(--color-text-secondary)]">
            Already have an account?{' '}
            <button
              onClick={() => onNavigate('login')}
              className="text-[var(--color-primary)] hover:underline"
            >
              Log in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}