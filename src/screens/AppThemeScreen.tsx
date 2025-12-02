import React, { useState } from 'react';
import { Sun, Moon, Monitor, Check, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useTheme } from '../contexts/ThemeContext';

interface AppThemeScreenProps {
  onNavigate: (screen: string) => void;
}

type ThemeOption = 'light' | 'dark' | 'system';

interface Theme {
  id: ThemeOption;
  title: string;
  description: string;
  icon: React.ElementType;
  preview: string;
}

export function AppThemeScreen({ onNavigate }: AppThemeScreenProps) {
  const { theme: selectedTheme, setTheme, actualTheme } = useTheme();
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const themes: Theme[] = [
    {
      id: 'light',
      title: 'Light',
      description: 'Bright and clean interface',
      icon: Sun,
      preview: 'linear-gradient(135deg, #FFF8F3 0%, #FFFFFF 100%)'
    },
    {
      id: 'dark',
      title: 'Dark',
      description: 'Easy on the eyes in low light',
      icon: Moon,
      preview: 'linear-gradient(135deg, #2E2E2E 0%, #1A1A1A 100%)'
    },
    {
      id: 'system',
      title: 'System',
      description: 'Automatically adapts to your device settings',
      icon: Monitor,
      preview: 'linear-gradient(135deg, #FFF8F3 0%, #FFFFFF 50%, #2E2E2E 50%, #1A1A1A 100%)'
    }
  ];

  const handleThemeSelect = (themeId: ThemeOption) => {
    setTheme(themeId);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="App Theme" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6 space-y-6">
        {/* Info Card */}
        <Card className="p-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-[var(--color-primary)]" />
            </div>
            <div>
              <h4 className="mb-1">Choose Your Theme</h4>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Select a theme that best suits your preference. You can change it anytime.
              </p>
            </div>
          </div>
        </Card>

        {/* Theme Options */}
        <div>
          <h4 className="mb-3 text-[var(--color-text-secondary)]">Available Themes</h4>
          <div className="space-y-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = selectedTheme === theme.id;
              
              return (
                <Card
                  key={theme.id}
                  className={`p-4 cursor-pointer transition-all ${
                    isSelected 
                      ? 'ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-cream)]' 
                      : 'hover:shadow-md'
                  }`}
                  onClick={() => handleThemeSelect(theme.id)}
                >
                  <div className="flex items-center gap-4">
                    {/* Theme Preview */}
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[var(--color-border)] flex-shrink-0">
                      <div 
                        className="w-full h-full"
                        style={{ background: theme.preview }}
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[var(--color-primary)]/10 flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-[var(--color-primary)] flex items-center justify-center">
                            <Check size={14} className="text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Theme Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon size={18} className="text-[var(--color-text-primary)]" />
                        <h4>{theme.title}</h4>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)]">
                        {theme.description}
                      </p>
                    </div>

                    {/* Selection Indicator */}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      isSelected 
                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' 
                        : 'border-[var(--color-border)]'
                    }`}>
                      {isSelected && <Check size={14} className="text-white" />}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Theme Preview Card */}
        <Card className="p-6">
          <h4 className="mb-4">Preview</h4>
          <div className="space-y-4">
            {/* Preview Header */}
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm" />
                <div>
                  <div className="h-3 w-24 bg-white/90 rounded mb-2" />
                  <div className="h-2 w-32 bg-white/60 rounded" />
                </div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 w-32 bg-[var(--color-text-primary)]/10 rounded" />
                <div className="h-4 w-16 bg-[var(--color-primary)]/20 rounded" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full bg-[var(--color-text-secondary)]/10 rounded" />
                <div className="h-3 w-5/6 bg-[var(--color-text-secondary)]/10 rounded" />
              </div>
            </div>

            {/* Preview Button */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-[var(--color-primary)] rounded-xl flex items-center justify-center">
                <div className="h-3 w-20 bg-white/90 rounded" />
              </div>
              <div className="flex-1 h-12 bg-[var(--color-border)] rounded-xl flex items-center justify-center">
                <div className="h-3 w-20 bg-[var(--color-text-primary)]/40 rounded" />
              </div>
            </div>
          </div>
        </Card>

        {/* Current Theme Info */}
        <Card className="p-4 bg-[var(--color-primary)]/5 border-[var(--color-primary)]/20">
          <div className="flex gap-3">
            {actualTheme === 'dark' ? (
              <Moon size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            ) : (
              <Sun size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h5 className="mb-1">Current Theme: {actualTheme === 'dark' ? 'Dark' : 'Light'}</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {selectedTheme === 'system' 
                  ? `Automatically using ${actualTheme} mode based on your system preferences.`
                  : `You are currently using ${actualTheme} mode.`}
              </p>
            </div>
          </div>
        </Card>

        {/* Additional Info */}
        <Card className="p-4">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <h5 className="mb-1">About Themes</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                The System option will automatically switch between light and dark themes based on your device settings, providing the best experience throughout the day.
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <div className="bg-[var(--color-success)] text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
            <Check size={20} />
            <span>Theme changed to {themes.find(t => t.id === selectedTheme)?.title}</span>
          </div>
        </div>
      )}
    </div>
  );
}
