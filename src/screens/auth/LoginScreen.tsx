import React, { useState } from 'react';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/Input';

interface LoginScreenProps {
  onNavigate: (screen: string, params?: any) => void;
}

export function LoginScreen({ onNavigate }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });

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

  // Password validation
  const validatePassword = (password: string) => {
    if (!password) {
      return 'Password is required';
    }
    return '';
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
  };

  // Handle email blur
  const handleEmailBlur = () => {
    setTouched({ ...touched, email: true });
    setEmailError(validateEmail(email));
  };

  // Handle password blur
  const handlePasswordBlur = () => {
    setTouched({ ...touched, password: true });
    setPasswordError(validatePassword(password));
  };

  // Check if form is valid
  const isFormValid = () => {
    return (
      email.trim() !== '' &&
      password !== '' &&
      validateEmail(email) === '' &&
      validatePassword(password) === ''
    );
  };

  const handleLogin = () => {
    // Validate all fields
    const emailErr = validateEmail(email);
    const passwordErr = validatePassword(password);

    setEmailError(emailErr);
    setPasswordError(passwordErr);
    setTouched({ email: true, password: true });

    // If valid, proceed
    if (!emailErr && !passwordErr) {
      // TODO: Call backend API to authenticate user
      // Example:
      // try {
      //   const result = await api.post('/auth/login', { 
      //     email, 
      //     password 
      //   });
      //   
      //   const { user, token } = result.data;
      //   
      //   // Store auth token and user data
      //   localStorage.setItem('authToken', token);
      //   localStorage.setItem('user', JSON.stringify(user));
      //   localStorage.setItem('isAuthenticated', 'true');
      //   localStorage.setItem('authMethod', 'email');
      //   
      //   // Navigate to home
      //   onNavigate('home');
      // } catch (error) {
      //   if (error.response?.status === 404) {
      //     // User not found - redirect to signup
      //     setEmailError('No account found with this email');
      //     setTimeout(() => {
      //       onNavigate('signup', { email }); // Pass email to signup form
      //     }, 1500);
      //   } else if (error.response?.status === 401) {
      //     // Wrong password
      //     setPasswordError('Incorrect password');
      //   } else {
      //     // Other errors
      //     setEmailError('Login failed. Please try again.');
      //   }
      // }

      // TEMPORARY: Frontend-only implementation (remove when backend is ready)
      onNavigate('home');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col">
      {/* Logo Section */}
      <div className="pt-16 pb-8 px-6 text-center">
        <Logo size="lg" showText />
        <h1 className="text-[var(--color-text-primary)] mb-2">Welcome Back</h1>
        <p className="text-[var(--color-text-secondary)]">
          Sign in to continue to Smart Chef
        </p>
      </div>

      {/* Form Section */}
      <div className="flex-1 bg-[var(--color-surface)] rounded-t-3xl shadow-[var(--shadow-lg)] p-6">
        <div className="space-y-4 mb-6">
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
          </div>

          <div className="text-right">
            <button
              onClick={() => onNavigate('forgot-password')}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </div>

        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={handleLogin}
          disabled={!isFormValid()}
          className="mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Login
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
          onClick={() => onNavigate('google-oauth', { googleAuthReturnScreen: 'login' })}
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
            Don't have an account?{' '}
            <button
              onClick={() => onNavigate('signup')}
              className="text-[var(--color-primary)] hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}