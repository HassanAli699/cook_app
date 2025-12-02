import React, { useState } from 'react';
import { Bell, BellOff, Clock, Calendar, Users, Star, ShoppingCart, Utensils, Check, Crown, Lock, CheckCircle, XCircle } from 'lucide-react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';
import { useNotifications } from '../contexts/NotificationContext';

interface NotificationsScreenProps {
  onNavigate: (screen: string) => void;
  isPremium: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  'cooking-reminders': Clock,
  'timer-alerts': Bell,
  'meal-planning': Calendar,
  'grocery-reminders': ShoppingCart,
  'inventory-expiry': Utensils,
  'recipe-recommendations': Star,
  'community-activity': Users
};

export function NotificationsScreen({ onNavigate, isPremium }: NotificationsScreenProps) {
  const { notifications, masterEnabled, toggleMaster, toggleNotification, getEnabledCount } = useNotifications();
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const handleToggleMaster = () => {
    toggleMaster();
    setToastMessage(`Notifications ${!masterEnabled ? 'enabled' : 'disabled'}`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  const handleToggleNotification = (id: string, title: string, currentEnabled: boolean) => {
    toggleNotification(id);
    setToastMessage(`${title} ${!currentEnabled ? 'enabled' : 'disabled'}`);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 2000);
  };

  const generalNotifications = notifications.filter(n => n.category === 'general');
  const cookingNotifications = notifications.filter(n => n.category === 'cooking');
  const socialNotifications = notifications.filter(n => n.category === 'social');

  const enabledCount = getEnabledCount();

  const renderNotification = (notification: any) => {
    const Icon = iconMap[notification.id] || Bell;
    const isLocked = notification.isPremium && !isPremium;
    
    return (
      <div
        key={notification.id}
        className={`p-4 first:rounded-t-xl last:rounded-b-xl ${
          !masterEnabled ? 'opacity-50' : ''
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-cream)] flex items-center justify-center flex-shrink-0">
              <Icon size={20} className="text-[var(--color-text-primary)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h5>{notification.title}</h5>
                {notification.isPremium && (
                  <Crown size={14} className="text-[var(--color-premium-gold)]" />
                )}
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">
                {notification.description}
              </p>
              {isLocked && (
                <p className="text-xs text-[var(--color-premium-gold)] mt-1">
                  Premium Feature
                </p>
              )}
            </div>
          </div>
          {isLocked ? (
            <button
              onClick={() => onNavigate('subscription')}
              className="flex items-center justify-center w-12 h-7 rounded-full bg-[var(--color-premium-gold)]/10 flex-shrink-0"
            >
              <Lock size={14} className="text-[var(--color-premium-gold)]" />
            </button>
          ) : (
            <button
              onClick={() => handleToggleNotification(notification.id, notification.title, notification.enabled)}
              disabled={!masterEnabled}
              className={`relative w-12 h-7 rounded-full transition-colors flex-shrink-0 ${
                notification.enabled && masterEnabled
                  ? 'bg-[var(--color-primary)]' 
                  : 'bg-[var(--color-border)]'
              } ${!masterEnabled ? 'cursor-not-allowed' : ''}`}
            >
              <div
                className={`absolute top-1 w-5 h-5 bg-[var(--color-surface)] rounded-full shadow-md transition-transform ${
                  notification.enabled && masterEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      <Header title="Notifications" onBack={() => onNavigate('settings')} />

      <div className="px-4 py-6 space-y-6">
        {/* Master Toggle */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                masterEnabled 
                  ? 'bg-[var(--color-primary)]/10' 
                  : 'bg-[var(--color-text-secondary)]/10'
              }`}>
                {masterEnabled ? (
                  <Bell size={24} className="text-[var(--color-primary)]" />
                ) : (
                  <BellOff size={24} className="text-[var(--color-text-secondary)]" />
                )}
              </div>
              <div>
                <h4 className="mb-1">All Notifications</h4>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {masterEnabled ? `${enabledCount} active` : 'All notifications disabled'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleMaster}
              className={`relative w-14 h-8 rounded-full transition-colors ${
                masterEnabled ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'
              }`}
            >
              <div
                className={`absolute top-1 w-6 h-6 bg-[var(--color-surface)] rounded-full shadow-md transition-transform ${
                  masterEnabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          {!masterEnabled && (
            <div className="p-3 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/20 rounded-xl">
              <p className="text-sm text-[var(--color-text-secondary)]">
                You won't receive any notifications. Turn on to customize your preferences.
              </p>
            </div>
          )}
        </Card>

        {!isPremium && (
          <Card className="p-4 bg-gradient-to-br from-[var(--color-premium-gold)]/10 to-[var(--color-premium-gold)]/5 border-2 border-[var(--color-premium-gold)]/20">
            <div className="flex items-center gap-3">
              <Crown size={20} className="text-[var(--color-premium-gold)] flex-shrink-0" />
              <div className="flex-1">
                <h5 className="mb-1 text-[var(--color-text-primary)]">Upgrade for Priority Notifications</h5>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Get custom notifications and priority alerts with Premium
                </p>
              </div>
              <button
                onClick={() => onNavigate('subscription')}
                className="text-sm text-[var(--color-premium-gold)] hover:underline whitespace-nowrap"
              >
                Upgrade
              </button>
            </div>
          </Card>
        )}

        {/* Cooking Notifications */}
        <div>
          <h4 className="mb-3 text-[var(--color-text-secondary)]">Cooking</h4>
          <Card className="divide-y divide-[var(--color-border)]">
            {cookingNotifications.map(renderNotification)}
          </Card>
        </div>

        {/* General Notifications */}
        <div>
          <h4 className="mb-3 text-[var(--color-text-secondary)]">General</h4>
          <Card className="divide-y divide-[var(--color-border)]">
            {generalNotifications.map(renderNotification)}
          </Card>
        </div>

        {/* Social Notifications */}
        <div>
          <h4 className="mb-3 text-[var(--color-text-secondary)]">Social</h4>
          <Card className="divide-y divide-[var(--color-border)]">
            {socialNotifications.map(renderNotification)}
          </Card>
        </div>

        {/* Info Box */}
        <Card className="p-4">
          <div className="flex gap-3">
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <h5 className="mb-1">Notification Preferences</h5>
              <p className="text-sm text-[var(--color-text-secondary)]">
                Customize which notifications you receive to stay informed about what matters most to you.
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
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}