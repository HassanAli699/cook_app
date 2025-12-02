import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ChefHat, Calendar, ShoppingCart, Package, Users, TrendingUp, Clock, Star, Crown, Heart } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { PremiumBadge } from '../components/PremiumLock';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  isPremium: boolean;
}

export function HomeScreen({ onNavigate, isPremium }: HomeScreenProps) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Chef');

  // TODO: Fetch user profile data from backend on component mount
  // Example:
  // useEffect(() => {
  //   const fetchUserProfile = async () => {
  //     try {
  //       const authToken = localStorage.getItem('authToken');
  //       const result = await api.get('/api/user/profile', {
  //         headers: { 'Authorization': `Bearer ${authToken}` }
  //       });
  //       setUserName(result.data.name);
  //       setProfilePhoto(result.data.profilePhoto);
  //     } catch (error) {
  //       console.error('Failed to fetch profile:', error);
  //     }
  //   };
  //   fetchUserProfile();
  // }, []);

  // TODO: Fetch personalized recipe feed from backend using Spoonacular API
  // This should replace the hardcoded todaySuggestions array
  // Backend endpoint: GET /api/recipes/feed
  // 
  // Example implementation:
  // const [todaySuggestions, setTodaySuggestions] = useState([]);
  // const [loading, setLoading] = useState(true);
  // 
  // useEffect(() => {
  //   const fetchRecipeFeed = async () => {
  //     try {
  //       setLoading(true);
  //       const authToken = localStorage.getItem('authToken');
  //       
  //       // Backend will call Spoonacular API: GET /recipes/random
  //       // with user's dietary preferences and allergies
  //       const result = await api.get('/api/recipes/feed', {
  //         headers: { 'Authorization': `Bearer ${authToken}` },
  //         params: {
  //           number: isPremium ? 10 : 6, // Premium users get more suggestions
  //           page: 1
  //         }
  //       });
  //       
  //       const recipes = result.data.recipes;
  //       // Response structure:
  //       // {
  //       //   recipes: [{
  //       //     id, title, image, readyInMinutes (time), 
  //       //     healthScore (rating), isPremium: false
  //       //   }],
  //       //   isPremium: boolean,
  //       //   limitReached: boolean (for free users),
  //       //   remainingToday: number|'unlimited'
  //       // }
  //       
  //       setTodaySuggestions(recipes);
  //       
  //       // Show limit warning for free users
  //       if (result.data.limitReached) {
  //         // Show toast: "Daily limit reached. Upgrade to Premium for unlimited recipes."
  //       }
  //       
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Failed to fetch recipe feed:', error);
  //       setLoading(false);
  //     }
  //   };
  //   
  //   fetchRecipeFeed();
  // }, [isPremium]);
  //
  // See RECIPE_API_INTEGRATION_GUIDE.md for complete Spoonacular integration details

  const quickAccessTiles = [
    { id: 'recipes', icon: BookOpen, label: 'Recipes', color: 'from-[var(--color-primary)] to-[var(--color-primary-hover)]' },
    { id: 'planner', icon: Calendar, label: 'Planner', color: 'from-purple-500 to-purple-600' },
    { id: 'grocery', icon: ShoppingCart, label: 'Grocery', color: 'from-[var(--color-secondary)] to-green-600' },
    { id: 'inventory', icon: Package, label: 'Inventory', color: 'from-blue-500 to-blue-600' },
    { id: 'community', icon: Users, label: 'Community', color: 'from-pink-500 to-pink-600' },
    { id: 'favorites', icon: Heart, label: 'Favorites', color: 'from-red-500 to-red-600' }
  ];

  const todaySuggestions = [
    {
      id: 1,
      title: 'Grilled Herb Steak',
      image: 'https://images.unsplash.com/photo-1709433420444-0535a5f616b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwYmVlZiUyMHN0ZWFrJTIwaGVyYnN8ZW58MXx8fHwxNzY0MTQ1MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      time: '25 min',
      rating: 4.8,
      isPremium: false
    },
    {
      id: 2,
      title: 'Italian Pasta Primavera',
      image: 'https://images.unsplash.com/photo-1714385988516-85f063e4fcdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmclMjBpdGFsaWFufGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      time: '30 min',
      rating: 4.9,
      isPremium: true
    },
    {
      id: 3,
      title: 'Healthy Buddha Bowl',
      image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NDA3MzU4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
      time: '15 min',
      rating: 4.7,
      isPremium: false
    }
  ];

  // Load profile photo from localStorage
  useEffect(() => {
    const savedPhoto = localStorage.getItem('userProfilePhoto');
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }

    // Check if user logged in with Google
    const googleUser = localStorage.getItem('googleUser');
    if (googleUser) {
      const userData = JSON.parse(googleUser);
      setUserName(userData.name.split(' ')[0]); // First name only
      
      // If no custom profile photo, use Google photo
      if (!savedPhoto && userData.picture) {
        setProfilePhoto(userData.picture);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] px-6 pt-12 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-white mb-1">Welcome back, {userName}!</h2>
            <p className="text-white/80">What would you like to cook today?</p>
          </div>
          <button
            onClick={() => onNavigate('settings')}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm"
          >
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-2xl">👨‍🍳</span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        <button
          onClick={() => onNavigate('recipes')}
          className="w-full bg-[var(--color-surface)] rounded-xl px-4 py-3 flex items-center gap-3 shadow-md hover:shadow-lg transition-shadow"
        >
          <Search size={20} className="text-[var(--color-text-secondary)]" />
          <span className="text-[var(--color-text-secondary)]">Search recipes, ingredients...</span>
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Premium Banner */}
        {!isPremium && (
          <Card onClick={() => onNavigate('subscription')} className="bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] p-6 text-white border-0 shadow-xl relative overflow-hidden">
            {/* Animated sparkle background effect */}
            <div className="absolute top-0 right-0 text-8xl opacity-10">✨</div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex-1">
                {/* Trial Offer Badge */}
                <div className="inline-block bg-white text-[var(--color-premium-gold)] px-3 py-1 rounded-full text-xs font-semibold mb-3 shadow-lg">
                  🎉 LIMITED OFFER
                </div>
                
                <div className="flex items-center gap-2 mb-2">
                  <Crown size={24} />
                  <h3 className="text-white">Go Premium</h3>
                </div>
                
                {/* Free Trial Highlight */}
                <div className="mb-3">
                  <p className="text-2xl font-bold text-white mb-1">
                    3 Months FREE
                  </p>
                  <p className="text-white/90 text-sm">
                    Then just $3.99/month • Cancel anytime
                  </p>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white text-[var(--color-premium-gold)] border-white hover:bg-white/90 font-semibold shadow-lg"
                >
                  Start Free Trial →
                </Button>
              </div>
              
              {/* Crown icon decoration */}
              <div className="ml-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <Crown size={32} className="text-white" />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Featured Recipe Hero */}
        <Card onClick={() => onNavigate('recipe-detail', { recipe: todaySuggestions[0] })} className="overflow-hidden">
          <div className="relative h-48">
            <img
              src={todaySuggestions[0].image}
              alt={todaySuggestions[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[var(--color-primary)] px-3 py-1 rounded-full text-xs">
                  Featured Today
                </span>
              </div>
              <h3 className="text-white mb-2">{todaySuggestions[0].title}</h3>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Clock size={16} />
                  {todaySuggestions[0].time}
                </span>
                <span className="flex items-center gap-1">
                  <Star size={16} className="fill-yellow-400 text-yellow-400" />
                  {todaySuggestions[0].rating}
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Access */}
        <div>
          <h3 className="mb-4">Quick Access</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickAccessTiles.map((tile) => {
              const Icon = tile.icon;
              return (
                <Card
                  key={tile.id}
                  onClick={() => onNavigate(tile.id)}
                  className="p-4 text-center"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mx-auto mb-2`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <p className="text-sm text-[var(--color-text-primary)]">{tile.label}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Today's Suggestions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3>Today's Suggestions</h3>
            <button
              onClick={() => onNavigate('recipes')}
              className="text-sm text-[var(--color-primary)] hover:underline"
            >
              See All
            </button>
          </div>
          <div className="space-y-3">
            {todaySuggestions.slice(1).map((recipe) => (
              <Card
                key={recipe.id}
                onClick={() => onNavigate('recipe-detail', { recipe })}
                className="overflow-hidden"
              >
                <div className="flex gap-3 p-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm truncate">{recipe.title}</h4>
                      {recipe.isPremium && <PremiumBadge />}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        {recipe.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <BottomNav active="home" onNavigate={onNavigate} />
    </div>
  );
}