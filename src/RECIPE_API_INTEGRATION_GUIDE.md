# 🍳 Recipe API Integration Guide - Kitchen Nova Mobile App

## Overview
This guide covers the integration of **Spoonacular API** and **Nutritionix API** for recipe data, ingredients, instructions, nutrition information, and cooking steps in the Kitchen Nova mobile application.

**Important:** This is a **MOBILE APPLICATION** (Flutter target platform), not a web app. All API calls should be optimized for mobile networks with proper caching, offline support, and data usage considerations.

---

## 📋 Table of Contents

1. [API Selection](#api-selection)
2. [Spoonacular API Integration](#spoonacular-api-integration)
3. [Nutritionix API Integration](#nutritionix-api-integration)
4. [Recipe Data Structure](#recipe-data-structure)
5. [Backend Architecture](#backend-architecture)
6. [Mobile Optimization](#mobile-optimization)
7. [Caching Strategy](#caching-strategy)
8. [Implementation Guide](#implementation-guide)

---

## 🎯 API Selection

### Spoonacular API (Recommended for Recipes)

**Best for:** Complete recipe data, cooking instructions, ingredient parsing

**Pricing:**
- Free: 150 requests/day
- Basic: $49/month - 5,000 requests/day
- Pro: $149/month - 50,000 requests/day

**What it provides:**
- ✅ Recipe search & discovery
- ✅ Detailed recipe information
- ✅ Step-by-step instructions
- ✅ Ingredient lists with quantities
- ✅ Nutrition data
- ✅ Similar recipes
- ✅ Recipe images
- ✅ Dietary filters (vegan, gluten-free, etc.)
- ✅ Meal planning
- ✅ Grocery list generation

**API Docs:** https://spoonacular.com/food-api/docs

---

### Nutritionix API (Recommended for Nutrition Data)

**Best for:** Detailed nutrition information, ingredient nutrition lookup

**Pricing:**
- Free: 200 requests/day
- Basic: $19.99/month - 5,000 requests/day
- Pro: Custom pricing

**What it provides:**
- ✅ Comprehensive nutrition data (50+ nutrients)
- ✅ Ingredient search
- ✅ Barcode lookup
- ✅ Natural language food search
- ✅ Restaurant food database
- ✅ Branded food items

**API Docs:** https://docs.nutritionix.com/

---

### Recommended Approach

**Use BOTH APIs:**
- **Spoonacular** for recipes, instructions, meal planning
- **Nutritionix** for detailed nutrition data, barcode scanning

**Why?**
- Spoonacular has better recipe data
- Nutritionix has more accurate nutrition information
- Combined: Best of both worlds
- Redundancy if one API is down

---

## 📱 Spoonacular API Integration

### 1. Authentication

**API Key Setup:**
```javascript
// Backend .env
SPOONACULAR_API_KEY=your_api_key_here

// Backend API calls
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';
const headers = {
  'x-api-key': process.env.SPOONACULAR_API_KEY,
  'Content-Type': 'application/json'
};
```

---

### 2. Recipe Search / Suggestions

**Spoonacular Endpoint:**
```
GET https://api.spoonacular.com/recipes/complexSearch
```

**Backend Endpoint:**
```
GET /api/recipes/search
Authorization: Bearer {token}
```

**Request Parameters:**
```json
{
  "query": "pasta",
  "cuisine": "italian",
  "diet": "vegetarian",
  "intolerances": "gluten,dairy",
  "maxReadyTime": 30,
  "minProtein": 20,
  "maxCalories": 500,
  "number": 20,
  "offset": 0,
  "addRecipeInformation": true,
  "fillIngredients": true,
  "addRecipeNutrition": true
}
```

**Backend Implementation:**
```javascript
// Backend: /routes/recipes.js
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { query, diet, intolerances, maxReadyTime, number = 20, offset = 0 } = req.query;
    const userId = req.user.id;
    
    // Fetch user's dietary preferences
    const userPreferences = await getUserDietaryPreferences(userId);
    
    // Build Spoonacular query
    const params = new URLSearchParams({
      query: query || '',
      diet: diet || userPreferences.diet || '',
      intolerances: intolerances || userPreferences.allergies?.join(',') || '',
      maxReadyTime: maxReadyTime || 120,
      number: number,
      offset: offset,
      addRecipeInformation: true,
      fillIngredients: true,
      addRecipeNutrition: true,
      apiKey: process.env.SPOONACULAR_API_KEY
    });
    
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/recipes/complexSearch?${params}`
    );
    
    // Transform data for mobile app
    const recipes = response.data.results.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      healthScore: recipe.healthScore,
      pricePerServing: recipe.pricePerServing,
      cuisines: recipe.cuisines || [],
      dishTypes: recipe.dishTypes || [],
      diets: recipe.diets || [],
      nutrition: {
        calories: recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 0,
        protein: recipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 0,
        carbs: recipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 0,
        fat: recipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 0
      },
      isPremium: false // All recipes free, but some features are premium
    }));
    
    // Cache results for mobile optimization
    await cacheRecipeResults(userId, recipes, query);
    
    res.json({
      recipes,
      totalResults: response.data.totalResults,
      offset: offset,
      number: number
    });
    
  } catch (error) {
    console.error('Recipe search error:', error);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});
```

---

### 3. Recipe Details

**Spoonacular Endpoint:**
```
GET https://api.spoonacular.com/recipes/{id}/information
```

**Backend Endpoint:**
```
GET /api/recipes/:recipeId
Authorization: Bearer {token}
```

**Spoonacular Parameters:**
```json
{
  "includeNutrition": true,
  "addWinePairing": false,
  "addTasteData": true
}
```

**Backend Implementation:**
```javascript
router.get('/:recipeId', authenticateToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const userId = req.user.id;
    
    // Check cache first (mobile optimization)
    const cached = await getCachedRecipe(recipeId);
    if (cached) {
      return res.json(cached);
    }
    
    // Fetch from Spoonacular
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/recipes/${recipeId}/information`,
      {
        params: {
          includeNutrition: true,
          addTasteData: true,
          apiKey: process.env.SPOONACULAR_API_KEY
        }
      }
    );
    
    const recipe = response.data;
    
    // Transform for mobile app
    const transformedRecipe = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.summary?.replace(/<[^>]*>/g, ''), // Remove HTML tags
      image: recipe.image,
      imageType: recipe.imageType,
      servings: recipe.servings,
      readyInMinutes: recipe.readyInMinutes,
      preparationMinutes: recipe.preparationMinutes || 0,
      cookingMinutes: recipe.cookingMinutes || 0,
      sourceUrl: recipe.sourceUrl,
      healthScore: recipe.healthScore,
      spoonacularScore: recipe.spoonacularScore,
      pricePerServing: recipe.pricePerServing / 100, // Convert cents to dollars
      
      // Cuisines & Diets
      cuisines: recipe.cuisines || [],
      dishTypes: recipe.dishTypes || [],
      diets: recipe.diets || [],
      occasions: recipe.occasions || [],
      
      // Ingredients
      ingredients: recipe.extendedIngredients.map(ing => ({
        id: ing.id,
        name: ing.name,
        originalName: ing.original,
        amount: ing.amount,
        unit: ing.unit,
        aisle: ing.aisle,
        image: `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`,
        consistency: ing.consistency,
        meta: ing.meta
      })),
      
      // Instructions
      instructions: parseInstructions(recipe.analyzedInstructions),
      
      // Nutrition
      nutrition: parseNutrition(recipe.nutrition),
      
      // Taste (optional)
      taste: recipe.taste ? {
        sweetness: recipe.taste.sweetness,
        saltiness: recipe.taste.saltiness,
        sourness: recipe.taste.sourness,
        bitterness: recipe.taste.bitterness,
        savoriness: recipe.taste.savoriness,
        fattiness: recipe.taste.fattiness,
        spiciness: recipe.taste.spiciness
      } : null
    };
    
    // Cache for 24 hours (mobile optimization)
    await cacheRecipe(recipeId, transformedRecipe, 86400);
    
    // Track view
    await trackRecipeView(userId, recipeId);
    
    res.json(transformedRecipe);
    
  } catch (error) {
    console.error('Recipe details error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

// Helper function to parse instructions
function parseInstructions(analyzedInstructions) {
  if (!analyzedInstructions || analyzedInstructions.length === 0) {
    return [];
  }
  
  const steps = analyzedInstructions[0].steps || [];
  
  return steps.map(step => ({
    number: step.number,
    instruction: step.step,
    ingredients: step.ingredients.map(ing => ({
      id: ing.id,
      name: ing.name,
      image: `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}`
    })),
    equipment: step.equipment.map(eq => ({
      id: eq.id,
      name: eq.name,
      image: `https://spoonacular.com/cdn/equipment_100x100/${eq.image}`
    })),
    length: step.length ? {
      number: step.length.number,
      unit: step.length.unit
    } : null
  }));
}

// Helper function to parse nutrition
function parseNutrition(nutrition) {
  if (!nutrition) return null;
  
  const nutrients = nutrition.nutrients || [];
  
  return {
    calories: findNutrient(nutrients, 'Calories'),
    fat: findNutrient(nutrients, 'Fat'),
    saturatedFat: findNutrient(nutrients, 'Saturated Fat'),
    carbohydrates: findNutrient(nutrients, 'Carbohydrates'),
    sugar: findNutrient(nutrients, 'Sugar'),
    protein: findNutrient(nutrients, 'Protein'),
    fiber: findNutrient(nutrients, 'Fiber'),
    sodium: findNutrient(nutrients, 'Sodium'),
    cholesterol: findNutrient(nutrients, 'Cholesterol'),
    
    // Vitamins
    vitaminA: findNutrient(nutrients, 'Vitamin A'),
    vitaminC: findNutrient(nutrients, 'Vitamin C'),
    vitaminD: findNutrient(nutrients, 'Vitamin D'),
    vitaminE: findNutrient(nutrients, 'Vitamin E'),
    vitaminK: findNutrient(nutrients, 'Vitamin K'),
    vitaminB6: findNutrient(nutrients, 'Vitamin B6'),
    vitaminB12: findNutrient(nutrients, 'Vitamin B12'),
    
    // Minerals
    calcium: findNutrient(nutrients, 'Calcium'),
    iron: findNutrient(nutrients, 'Iron'),
    magnesium: findNutrient(nutrients, 'Magnesium'),
    potassium: findNutrient(nutrients, 'Potassium'),
    zinc: findNutrient(nutrients, 'Zinc'),
    
    // Properties
    weightPerServing: nutrition.weightPerServing
  };
}

function findNutrient(nutrients, name) {
  const nutrient = nutrients.find(n => n.name === name);
  return nutrient ? {
    amount: nutrient.amount,
    unit: nutrient.unit,
    percentOfDailyNeeds: nutrient.percentOfDailyNeeds
  } : null;
}
```

---

### 4. Personalized Recipe Feed

**Spoonacular Endpoint:**
```
GET https://api.spoonacular.com/recipes/random
```

**Backend Endpoint:**
```
GET /api/recipes/feed
Authorization: Bearer {token}
```

**Backend Implementation:**
```javascript
router.get('/feed', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    
    // Get user preferences
    const userPrefs = await getUserPreferences(userId);
    
    // Check if user is premium
    const isPremium = await checkPremiumStatus(userId);
    
    // Free users: max 12 recipes per day
    // Premium users: unlimited
    if (!isPremium) {
      const todayCount = await getTodayRecipeCount(userId);
      if (todayCount >= 12) {
        return res.json({
          recipes: [],
          message: 'Daily limit reached. Upgrade to Premium for unlimited recipes.',
          isPremium: false,
          limitReached: true
        });
      }
    }
    
    // Fetch personalized recipes from Spoonacular
    const params = {
      number: isPremium ? limit : Math.min(limit, 12),
      tags: userPrefs.diets?.join(',') || '',
      excludeTags: userPrefs.allergies?.join(',') || '',
      apiKey: process.env.SPOONACULAR_API_KEY
    };
    
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/recipes/random`,
      { params }
    );
    
    const recipes = response.data.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      image: recipe.image,
      readyInMinutes: recipe.readyInMinutes,
      servings: recipe.servings,
      healthScore: recipe.healthScore,
      isPremium: false
    }));
    
    // Track daily count for free users
    if (!isPremium) {
      await incrementDailyRecipeCount(userId, recipes.length);
    }
    
    res.json({
      recipes,
      isPremium,
      limitReached: false,
      remainingToday: isPremium ? 'unlimited' : (12 - todayCount - recipes.length)
    });
    
  } catch (error) {
    console.error('Recipe feed error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe feed' });
  }
});
```

---

### 5. Similar Recipes

**Spoonacular Endpoint:**
```
GET https://api.spoonacular.com/recipes/{id}/similar
```

**Backend Endpoint:**
```
GET /api/recipes/:recipeId/similar
Authorization: Bearer {token}
```

**Backend Implementation:**
```javascript
router.get('/:recipeId/similar', authenticateToken, async (req, res) => {
  try {
    const { recipeId } = req.params;
    const { number = 6 } = req.query;
    
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/recipes/${recipeId}/similar`,
      {
        params: {
          number,
          apiKey: process.env.SPOONACULAR_API_KEY
        }
      }
    );
    
    res.json({ similar: response.data });
    
  } catch (error) {
    console.error('Similar recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch similar recipes' });
  }
});
```

---

### 6. Ingredient Parsing & Grocery Lists

**Spoonacular Endpoint:**
```
POST https://api.spoonacular.com/recipes/parseIngredients
```

**Backend Endpoint:**
```
POST /api/recipes/parse-ingredients
Authorization: Bearer {token}
```

**Backend Implementation:**
```javascript
router.post('/parse-ingredients', authenticateToken, async (req, res) => {
  try {
    const { ingredients, servings } = req.body;
    
    const response = await axios.post(
      `${SPOONACULAR_BASE_URL}/recipes/parseIngredients`,
      {
        ingredientList: ingredients.join('\n'),
        servings: servings || 1
      },
      {
        params: {
          apiKey: process.env.SPOONACULAR_API_KEY
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const parsed = response.data.map(ing => ({
      original: ing.original,
      originalName: ing.originalName,
      name: ing.name,
      amount: ing.amount,
      unit: ing.unit,
      unitShort: ing.unitShort,
      aisle: ing.aisle,
      consistency: ing.consistency,
      image: ing.image ? `https://spoonacular.com/cdn/ingredients_100x100/${ing.image}` : null,
      nutrition: ing.nutrition
    }));
    
    res.json({ ingredients: parsed });
    
  } catch (error) {
    console.error('Ingredient parsing error:', error);
    res.status(500).json({ error: 'Failed to parse ingredients' });
  }
});
```

---

### 7. Meal Planning with Spoonacular

**Spoonacular Endpoint:**
```
POST https://api.spoonacular.com/mealplanner/generate
```

**Backend Endpoint:**
```
POST /api/meal-plan/auto-generate
Authorization: Bearer {token}
```

**Backend Implementation:**
```javascript
router.post('/auto-generate', authenticateToken, premiumOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const { timeFrame, targetCalories, diet, exclude } = req.body;
    
    // Get user preferences
    const userPrefs = await getUserPreferences(userId);
    
    const response = await axios.get(
      `${SPOONACULAR_BASE_URL}/mealplanner/generate`,
      {
        params: {
          timeFrame: timeFrame || 'week', // day, week
          targetCalories: targetCalories || 2000,
          diet: diet || userPrefs.diet || '',
          exclude: exclude || userPrefs.allergies?.join(',') || '',
          apiKey: process.env.SPOONACULAR_API_KEY
        }
      }
    );
    
    const mealPlan = response.data;
    
    // Save to database
    await saveMealPlan(userId, mealPlan);
    
    res.json({
      success: true,
      mealPlan: mealPlan,
      nutrients: mealPlan.nutrients
    });
    
  } catch (error) {
    console.error('Meal plan generation error:', error);
    res.status(500).json({ error: 'Failed to generate meal plan' });
  }
});
```

---

## 🥗 Nutritionix API Integration

### 1. Authentication

**API Key Setup:**
```javascript
// Backend .env
NUTRITIONIX_APP_ID=your_app_id
NUTRITIONIX_API_KEY=your_api_key

// Backend API calls
const NUTRITIONIX_BASE_URL = 'https://trackapi.nutritionix.com/v2';
const headers = {
  'x-app-id': process.env.NUTRITIONIX_APP_ID,
  'x-app-key': process.env.NUTRITIONIX_API_KEY,
  'Content-Type': 'application/json'
};
```

---

### 2. Natural Language Nutrition Search

**Nutritionix Endpoint:**
```
POST https://trackapi.nutritionix.com/v2/natural/nutrients
```

**Backend Endpoint:**
```
POST /api/nutrition/analyze
Authorization: Bearer {token}
```

**Backend Implementation:**
```javascript
router.post('/analyze', authenticateToken, async (req, res) => {
  try {
    const { query } = req.body; // e.g., "1 cup of rice and 2 chicken breasts"
    
    const response = await axios.post(
      `${NUTRITIONIX_BASE_URL}/natural/nutrients`,
      { query },
      { headers: {
        'x-app-id': process.env.NUTRITIONIX_APP_ID,
        'x-app-key': process.env.NUTRITIONIX_API_KEY
      }}
    );
    
    const foods = response.data.foods.map(food => ({
      foodName: food.food_name,
      brandName: food.brand_name,
      servingQty: food.serving_qty,
      servingUnit: food.serving_unit,
      servingWeight: food.serving_weight_grams,
      calories: food.nf_calories,
      totalFat: food.nf_total_fat,
      saturatedFat: food.nf_saturated_fat,
      cholesterol: food.nf_cholesterol,
      sodium: food.nf_sodium,
      totalCarbohydrate: food.nf_total_carbohydrate,
      dietaryFiber: food.nf_dietary_fiber,
      sugars: food.nf_sugars,
      protein: food.nf_protein,
      potassium: food.nf_potassium,
      photo: food.photo?.thumb || null
    }));
    
    res.json({ foods });
    
  } catch (error) {
    console.error('Nutrition analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze nutrition' });
  }
});
```

---

### 3. Barcode Lookup (Premium Feature)

**Nutritionix Endpoint:**
```
GET https://trackapi.nutritionix.com/v2/search/item?upc={barcode}
```

**Backend Endpoint:**
```
POST /api/inventory/barcode-scan
Authorization: Bearer {token}
```

**Backend Implementation:**
```javascript
router.post('/barcode-scan', authenticateToken, premiumOnly, async (req, res) => {
  try {
    const { barcode } = req.body;
    
    const response = await axios.get(
      `${NUTRITIONIX_BASE_URL}/search/item`,
      {
        params: { upc: barcode },
        headers: {
          'x-app-id': process.env.NUTRITIONIX_APP_ID,
          'x-app-key': process.env.NUTRITIONIX_API_KEY
        }
      }
    );
    
    const product = response.data.foods[0];
    
    const result = {
      name: product.food_name,
      brandName: product.brand_name,
      servingQty: product.serving_qty,
      servingUnit: product.serving_unit,
      servingWeight: product.serving_weight_grams,
      calories: product.nf_calories,
      nutrition: {
        totalFat: product.nf_total_fat,
        saturatedFat: product.nf_saturated_fat,
        cholesterol: product.nf_cholesterol,
        sodium: product.nf_sodium,
        totalCarbohydrate: product.nf_total_carbohydrate,
        dietaryFiber: product.nf_dietary_fiber,
        sugars: product.nf_sugars,
        protein: product.nf_protein
      },
      photo: product.photo?.thumb || null,
      tags: product.tags || {}
    };
    
    res.json({ product: result });
    
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.error('Barcode scan error:', error);
    res.status(500).json({ error: 'Failed to scan barcode' });
  }
});
```

---

## 📊 Recipe Data Structure

### Complete Recipe Object (Mobile App)

```typescript
interface Recipe {
  // Basic Info
  id: string;
  title: string;
  description: string;
  image: string;
  imageType: string;
  
  // Timing
  readyInMinutes: number;
  preparationMinutes: number;
  cookingMinutes: number;
  servings: number;
  
  // Classification
  cuisines: string[];
  dishTypes: string[];
  diets: string[];
  occasions: string[];
  
  // Health & Cost
  healthScore: number;
  spoonacularScore: number;
  pricePerServing: number;
  
  // Ingredients
  ingredients: Ingredient[];
  
  // Instructions
  instructions: InstructionStep[];
  
  // Nutrition
  nutrition: Nutrition;
  
  // Optional
  taste?: Taste;
  sourceUrl?: string;
  
  // App-specific
  isPremium: boolean;
  isFavorite?: boolean;
}

interface Ingredient {
  id: number;
  name: string;
  originalName: string;
  amount: number;
  unit: string;
  aisle: string;
  image: string;
  consistency: string;
  meta: string[];
}

interface InstructionStep {
  number: number;
  instruction: string;
  ingredients: {
    id: number;
    name: string;
    image: string;
  }[];
  equipment: {
    id: number;
    name: string;
    image: string;
  }[];
  length?: {
    number: number;
    unit: string;
  };
}

interface Nutrition {
  calories: NutrientData;
  fat: NutrientData;
  saturatedFat: NutrientData;
  carbohydrates: NutrientData;
  sugar: NutrientData;
  protein: NutrientData;
  fiber: NutrientData;
  sodium: NutrientData;
  cholesterol: NutrientData;
  
  // Vitamins
  vitaminA: NutrientData;
  vitaminC: NutrientData;
  vitaminD: NutrientData;
  vitaminE: NutrientData;
  vitaminK: NutrientData;
  vitaminB6: NutrientData;
  vitaminB12: NutrientData;
  
  // Minerals
  calcium: NutrientData;
  iron: NutrientData;
  magnesium: NutrientData;
  potassium: NutrientData;
  zinc: NutrientData;
  
  weightPerServing: {
    amount: number;
    unit: string;
  };
}

interface NutrientData {
  amount: number;
  unit: string;
  percentOfDailyNeeds: number;
}

interface Taste {
  sweetness: number;
  saltiness: number;
  sourness: number;
  bitterness: number;
  savoriness: number;
  fattiness: number;
  spiciness: number;
}
```

---

## 🏗️ Backend Architecture

### Recommended Structure

```
backend/
├── config/
│   ├── spoonacular.js      # Spoonacular API config
│   ├── nutritionix.js      # Nutritionix API config
│   └── cache.js            # Redis/cache config
├── routes/
│   ├── recipes.js          # Recipe endpoints
│   ├── nutrition.js        # Nutrition endpoints
│   ├── mealPlanner.js      # Meal planning
│   ├── grocery.js          # Grocery lists
│   └── inventory.js        # Inventory tracking
├── services/
│   ├── spoonacularService.js   # Spoonacular API calls
│   ├── nutritionixService.js   # Nutritionix API calls
│   ├── cacheService.js         # Caching logic
│   └── transformService.js     # Data transformation
├── middleware/
│   ├── auth.js             # JWT authentication
│   ├── premium.js          # Premium user check
│   └── rateLimit.js        # API rate limiting
└── utils/
    ├── recipeParser.js     # Parse recipe data
    └── nutritionParser.js  # Parse nutrition data
```

---

## 📱 Mobile Optimization

### 1. Caching Strategy

**Mobile apps need aggressive caching to reduce data usage:**

```javascript
// Cache configuration
const CACHE_DURATIONS = {
  RECIPE_DETAILS: 24 * 60 * 60,      // 24 hours
  RECIPE_SEARCH: 6 * 60 * 60,        // 6 hours
  NUTRITION_DATA: 7 * 24 * 60 * 60,  // 7 days
  USER_FEED: 1 * 60 * 60,            // 1 hour
  TRENDING: 30 * 60                   // 30 minutes
};

// Redis caching
const redis = require('redis');
const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

async function getCachedRecipe(recipeId) {
  const cached = await client.get(`recipe:${recipeId}`);
  return cached ? JSON.parse(cached) : null;
}

async function cacheRecipe(recipeId, data, duration) {
  await client.setex(
    `recipe:${recipeId}`,
    duration,
    JSON.stringify(data)
  );
}
```

---

### 2. Image Optimization

**Spoonacular provides multiple image sizes:**

```javascript
// Image size options
const IMAGE_SIZES = {
  THUMBNAIL: '90x90',
  SMALL: '240x150',
  MEDIUM: '312x231',
  LARGE: '636x393'
};

// Mobile app should use appropriate sizes
function getRecipeImage(imageName, size = 'MEDIUM') {
  const dimensions = IMAGE_SIZES[size];
  return `https://spoonacular.com/recipeImages/${imageName}-${dimensions}.jpg`;
}

function getIngredientImage(imageName, size = 'SMALL') {
  const dimensions = size === 'SMALL' ? '100x100' : '250x250';
  return `https://spoonacular.com/cdn/ingredients_${dimensions}/${imageName}`;
}
```

---

### 3. Response Compression

**Reduce mobile data usage:**

```javascript
const compression = require('compression');
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6 // Balance between speed and compression
}));
```

---

### 4. Pagination & Infinite Scroll

**Mobile-friendly pagination:**

```javascript
// Mobile optimized pagination
router.get('/search', authenticateToken, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;
  
  // Limit max page size to prevent memory issues on mobile
  const safeLimit = Math.min(parseInt(limit), 20);
  
  const response = await spoonacularAPI.search({
    offset,
    number: safeLimit
  });
  
  res.json({
    recipes: response.results,
    pagination: {
      page: parseInt(page),
      limit: safeLimit,
      total: response.totalResults,
      hasMore: (offset + safeLimit) < response.totalResults
    }
  });
});
```

---

### 5. Offline Support

**Cache critical data for offline access:**

```javascript
// Backend: Include cache headers
router.get('/:recipeId', authenticateToken, async (req, res) => {
  const recipe = await getRecipe(req.params.recipeId);
  
  // Set cache headers for mobile app caching
  res.set({
    'Cache-Control': 'public, max-age=86400', // 24 hours
    'ETag': generateETag(recipe),
    'Last-Modified': recipe.updatedAt
  });
  
  res.json(recipe);
});
```

---

### 6. Data Usage Monitoring

**Track API usage for free vs premium:**

```javascript
async function trackAPIUsage(userId, endpoint, cost) {
  const usage = await APIUsage.findOne({
    where: { userId, date: new Date().toDateString() }
  });
  
  if (usage) {
    usage.requests += 1;
    usage.cost += cost;
    await usage.save();
  } else {
    await APIUsage.create({
      userId,
      date: new Date().toDateString(),
      requests: 1,
      cost
    });
  }
}
```

---

## 🚀 Implementation Guide

### Step 1: Set Up API Keys

1. **Spoonacular:**
   - Sign up at https://spoonacular.com/food-api/console
   - Get API key from dashboard
   - Add to `.env`: `SPOONACULAR_API_KEY=your_key`

2. **Nutritionix:**
   - Sign up at https://www.nutritionix.com/business/api
   - Get App ID and API Key
   - Add to `.env`:
     ```
     NUTRITIONIX_APP_ID=your_app_id
     NUTRITIONIX_API_KEY=your_api_key
     ```

---

### Step 2: Install Dependencies

```bash
npm install axios redis express-rate-limit compression
```

---

### Step 3: Create Services

**spoonacularService.js:**
```javascript
const axios = require('axios');

const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

class SpoonacularService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL: SPOONACULAR_BASE_URL,
      params: { apiKey: this.apiKey }
    });
  }

  async searchRecipes(params) {
    const response = await this.client.get('/recipes/complexSearch', { params });
    return response.data;
  }

  async getRecipeDetails(recipeId) {
    const response = await this.client.get(`/recipes/${recipeId}/information`, {
      params: { includeNutrition: true }
    });
    return response.data;
  }

  async getRandomRecipes(params) {
    const response = await this.client.get('/recipes/random', { params });
    return response.data;
  }

  async getSimilarRecipes(recipeId, number = 6) {
    const response = await this.client.get(`/recipes/${recipeId}/similar`, {
      params: { number }
    });
    return response.data;
  }

  async parseIngredients(ingredientList, servings = 1) {
    const response = await this.client.post('/recipes/parseIngredients', 
      { ingredientList, servings },
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }}
    );
    return response.data;
  }

  async generateMealPlan(params) {
    const response = await this.client.get('/mealplanner/generate', { params });
    return response.data;
  }
}

module.exports = new SpoonacularService(process.env.SPOONACULAR_API_KEY);
```

---

### Step 4: Add TODO Comments to Frontend

**File:** `/screens/recipes/RecipeDetailScreen.tsx`

Add comprehensive TODO for fetching recipe details:

```typescript
// TODO: Fetch recipe details from backend
// Example:
// useEffect(() => {
//   const fetchRecipeDetails = async () => {
//     try {
//       const authToken = localStorage.getItem('authToken');
//       const result = await api.get(`/api/recipes/${recipeId}`, {
//         headers: { 'Authorization': `Bearer ${authToken}` }
//       });
//       
//       const recipe = result.data;
//       setRecipeData({
//         ingredients: recipe.ingredients,
//         instructions: recipe.instructions,
//         nutrition: recipe.nutrition,
//         servings: recipe.servings,
//         readyInMinutes: recipe.readyInMinutes
//       });
//     } catch (error) {
//       console.error('Failed to fetch recipe:', error);
//     }
//   };
//   
//   fetchRecipeDetails();
// }, [recipeId]);
```

---

## 📊 API Cost Optimization

### Cost Comparison

**Spoonacular:**
- Free: 150 req/day = ~4,500 req/month
- Basic ($49/mo): 5,000 req/day = ~150,000 req/month
- Cost per request: ~$0.00033

**Nutritionix:**
- Free: 200 req/day = ~6,000 req/month
- Basic ($19.99/mo): 5,000 req/day = ~150,000 req/month
- Cost per request: ~$0.00013

### Optimization Strategies

1. **Aggressive Caching:** Cache recipe details for 24 hours
2. **Batch Requests:** Combine multiple requests when possible
3. **Lazy Loading:** Load nutrition data only when needed
4. **Free Tier for Testing:** Use free tier during development
5. **Premium Users Only:** Limit some features to premium users

---

## ✅ Implementation Checklist

- [ ] Set up Spoonacular API account
- [ ] Set up Nutritionix API account
- [ ] Configure environment variables
- [ ] Install required npm packages
- [ ] Create SpoonacularService
- [ ] Create NutritionixService
- [ ] Set up Redis for caching
- [ ] Implement recipe search endpoint
- [ ] Implement recipe details endpoint
- [ ] Implement nutrition lookup endpoint
- [ ] Implement barcode scanning endpoint
- [ ] Add caching middleware
- [ ] Add rate limiting
- [ ] Test all endpoints with Postman
- [ ] Add TODO comments to mobile app code
- [ ] Implement mobile app API calls
- [ ] Test mobile data usage
- [ ] Monitor API costs

---

**Ready for mobile app integration!** 🚀📱

This guide provides everything needed to integrate Spoonacular and Nutritionix APIs for a production-ready mobile cooking application.
