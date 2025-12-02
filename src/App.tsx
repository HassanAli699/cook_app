import React, { useState, useEffect } from 'react';
import './styles/globals.css';

// Import all screens
import { OnboardingFlow } from './screens/OnboardingFlow';
import { LoginScreen } from './screens/auth/LoginScreen';
import { SignupScreen } from './screens/auth/SignupScreen';
import { GoogleAuthScreen } from './screens/auth/GoogleAuthScreen';
import { ForgotPasswordScreen } from './screens/auth/ForgotPasswordScreen';
import { ResetLinkSentScreen } from './screens/auth/ResetLinkSentScreen';
import { NewPasswordScreen } from './screens/auth/NewPasswordScreen';
import { HomeScreen } from './screens/HomeScreen';
import { RecipeSuggestionsScreen } from './screens/recipes/RecipeSuggestionsScreen';
import { RecipeDetailScreen } from './screens/recipes/RecipeDetailScreen';
import { CookingAssistantScreen } from './screens/cooking/CookingAssistantScreen';
import { MealPlannerScreen } from './screens/planner/MealPlannerScreen';
import { GroceryManagerScreen } from './screens/grocery/GroceryManagerScreen';
import { InventoryTrackerScreen } from './screens/inventory/InventoryTrackerScreen';
import { BarcodeScannerScreen } from './screens/scanning/BarcodeScannerScreen';
import { ReceiptScannerScreen } from './screens/scanning/ReceiptScannerScreen';
import { CommunityFeedScreen } from './screens/community/CommunityFeedScreen';
import { PostRecipeScreen } from './screens/community/PostRecipeScreen';
import { SubscriptionScreen } from './screens/subscription/SubscriptionScreen';
import { CheckoutScreen } from './screens/subscription/CheckoutScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { FavoritesScreen } from './screens/FavoritesScreen';
import { ChangePasswordScreen } from './screens/ChangePasswordScreen';
import { LinkedAccountsScreen } from './screens/LinkedAccountsScreen';
import { NotificationsScreen } from './screens/NotificationsScreen';
import { AppThemeScreen } from './screens/AppThemeScreen';
import { TermsOfServiceScreen } from './screens/legal/TermsOfServiceScreen';
import { PrivacyPolicyScreen } from './screens/legal/PrivacyPolicyScreen';
import { AboutScreen } from './screens/legal/AboutScreen';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { SubscriptionProvider } from './contexts/SubscriptionContext';
import { TrialExpirationModal } from './components/TrialExpirationModal';
import { checkTrialStatus, handleTrialExpiration, getTrialExpirationMessage } from './utils/trialChecker';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('onboarding');
  const [isPremium, setIsPremium] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [mealPlannerContext, setMealPlannerContext] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [returnTo, setReturnTo] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [googleAuthReturnScreen, setGoogleAuthReturnScreen] = useState<'login' | 'signup'>('login');
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialMessage, setTrialMessage] = useState('');
  const [trialStatus, setTrialStatus] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([
    {
      id: 'sample-1',
      user: { name: 'You', avatar: '👤', isPremium: true },
      recipe: 'My Special Pasta Carbonara',
      image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNhcmJvbmFyYXxlbnwxfHx8fDE3NjQxNDUzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 45,
      comments: 12,
      tags: ['Italian', 'Pasta'],
      timeAgo: '1h ago',
      time: '25 min',
      rating: '4.7',
      ingredients: ['Pasta', 'Eggs', 'Parmesan', 'Bacon', 'Black Pepper'],
      steps: ['Boil pasta', 'Cook bacon', 'Mix eggs with cheese', 'Combine all']
    },
    {
      id: 'sample-2',
      user: { name: 'You', avatar: '👤', isPremium: true },
      recipe: 'Homemade Chocolate Cake',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaG9jb2xhdGUlMjBjYWtlfGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      likes: 89,
      comments: 23,
      tags: ['Dessert', 'Chocolate'],
      timeAgo: '3d ago',
      time: '60 min',
      rating: '4.9',
      ingredients: ['Flour', 'Sugar', 'Cocoa', 'Eggs', 'Butter'],
      steps: ['Mix dry ingredients', 'Add wet ingredients', 'Bake at 350F']
    }
  ]);
  const [showMyPostsOnReturn, setShowMyPostsOnReturn] = useState(false);

  // Check trial status on mount and periodically
  useEffect(() => {
    const checkTrial = () => {
      // Handle trial expiration
      const hasExpired = handleTrialExpiration();
      
      if (hasExpired) {
        const status = checkTrialStatus();
        setTrialStatus(status);
        
        const message = getTrialExpirationMessage();
        if (message) {
          setTrialMessage(message);
          setShowTrialModal(true);
        }
      }
      
      // Check if user is on free trial
      const storedPremium = localStorage.getItem('isPremium');
      if (storedPremium === 'true') {
        setIsPremium(true);
      }
    };

    checkTrial();
    
    // Check trial status every hour
    const interval = setInterval(checkTrial, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const navigate = (screen: string, data?: any) => {
    setCurrentScreen(screen);
    if (data?.recipe) {
      setSelectedRecipe(data.recipe);
    } else {
      setSelectedRecipe(null);
    }
    if (data?.mealPlannerContext) {
      setMealPlannerContext(data.mealPlannerContext);
    } else {
      // Clear meal planner context when navigating without it
      setMealPlannerContext(null);
    }
    if (data?.slot) {
      setSelectedSlot(data.slot);
    }
    if (data?.returnTo) {
      setReturnTo(data.returnTo);
    }
    if (data?.plan) {
      setSelectedPlan(data.plan);
    }
    if (data?.googleAuthReturnScreen) {
      setGoogleAuthReturnScreen(data.googleAuthReturnScreen);
    }
  };

  const handleSubscribe = () => {
    setIsPremium(true);
    navigate('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      // Onboarding
      case 'onboarding':
        return <OnboardingFlow onComplete={() => navigate('login')} />;
      
      // Authentication
      case 'login':
        return <LoginScreen onNavigate={navigate} />;
      case 'signup':
        return <SignupScreen onNavigate={navigate} />;
      case 'google-oauth':
        return <GoogleAuthScreen onNavigate={navigate} returnScreen={googleAuthReturnScreen} />;
      case 'forgot-password':
        return <ForgotPasswordScreen onNavigate={navigate} returnTo={returnTo || undefined} />;
      case 'reset-link-sent':
        return <ResetLinkSentScreen onNavigate={navigate} />;
      case 'new-password':
        return <NewPasswordScreen onNavigate={navigate} />;
      
      // Main App
      case 'home':
        return <HomeScreen onNavigate={navigate} isPremium={isPremium} />;
      
      // Recipes
      case 'recipes':
        return <RecipeSuggestionsScreen onNavigate={navigate} isPremium={isPremium} mealPlannerContext={mealPlannerContext} />;
      case 'recipe-detail':
        return (
          <RecipeDetailScreen
            recipe={selectedRecipe}
            onNavigate={navigate}
            isPremium={isPremium}
          />
        );
      
      // Cooking
      case 'cooking':
        return <CookingAssistantScreen onNavigate={navigate} isPremium={isPremium} />;
      
      // Meal Planner
      case 'planner':
        return <MealPlannerScreen onNavigate={navigate} isPremium={isPremium} selectedRecipeFromBrowse={selectedRecipe} slotFromBrowse={selectedSlot} />;
      
      // Grocery
      case 'grocery':
        return <GroceryManagerScreen onNavigate={navigate} isPremium={isPremium} />;
      
      // Inventory
      case 'inventory':
        return <InventoryTrackerScreen onNavigate={navigate} isPremium={isPremium} />;
      
      // Scanning
      case 'barcode-scanner':
        return <BarcodeScannerScreen onNavigate={navigate} />;
      case 'receipt-scanner':
        return <ReceiptScannerScreen onNavigate={navigate} />;
      
      // Community
      case 'community':
        return <CommunityFeedScreen onNavigate={navigate} isPremium={isPremium} userPosts={userPosts} onUpdatePosts={setUserPosts} showMyPostsOnReturn={showMyPostsOnReturn} setShowMyPostsOnReturn={setShowMyPostsOnReturn} />;
      case 'post-recipe':
        return <PostRecipeScreen onNavigate={navigate} onPostRecipe={setUserPosts} userPosts={userPosts} onSetShowMyPosts={setShowMyPostsOnReturn} isPremium={isPremium} />;
      
      // Subscription
      case 'subscription':
        return <SubscriptionScreen onNavigate={navigate} />;
      case 'checkout':
        return <CheckoutScreen onNavigate={navigate} onSubscribe={handleSubscribe} selectedPlan={selectedPlan} />;
      
      // Settings
      case 'settings':
        return <SettingsScreen onNavigate={navigate} isPremium={isPremium} />;
      
      // Favorites
      case 'favorites':
        return <FavoritesScreen onNavigate={navigate} />;
      
      // Change Password
      case 'change-password':
        return <ChangePasswordScreen onNavigate={navigate} />;
      
      // Linked Accounts
      case 'linked-accounts':
        return <LinkedAccountsScreen onNavigate={navigate} />;
      
      // Notifications
      case 'notifications':
        return <NotificationsScreen onNavigate={navigate} isPremium={isPremium} />;
      
      // App Theme
      case 'app-theme':
        return <AppThemeScreen onNavigate={navigate} />;
      
      // Legal
      case 'terms-of-service':
        return <TermsOfServiceScreen onNavigate={navigate} />;
      case 'privacy-policy':
        return <PrivacyPolicyScreen onNavigate={navigate} />;
      case 'about':
        return <AboutScreen onNavigate={navigate} />;
      
      default:
        return <HomeScreen onNavigate={navigate} isPremium={isPremium} />;
    }
  };

  return (
    <SubscriptionProvider>
      <ThemeProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <div className="container-mobile">
              {renderScreen()}
              
              {/* Trial Expiration Modal */}
              {showTrialModal && trialStatus && (
                <TrialExpirationModal
                  isOpen={showTrialModal}
                  message={trialMessage}
                  isExpired={trialStatus.isTrialExpired}
                  daysRemaining={trialStatus.daysRemaining}
                  onSubscribe={() => {
                    setShowTrialModal(false);
                    navigate('subscription');
                  }}
                  onClose={() => setShowTrialModal(false)}
                />
              )}
            </div>
          </FavoritesProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SubscriptionProvider>
  );
}