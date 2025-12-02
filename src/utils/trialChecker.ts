// Trial Checker Utility
// Checks if the free trial has expired and manages trial notifications

export interface TrialData {
  startDate: string;
  endDate: string;
  isActive: boolean;
  usedAt: number;
}

export interface TrialStatus {
  hasUsedTrial: boolean;
  isTrialActive: boolean;
  isTrialExpired: boolean;
  daysRemaining: number;
  trialEndDate: Date | null;
}

export const checkTrialStatus = (): TrialStatus => {
  const trialDataString = localStorage.getItem('freeTrialData');
  
  if (!trialDataString) {
    return {
      hasUsedTrial: false,
      isTrialActive: false,
      isTrialExpired: false,
      daysRemaining: 0,
      trialEndDate: null
    };
  }
  
  const trialData: TrialData = JSON.parse(trialDataString);
  const now = new Date();
  const endDate = new Date(trialData.endDate);
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  const isTrialExpired = now >= endDate;
  const isTrialActive = !isTrialExpired && trialData.isActive;
  
  return {
    hasUsedTrial: true,
    isTrialActive,
    isTrialExpired,
    daysRemaining: Math.max(0, daysRemaining),
    trialEndDate: endDate
  };
};

export const handleTrialExpiration = () => {
  const status = checkTrialStatus();
  
  if (status.isTrialExpired && status.hasUsedTrial) {
    // Remove premium status
    localStorage.removeItem('isPremium');
    
    // Update subscription data
    const subscriptionData = localStorage.getItem('subscriptionData');
    if (subscriptionData) {
      const subscription = JSON.parse(subscriptionData);
      if (subscription.isTrial) {
        subscription.status = 'expired';
        localStorage.setItem('subscriptionData', JSON.stringify(subscription));
      }
    }
    
    // Update trial data
    const trialDataString = localStorage.getItem('freeTrialData');
    if (trialDataString) {
      const trialData: TrialData = JSON.parse(trialDataString);
      trialData.isActive = false;
      localStorage.setItem('freeTrialData', JSON.stringify(trialData));
    }
    
    return true; // Trial has expired
  }
  
  return false; // Trial is still active or not used
};

export const getTrialExpirationMessage = (): string | null => {
  const status = checkTrialStatus();
  
  if (status.isTrialExpired) {
    return 'Your 3-month free trial has expired. Subscribe to Premium to continue enjoying all features.';
  }
  
  if (status.isTrialActive && status.daysRemaining <= 7) {
    return `Your free trial ends in ${status.daysRemaining} day${status.daysRemaining !== 1 ? 's' : ''}. Subscribe now to keep Premium access!`;
  }
  
  return null;
};

export const shouldShowTrialNotification = (): boolean => {
  const lastShown = localStorage.getItem('lastTrialNotification');
  const now = Date.now();
  
  // Show notification once per day
  if (lastShown && now - parseInt(lastShown) < 24 * 60 * 60 * 1000) {
    return false;
  }
  
  const message = getTrialExpirationMessage();
  if (message) {
    localStorage.setItem('lastTrialNotification', now.toString());
    return true;
  }
  
  return false;
};
