import React, { useState } from 'react';
import { Plus, Download, Sparkles, Lock, Calendar as CalendarIcon, X, Clock, Star, Crown } from 'lucide-react';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { PremiumBadge, PremiumLock } from '../../components/PremiumLock';
import { Toast } from '../../components/Toast';

interface MealPlannerScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  isPremium: boolean;
  selectedRecipeFromBrowse?: any;
  slotFromBrowse?: { day: string; mealType: string } | null;
}

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mealTypes = ['Breakfast', 'Lunch', 'Dinner'];

const lastWeekMeals = {
  'Mon-Breakfast': { name: 'Pancakes with Syrup', calories: 420 },
  'Mon-Lunch': { name: 'Turkey Sandwich', calories: 380 },
  'Tue-Breakfast': { name: 'Smoothie Bowl', calories: 310 },
  'Wed-Dinner': { name: 'Baked Salmon', calories: 480 },
  'Fri-Lunch': { name: 'Caesar Salad', calories: 350 }
};

const thisWeekMeals = {
  'Mon-Breakfast': { name: 'Oatmeal with Berries', calories: 320 },
  'Mon-Lunch': { name: 'Grilled Chicken Salad', calories: 450 },
  'Tue-Dinner': { name: 'Pasta Primavera', calories: 520 },
  'Wed-Breakfast': { name: 'Scrambled Eggs & Toast', calories: 380 },
  'Thu-Lunch': { name: 'Buddha Bowl', calories: 420 }
};

const nextWeekMeals = {
  'Mon-Breakfast': { name: 'French Toast', calories: 390 },
  'Tue-Lunch': { name: 'Sushi Bowl', calories: 410 },
  'Wed-Dinner': { name: 'Beef Tacos', calories: 520 },
  'Thu-Breakfast': { name: 'Yogurt Parfait', calories: 280 },
  'Sat-Dinner': { name: 'Pizza Margherita', calories: 550 }
};

const availableRecipes = [
  {
    id: 1,
    name: 'Grilled Herb Steak',
    image: 'https://images.unsplash.com/photo-1709433420444-0535a5f616b9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmlsbGVkJTIwYmVlZiUyMHN0ZWFrJTIwaGVyYnN8ZW58MXx8fHwxNzY0MTQ1MzcxfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '25 min',
    calories: 520,
    rating: 4.8
  },
  {
    id: 2,
    name: 'Italian Pasta Primavera',
    image: 'https://images.unsplash.com/photo-1714385988516-85f063e4fcdb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXN0YSUyMGNvb2tpbmclMjBpdGFsaWFufGVufDF8fHx8MTc2NDE0NTM3Nnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '30 min',
    calories: 450,
    rating: 4.9
  },
  {
    id: 3,
    name: 'Healthy Buddha Bowl',
    image: 'https://images.unsplash.com/photo-1649531794884-b8bb1de72e68?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGh5JTIwc2FsYWQlMjBib3dsfGVufDF8fHx8MTc2NDA3MzU4Mnww&ixlib=rb-4.1.0&q=80&w=1080',
    time: '15 min',
    calories: 380,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Spiced Vegetable Stir-fry',
    image: 'https://images.unsplash.com/photo-1673643164692-f28262c71c67?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHZlZ2V0YWJsZXMlMjBjdXR0aW5nJTIwYm9hcmR8ZW58MXx8fHwxNzY0MTQ1MjE2fDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '20 min',
    calories: 340,
    rating: 4.6
  },
  {
    id: 5,
    name: 'Classic French Omelette',
    image: 'https://images.unsplash.com/photo-1740727665746-cfe80ababc23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVmJTIwY29va2luZyUyMGtpdGNoZW58ZW58MXx8fHwxNzY0MTA5MDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '10 min',
    calories: 280,
    rating: 4.5
  },
  {
    id: 6,
    name: 'Aromatic Spice Blend Rice',
    image: 'https://images.unsplash.com/photo-1564965925873-26de794b0d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb29raW5nJTIwaW5ncmVkaWVudHMlMjBzcGljZXN8ZW58MXx8fHwxNzY0MDc3MTEyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    time: '35 min',
    calories: 410,
    rating: 4.9
  },
  {
    id: 7,
    name: 'Avocado Toast with Eggs',
    image: 'https://images.unsplash.com/photo-1588137378633-dea1336ce1e2?w=400',
    time: '8 min',
    calories: 320,
    rating: 4.6
  },
  {
    id: 8,
    name: 'Greek Yogurt Parfait',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    time: '5 min',
    calories: 250,
    rating: 4.7
  },
  {
    id: 9,
    name: 'Chicken Caesar Salad',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400',
    time: '18 min',
    calories: 420,
    rating: 4.8
  },
  {
    id: 10,
    name: 'Salmon with Roasted Vegetables',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    time: '28 min',
    calories: 480,
    rating: 4.9
  }
];

export function MealPlannerScreen({ onNavigate, isPremium, selectedRecipeFromBrowse, slotFromBrowse }: MealPlannerScreenProps) {
  const [selectedWeek, setSelectedWeek] = useState('This Week');
  
  // Initialize meal states from localStorage or use defaults
  const [lastWeekMealsState, setLastWeekMealsState] = useState(() => {
    const saved = localStorage.getItem('lastWeekMeals');
    return saved ? JSON.parse(saved) : lastWeekMeals;
  });
  
  const [thisWeekMealsState, setThisWeekMealsState] = useState(() => {
    const saved = localStorage.getItem('thisWeekMeals');
    return saved ? JSON.parse(saved) : thisWeekMeals;
  });
  
  const [nextWeekMealsState, setNextWeekMealsState] = useState(() => {
    const saved = localStorage.getItem('nextWeekMeals');
    return saved ? JSON.parse(saved) : nextWeekMeals;
  });
  
  const [showRecipeSelector, setShowRecipeSelector] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; mealType: string } | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // User preferences for auto-generation
  const [calorieTarget, setCalorieTarget] = useState('2000');
  const [dietaryGoal, setDietaryGoal] = useState('balanced');
  const [excludeIngredients, setExcludeIngredients] = useState('');

  // Save to localStorage whenever meal states change
  React.useEffect(() => {
    localStorage.setItem('lastWeekMeals', JSON.stringify(lastWeekMealsState));
  }, [lastWeekMealsState]);

  React.useEffect(() => {
    localStorage.setItem('thisWeekMeals', JSON.stringify(thisWeekMealsState));
  }, [thisWeekMealsState]);

  React.useEffect(() => {
    localStorage.setItem('nextWeekMeals', JSON.stringify(nextWeekMealsState));
  }, [nextWeekMealsState]);

  // Get current meals based on selected week
  const meals = selectedWeek === 'Last Week' ? lastWeekMealsState : 
                selectedWeek === 'This Week' ? thisWeekMealsState : 
                nextWeekMealsState;

  // Handle recipe selected from browse screen
  React.useEffect(() => {
    if (selectedRecipeFromBrowse && slotFromBrowse) {
      const mealKey = `${slotFromBrowse.day}-${slotFromBrowse.mealType}`;
      const newMeal = {
        name: selectedRecipeFromBrowse.title,
        calories: selectedRecipeFromBrowse.calories || 400
      };
      
      if (selectedWeek === 'Last Week') {
        setLastWeekMealsState(prevMeals => ({ ...prevMeals, [mealKey]: newMeal }));
      } else if (selectedWeek === 'This Week') {
        setThisWeekMealsState(prevMeals => ({ ...prevMeals, [mealKey]: newMeal }));
      } else {
        setNextWeekMealsState(prevMeals => ({ ...prevMeals, [mealKey]: newMeal }));
      }
    }
  }, [selectedRecipeFromBrowse, slotFromBrowse, selectedWeek]);

  const handleAddMeal = (day: string, mealType: string) => {
    setSelectedSlot({ day, mealType });
    setShowRecipeSelector(true);
  };

  const handleSelectRecipe = (recipe: typeof availableRecipes[0]) => {
    if (selectedSlot) {
      const mealKey = `${selectedSlot.day}-${selectedSlot.mealType}`;
      const newMeal = {
        name: recipe.name,
        calories: recipe.calories
      };
      
      if (selectedWeek === 'Last Week') {
        setLastWeekMealsState({ ...lastWeekMealsState, [mealKey]: newMeal });
      } else if (selectedWeek === 'This Week') {
        setThisWeekMealsState({ ...thisWeekMealsState, [mealKey]: newMeal });
      } else {
        setNextWeekMealsState({ ...nextWeekMealsState, [mealKey]: newMeal });
      }
      
      setShowRecipeSelector(false);
      setSelectedSlot(null);
    }
  };

  const handleDeleteMeal = (day: string, mealType: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the add meal modal
    
    const mealKey = `${day}-${mealType}`;
    
    if (selectedWeek === 'Last Week') {
      const newMeals = { ...lastWeekMealsState };
      delete newMeals[mealKey as keyof typeof newMeals];
      setLastWeekMealsState(newMeals);
    } else if (selectedWeek === 'This Week') {
      const newMeals = { ...thisWeekMealsState };
      delete newMeals[mealKey as keyof typeof newMeals];
      setThisWeekMealsState(newMeals);
    } else {
      const newMeals = { ...nextWeekMealsState };
      delete newMeals[mealKey as keyof typeof newMeals];
      setNextWeekMealsState(newMeals);
    }
    
    setToastMessage('Meal removed from plan');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleDownload = () => {
    // Create formatted text content
    let content = '📅 WEEKLY MEAL PLAN\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    content += `Week: ${selectedWeek}\n\n`;
    
    let totalCalories = 0;
    let mealCount = 0;
    
    daysOfWeek.forEach(day => {
      let dayContent = '';
      let dayHasMeals = false;
      
      mealTypes.forEach(mealType => {
        const mealKey = `${day}-${mealType}`;
        const meal = meals[mealKey];
        
        if (meal) {
          if (!dayHasMeals) {
            dayContent += `\n${day.toUpperCase()}\n`;
            dayContent += '────────────────\n';
            dayHasMeals = true;
          }
          dayContent += `${mealType}:\n`;
          dayContent += `  🍽️ ${meal.name}\n`;
          dayContent += `  📊 ${meal.calories} cal\n\n`;
          totalCalories += meal.calories;
          mealCount++;
        }
      });
      
      if (dayHasMeals) {
        content += dayContent;
      }
    });
    
    if (mealCount === 0) {
      content += 'No meals planned yet.\n\n';
    }
    
    content += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += `Generated by Smart Chef on ${new Date().toLocaleDateString()}\n`;
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meal-plan-${selectedWeek.toLowerCase().replace(' ', '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success toast
    setToastMessage('Meal plan downloaded successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Auto-generate meal plan based on preferences
  const handleAutoGenerate = () => {
    if (!isPremium) {
      onNavigate('subscription');
      return;
    }
    setShowPreferencesModal(true);
  };

  const generateMealPlan = () => {
    setIsGenerating(true);
    setShowPreferencesModal(false);

    // Simulate AI generation delay
    setTimeout(() => {
      const dailyCalorieTarget = parseInt(calorieTarget) || 2000;
      const breakfastCal = Math.round(dailyCalorieTarget * 0.25);
      const lunchCal = Math.round(dailyCalorieTarget * 0.35);
      const dinnerCal = Math.round(dailyCalorieTarget * 0.40);

      // Filter recipes based on dietary goal
      let filteredRecipes = [...availableRecipes];
      
      if (dietaryGoal === 'low-carb') {
        // Prefer lower calorie options for low-carb
        filteredRecipes = filteredRecipes.filter(r => r.calories <= 450);
      } else if (dietaryGoal === 'high-protein') {
        // Prefer higher calorie options for high-protein
        filteredRecipes = filteredRecipes.filter(r => r.calories >= 400);
      }

      // Generate meals for each day and meal type
      const newMeals: any = {};
      
      daysOfWeek.forEach(day => {
        mealTypes.forEach(mealType => {
          const mealKey = `${day}-${mealType}`;
          
          // Select appropriate calorie range for meal type
          let targetCal = breakfastCal;
          if (mealType === 'Lunch') targetCal = lunchCal;
          if (mealType === 'Dinner') targetCal = dinnerCal;

          // Find recipes within calorie range
          const suitableRecipes = filteredRecipes.filter(r => {
            const diff = Math.abs(r.calories - targetCal);
            return diff <= 100; // Within 100 calories of target
          });

          // Pick a random suitable recipe or fall back to any recipe
          const recipesToChooseFrom = suitableRecipes.length > 0 ? suitableRecipes : filteredRecipes;
          const selectedRecipe = recipesToChooseFrom[Math.floor(Math.random() * recipesToChooseFrom.length)];

          newMeals[mealKey] = {
            name: selectedRecipe.name,
            calories: selectedRecipe.calories
          };
        });
      });

      // Update the selected week's meals
      if (selectedWeek === 'Last Week') {
        setLastWeekMealsState(newMeals);
      } else if (selectedWeek === 'This Week') {
        setThisWeekMealsState(newMeals);
      } else {
        setNextWeekMealsState(newMeals);
      }

      setIsGenerating(false);
      setToastMessage(`✨ AI generated a personalized meal plan for ${selectedWeek}!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 2000);
  };

  // Calculate weekly nutrition summary
  const calculateWeeklySummary = () => {
    let totalCalories = 0;
    let mealCount = 0;

    daysOfWeek.forEach(day => {
      mealTypes.forEach(mealType => {
        const mealKey = `${day}-${mealType}`;
        const meal = meals[mealKey as keyof typeof meals];
        
        if (meal) {
          totalCalories += meal.calories;
          mealCount++;
        }
      });
    });

    // Estimate protein based on calories (rough estimate: 0.028g protein per calorie)
    // This assumes a balanced diet with ~30% calories from protein
    const estimatedProtein = Math.round(totalCalories * 0.028);

    return {
      totalCalories,
      mealCount,
      estimatedProtein,
      avgCaloriesPerMeal: mealCount > 0 ? Math.round(totalCalories / mealCount) : 0
    };
  };

  const weeklySummary = calculateWeeklySummary();

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20">
      <Header 
        title="Meal Planner" 
        onBack={() => onNavigate('home')}
        actions={
          <button 
            onClick={handleDownload}
            className="p-2 rounded-lg hover:bg-[var(--color-cream)] transition-colors"
          >
            <Download size={20} className="text-[var(--color-text-primary)]" />
          </button>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Week Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['Last Week', 'This Week', 'Next Week'].map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                selectedWeek === week
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-primary)]'
              }`}
            >
              {week}
            </button>
          ))}
        </div>

        {/* Premium Auto-Generate Banner */}
        {!isPremium && (
          <Card className="bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] p-4 text-white border-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={20} />
                  <h4 className="text-white">AI Meal Planning</h4>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  Auto-generate weekly meals based on your goals
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="bg-[var(--color-surface)] text-[var(--color-premium-gold)] border-[var(--color-surface)] hover:bg-[var(--color-cream)]"
                  onClick={() => onNavigate('subscription')}
                >
                  Upgrade Now
                </Button>
              </div>
              <Lock size={40} className="text-white/20" />
            </div>
          </Card>
        )}

        {/* Free Version: Simple Weekly Grid */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3>Weekly Meal Plan</h3>
            {isPremium ? (
              <Button variant="primary" size="sm" onClick={handleAutoGenerate}>
                <Sparkles size={16} />
                Auto-Generate
              </Button>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[var(--color-cream-dark)] rounded-lg border border-[var(--color-border)]">
                <Crown size={14} className="text-[var(--color-premium-gold)]" />
                <span className="text-xs text-[var(--color-text-secondary)]">Auto-generated meals</span>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[600px]">
              {/* Header Row */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="text-sm text-[var(--color-text-secondary)] flex items-center">
                  Meal
                </div>
                {daysOfWeek.map((day) => (
                  <div key={day} className="text-sm text-center text-[var(--color-text-primary)] font-semibold">
                    {day}
                  </div>
                ))}
              </div>

              {/* Meal Rows */}
              {mealTypes.map((mealType) => (
                <div key={mealType} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="text-sm text-[var(--color-text-secondary)] flex items-center py-2">
                    {mealType}
                  </div>
                  {daysOfWeek.map((day) => {
                    const mealKey = `${day}-${mealType}`;
                    const meal = meals[mealKey as keyof typeof meals];
                    
                    return (
                      <div key={day} className="relative group">
                        <button
                          onClick={() => handleAddMeal(day, mealType)}
                          className="w-full bg-[var(--color-cream)] hover:bg-[var(--color-border)] rounded-lg p-2 min-h-[60px] transition-colors"
                        >
                          {meal ? (
                            <div className="text-left">
                              <p className="text-xs truncate mb-1">{meal.name}</p>
                              <p className="text-xs text-[var(--color-text-secondary)]">
                                {meal.calories} cal
                              </p>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Plus size={20} className="text-[var(--color-text-secondary)]" />
                            </div>
                          )}
                        </button>
                        {/* Delete Button - Only show when meal exists */}
                        {meal && (
                          <button
                            onClick={(e) => handleDeleteMeal(day, mealType, e)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-error)] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-[var(--color-error)]/80 z-10"
                            title="Remove meal"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Premium Features Preview */}
        {!isPremium && (
          <Card className="p-6 relative overflow-hidden">
            <PremiumLock 
              feature="Advanced meal planning features"
              onUpgrade={() => onNavigate('subscription')}
            />
            <div className="opacity-30">
              <h3 className="mb-4">Premium Features</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="text-[var(--color-premium-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Auto-Generate Meals</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      AI-powered weekly meal generation based on your preferences
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CalendarIcon size={20} className="text-[var(--color-premium-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Nutrition-Based Planning</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Plan meals to meet specific calorie and macro targets
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lock size={20} className="text-[var(--color-premium-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Goal Modes</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Weight loss, muscle gain, diabetic-friendly planning
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Download size={20} className="text-[var(--color-premium-gold)] mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold mb-1">Export & Share</p>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Export to PDF or generate grocery lists from meal plans
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Weekly Summary */}
        {isPremium && (
          <Card className="p-4">
            <h4 className="mb-3">Weekly Nutrition Summary</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl mb-1">{weeklySummary.totalCalories.toLocaleString()}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Total Calories</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">{weeklySummary.estimatedProtein}g</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl mb-1">{weeklySummary.mealCount}</p>
                <p className="text-xs text-[var(--color-text-secondary)]">Meals Planned</p>
              </div>
            </div>
          </Card>
        )}
      </div>

      <BottomNav active="planner" onNavigate={onNavigate} />

      {/* Recipe Selection Modal */}
      {showRecipeSelector && selectedSlot && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end animate-fade-in">
          <div className="w-full max-w-[428px] mx-auto bg-[var(--color-surface)] rounded-t-3xl max-h-[80vh] overflow-hidden flex flex-col animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)]">
              <div>
                <h3>Select Recipe</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {selectedSlot.day} - {selectedSlot.mealType}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRecipeSelector(false);
                  setSelectedSlot(null);
                }}
                className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
              >
                <X size={24} className="text-[var(--color-text-primary)]" />
              </button>
            </div>

            {/* Recipe List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {availableRecipes.map((recipe) => (
                <button
                  key={recipe.id}
                  onClick={() => handleSelectRecipe(recipe)}
                  className="w-full bg-[var(--color-surface)] border-2 border-[var(--color-border)] rounded-2xl p-3 hover:border-[var(--color-primary)] transition-all active:scale-[0.98] text-left"
                >
                  <div className="flex gap-3">
                    <img
                      src={recipe.image}
                      alt={recipe.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="mb-1 truncate">{recipe.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="fill-[var(--color-secondary)] text-[var(--color-secondary)]" />
                          <span>{recipe.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--color-text-secondary)] mt-1">
                        {recipe.calories} cal
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Action */}
            <div className="p-4 border-t border-[var(--color-border)] bg-[var(--color-cream)]/50">
              <button
                onClick={() => {
                  onNavigate('recipes', { mealPlannerContext: selectedSlot });
                }}
                className="w-full text-[var(--color-primary)] text-sm hover:underline"
              >
                Browse All Recipes →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[400px] bg-[var(--color-surface)] rounded-3xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h3 className="mb-1">Meal Plan Preferences</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Customize your {selectedWeek.toLowerCase()} meal plan
                </p>
              </div>
              <button
                onClick={() => setShowPreferencesModal(false)}
                className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
              >
                <X size={24} className="text-[var(--color-text-primary)]" />
              </button>
            </div>

            {/* Preferences Form */}
            <div className="p-6 space-y-5">
              {/* Daily Calorie Target */}
              <div className="space-y-2">
                <label className="text-sm">Daily Calorie Target</label>
                <input
                  type="number"
                  value={calorieTarget}
                  onChange={(e) => setCalorieTarget(e.target.value)}
                  placeholder="2000"
                  className="w-full bg-[var(--color-cream)] border-2 border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Total calories per day across all meals
                </p>
              </div>

              {/* Dietary Goal */}
              <div className="space-y-2">
                <label className="text-sm">Dietary Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { value: 'balanced', label: 'Balanced', emoji: '⚖️' },
                    { value: 'low-carb', label: 'Low-Carb', emoji: '🥗' },
                    { value: 'high-protein', label: 'High-Protein', emoji: '💪' }
                  ].map((goal) => (
                    <button
                      key={goal.value}
                      onClick={() => setDietaryGoal(goal.value)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        dietaryGoal === goal.value
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                          : 'border-[var(--color-border)] bg-[var(--color-cream)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      <div className="text-2xl mb-1">{goal.emoji}</div>
                      <p className="text-xs">{goal.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Exclude Ingredients (Optional) */}
              <div className="space-y-2">
                <label className="text-sm">Exclude Ingredients <span className="text-[var(--color-text-secondary)]">(Optional)</span></label>
                <input
                  type="text"
                  value={excludeIngredients}
                  onChange={(e) => setExcludeIngredients(e.target.value)}
                  placeholder="e.g., nuts, dairy, gluten"
                  className="w-full bg-[var(--color-cream)] border-2 border-[var(--color-border)] rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                />
                <p className="text-xs text-[var(--color-text-secondary)]">
                  Separate multiple ingredients with commas
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm mb-1">AI-Powered Generation</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      Our AI will create a balanced meal plan with {daysOfWeek.length * mealTypes.length} meals tailored to your preferences and calorie goals.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={generateMealPlan}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Sparkles size={20} className="animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Generate Meal Plan
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => setShowPreferencesModal(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}