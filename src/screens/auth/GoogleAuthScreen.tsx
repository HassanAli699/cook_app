import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../components/Button';

interface GoogleAuthScreenProps {
  onNavigate: (screen: string) => void;
  returnScreen?: 'login' | 'signup';
}

export function GoogleAuthScreen({ onNavigate, returnScreen = 'login' }: GoogleAuthScreenProps) {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Add FedCM permissions policy meta tag
    const metaTag = document.createElement('meta');
    metaTag.httpEquiv = 'Permissions-Policy';
    metaTag.content = 'identity-credentials-get=(self)';
    
    // Check if meta tag already exists
    const existingMeta = document.querySelector('meta[http-equiv="Permissions-Policy"]');
    if (!existingMeta) {
      document.head.appendChild(metaTag);
    }

    // Load Google Identity Services library
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
      // Clean up meta tag
      if (!existingMeta && metaTag.parentNode) {
        document.head.removeChild(metaTag);
      }
    };
  }, []);

  const initializeGoogleSignIn = () => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
        callback: handleCredentialResponse,
        auto_select: false, // Disable auto-select to avoid FedCM issues
        cancel_on_tap_outside: false,
        use_fedcm_for_prompt: true // Enable FedCM
      });

      // Render the Google Sign-In button
      const buttonContainer = document.getElementById('googleSignInButton');
      if (buttonContainer) {
        window.google.accounts.id.renderButton(
          buttonContainer,
          {
            theme: 'outline',
            size: 'large',
            width: 350, // Use pixel value instead of percentage
            text: 'continue_with',
            shape: 'rectangular',
            logo_alignment: 'left'
          }
        );
      }

      // Show One Tap prompt (optional - only if desired)
      // Removed prompt() to avoid FedCM warnings in development
    }
  };

  const handleCredentialResponse = (response: any) => {
    setIsAuthenticating(true);

    // Decode JWT token to get user info
    const credential = response.credential;
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    // TODO: Send Google credential to backend for verification and user creation/login
    // Example:
    // try {
    //   const result = await api.post('/auth/google', { 
    //     credential: credential,
    //     idToken: credential // Google ID token
    //   });
    //   
    //   // Backend should verify the token with Google and return user data + auth token
    //   const { user, token, isNewUser } = result.data;
    //   
    //   // Store auth token and user data
    //   localStorage.setItem('authToken', token);
    //   localStorage.setItem('user', JSON.stringify(user));
    //   localStorage.setItem('isAuthenticated', 'true');
    //   localStorage.setItem('authMethod', 'google');
    //   
    //   // Navigate to appropriate screen
    //   onNavigate(isNewUser ? 'onboarding' : 'home');
    // } catch (error) {
    //   console.error('Google authentication failed:', error);
    //   setIsAuthenticating(false);
    //   // Show error message to user
    // }

    // TEMPORARY: Frontend-only implementation (remove when backend is ready)
    const userData = {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      googleId: payload.sub,
      emailVerified: payload.email_verified
    };

    // Save to localStorage (temporary)
    localStorage.setItem('googleUser', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authMethod', 'google');

    // Navigate to home after successful authentication
    setTimeout(() => {
      onNavigate('home');
    }, 1000);
  };

  if (isAuthenticating) {
    return (
      <div className="min-h-screen bg-[var(--color-cream)] flex items-center justify-center">
        <div className="text-center px-6">
          <div className="w-20 h-20 mx-auto mb-6">
            <div className="w-full h-full rounded-full border-4 border-[var(--color-primary)] border-t-transparent animate-spin" />
          </div>
          <h2 className="text-[var(--color-text-primary)] mb-2">Authenticating...</h2>
          <p className="text-[var(--color-text-secondary)]">
            Setting up your Smart Chef account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-cream)] flex flex-col">
      {/* Header */}
      <div className="pt-12 pb-6 px-6">
        <button
          onClick={() => onNavigate(returnScreen)}
          className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </button>
        
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <svg className="w-12 h-12" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
          <h1 className="text-[var(--color-text-primary)] mb-2">Sign in with Google</h1>
          <p className="text-[var(--color-text-secondary)]">
            Choose your Google account to continue
          </p>
        </div>
      </div>

      {/* Google Sign-In Section */}
      <div className="flex-1 bg-[var(--color-surface)] rounded-t-3xl shadow-[var(--shadow-lg)] p-6">
        <div className="max-w-md mx-auto">
          {/* Google Sign-In Button Container */}
          <div className="mb-6 flex justify-center">
            <div id="googleSignInButton" />
          </div>

          {/* Information Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <h4 className="text-blue-900 mb-2">Secure Sign-In</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your Google account will be securely connected</li>
              <li>• We'll never access your password</li>
              <li>• You can disconnect anytime from settings</li>
            </ul>
          </div>

          {/* Manual Sign-In Alternative */}
          <div className="text-center">
            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
              Having trouble signing in?
            </p>
            <Button
              variant="outline"
              fullWidth
              onClick={() => {
                // Try to trigger Google Sign-In programmatically
                if (window.google) {
                  window.google.accounts.id.prompt();
                }
              }}
            >
              Try Again
            </Button>
          </div>

          {/* Privacy Notice */}
          <div className="text-xs text-[var(--color-text-secondary)] text-center pt-6 pb-2">
            By continuing, you agree to share your name, email address, and profile picture with Smart Chef.{' '}
            <button className="text-[var(--color-primary)] hover:underline">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: any;
  }
}