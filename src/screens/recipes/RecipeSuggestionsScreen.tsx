import React, { useState, useEffect, useRef } from 'react';
import { Search, SlidersHorizontal, Clock, Star, TrendingUp, Lock, Crown, Sparkles } from 'lucide-react';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Card } from '../../components/Card';
import { PremiumBadge } from '../../components/PremiumLock';
import { Button } from '../../components/Button';

interface RecipeSuggestionsScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  isPremium: boolean;
  mealPlannerContext?: { day: string; mealType: string } | null;
}

const mockRecipes = [
  {
    id: 1,
    title: 'Grilled Herb Steak',
    image: 'https://images.unsplash.com/photo-1709433420444-0535a5f616b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwYmVlZiUyMHN0ZWFrJTIwaGVyYnN8ZW58MXx8fHwxNzY0MTQ1MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '25 min',
    difficulty: 'Medium',
    rating: 4.8,
    calories: 520,
    isPremium: false,
    categories: ['low-carb']
  },
  {
    id: 2,
    title: 'Italian Pasta Primavera',
    image: 'https://images.unsplash.com/photo-1714385988516-85f063e4fcdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmclMjBpdGFsaWFufGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '30 min',
    difficulty: 'Easy',
    rating: 4.9,
    calories: 450,
    isPremium: true,
    categories: ['vegan', 'budget']
  },
  {
    id: 3,
    title: 'Healthy Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTY0MDczNTgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '15 min',
    difficulty: 'Easy',
    rating: 4.7,
    calories: 380,
    isPremium: false,
    categories: ['vegan', 'low-carb']
  },
  {
    id: 4,
    title: 'Spiced Vegetable Stir-fry',
    image: 'https://images.unsplash.com/photo-1673643164692-f28262c71c67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBjdXR0aW5nJTIwYm9hcmR8ZW58MXx8fHwxNzY0MTQ1MjE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '20 min',
    difficulty: 'Easy',
    rating: 4.6,
    calories: 340,
    isPremium: true,
    categories: ['vegan', 'budget']
  },
  {
    id: 5,
    title: 'Classic French Omelette',
    image: 'https://images.unsplash.com/photo-1740727665746-cfe80ababc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGtpdGNoZW58ZW58MXx8fHwxNzY0MTA5MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '10 min',
    difficulty: 'Medium',
    rating: 4.5,
    calories: 280,
    isPremium: false,
    categories: ['low-carb', 'budget']
  },
  {
    id: 6,
    title: 'Aromatic Spice Blend Rice',
    image: 'https://images.unsplash.com/photo-1564965925873-26de794b0d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwaW5ncmVkaWVudHMlMjBzcGljZXN8ZW58MXx8fHwxNzY0MDc3MTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '35 min',
    difficulty: 'Hard',
    rating: 4.9,
    calories: 410,
    isPremium: true,
    categories: ['vegan', 'budget']
  },
  {
    id: 7,
    title: 'Grilled Salmon Teriyaki',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxtb24lMjBncmlsbGVkfGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '20 min',
    difficulty: 'Medium',
    rating: 4.8,
    calories: 390,
    isPremium: true,
    categories: ['low-carb']
  },
  {
    id: 8,
    title: 'Quinoa Power Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGJvd2x8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '25 min',
    difficulty: 'Easy',
    rating: 4.7,
    calories: 420,
    isPremium: false,
    categories: ['vegan', 'budget']
  },
  {
    id: 9,
    title: 'Mediterranean Chicken Wrap',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwd3JhcHxlbnwxfHx8fDE3NjQxNDUzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '15 min',
    difficulty: 'Easy',
    rating: 4.6,
    calories: 380,
    isPremium: true,
    categories: ['budget']
  },
  {
    id: 10,
    title: 'Vegan Mushroom Stroganoff',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtdXNocm9vbSUyMHN0cm9nYW5vZmZ8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '30 min',
    difficulty: 'Medium',
    rating: 4.8,
    calories: 360,
    isPremium: true,
    categories: ['vegan', 'budget']
  },
  {
    id: 11,
    title: 'Keto Cauliflower Pizza',
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNsb3NldXB8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '40 min',
    difficulty: 'Hard',
    rating: 4.5,
    calories: 320,
    isPremium: false,
    categories: ['low-carb']
  },
  {
    id: 12,
    title: 'Thai Coconut Curry',
    image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXJyeSUyMGRpc2h8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '35 min',
    difficulty: 'Medium',
    rating: 4.9,
    calories: 450,
    isPremium: true,
    categories: ['vegan']
  },
  {
    id: 13,
    title: 'Baked Lemon Chicken',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwYmFrZWR8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '45 min',
    difficulty: 'Medium',
    rating: 4.6,
    calories: 340,
    isPremium: true,
    categories: ['low-carb']
  },
  {
    id: 14,
    title: 'Spicy Tofu Tacos',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0YWNvcyUyMGZvb2R8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '20 min',
    difficulty: 'Easy',
    rating: 4.7,
    calories: 320,
    isPremium: true,
    categories: ['vegan', 'budget']
  },
  {
    id: 15,
    title: 'Garlic Butter Shrimp',
    image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBjb29raW5nfGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '15 min',
    difficulty: 'Easy',
    rating: 4.8,
    calories: 280,
    isPremium: false,
    categories: ['low-carb']
  },
  {
    id: 16,
    title: 'Roasted Vegetable Medley',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZWdldGFibGVzJTIwcm9hc3RlZHxlbnwxfHx8fDE3NjQxNDUzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '40 min',
    difficulty: 'Easy',
    rating: 4.5,
    calories: 220,
    isPremium: true,
    categories: ['vegan', 'low-carb']
  },
  {
    id: 17,
    title: 'Beef Teriyaki Bowl',
    image: 'https://images.unsplash.com/photo-1546069901-eacef0df6022?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiZWVmJTIwYm93bCUyMHJpY2V8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '30 min',
    difficulty: 'Medium',
    rating: 4.7,
    calories: 520,
    isPremium: true,
    categories: ['budget']
  },
  {
    id: 18,
    title: 'Zucchini Noodle Alfredo',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGFsZnJlZG98ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '25 min',
    difficulty: 'Medium',
    rating: 4.6,
    calories: 310,
    isPremium: false,
    categories: ['low-carb']
  },
  {
    id: 19,
    title: 'Chickpea Curry',
    image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja3BlYSUyMGN1cnJ5fGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '35 min',
    difficulty: 'Medium',
    rating: 4.8,
    calories: 380,
    isPremium: true,
    categories: ['vegan', 'budget']
  },
  {
    id: 20,
    title: 'Grilled Veggie Skewers',
    image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwdmVnZXRhYmxlc3xlbnwxfHx8fDE3NjQxNDUzNzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '20 min',
    difficulty: 'Easy',
    rating: 4.5,
    calories: 180,
    isPremium: true,
    categories: ['vegan', 'low-carb']
  },
  {
    id: 21,
    title: 'Seared Tuna Steak',
    image: 'https://images.unsplash.com/photo-1580959375944-87d84d2e60d3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dW5hJTIwc3RlYWt8ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '15 min',
    difficulty: 'Hard',
    rating: 4.9,
    calories: 350,
    isPremium: true,
    categories: ['low-carb']
  },
  {
    id: 22,
    title: 'Sweet Potato Fries',
    image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzd2VldCUyMHBvdGF0byUyMGZyaWVzfGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '30 min',
    difficulty: 'Easy',
    rating: 4.6,
    calories: 260,
    isPremium: false,
    categories: ['vegan', 'budget']
  },
  {
    id: 23,
    title: 'Pesto Chicken Pizza',
    image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaXp6YSUyMGNoaWNrZW58ZW58MXx8fHwxNzY0MTQ1Mzc2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '35 min',
    difficulty: 'Medium',
    rating: 4.7,
    calories: 480,
    isPremium: true,
    categories: ['budget']
  },
  {
    id: 24,
    title: 'Mango Avocado Salad',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxhZCUyMGZydWl0fGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '10 min',
    difficulty: 'Easy',
    rating: 4.8,
    calories: 240,
    isPremium: true,
    categories: ['vegan', 'low-carb']
  }
];

export function RecipeSuggestionsScreen({ onNavigate, isPremium, mealPlannerContext }: RecipeSuggestionsScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [displayedRecipes, setDisplayedRecipes] = useState<typeof mockRecipes>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const recipesPerPage = 6;

  // TODO: Fetch recipes from backend on component mount
  // Example:
  // useEffect(() => {
  //   const fetchRecipes = async () => {
  //     try {
  //       const authToken = localStorage.getItem('authToken');
  //       const result = await api.get('/recipes/suggestions', {
  //         headers: { 'Authorization': `Bearer ${authToken}` },
  //         params: {
  //           page: 1,
  //           limit: isPremium ? recipesPerPage : 12,
  //           filter: selectedFilter,
  //           searchQuery: searchQuery
  //         }
  //       });
  //       setDisplayedRecipes(result.data.recipes);
  //     } catch (error) {
  //       console.error('Failed to fetch recipes:', error);
  //     }
  //   };
  //   fetchRecipes();
  // }, [isPremium, selectedFilter, searchQuery]);

  // Initialize with first page of recipes
  useEffect(() => {
    const filteredRecipes = getFilteredRecipes();
    // Free users: limit to 10-12 recipes, Premium users: show all
    const initialRecipes = isPremium 
      ? filteredRecipes.slice(0, recipesPerPage)
      : filteredRecipes.slice(0, 12); // Free users get max 12 recipes
    setDisplayedRecipes(initialRecipes);
    setPage(1);
  }, [isPremium, selectedFilter]);

  // Infinite scroll handler - only for premium users
  useEffect(() => {
    if (!isPremium) return; // Only enable infinite scroll for premium users

    const handleScroll = () => {
      const scrollContainer = document.querySelector('.recipe-scroll-container');
      if (!scrollContainer) return;

      const scrollTop = scrollContainer.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight;
      const clientHeight = scrollContainer.clientHeight;

      // Check if user scrolled to bottom (with 200px threshold)
      if (scrollTop + clientHeight >= scrollHeight - 200 && !isLoading) {
        loadMoreRecipes();
      }
    };

    const scrollContainer = document.querySelector('.recipe-scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [isPremium, isLoading, page, selectedFilter]);

  const getFilteredRecipes = () => {
    let filtered = mockRecipes;
    
    // Filter by premium status
    if (!isPremium) {
      filtered = filtered.filter(r => !r.isPremium);
    }

    // Filter by category
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(r => r.categories.includes(selectedFilter));
    }

    return filtered;
  };

  const loadMoreRecipes = () => {
    const allFiltered = getFilteredRecipes();
    const nextPageRecipes = allFiltered.slice(page * recipesPerPage, (page + 1) * recipesPerPage);
    
    if (nextPageRecipes.length > 0) {
      setIsLoading(true);
      // Simulate loading delay
      setTimeout(() => {
        setDisplayedRecipes(prev => [...prev, ...nextPageRecipes]);
        setPage(prev => prev + 1);
        setIsLoading(false);
      }, 500);
    }
  };

  const handleFilterClick = (filter: string) => {
    if (filter !== 'all' && !isPremium) {
      // Redirect to subscription page if not premium
      onNavigate('subscription');
      return;
    }
    setSelectedFilter(filter);
    setPage(1);
  };

  const handleRecipeClick = (recipe: any) => {
    if (mealPlannerContext) {
      // If coming from meal planner, add to plan and go back
      onNavigate('planner', { recipe, slot: mealPlannerContext });
    } else {
      // Otherwise, navigate to recipe detail
      onNavigate('recipe-detail', { recipe });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20 recipe-scroll-container overflow-y-auto" style={{ height: '100vh' }}>
      <Header 
        title="Recipes" 
        onBack={() => onNavigate(mealPlannerContext ? 'planner' : 'home')} 
      />

      <div className="px-4 py-4 space-y-4">
        {/* Meal Planner Banner */}
        {mealPlannerContext && (
          <Card className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-4 text-white border-0">
            <p className="text-sm text-white/90 mb-1">Adding to meal plan</p>
            <p className="font-semibold">{mealPlannerContext.day} - {mealPlannerContext.mealType}</p>
            <p className="text-xs text-white/80 mt-2">Tap any recipe to add it to your plan</p>
          </Card>
        )}

        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]" />
            <input
              type="text"
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-xl focus:outline-none focus:border-[var(--color-primary)] transition-colors"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-colors"
          >
            <SlidersHorizontal size={20} className="text-[var(--color-text-primary)]" />
          </button>
        </div>

        {/* Filter Tags */}
        {showFilters && (
          <div className="bg-[var(--color-surface)] rounded-xl p-4 shadow-[var(--shadow-sm)] animate-slide-up">
            <h4 className="mb-3 text-sm">Filters</h4>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedFilter === 'all' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-cream-dark)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors'}`}
                onClick={() => handleFilterClick('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedFilter === 'vegan' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-cream-dark)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors'} flex items-center gap-1`}
                onClick={() => handleFilterClick('vegan')}
              >
                {!isPremium && <Lock size={12} />}
                Vegan
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedFilter === 'low-carb' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-cream-dark)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors'} flex items-center gap-1`}
                onClick={() => handleFilterClick('low-carb')}
              >
                {!isPremium && <Lock size={12} />}
                Low-Carb
              </button>
              <button
                className={`px-4 py-2 rounded-full text-sm ${selectedFilter === 'budget' ? 'bg-[var(--color-primary)] text-white' : 'bg-[var(--color-cream-dark)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-colors'} flex items-center gap-1`}
                onClick={() => handleFilterClick('budget')}
              >
                {!isPremium && <Lock size={12} />}
                Budget
              </button>
            </div>
            {!isPremium && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-3 flex items-center gap-1">
                <Lock size={12} />
                Premium filters require Smart Chef Premium
              </p>
            )}
          </div>
        )}

        {/* Trending Banner */}
        <Card className="bg-gradient-to-r from-[var(--color-primary)]/10 to-[var(--color-primary-hover)]/10 p-4 border-2 border-[var(--color-primary)]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-hover)] flex items-center justify-center flex-shrink-0">
              <TrendingUp size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm mb-1">Trending This Week</h4>
              <p className="text-xs text-[var(--color-text-secondary)]">
                Most popular recipes among our community
              </p>
            </div>
          </div>
        </Card>

        {/* Premium Limit Banner */}
        {!isPremium && (
          <Card className="bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] p-4 text-white border-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={20} />
                  <h4 className="text-white">Basic AI Suggestions</h4>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  Unlock unlimited advanced AI recipe suggestions
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-[var(--color-surface)] text-[var(--color-premium-gold)] border-[var(--color-surface)] hover:bg-[var(--color-cream)]"
                  onClick={() => onNavigate('subscription')}
                >
                  <Crown size={16} />
                  Upgrade Now
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Recipe Grid */}
        <div className="grid grid-cols-2 gap-3">
          {displayedRecipes.map((recipe) => (
            <Card
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe)}
              className="overflow-hidden"
            >
              <div className="relative">
                <div className="relative h-32 bg-[var(--color-border)]">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                  {recipe.isPremium && (
                    <div className="absolute top-2 right-2">
                      <PremiumBadge />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]">{recipe.title}</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {recipe.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                        {recipe.rating}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--color-text-secondary)]">
                      {recipe.difficulty}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
          {isLoading && (
            <Card className="text-center">
              <p className="text-sm text-[var(--color-text-secondary)]">Loading...</p>
            </Card>
          )}
        </div>

        {/* Premium CTA */}
        {!isPremium && (
          <Card onClick={() => onNavigate('subscription')} className="bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] p-6 text-white border-0 mt-4">
            <h3 className="text-white mb-2">Unlock Premium Recipes</h3>
            <p className="text-white/90 text-sm mb-4">
              Get access to exclusive recipes, dietary filters, and custom variations
            </p>
            <Button variant="outline" size="sm" className="bg-[var(--color-surface)] text-[var(--color-premium-gold)] border-[var(--color-surface)] hover:bg-[var(--color-cream)]">
              Upgrade to Premium
            </Button>
          </Card>
        )}
      </div>

      <BottomNav active="recipes" onNavigate={onNavigate} />
    </div>
  );
}