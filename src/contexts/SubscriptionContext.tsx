import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SubscriptionContextType {
  isPremium: boolean;
  setIsPremium: (value: boolean) => void;
  hasFeatureAccess: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  // Define which features require premium
  const premiumFeatures = [
    'ai-advanced-recipes',
    'voice-mode',
    'smart-timers',
    'ai-meal-generation',
    'ai-predictions',
    'barcode-scanning',
    'smart-grocery-lists',
    'grocery-sharing',
    'community-posting',
    'creator-badge',
    'priority-notifications',
    'custom-notifications'
  ];

  const hasFeatureAccess = (feature: string): boolean => {
    if (!premiumFeatures.includes(feature)) {
      return true; // Free feature
    }
    return isPremium; // Premium feature - check subscription
  };

  return (
    <SubscriptionContext.Provider value={{ isPremium, setIsPremium, hasFeatureAccess }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
