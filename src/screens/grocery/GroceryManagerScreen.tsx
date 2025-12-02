import React, { useState, useEffect } from 'react';
import { Plus, Check, Trash2, Share2, Download, Sparkles, Crown, Calendar, X } from 'lucide-react';
import { Header } from '../../components/Header';
import { BottomNav } from '../../components/BottomNav';
import { ShareModal } from '../../components/ShareModal';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { PremiumBadge } from '../../components/PremiumLock';
import { Toast } from '../../components/Toast';

interface GroceryManagerScreenProps {
  onNavigate: (screen: string) => void;
  isPremium: boolean;
}

interface GroceryItem {
  id: number;
  name: string;
  category: string;
  checked: boolean;
  quantity?: string;
  sourceMeals?: string[]; // Track which meals this ingredient came from
}

interface ImportedMealsTracker {
  [week: string]: {
    [mealKey: string]: string; // e.g., "Monday-Breakfast": "Oatmeal with Berries"
  };
}

const categories = ['Produce', 'Dairy', 'Meat', 'Pantry', 'Spices', 'Other'];
const categoryColors: Record<string, string> = {
  Produce: 'bg-[var(--color-success)]/20 text-[var(--color-success)]',
  Dairy: 'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  Meat: 'bg-[var(--color-error)]/20 text-[var(--color-error)]',
  Pantry: 'bg-[var(--color-warning)]/20 text-[var(--color-warning)]',
  Spices: 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]',
  Other: 'bg-[var(--color-border)] text-[var(--color-text-secondary)]'
};

export function GroceryManagerScreen({ onNavigate, isPremium }: GroceryManagerScreenProps) {
  // Initialize items from localStorage or use defaults
  const [items, setItems] = useState<GroceryItem[]>(() => {
    const saved = localStorage.getItem('groceryItems');
    if (saved) {
      return JSON.parse(saved);
    }
    return [
      { id: 1, name: 'Fresh Tomatoes', category: 'Produce', checked: false },
      { id: 2, name: 'Whole Milk', category: 'Dairy', checked: false },
      { id: 3, name: 'Chicken Breast', category: 'Meat', checked: false },
      { id: 4, name: 'Olive Oil', category: 'Pantry', checked: false },
      { id: 5, name: 'Basil', category: 'Spices', checked: false },
      { id: 6, name: 'Pasta', category: 'Pantry', checked: true }
    ];
  });
  
  const [newItem, setNewItem] = useState('');
  const [showAddItem, setShowAddItem] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showMealPlanModal, setShowMealPlanModal] = useState(false);
  const [selectedWeekForImport, setSelectedWeekForImport] = useState('This Week');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Save to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('groceryItems', JSON.stringify(items));
  }, [items]);

  const toggleItem = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const deleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, {
        id: Date.now(),
        name: newItem,
        category: 'Other',
        checked: false
      }]);
      setNewItem('');
      setShowAddItem(false);
    }
  };

  const groupedItems = categories.reduce((acc, category) => {
    acc[category] = items.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  const handleDownload = () => {
    // Create formatted text content
    let content = '🛒 GROCERY LIST\n';
    content += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';
    
    const uncheckedItems = items.filter(item => !item.checked);
    const checkedItems = items.filter(item => item.checked);
    
    // Group unchecked items by category
    if (uncheckedItems.length > 0) {
      content += '📋 ITEMS TO BUY:\n\n';
      categories.forEach(category => {
        const categoryItems = uncheckedItems.filter(item => item.category === category);
        if (categoryItems.length > 0) {
          content += `${category}:\n`;
          categoryItems.forEach(item => {
            content += `  ☐ ${item.name}\n`;
          });
          content += '\n';
        }
      });
    }
    
    // Add checked items section
    if (checkedItems.length > 0) {
      content += '\n✓ PURCHASED ITEMS:\n\n';
      categories.forEach(category => {
        const categoryItems = checkedItems.filter(item => item.category === category);
        if (categoryItems.length > 0) {
          content += `${category}:\n`;
          categoryItems.forEach(item => {
            content += `  ☑ ${item.name}\n`;
          });
          content += '\n';
        }
      });
    }
    
    content += '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n';
    content += `Total Items: ${items.length} | Checked: ${checkedItems.length} | Remaining: ${uncheckedItems.length}\n`;
    content += `Generated by Smart Chef on ${new Date().toLocaleDateString()}\n`;
    
    // Create and download file
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `grocery-list-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    // Show success toast
    setToastMessage('Grocery list downloaded successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Recipe to ingredients mapping
  const recipeIngredients: Record<string, { name: string; category: string; quantity: string }[]> = {
    'Oatmeal with Berries': [
      { name: 'Rolled Oats', category: 'Pantry', quantity: '1 cup' },
      { name: 'Mixed Berries', category: 'Produce', quantity: '1/2 cup' },
      { name: 'Honey', category: 'Pantry', quantity: '1 tbsp' },
      { name: 'Milk', category: 'Dairy', quantity: '1 cup' }
    ],
    'Grilled Chicken Salad': [
      { name: 'Chicken Breast', category: 'Meat', quantity: '200g' },
      { name: 'Mixed Greens', category: 'Produce', quantity: '2 cups' },
      { name: 'Cherry Tomatoes', category: 'Produce', quantity: '1 cup' },
      { name: 'Olive Oil', category: 'Pantry', quantity: '2 tbsp' },
      { name: 'Lemon', category: 'Produce', quantity: '1 pc' }
    ],
    'Pasta Primavera': [
      { name: 'Pasta', category: 'Pantry', quantity: '250g' },
      { name: 'Bell Peppers', category: 'Produce', quantity: '2 pcs' },
      { name: 'Zucchini', category: 'Produce', quantity: '1 pc' },
      { name: 'Garlic', category: 'Produce', quantity: '3 cloves' },
      { name: 'Parmesan Cheese', category: 'Dairy', quantity: '50g' },
      { name: 'Olive Oil', category: 'Pantry', quantity: '2 tbsp' }
    ],
    'Scrambled Eggs & Toast': [
      { name: 'Eggs', category: 'Dairy', quantity: '3 pcs' },
      { name: 'Bread', category: 'Pantry', quantity: '2 slices' },
      { name: 'Butter', category: 'Dairy', quantity: '1 tbsp' },
      { name: 'Chives', category: 'Spices', quantity: '1 tbsp' }
    ],
    'Buddha Bowl': [
      { name: 'Quinoa', category: 'Pantry', quantity: '1 cup' },
      { name: 'Chickpeas', category: 'Pantry', quantity: '1 cup' },
      { name: 'Avocado', category: 'Produce', quantity: '1 pc' },
      { name: 'Sweet Potato', category: 'Produce', quantity: '1 pc' },
      { name: 'Kale', category: 'Produce', quantity: '2 cups' },
      { name: 'Tahini', category: 'Pantry', quantity: '3 tbsp' }
    ],
    'Pancakes with Syrup': [
      { name: 'Flour', category: 'Pantry', quantity: '2 cups' },
      { name: 'Eggs', category: 'Dairy', quantity: '2 pcs' },
      { name: 'Milk', category: 'Dairy', quantity: '1.5 cups' },
      { name: 'Baking Powder', category: 'Pantry', quantity: '2 tsp' },
      { name: 'Maple Syrup', category: 'Pantry', quantity: '1/4 cup' },
      { name: 'Butter', category: 'Dairy', quantity: '2 tbsp' }
    ],
    'Turkey Sandwich': [
      { name: 'Turkey Slices', category: 'Meat', quantity: '100g' },
      { name: 'Bread', category: 'Pantry', quantity: '2 slices' },
      { name: 'Lettuce', category: 'Produce', quantity: '2 leaves' },
      { name: 'Tomatoes', category: 'Produce', quantity: '1 pc' },
      { name: 'Cheese Slices', category: 'Dairy', quantity: '2 slices' },
      { name: 'Mayonnaise', category: 'Pantry', quantity: '1 tbsp' }
    ],
    'Smoothie Bowl': [
      { name: 'Frozen Berries', category: 'Produce', quantity: '2 cups' },
      { name: 'Banana', category: 'Produce', quantity: '1 pc' },
      { name: 'Greek Yogurt', category: 'Dairy', quantity: '1/2 cup' },
      { name: 'Granola', category: 'Pantry', quantity: '1/3 cup' },
      { name: 'Chia Seeds', category: 'Pantry', quantity: '1 tbsp' }
    ],
    'Baked Salmon': [
      { name: 'Salmon Fillet', category: 'Meat', quantity: '200g' },
      { name: 'Lemon', category: 'Produce', quantity: '1 pc' },
      { name: 'Dill', category: 'Spices', quantity: '2 tbsp' },
      { name: 'Olive Oil', category: 'Pantry', quantity: '2 tbsp' },
      { name: 'Asparagus', category: 'Produce', quantity: '200g' }
    ],
    'Caesar Salad': [
      { name: 'Romaine Lettuce', category: 'Produce', quantity: '1 head' },
      { name: 'Parmesan Cheese', category: 'Dairy', quantity: '50g' },
      { name: 'Croutons', category: 'Pantry', quantity: '1 cup' },
      { name: 'Caesar Dressing', category: 'Pantry', quantity: '1/4 cup' },
      { name: 'Chicken Breast', category: 'Meat', quantity: '150g' }
    ],
    'French Toast': [
      { name: 'Bread', category: 'Pantry', quantity: '4 slices' },
      { name: 'Eggs', category: 'Dairy', quantity: '3 pcs' },
      { name: 'Milk', category: 'Dairy', quantity: '1/2 cup' },
      { name: 'Cinnamon', category: 'Spices', quantity: '1 tsp' },
      { name: 'Vanilla Extract', category: 'Pantry', quantity: '1 tsp' },
      { name: 'Maple Syrup', category: 'Pantry', quantity: '1/4 cup' }
    ],
    'Sushi Bowl': [
      { name: 'Sushi Rice', category: 'Pantry', quantity: '1 cup' },
      { name: 'Salmon', category: 'Meat', quantity: '150g' },
      { name: 'Avocado', category: 'Produce', quantity: '1 pc' },
      { name: 'Cucumber', category: 'Produce', quantity: '1 pc' },
      { name: 'Seaweed', category: 'Pantry', quantity: '2 sheets' },
      { name: 'Soy Sauce', category: 'Pantry', quantity: '2 tbsp' }
    ],
    'Beef Tacos': [
      { name: 'Ground Beef', category: 'Meat', quantity: '300g' },
      { name: 'Taco Shells', category: 'Pantry', quantity: '6 pcs' },
      { name: 'Lettuce', category: 'Produce', quantity: '1 cup' },
      { name: 'Tomatoes', category: 'Produce', quantity: '2 pcs' },
      { name: 'Cheese', category: 'Dairy', quantity: '100g' },
      { name: 'Sour Cream', category: 'Dairy', quantity: '1/2 cup' },
      { name: 'Taco Seasoning', category: 'Spices', quantity: '2 tbsp' }
    ],
    'Yogurt Parfait': [
      { name: 'Greek Yogurt', category: 'Dairy', quantity: '1 cup' },
      { name: 'Granola', category: 'Pantry', quantity: '1/2 cup' },
      { name: 'Fresh Berries', category: 'Produce', quantity: '1 cup' },
      { name: 'Honey', category: 'Pantry', quantity: '2 tbsp' }
    ],
    'Pizza Margherita': [
      { name: 'Pizza Dough', category: 'Pantry', quantity: '1 ball' },
      { name: 'Tomato Sauce', category: 'Pantry', quantity: '1/2 cup' },
      { name: 'Mozzarella Cheese', category: 'Dairy', quantity: '200g' },
      { name: 'Fresh Basil', category: 'Spices', quantity: '10 leaves' },
      { name: 'Olive Oil', category: 'Pantry', quantity: '1 tbsp' }
    ],
    'Grilled Herb Steak': [
      { name: 'Beef Steak', category: 'Meat', quantity: '250g' },
      { name: 'Rosemary', category: 'Spices', quantity: '2 sprigs' },
      { name: 'Thyme', category: 'Spices', quantity: '2 sprigs' },
      { name: 'Garlic', category: 'Produce', quantity: '4 cloves' },
      { name: 'Olive Oil', category: 'Pantry', quantity: '2 tbsp' },
      { name: 'Salt', category: 'Spices', quantity: '1 tsp' },
      { name: 'Black Pepper', category: 'Spices', quantity: '1 tsp' }
    ],
    'Italian Pasta Primavera': [
      { name: 'Pasta', category: 'Pantry', quantity: '300g' },
      { name: 'Bell Peppers', category: 'Produce', quantity: '2 pcs' },
      { name: 'Zucchini', category: 'Produce', quantity: '1 pc' },
      { name: 'Cherry Tomatoes', category: 'Produce', quantity: '1 cup' },
      { name: 'Garlic', category: 'Produce', quantity: '3 cloves' },
      { name: 'Olive Oil', category: 'Pantry', quantity: '3 tbsp' },
      { name: 'Parmesan Cheese', category: 'Dairy', quantity: '75g' }
    ],
    'Healthy Buddha Bowl': [
      { name: 'Quinoa', category: 'Pantry', quantity: '1 cup' },
      { name: 'Chickpeas', category: 'Pantry', quantity: '1 cup' },
      { name: 'Avocado', category: 'Produce', quantity: '1 pc' },
      { name: 'Sweet Potato', category: 'Produce', quantity: '1 pc' },
      { name: 'Spinach', category: 'Produce', quantity: '2 cups' },
      { name: 'Tahini', category: 'Pantry', quantity: '3 tbsp' }
    ],
    'Spiced Vegetable Stir-fry': [
      { name: 'Mixed Vegetables', category: 'Produce', quantity: '3 cups' },
      { name: 'Soy Sauce', category: 'Pantry', quantity: '3 tbsp' },
      { name: 'Ginger', category: 'Spices', quantity: '1 tbsp' },
      { name: 'Garlic', category: 'Produce', quantity: '3 cloves' },
      { name: 'Sesame Oil', category: 'Pantry', quantity: '1 tbsp' }
    ],
    'Classic French Omelette': [
      { name: 'Eggs', category: 'Dairy', quantity: '3 pcs' },
      { name: 'Butter', category: 'Dairy', quantity: '2 tbsp' },
      { name: 'Cheese', category: 'Dairy', quantity: '50g' },
      { name: 'Chives', category: 'Spices', quantity: '1 tbsp' }
    ],
    'Aromatic Spice Blend Rice': [
      { name: 'Basmati Rice', category: 'Pantry', quantity: '2 cups' },
      { name: 'Cumin', category: 'Spices', quantity: '1 tsp' },
      { name: 'Cardamom', category: 'Spices', quantity: '4 pods' },
      { name: 'Cinnamon', category: 'Spices', quantity: '1 stick' },
      { name: 'Butter', category: 'Dairy', quantity: '2 tbsp' }
    ],
    'Avocado Toast with Eggs': [
      { name: 'Bread', category: 'Pantry', quantity: '2 slices' },
      { name: 'Avocado', category: 'Produce', quantity: '1 pc' },
      { name: 'Eggs', category: 'Dairy', quantity: '2 pcs' },
      { name: 'Lemon', category: 'Produce', quantity: '1/2 pc' },
      { name: 'Red Pepper Flakes', category: 'Spices', quantity: '1/2 tsp' }
    ],
    'Greek Yogurt Parfait': [
      { name: 'Greek Yogurt', category: 'Dairy', quantity: '1 cup' },
      { name: 'Granola', category: 'Pantry', quantity: '1/2 cup' },
      { name: 'Mixed Berries', category: 'Produce', quantity: '1 cup' },
      { name: 'Honey', category: 'Pantry', quantity: '2 tbsp' }
    ],
    'Chicken Caesar Salad': [
      { name: 'Chicken Breast', category: 'Meat', quantity: '200g' },
      { name: 'Romaine Lettuce', category: 'Produce', quantity: '1 head' },
      { name: 'Parmesan Cheese', category: 'Dairy', quantity: '50g' },
      { name: 'Croutons', category: 'Pantry', quantity: '1 cup' },
      { name: 'Caesar Dressing', category: 'Pantry', quantity: '1/4 cup' }
    ],
    'Salmon with Roasted Vegetables': [
      { name: 'Salmon Fillet', category: 'Meat', quantity: '200g' },
      { name: 'Broccoli', category: 'Produce', quantity: '1 cup' },
      { name: 'Carrots', category: 'Produce', quantity: '2 pcs' },
      { name: 'Olive Oil', category: 'Pantry', quantity: '2 tbsp' },
      { name: 'Lemon', category: 'Produce', quantity: '1 pc' }
    ]
  };

  const handleFromMealPlan = () => {
    if (!isPremium) {
      onNavigate('subscription');
      return;
    }
    setShowMealPlanModal(true);
  };

  const importFromMealPlan = () => {
    // Read actual meal plans from localStorage
    const getMealPlanFromStorage = (week: string) => {
      let storageKey = '';
      if (week === 'Last Week') storageKey = 'lastWeekMeals';
      else if (week === 'This Week') storageKey = 'thisWeekMeals';
      else if (week === 'Next Week') storageKey = 'nextWeekMeals';
      
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : {};
    };

    // Get imported meals tracker from localStorage
    const getImportedMeals = (): ImportedMealsTracker => {
      const saved = localStorage.getItem('importedMealsTracker');
      return saved ? JSON.parse(saved) : {};
    };

    // Save imported meals tracker to localStorage
    const saveImportedMeals = (tracker: ImportedMealsTracker) => {
      localStorage.setItem('importedMealsTracker', JSON.stringify(tracker));
    };

    const selectedWeekMeals = getMealPlanFromStorage(selectedWeekForImport);
    const importedMealsTracker = getImportedMeals();
    
    // Get previously imported meals for this week
    const previouslyImportedMeals = importedMealsTracker[selectedWeekForImport] || {};
    
    // Identify new meals (not previously imported) and deleted meals
    const currentMealKeys = Object.keys(selectedWeekMeals);
    const previousMealKeys = Object.keys(previouslyImportedMeals);
    
    // Find meals that were deleted from the meal plan
    const deletedMealKeys = previousMealKeys.filter(key => !currentMealKeys.includes(key));
    
    // Find meals that are new (not yet imported)
    const newMeals: { [key: string]: any } = {};
    currentMealKeys.forEach(key => {
      const currentMealName = selectedWeekMeals[key].name;
      const previousMealName = previouslyImportedMeals[key];
      
      // Add if this slot is new OR if the meal in this slot has changed
      if (!previousMealName || previousMealName !== currentMealName) {
        newMeals[key] = selectedWeekMeals[key];
      }
    });

    // Helper function to create meal identifier
    const createMealId = (mealKey: string, mealName: string) => {
      return `${selectedWeekForImport}|${mealKey}|${mealName}`;
    };

    // Map to track ingredients with their quantities and source meals
    const ingredientsMap = new Map<string, { 
      name: string; 
      category: string; 
      quantities: string[];
      sourceMeals: string[];
    }>();

    // Extract ingredients only from NEW meals
    Object.entries(newMeals).forEach(([mealKey, meal]: [string, any]) => {
      const ingredients = recipeIngredients[meal.name] || [];
      const mealId = createMealId(mealKey, meal.name);
      
      ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        
        if (ingredientsMap.has(key)) {
          // Add quantity and source to existing ingredient
          const existing = ingredientsMap.get(key)!;
          existing.quantities.push(ingredient.quantity);
          existing.sourceMeals.push(mealId);
        } else {
          // Add new ingredient
          ingredientsMap.set(key, {
            name: ingredient.name,
            category: ingredient.category,
            quantities: [ingredient.quantity],
            sourceMeals: [mealId]
          });
        }
      });
    });

    // Process deleted meals - remove their ingredients from grocery list
    const ingredientsToRemove = new Set<string>();
    deletedMealKeys.forEach(mealKey => {
      const deletedMealName = previouslyImportedMeals[mealKey];
      const mealId = createMealId(mealKey, deletedMealName);
      const ingredients = recipeIngredients[deletedMealName] || [];
      
      ingredients.forEach(ingredient => {
        ingredientsToRemove.add(ingredient.name.toLowerCase());
      });
    });

    // Helper function to parse quantity
    const parseQuantity = (qty: string): { value: number; unit: string } => {
      const match = qty.match(/^([\d./]+)\s*(.*)$/);
      if (!match) return { value: 1, unit: qty };
      
      let value = 0;
      const numStr = match[1];
      const unit = match[2];
      
      // Handle fractions like "1/2"
      if (numStr.includes('/')) {
        const parts = numStr.split('/');
        value = parseFloat(parts[0]) / parseFloat(parts[1]);
      } else {
        value = parseFloat(numStr);
      }
      
      return { value, unit };
    };

    // Helper function to combine quantities
    const combineQuantities = (quantities: string[]): string => {
      if (quantities.length === 1) return quantities[0];
      
      // Try to parse and combine numeric quantities
      const parsed = quantities.map(parseQuantity);
      const firstUnit = parsed[0].unit;
      
      // Check if all quantities have the same unit
      const sameUnit = parsed.every(p => p.unit === firstUnit);
      
      if (sameUnit && firstUnit) {
        // Sum the values
        const total = parsed.reduce((sum, p) => sum + p.value, 0);
        
        // Format the result
        if (total % 1 === 0) {
          return `${total} ${firstUnit}`;
        } else {
          return `${total.toFixed(1)} ${firstUnit}`;
        }
      } else {
        // Different units or complex - show count
        return `${quantities.length}x servings`;
      }
    };

    // Convert map to array with combined quantities
    const newIngredients = Array.from(ingredientsMap.values()).map(item => ({
      name: item.name,
      category: item.category,
      quantity: combineQuantities(item.quantities),
      sourceMeals: item.sourceMeals
    }));

    // Helper function to merge quantities between existing and new items
    const mergeQuantities = (existingQty: string | undefined, newQty: string): string => {
      if (!existingQty) return newQty;
      
      const existing = parseQuantity(existingQty);
      const newParsed = parseQuantity(newQty);
      
      // Check if units match
      if (existing.unit === newParsed.unit && existing.unit) {
        const total = existing.value + newParsed.value;
        if (total % 1 === 0) {
          return `${total} ${existing.unit}`;
        } else {
          return `${total.toFixed(1)} ${existing.unit}`;
        }
      } else {
        // Different units - just indicate multiple servings
        return `Combined servings`;
      }
    };

    // Helper function to subtract quantities
    const subtractQuantities = (existingQty: string | undefined, removeQty: string): string | null => {
      if (!existingQty) return null;
      
      const existing = parseQuantity(existingQty);
      const remove = parseQuantity(removeQty);
      
      // Check if units match
      if (existing.unit === remove.unit && existing.unit) {
        const result = existing.value - remove.value;
        if (result <= 0) return null; // Remove item completely
        
        if (result % 1 === 0) {
          return `${result} ${existing.unit}`;
        } else {
          return `${result.toFixed(1)} ${existing.unit}`;
        }
      }
      
      // Different units - can't subtract, return existing
      return existingQty;
    };

    // Update grocery list
    let updatedItems = [...items];
    const addedIngredients: string[] = [];
    const updatedIngredients: string[] = [];
    const removedIngredients: string[] = [];

    // Remove ingredients from deleted meals
    ingredientsToRemove.forEach(ingredientKey => {
      const existingIndex = updatedItems.findIndex(
        item => item.name.toLowerCase() === ingredientKey
      );

      if (existingIndex !== -1) {
        const existingItem = updatedItems[existingIndex];
        const deletedMealNames = deletedMealKeys.map(key => previouslyImportedMeals[key]);
        
        // Check if this ingredient came from deleted meals
        const shouldRemove = deletedMealNames.some(mealName => {
          const ingredients = recipeIngredients[mealName] || [];
          return ingredients.some(ing => ing.name.toLowerCase() === ingredientKey);
        });

        if (shouldRemove) {
          // Get the ingredient quantity from deleted meal
          const deletedMealName = deletedMealNames.find(mealName => {
            const ingredients = recipeIngredients[mealName] || [];
            return ingredients.some(ing => ing.name.toLowerCase() === ingredientKey);
          });
          
          if (deletedMealName) {
            const ingredients = recipeIngredients[deletedMealName] || [];
            const deletedIngredient = ingredients.find(ing => ing.name.toLowerCase() === ingredientKey);
            
            if (deletedIngredient && existingItem.quantity) {
              const newQuantity = subtractQuantities(existingItem.quantity, deletedIngredient.quantity);
              
              if (newQuantity === null) {
                // Remove item completely
                updatedItems = updatedItems.filter((_, idx) => idx !== existingIndex);
                removedIngredients.push(existingItem.name);
              } else {
                // Update quantity
                updatedItems[existingIndex] = {
                  ...existingItem,
                  quantity: newQuantity
                };
                updatedIngredients.push(existingItem.name);
              }
            }
          }
        }
      }
    });

    // Add new ingredients
    newIngredients.forEach(newIngredient => {
      const existingIndex = updatedItems.findIndex(
        item => item.name.toLowerCase() === newIngredient.name.toLowerCase()
      );

      if (existingIndex !== -1) {
        // Update existing item's quantity and source meals
        const existingItem = updatedItems[existingIndex];
        const existingSourceMeals = existingItem.sourceMeals || [];
        
        updatedItems[existingIndex] = {
          ...existingItem,
          quantity: mergeQuantities(existingItem.quantity, newIngredient.quantity),
          sourceMeals: [...existingSourceMeals, ...newIngredient.sourceMeals]
        };
        
        if (!updatedIngredients.includes(newIngredient.name)) {
          updatedIngredients.push(newIngredient.name);
        }
      } else {
        // Add new item
        updatedItems.push({
          id: Date.now() + Math.random(),
          name: newIngredient.name,
          category: newIngredient.category,
          checked: false,
          quantity: newIngredient.quantity,
          sourceMeals: newIngredient.sourceMeals
        });
        addedIngredients.push(newIngredient.name);
      }
    });

    // Update the imported meals tracker
    const updatedTracker = { ...importedMealsTracker };
    updatedTracker[selectedWeekForImport] = {};
    
    // Store current meal plan state
    currentMealKeys.forEach(key => {
      updatedTracker[selectedWeekForImport][key] = selectedWeekMeals[key].name;
    });
    
    saveImportedMeals(updatedTracker);
    setItems(updatedItems);
    setShowMealPlanModal(false);

    // Show appropriate message
    if (newIngredients.length === 0 && deletedMealKeys.length === 0) {
      setToastMessage(`No changes detected in ${selectedWeekForImport}. All meals already imported!`);
    } else {
      let message = '';
      if (addedIngredients.length > 0) {
        message += `✨ Added ${addedIngredients.length} new`;
      }
      if (updatedIngredients.length > 0) {
        if (message) message += ' and ';
        else message += '✨ ';
        message += `updated ${updatedIngredients.length}`;
      }
      if (addedIngredients.length > 0 || updatedIngredients.length > 0) {
        message += ' ingredients';
      }
      if (removedIngredients.length > 0) {
        if (message) message += ', ';
        else message += '✨ ';
        message += `removed ${removedIngredients.length} ingredients`;
      }
      message += ` from ${selectedWeekForImport}!`;
      setToastMessage(message);
    }
    
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleClearList = () => {
    setShowClearConfirm(true);
  };

  const confirmClearList = () => {
    setItems([]);
    setShowClearConfirm(false);
    setToastMessage('Grocery list cleared successfully!');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20">
      <Header 
        title="Grocery List" 
        onBack={() => onNavigate('home')}
        actions={
          <div className="flex gap-2">
            <button 
              onClick={() => isPremium ? setShowShareModal(true) : onNavigate('subscription')}
              className="p-2 rounded-lg hover:bg-[var(--color-cream)] transition-colors relative"
            >
              <Share2 size={20} className="text-[var(--color-text-primary)]" />
              {!isPremium && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[var(--color-premium-gold)] rounded-full flex items-center justify-center">
                  <Crown size={10} className="text-white" />
                </div>
              )}
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 rounded-lg hover:bg-[var(--color-cream)] transition-colors"
            >
              <Download size={20} className="text-[var(--color-text-primary)]" />
            </button>
          </div>
        }
      />

      <div className="px-4 py-4 space-y-4">
        {/* Premium Features Banner */}
        {!isPremium && (
          <Card className="bg-gradient-to-br from-[var(--color-premium-gold)] to-[var(--color-premium-gold-dark)] p-4 text-white border-0">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={20} />
                  <h4 className="text-white">Smart Grocery Pro</h4>
                </div>
                <p className="text-white/90 text-sm mb-3">
                  Auto-generate from meal plans & share with family
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
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={() => setShowAddItem(true)}
          >
            <Plus size={16} />
            Add Item
          </Button>
          {isPremium ? (
            <Button
              variant="secondary"
              size="sm"
              fullWidth
              onClick={handleFromMealPlan}
            >
              <Sparkles size={16} />
              From Meal Plan
            </Button>
          ) : (
            <div className="flex items-center justify-center gap-2 px-3 py-2 bg-[var(--color-cream-dark)] rounded-lg border border-[var(--color-border)]">
              <Crown size={14} className="text-[var(--color-premium-gold)]" />
              <span className="text-xs text-[var(--color-text-secondary)] whitespace-nowrap">From Meal Plan</span>
            </div>
          )}
        </div>

        {/* Add Item Input */}
        {showAddItem && (
          <Card className="p-4 animate-slide-up">
            <div className="flex gap-2">
              <Input
                placeholder="Enter item name..."
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addItem()}
              />
              <Button variant="primary" onClick={addItem}>
                Add
              </Button>
            </div>
          </Card>
        )}

        {/* Progress */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-[var(--color-text-secondary)]">Progress</p>
            <p className="text-sm">
              {items.filter(item => item.checked).length} / {items.length}
            </p>
          </div>
          <div className="h-2 bg-[var(--color-cream)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--color-success)] to-green-600 transition-all duration-300"
              style={{ 
                width: `${items.length > 0 ? (items.filter(item => item.checked).length / items.length) * 100 : 0}%` 
              }}
            />
          </div>
        </Card>

        {/* Clear List Button - Only show if there are items */}
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            onClick={handleClearList}
            className="text-[var(--color-error)] hover:bg-[var(--color-error)]/10 border-2 border-[var(--color-border)]"
          >
            <Trash2 size={16} />
            Clear All Items
          </Button>
        )}

        {/* Grocery Items by Category */}
        {categories.map(category => {
          const categoryItems = groupedItems[category];
          if (categoryItems.length === 0) return null;

          return (
            <Card key={category} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${categoryColors[category]}`}>
                    {category}
                  </span>
                  <span className="text-sm text-[var(--color-text-secondary)]">
                    {categoryItems.length} items
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-[var(--color-cream)] rounded-lg"
                  >
                    <button
                      onClick={() => toggleItem(item.id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
                        item.checked
                          ? 'bg-[var(--color-success)] border-[var(--color-success)]'
                          : 'border-[var(--color-border)] bg-[var(--color-surface)]'
                      }`}
                    >
                      {item.checked && <Check size={16} className="text-white" />}
                    </button>
                    <div className="flex-1 min-w-0">
                      <span className={`block ${item.checked ? 'line-through text-[var(--color-text-secondary)]' : 'text-[var(--color-text-primary)]'}`}>
                        {item.name}
                      </span>
                      {item.quantity && (
                        <span className="text-xs text-[var(--color-text-secondary)] block mt-0.5">
                          {item.quantity}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors flex-shrink-0"
                    >
                      <Trash2 size={16} className="text-[var(--color-error)]" />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      <BottomNav active="grocery" onNavigate={onNavigate} />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Grocery List"
        shareText="Check out my grocery list for this week! 🛒"
        shareUrl="https://kitchennova.app/grocery"
      />

      {/* Meal Plan Import Modal */}
      {showMealPlanModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[400px] bg-[var(--color-surface)] rounded-3xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h3 className="mb-1">Import from Meal Plan</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Select a week to import ingredients
                </p>
              </div>
              <button
                onClick={() => setShowMealPlanModal(false)}
                className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
              >
                <Calendar size={24} className="text-[var(--color-text-primary)]" />
              </button>
            </div>

            {/* Week Selection */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm">Select Week</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Last Week', 'This Week', 'Next Week'].map((week) => (
                    <button
                      key={week}
                      onClick={() => setSelectedWeekForImport(week)}
                      className={`p-3 rounded-xl border-2 transition-all ${
                        selectedWeekForImport === week
                          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10'
                          : 'border-[var(--color-border)] bg-[var(--color-cream)] hover:border-[var(--color-primary)]/50'
                      }`}
                    >
                      <div className="text-xs">{week}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <Sparkles size={20} className="text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm mb-1">Smart Import</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">
                      All ingredients from your {selectedWeekForImport.toLowerCase()} meal plan will be added to your grocery list. Duplicates will be automatically removed.
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
                onClick={importFromMealPlan}
              >
                <Sparkles size={20} />
                Import Ingredients
              </Button>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => setShowMealPlanModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clear List Confirmation */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="w-full max-w-[400px] bg-[var(--color-surface)] rounded-3xl overflow-hidden animate-slide-up">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
              <div>
                <h3 className="mb-1">Clear Grocery List</h3>
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Are you sure you want to clear all items from your grocery list?
                </p>
              </div>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="p-2 hover:bg-[var(--color-cream)] rounded-lg transition-colors"
              >
                <X size={24} className="text-[var(--color-text-primary)]" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="p-6 pt-0 space-y-3">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={confirmClearList}
              >
                <Trash2 size={20} />
                Clear List
              </Button>
              <Button
                variant="ghost"
                size="lg"
                fullWidth
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
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
    </div>
  );
}