import React, { useState } from 'react';
import { Chrome, Check, AlertCircle, X, Link2, Unlink } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface LinkedAccountsScreenProps {
  onNavigate: (screen: string) => void;
}

interface AccountProvider {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  connected: boolean;
  email?: string;
  connectedDate?: string;
}

export function LinkedAccountsScreen({ onNavigate }: LinkedAccountsScreenProps) {
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AccountProvider | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [accounts, setAccounts] = useState<AccountProvider[]>([
    {
      id: 'google',
      name: 'Google',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      color: '#4285F4',
      bgColor: 'rgba(66, 133, 244, 0.1)',
      connected: true,
      email: 'john.doe@gmail.com',
      connectedDate: 'January 15, 2024'
    }
  ]);

  const handleConnectAccount = (provider: AccountProvider) => {
    // Simulate connection
    setAccounts(accounts.map(acc => 
      acc.id === provider.id 
        ? { 
            ...acc, 
            connected: true, 
            email: `user@${provider.id}.com`,
            connectedDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
          }
        : acc
    ));
    setToastMessage(`${provider.name} account connected successfully`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
  };

  const handleDisconnectAccount = (provider: AccountProvider) => {
    setSelectedProvider(provider);
    setShowDisconnectModal(true);
  };

  const confirmDisconnect = () => {
    if (selectedProvider) {
      setAccounts(accounts.map(acc => 
        acc.id === selectedProvider.id 
          ? { ...acc, connected: false, email: undefined, connectedDate: undefined }
          : acc
      ));
      setToastMessage(`${selectedProvider.name} account disconnected`);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
    setShowDisconnectModal(false);
    setSelectedProvider(null);
  };

  const connectedCount = accounts.filter(acc => acc.connected).length;

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="Linked Accounts" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6 space-y-6">
        {/* Info Card */}
        <Card className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <Link2 size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h4 className="mb-1">Connect Your Google Account</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Link your Google account for easier sign-in and to sync your data across devices.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-sage-green)]/10 border border-[var(--color-sage-green)]/20">
                <Check size={16} className="text-[var(--color-sage-green)]" />
                <span className="text-sm text-[var(--color-text-primary)]">
                  {connectedCount} {connectedCount === 1 ? 'account' : 'accounts'} connected
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Google Account */}
        <div>
          <h4 className="mb-3 text-[var(--color-text-secondary)]">Google Account</h4>
          <div className="space-y-3">
            {accounts.map((provider) => (
              <Card key={provider.id} className="p-4">
                <div className="flex items-start gap-4">
                  {/* Provider Icon */}
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: provider.bgColor }}
                  >
                    {provider.icon}
                  </div>

                  {/* Account Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4>{provider.name}</h4>
                      {provider.connected && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 flex-shrink-0">
                          <Check size={14} className="text-[var(--color-success)]" />
                          <span className="text-xs text-[var(--color-success)]">Connected</span>
                        </div>
                      )}
                    </div>
                    
                    {provider.connected ? (
                      <div className="space-y-1 mb-3">
                        <p className="text-sm text-[var(--color-text-primary)] truncate">
                          {provider.email}
                        </p>
                        <p className="text-xs text-[var(--color-text-secondary)]">
                          Connected on {provider.connectedDate}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-[var(--color-text-secondary)] mb-3">
                        Not connected
                      </p>
                    )}

                    {/* Action Button */}
                    {provider.connected ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnectAccount(provider)}
                      >
                        <Unlink size={16} />
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleConnectAccount(provider)}
                      >
                        <Link2 size={16} />
                        Connect
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <Card className="p-4">
          <div className="flex gap-3">
            <AlertCircle size={20} className="text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
            <div>
              <h5 className="mb-1">Security & Privacy</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Linking accounts allows you to sign in using those services. Smart Chef will never post to your social media without your permission. You can disconnect any account at any time.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && selectedProvider && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-fade-in"
          onClick={() => setShowDisconnectModal(false)}
        >
          <Card 
            className="w-full max-w-md p-6 animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[var(--color-warning)]/10 border-2 border-[var(--color-warning)]/20 mx-auto mb-4">
              <Unlink size={24} className="text-[var(--color-warning)]" />
            </div>
            
            <h3 className="text-center mb-2">Disconnect {selectedProvider.name}?</h3>
            <p className="text-center text-sm text-[var(--color-text-secondary)] mb-6">
              You'll no longer be able to sign in with {selectedProvider.name}. You can reconnect it anytime.
            </p>

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={() => setShowDisconnectModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="lg"
                fullWidth
                onClick={confirmDisconnect}
              >
                Disconnect
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-[var(--color-success)] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Check size={20} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}