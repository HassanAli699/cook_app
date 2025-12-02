import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Star, Bookmark, Share2, ChefHat, Lock, Crown, Plus, Minus } from 'lucide-react';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { PremiumLock } from '../../components/PremiumLock';
import { ShareModal } from '../../components/ShareModal';
import { Toast } from '../../components/Toast';
import { useFavorites } from '../../contexts/FavoritesContext';

interface RecipeDetailScreenProps {
  recipe: any;
  onNavigate: (screen: string, data?: any) => void;
  isPremium: boolean;
}

export function RecipeDetailScreen({ recipe, onNavigate, isPremium }: RecipeDetailScreenProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [servings, setServings] = useState(2); // Default servings
  const baseServings = 2; // Original recipe servings
  
  // TODO: Fetch complete recipe details from backend using Spoonacular API
  // This screen currently receives basic recipe data as props
  // Need to fetch full details including ingredients, instructions, and nutrition
  // 
  // Example implementation:
  // const [recipeDetails, setRecipeDetails] = useState(null);
  // const [loading, setLoading] = useState(true);
  // 
  // useEffect(() => {
  //   const fetchRecipeDetails = async () => {
  //     try {
  //       setLoading(true);
  //       const authToken = localStorage.getItem('authToken');
  //       
  //       // Backend will call Spoonacular API: GET /recipes/{id}/information
  //       const result = await api.get(`/api/recipes/${recipe.id}`, {
  //         headers: { 'Authorization': `Bearer ${authToken}` }
  //       });
  //       
  //       const fullRecipe = result.data;
  //       // Response structure from Spoonacular:
  //       // {
  //       //   id, title, description, image, servings, readyInMinutes,
  //       //   ingredients: [{ id, name, amount, unit, image, aisle }],
  //       //   instructions: [{ number, instruction, ingredients, equipment, length }],
  //       //   nutrition: { 
  //       //     calories, protein, fat, carbs, fiber, sugar, sodium,
  //       //     vitamins, minerals, weightPerServing
  //       //   },
  //       //   healthScore, pricePerServing, cuisines, diets, dishTypes
  //       // }
  //       
  //       setRecipeDetails(fullRecipe);
  //       setLoading(false);
  //     } catch (error) {
  //       console.error('Failed to fetch recipe details:', error);
  //       setLoading(false);
  //       // Show error toast or fallback UI
  //     }
  //   };
  //   
  //   if (recipe?.id) {
  //     fetchRecipeDetails();
  //   }
  // }, [recipe.id]);
  //
  // See RECIPE_API_INTEGRATION_GUIDE.md for complete Spoonacular integration details

  const isSaved = isFavorite(recipe.id);

  const handleToggleFavorite = () => {
    if (isSaved) {
      removeFromFavorites(recipe.id);
      setToastMessage('Removed from favorites');
    } else {
      addToFavorites(recipe);
      setToastMessage('Added to favorites!');
    }
    setShowToast(true);
  };

  const ingredients = [
    '500g beef steak',
    '2 tbsp olive oil',
    '4 cloves garlic, minced',
    '2 sprigs fresh rosemary',
    '2 sprigs fresh thyme',
    'Salt and pepper to taste',
    '1 tbsp butter'
  ];

  const instructions = [
    'Remove steak from refrigerator 30 minutes before cooking to bring to room temperature.',
    'Season both sides generously with salt and pepper.',
    'Heat olive oil in a cast-iron skillet over high heat until smoking.',
    'Place steak in the pan and sear for 3-4 minutes without moving.',
    'Flip the steak and add butter, garlic, and herbs to the pan.',
    'Baste the steak with the herb butter for another 3-4 minutes.',
    'Remove from heat and let rest for 5 minutes before slicing.'
  ];

  const showPremiumFeatures = recipe.isPremium && !isPremium;

  // Helper function to scale ingredient quantities based on servings
  const scaleIngredient = (ingredient: string): string => {
    // Match numbers (including decimals and fractions) at the start of the string
    const match = ingredient.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(.+)/);
    
    if (match) {
      const amount = match[1];
      const rest = match[2];
      
      // Handle fractions
      if (amount.includes('/')) {
        const [numerator, denominator] = amount.split('/').map(Number);
        const scaledAmount = (numerator / denominator) * (servings / baseServings);
        
        // Convert back to fraction if it makes sense
        if (scaledAmount === 0.5) return `1/2 ${rest}`;
        if (scaledAmount === 0.25) return `1/4 ${rest}`;
        if (scaledAmount === 0.75) return `3/4 ${rest}`;
        if (scaledAmount === 0.33) return `1/3 ${rest}`;
        if (scaledAmount === 0.67) return `2/3 ${rest}`;
        
        // Otherwise use decimal
        return `${scaledAmount.toFixed(1).replace(/\.0$/, '')} ${rest}`;
      }
      
      // Handle regular numbers
      const scaledAmount = parseFloat(amount) * (servings / baseServings);
      const formatted = scaledAmount % 1 === 0 
        ? scaledAmount.toString() 
        : scaledAmount.toFixed(1).replace(/\.0$/, '');
      
      return `${formatted} ${rest}`;
    }
    
    // If no number found, return as is (e.g., "Salt and pepper to taste")
    return ingredient;
  };

  const handleIncreaseServings = () => {
    setServings(prev => Math.min(prev + 1, 12)); // Max 12 servings
  };

  const handleDecreaseServings = () => {
    setServings(prev => Math.max(prev - 1, 1)); // Min 1 serving
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)]">
      {/* Hero Image */}
      <div className="relative h-72">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        
        {/* Header Buttons */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button
            onClick={() => onNavigate('recipes')}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
          >
            <ArrowLeft size={20} className="text-[#2E2E2E]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={handleToggleFavorite}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Bookmark size={20} className={isSaved ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-[#2E2E2E]'} />
            </button>
            <button 
              onClick={() => setShowShareModal(true)}
              className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
            >
              <Share2 size={20} className="text-[#2E2E2E]" />
            </button>
          </div>
        </div>

        {/* Recipe Title */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-white mb-3">{recipe.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1">
              <Clock size={16} />
              {recipe.time}
            </span>
            <span className="flex items-center gap-1">
              <Users size={16} />
              2 servings
            </span>
            <span className="flex items-center gap-1">
              <Star size={16} className="fill-yellow-400 text-yellow-400" />
              {recipe.rating}
            </span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">⏱️</div>
            <p className="text-xs text-[var(--color-text-secondary)]">Prep Time</p>
            <p className="text-sm">10 min</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <p className="text-xs text-[var(--color-text-secondary)]">Cook Time</p>
            <p className="text-sm">15 min</p>
          </Card>
          <Card className="p-4 text-center">
            <div className="text-2xl mb-1">📊</div>
            <p className="text-xs text-[var(--color-text-secondary)]">Difficulty</p>
            <p className="text-sm">{recipe.difficulty}</p>
          </Card>
        </div>

        {/* Tabs */}
        <Card className="p-1">
          <div className="grid grid-cols-3 gap-1">
            {(['ingredients', 'instructions', 'nutrition'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 rounded-lg transition-colors capitalize ${
                  activeTab === tab
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-cream)]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </Card>

        {/* Tab Content */}
        <Card className="p-4">
          {activeTab === 'ingredients' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="mb-0">Ingredients</h3>
                
                {/* Servings Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[var(--color-text-secondary)]">Servings:</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDecreaseServings}
                      disabled={servings <= 1}
                      className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center transition-all hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-cream)] disabled:hover:text-[var(--color-text-primary)]"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="min-w-[2rem] text-center">{servings}</span>
                    <button
                      onClick={handleIncreaseServings}
                      disabled={servings >= 12}
                      className="w-8 h-8 rounded-full bg-[var(--color-cream)] flex items-center justify-center transition-all hover:bg-[var(--color-primary)] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[var(--color-cream)] disabled:hover:text-[var(--color-text-primary)]"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <ul className="space-y-3">
                {ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--color-cream)] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-primary)]" />
                    </div>
                    <span className="text-[var(--color-text-primary)]">{scaleIngredient(ingredient)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div>
              <h3 className="mb-4">Instructions</h3>
              <ol className="space-y-4">
                {instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center flex-shrink-0 text-sm">
                      {index + 1}
                    </div>
                    <p className="text-[var(--color-text-primary)] flex-1 pt-1">{instruction}</p>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="mb-4">Nutrition Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-secondary)]">Calories</span>
                  <span className="font-semibold">450 kcal</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-secondary)]">Protein</span>
                  <span className="font-semibold">38g</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--color-border)]">
                  <span className="text-[var(--color-text-secondary)]">Carbs</span>
                  <span className="font-semibold">5g</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[var(--color-text-secondary)]">Fat</span>
                  <span className="font-semibold">28g</span>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Premium Features Card */}
        {showPremiumFeatures && (
          <Card className="p-6 relative overflow-hidden">
            <PremiumLock 
              feature="Advanced recipe features" 
              onUpgrade={() => onNavigate('subscription')}
            />
            <div className="opacity-30">
              <h3 className="mb-4">Premium Features</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-[var(--color-premium-gold)]" />
                  <span>Smart ingredient substitutions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-[var(--color-premium-gold)]" />
                  <span>Calorie-adjusted versions</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-[var(--color-premium-gold)]" />
                  <span>Dietary filter variations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Lock size={20} className="text-[var(--color-premium-gold)]" />
                  <span>Budget-based alternatives</span>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* CTA Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={() => onNavigate('cooking', { recipe })}
          className="sticky bottom-6"
        >
          <ChefHat size={20} />
          Start Cooking
        </Button>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Recipe"
        shareText={`Check out this amazing recipe: ${recipe.title}`}
        shareUrl="https://kitchennova.app/recipe"
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}