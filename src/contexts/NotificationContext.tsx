import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: 'general' | 'cooking' | 'social';
  isPremium?: boolean;
}

interface NotificationContextType {
  notifications: NotificationSetting[];
  masterEnabled: boolean;
  toggleMaster: () => void;
  toggleNotification: (id: string) => void;
  enableAllNotifications: () => void;
  disableAllNotifications: () => void;
  getEnabledCount: () => number;
  isNotificationEnabled: (id: string) => boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [masterEnabled, setMasterEnabled] = useState(() => {
    const saved = localStorage.getItem('kitchen-nova-notifications-master');
    return saved ? JSON.parse(saved) : true;
  });

  const [notifications, setNotifications] = useState<NotificationSetting[]>(() => {
    const saved = localStorage.getItem('kitchen-nova-notifications');
    return saved ? JSON.parse(saved) : [
      {
        id: 'cooking-reminders',
        title: 'Cooking Reminders',
        description: 'Get notified when it\'s time to start cooking planned meals',
        enabled: true,
        category: 'cooking'
      },
      {
        id: 'timer-alerts',
        title: 'Timer Alerts',
        description: 'Receive alerts when cooking timers complete',
        enabled: true,
        category: 'cooking'
      },
      {
        id: 'meal-planning',
        title: 'Meal Planning',
        description: 'Weekly meal plan reminders and suggestions',
        enabled: true,
        category: 'general'
      },
      {
        id: 'grocery-reminders',
        title: 'Grocery Reminders',
        description: 'Reminders to check your grocery list before shopping',
        enabled: false,
        category: 'general'
      },
      {
        id: 'inventory-expiry',
        title: 'Inventory Expiry',
        description: 'Get notified when ingredients are about to expire',
        enabled: true,
        category: 'general'
      },
      {
        id: 'recipe-recommendations',
        title: 'Recipe Recommendations',
        description: 'Personalized recipe suggestions based on your preferences',
        enabled: true,
        category: 'general',
        isPremium: true
      },
      {
        id: 'community-activity',
        title: 'Community Activity',
        description: 'Likes, comments, and follows on your shared recipes',
        enabled: false,
        category: 'social',
        isPremium: true
      }
    ];
  });

  const toggleMaster = () => {
    const newState = !masterEnabled;
    setMasterEnabled(newState);
    localStorage.setItem('kitchen-nova-notifications-master', JSON.stringify(newState));
    
    // TODO: Sync master notification preference to backend
    // Example:
    // try {
    //   const authToken = localStorage.getItem('authToken');
    //   await api.put('/user/notifications/master',
    //     { enabled: newState },
    //     { headers: { 'Authorization': `Bearer ${authToken}` } }
    //   );
    // } catch (error) {
    //   console.error('Failed to sync master notification preference:', error);
    // }
    
    // If turning off, disable all notifications
    if (!newState) {
      const updatedNotifications = notifications.map(n => ({ ...n, enabled: false }));
      setNotifications(updatedNotifications);
      localStorage.setItem('kitchen-nova-notifications', JSON.stringify(updatedNotifications));
    }
  };

  const toggleNotification = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('kitchen-nova-notifications', JSON.stringify(updatedNotifications));
    
    // TODO: Sync individual notification preference to backend
    // Example:
    // try {
    //   const authToken = localStorage.getItem('authToken');
    //   const notification = updatedNotifications.find(n => n.id === id);
    //   await api.put(`/user/notifications/${id}`,
    //     { enabled: notification?.enabled },
    //     { headers: { 'Authorization': `Bearer ${authToken}` } }
    //   );
    // } catch (error) {
    //   console.error('Failed to sync notification preference:', error);
    // }
  };

  const enableAllNotifications = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, enabled: true }));
    setNotifications(updatedNotifications);
    localStorage.setItem('kitchen-nova-notifications', JSON.stringify(updatedNotifications));
    
    // TODO: Sync all notification preferences to backend
    // Example:
    // try {
    //   const authToken = localStorage.getItem('authToken');
    //   await api.put('/user/notifications/enable-all',
    //     {},
    //     { headers: { 'Authorization': `Bearer ${authToken}` } }
    //   );
    // } catch (error) {
    //   console.error('Failed to enable all notifications:', error);
    // }
  };

  const disableAllNotifications = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, enabled: false }));
    setNotifications(updatedNotifications);
    localStorage.setItem('kitchen-nova-notifications', JSON.stringify(updatedNotifications));
    
    // TODO: Sync all notification preferences to backend
    // Example:
    // try {
    //   const authToken = localStorage.getItem('authToken');
    //   await api.put('/user/notifications/disable-all',
    //     {},
    //     { headers: { 'Authorization': `Bearer ${authToken}` } }
    //   );
    // } catch (error) {
    //   console.error('Failed to disable all notifications:', error);
    // }
  };

  const getEnabledCount = () => {
    return notifications.filter(n => n.enabled).length;
  };

  const isNotificationEnabled = (id: string) => {
    const notification = notifications.find(n => n.id === id);
    return notification ? notification.enabled : false;
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      masterEnabled,
      toggleMaster,
      toggleNotification,
      enableAllNotifications,
      disableAllNotifications,
      getEnabledCount,
      isNotificationEnabled
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}