# 🔧 Complete Backend Integration TODO Checklist - Kitchen Nova

## 📌 Overview
This document provides a comprehensive checklist of ALL features in the Kitchen Nova app that require backend integration. Each section includes file locations, function names, and API endpoint specifications.

---

## ✅ Already Completed (With TODO Comments)

### 1. Authentication ✅
- [x] Google OAuth (`/screens/auth/GoogleAuthScreen.tsx`)
- [x] Email/Password Login (`/screens/auth/LoginScreen.tsx`)
- [x] Signup (`/screens/auth/SignupScreen.tsx`)
- [x] Forgot Password (`/screens/auth/ForgotPasswordScreen.tsx`)
- [x] Resend Reset Link (`/screens/auth/ResetLinkSentScreen.tsx`)
- [x] Reset Password (`/screens/auth/NewPasswordScreen.tsx`)
- [x] Change Password (`/screens/ChangePasswordScreen.tsx`)

### 2. User Profile ✅
- [x] Fetch Profile Data (`/screens/SettingsScreen.tsx`)
- [x] Update Profile (`/screens/SettingsScreen.tsx` - `handleSaveProfile`)
- [x] Update Profile Photo (`/screens/SettingsScreen.tsx` - `handlePhotoSelect`)
- [x] Dietary Preferences (`/screens/SettingsScreen.tsx` - `handleSaveDietaryPreferences`)

### 3. Notification Preferences ✅
- [x] Fetch Notifications (`/contexts/NotificationContext.tsx`)
- [x] Toggle Master Notification (`/contexts/NotificationContext.tsx` - `toggleMaster`)
- [x] Toggle Individual Notification (`/contexts/NotificationContext.tsx` - `toggleNotification`)
- [x] Enable All Notifications (`/contexts/NotificationContext.tsx` - `enableAllNotifications`)
- [x] Disable All Notifications (`/contexts/NotificationContext.tsx` - `disableAllNotifications`)

### 4. Favorites ✅
- [x] Fetch Favorites (`/contexts/FavoritesContext.tsx`)
- [x] Add to Favorites (`/contexts/FavoritesContext.tsx` - `addToFavorites`)
- [x] Remove from Favorites (`/contexts/FavoritesContext.tsx` - `removeFromFavorites`)

### 5. Recipe Suggestions ✅
- [x] Fetch Recipes (`/screens/recipes/RecipeSuggestionsScreen.tsx`)
- [x] Infinite Scroll (Premium) (`/screens/recipes/RecipeSuggestionsScreen.tsx` - `loadMoreRecipes`)
- [x] Search & Filter Recipes (`/screens/recipes/RecipeSuggestionsScreen.tsx`)

---

## 🔨 Needs Backend Integration

### 6. Home Screen / Recipe Feed

**File:** `/screens/HomeScreen.tsx`

**Features:**
- Fetch personalized recipe feed based on user preferences
- Fetch daily tips
- Fetch quick actions
- Fetch trending recipes

**API Endpoints:**
```
GET /api/recipes/feed
GET /api/tips/daily
GET /api/recipes/trending
```

**Example:**
```typescript
// Fetch personalized feed
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/recipes/feed', {
  headers: { 'Authorization': `Bearer ${authToken}` },
  params: {
    page: 1,
    limit: 10,
    dietaryPreferences: user.dietaryPreferences
  }
});
```

---

### 7. Recipe Detail Screen

**File:** `/screens/recipes/RecipeDetailScreen.tsx`

**Features:**
- Fetch full recipe details
- Fetch nutrition information
- Fetch ingredient list
- Fetch cooking instructions
- Fetch reviews/ratings

**API Endpoints:**
```
GET /api/recipes/:recipeId
GET /api/recipes/:recipeId/nutrition
GET /api/recipes/:recipeId/reviews
POST /api/recipes/:recipeId/reviews (submit review)
```

**Example:**
```typescript
// Fetch recipe details
const authToken = localStorage.getItem('authToken');
const result = await api.get(`/api/recipes/${recipeId}`, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

const recipe = result.data;
// {
//   id, title, description, image,
//   ingredients: [{name, quantity, unit}],
//   instructions: [{ step, description, time }],
//   nutrition: { calories, protein, carbs, fat },
//   time, difficulty, rating, reviews
// }
```

---

### 8. Meal Planner

**File:** `/screens/planner/MealPlannerScreen.tsx`

**Features:**
- Fetch weekly meal plan
- Add recipe to meal plan
- Remove recipe from meal plan
- Auto-generate meal plan (Premium)
- Update meal plan
- Fetch nutrition summary

**API Endpoints:**
```
GET /api/meal-plan/weekly
POST /api/meal-plan/add
DELETE /api/meal-plan/:mealId
POST /api/meal-plan/auto-generate (Premium)
GET /api/meal-plan/nutrition-summary
```

**Example:**
```typescript
// Fetch weekly meal plan
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/meal-plan/weekly', {
  headers: { 'Authorization': `Bearer ${authToken}` },
  params: {
    startDate: '2024-12-01'
  }
});

// Add recipe to meal plan
await api.post('/api/meal-plan/add', {
  recipeId: '123',
  day: 'Monday',
  mealType: 'Breakfast',
  date: '2024-12-02'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Auto-generate (Premium)
await api.post('/api/meal-plan/auto-generate', {
  startDate: '2024-12-01',
  preferences: {
    calories: 2000,
    dietary: ['vegetarian'],
    avoidIngredients: ['peanuts']
  }
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

**LocalStorage Keys:**
- `kitchen-nova-meal-plan-{userId}` - Meal plan data
- `kitchen-nova-meal-plan-nutrition-{userId}` - Nutrition summary

---

### 9. Grocery Manager

**File:** `/screens/grocery/GroceryManagerScreen.tsx`

**Features:**
- Fetch grocery lists
- Create new grocery list
- Add items to list
- Remove items from list
- Toggle item completion
- Import from meal plan
- Smart deduplication
- Share lists (Premium)

**API Endpoints:**
```
GET /api/grocery/lists
POST /api/grocery/lists (create list)
POST /api/grocery/lists/:listId/items (add item)
DELETE /api/grocery/lists/:listId/items/:itemId
PUT /api/grocery/lists/:listId/items/:itemId (toggle completion)
POST /api/grocery/from-meal-plan (import from meal plan)
POST /api/grocery/lists/:listId/share (Premium)
```

**Example:**
```typescript
// Fetch grocery lists
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/grocery/lists', {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Create new list
await api.post('/api/grocery/lists', {
  name: 'Weekly Shopping',
  date: '2024-12-01'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Add item
await api.post(`/api/grocery/lists/${listId}/items`, {
  name: 'Tomatoes',
  quantity: '2 lbs',
  category: 'Produce'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Import from meal plan
await api.post('/api/grocery/from-meal-plan', {
  startDate: '2024-12-01',
  endDate: '2024-12-07'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

**LocalStorage Keys:**
- `kitchen-nova-grocery-lists-{userId}` - Grocery lists data

---

### 10. Inventory Tracker

**File:** `/screens/inventory/InventoryTrackerScreen.tsx`

**Features:**
- Fetch inventory items
- Add inventory item
- Update item quantity
- Delete item
- Barcode scan (Premium)
- Receipt OCR (Premium)
- Expiry tracking
- AI predictions (Premium)

**API Endpoints:**
```
GET /api/inventory/items
POST /api/inventory/items (add item)
PUT /api/inventory/items/:itemId (update quantity)
DELETE /api/inventory/items/:itemId
POST /api/inventory/barcode-scan (Premium)
POST /api/inventory/receipt-scan (Premium)
GET /api/inventory/expiring-soon
POST /api/inventory/ai-predict (Premium)
```

**Example:**
```typescript
// Fetch inventory
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/inventory/items', {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Add item
await api.post('/api/inventory/items', {
  name: 'Milk',
  quantity: 2,
  unit: 'gallons',
  category: 'Dairy',
  expiryDate: '2024-12-15',
  location: 'Fridge'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Barcode scan (Premium)
await api.post('/api/inventory/barcode-scan', {
  barcode: '012345678901'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Receipt OCR (Premium)
const formData = new FormData();
formData.append('receipt', receiptImage);
await api.post('/api/inventory/receipt-scan', formData, {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'multipart/form-data'
  }
});
```

**LocalStorage Keys:**
- `kitchen-nova-inventory-{userId}` - Inventory data

---

### 11. Cooking Assistant

**File:** `/screens/cooking/CookingAssistantScreen.tsx`

**Features:**
- Start cooking session
- Fetch recipe steps
- Update step completion
- Manage timers
- Voice mode (Premium)
- Smart timers (Premium)

**API Endpoints:**
```
POST /api/cooking/sessions (start session)
GET /api/cooking/sessions/:sessionId
PUT /api/cooking/sessions/:sessionId/step (update progress)
POST /api/cooking/sessions/:sessionId/complete
POST /api/cooking/timers (create timer)
DELETE /api/cooking/timers/:timerId
```

**Example:**
```typescript
// Start cooking session
const authToken = localStorage.getItem('authToken');
const result = await api.post('/api/cooking/sessions', {
  recipeId: '123',
  servings: 4
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

const sessionId = result.data.sessionId;

// Update step progress
await api.put(`/api/cooking/sessions/${sessionId}/step`, {
  stepIndex: 2,
  completed: true
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Create timer
await api.post('/api/cooking/timers', {
  sessionId: sessionId,
  duration: 600, // 10 minutes in seconds
  label: 'Boil pasta'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

---

### 12. Community Feed

**File:** `/screens/community/CommunityFeedScreen.tsx`

**Features:**
- Fetch community posts
- Infinite scroll
- Like/unlike posts
- Comment on posts
- Follow users
- Filter by "My Posts"

**API Endpoints:**
```
GET /api/community/posts
POST /api/community/posts/:postId/like
DELETE /api/community/posts/:postId/like
POST /api/community/posts/:postId/comments
POST /api/community/users/:userId/follow
DELETE /api/community/users/:userId/follow
GET /api/community/my-posts
```

**Example:**
```typescript
// Fetch community posts
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/community/posts', {
  headers: { 'Authorization': `Bearer ${authToken}` },
  params: {
    page: 1,
    limit: 10,
    filter: 'all' // or 'following', 'my-posts'
  }
});

// Like post
await api.post(`/api/community/posts/${postId}/like`, {}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Comment on post
await api.post(`/api/community/posts/${postId}/comments`, {
  text: 'Great recipe!'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Follow user
await api.post(`/api/community/users/${userId}/follow`, {}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

---

### 13. Post Recipe (Community)

**File:** `/screens/community/PostRecipeScreen.tsx`

**Features:**
- Create new recipe post
- Upload recipe photo
- Add ingredients
- Add instructions
- Add tags/categories

**API Endpoints:**
```
POST /api/community/posts (create post)
POST /api/community/posts/upload-image (upload photo)
```

**Example:**
```typescript
// Upload recipe photo
const authToken = localStorage.getItem('authToken');
const formData = new FormData();
formData.append('photo', photoFile);

const uploadResult = await api.post('/api/community/posts/upload-image', formData, {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'multipart/form-data'
  }
});

const photoUrl = uploadResult.data.url;

// Create post
await api.post('/api/community/posts', {
  title: 'Amazing Pasta Recipe',
  description: 'Perfect for weeknight dinners',
  photoUrl: photoUrl,
  ingredients: ['Pasta', 'Tomatoes', 'Garlic'],
  instructions: ['Boil pasta', 'Make sauce', 'Combine'],
  tags: ['pasta', 'italian', 'easy'],
  cookTime: 30,
  servings: 4
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

---

### 14. Subscription Management

**File:** `/screens/subscription/SubscriptionScreen.tsx`  
**File:** `/screens/subscription/CheckoutScreen.tsx`

**Features:**
- Fetch subscription status
- Fetch plan details
- Subscribe to premium
- Cancel subscription
- Payment processing
- Restore purchases

**API Endpoints:**
```
GET /api/subscription/status
GET /api/subscription/plans
POST /api/subscription/subscribe
POST /api/subscription/cancel
POST /api/subscription/restore
POST /api/payments/create-intent (Stripe/PayPal)
POST /api/payments/confirm
```

**Example:**
```typescript
// Fetch subscription status
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/subscription/status', {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

const { isPremium, plan, expiryDate } = result.data;

// Subscribe to premium
await api.post('/api/subscription/subscribe', {
  plan: 'premium-annual',
  paymentMethod: 'stripe',
  paymentToken: 'tok_xxx'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Cancel subscription
await api.post('/api/subscription/cancel', {}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

---

### 15. Theme Settings

**File:** `/contexts/ThemeContext.tsx`

**Features:**
- Fetch user theme preference
- Update theme preference

**API Endpoints:**
```
GET /api/user/preferences/theme
PUT /api/user/preferences/theme
```

**Example:**
```typescript
// Fetch theme preference
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/user/preferences/theme', {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

const theme = result.data.theme; // 'light' or 'dark'

// Update theme
await api.put('/api/user/preferences/theme', {
  theme: 'dark'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

**LocalStorage Keys:**
- `kitchen-nova-theme` - Theme preference

---

### 16. Barcode Scanner

**File:** `/screens/scanning/BarcodeScannerScreen.tsx`

**Features:**
- Scan barcode
- Fetch product information
- Add scanned item to inventory

**API Endpoints:**
```
POST /api/products/barcode-lookup
```

**Example:**
```typescript
// Lookup barcode
const authToken = localStorage.getItem('authToken');
const result = await api.post('/api/products/barcode-lookup', {
  barcode: '012345678901'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

const product = result.data;
// {
//   name: 'Whole Milk',
//   brand: 'Organic Valley',
//   category: 'Dairy',
//   size: '1 gallon',
//   nutrition: { calories, protein, fat }
// }
```

---

### 17. Receipt Scanner

**File:** `/screens/scanning/ReceiptScannerScreen.tsx`

**Features:**
- Scan receipt (camera or upload)
- OCR processing
- Extract items from receipt
- Add items to inventory

**API Endpoints:**
```
POST /api/receipts/scan (upload receipt)
GET /api/receipts/:receiptId/status (processing status)
GET /api/receipts/:receiptId/items (extracted items)
```

**Example:**
```typescript
// Upload receipt
const authToken = localStorage.getItem('authToken');
const formData = new FormData();
formData.append('receipt', receiptImage);

const uploadResult = await api.post('/api/receipts/scan', formData, {
  headers: {
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'multipart/form-data'
  }
});

const receiptId = uploadResult.data.receiptId;

// Poll for processing status
const statusResult = await api.get(`/api/receipts/${receiptId}/status`, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Get extracted items
const itemsResult = await api.get(`/api/receipts/${receiptId}/items`, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

const items = itemsResult.data.items;
// [{ name, quantity, price, category }]
```

---

### 18. Linked Accounts

**File:** `/screens/LinkedAccountsScreen.tsx`

**Features:**
- Fetch linked accounts
- Link Google account
- Unlink Google account

**API Endpoints:**
```
GET /api/user/linked-accounts
POST /api/user/linked-accounts/google
DELETE /api/user/linked-accounts/google
```

**Example:**
```typescript
// Fetch linked accounts
const authToken = localStorage.getItem('authToken');
const result = await api.get('/api/user/linked-accounts', {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

const linkedAccounts = result.data.accounts;
// [{ provider: 'google', email: 'user@gmail.com', linkedAt: '2024-01-01' }]

// Link Google account
await api.post('/api/user/linked-accounts/google', {
  googleToken: 'google_oauth_token'
}, {
  headers: { 'Authorization': `Bearer ${authToken}` }
});

// Unlink Google account
await api.delete('/api/user/linked-accounts/google', {
  headers: { 'Authorization': `Bearer ${authToken}` }
});
```

---

## 📊 Complete API Endpoint Summary

### Authentication
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/auth/google` | Google OAuth login | ✅ TODO Added |
| POST | `/api/auth/login` | Email/password login | ✅ TODO Added |
| POST | `/api/auth/signup` | Create new account | ✅ TODO Added |
| POST | `/api/auth/forgot-password` | Send reset email | ✅ TODO Added |
| POST | `/api/auth/resend-reset-link` | Resend reset email | ✅ TODO Added |
| POST | `/api/auth/reset-password` | Reset password | ✅ TODO Added |
| POST | `/api/auth/change-password` | Change password | ✅ TODO Added |

### User Profile
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/user/profile` | Fetch user profile | ✅ TODO Added |
| PUT | `/api/user/profile` | Update profile | ✅ TODO Added |
| POST | `/api/user/profile-photo` | Upload profile photo | ✅ TODO Added |
| PUT | `/api/user/dietary-preferences` | Update dietary prefs | ✅ TODO Added |
| GET | `/api/user/linked-accounts` | Fetch linked accounts | ⏳ Needs TODO |
| POST | `/api/user/linked-accounts/google` | Link Google | ⏳ Needs TODO |
| DELETE | `/api/user/linked-accounts/google` | Unlink Google | ⏳ Needs TODO |

### Notifications
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/user/notifications` | Fetch notification settings | ✅ TODO Added |
| PUT | `/api/user/notifications/master` | Toggle master | ✅ TODO Added |
| PUT | `/api/user/notifications/{id}` | Toggle individual | ✅ TODO Added |
| PUT | `/api/user/notifications/enable-all` | Enable all | ✅ TODO Added |
| PUT | `/api/user/notifications/disable-all` | Disable all | ✅ TODO Added |

### Favorites
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/user/favorites` | Fetch favorites | ✅ TODO Added |
| POST | `/api/user/favorites` | Add to favorites | ✅ TODO Added |
| DELETE | `/api/user/favorites/:recipeId` | Remove from favorites | ✅ TODO Added |

### Recipes
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/recipes/feed` | Personalized feed | ⏳ Needs TODO |
| GET | `/api/recipes/suggestions` | AI suggestions | ✅ TODO Added |
| GET | `/api/recipes/:recipeId` | Recipe details | ⏳ Needs TODO |
| GET | `/api/recipes/:recipeId/nutrition` | Nutrition info | ⏳ Needs TODO |
| GET | `/api/recipes/:recipeId/reviews` | Recipe reviews | ⏳ Needs TODO |
| POST | `/api/recipes/:recipeId/reviews` | Submit review | ⏳ Needs TODO |
| GET | `/api/recipes/trending` | Trending recipes | ⏳ Needs TODO |
| GET | `/api/tips/daily` | Daily tips | ⏳ Needs TODO |

### Meal Planner
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/meal-plan/weekly` | Fetch meal plan | ⏳ Needs TODO |
| POST | `/api/meal-plan/add` | Add recipe to plan | ⏳ Needs TODO |
| DELETE | `/api/meal-plan/:mealId` | Remove from plan | ⏳ Needs TODO |
| POST | `/api/meal-plan/auto-generate` | Auto-generate (Premium) | ⏳ Needs TODO |
| GET | `/api/meal-plan/nutrition-summary` | Nutrition summary | ⏳ Needs TODO |

### Grocery Manager
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/grocery/lists` | Fetch grocery lists | ⏳ Needs TODO |
| POST | `/api/grocery/lists` | Create new list | ⏳ Needs TODO |
| POST | `/api/grocery/lists/:listId/items` | Add item | ⏳ Needs TODO |
| DELETE | `/api/grocery/lists/:listId/items/:itemId` | Remove item | ⏳ Needs TODO |
| PUT | `/api/grocery/lists/:listId/items/:itemId` | Toggle completion | ⏳ Needs TODO |
| POST | `/api/grocery/from-meal-plan` | Import from meal plan | ⏳ Needs TODO |
| POST | `/api/grocery/lists/:listId/share` | Share list (Premium) | ⏳ Needs TODO |

### Inventory Tracker
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/inventory/items` | Fetch inventory | ⏳ Needs TODO |
| POST | `/api/inventory/items` | Add item | ⏳ Needs TODO |
| PUT | `/api/inventory/items/:itemId` | Update quantity | ⏳ Needs TODO |
| DELETE | `/api/inventory/items/:itemId` | Delete item | ⏳ Needs TODO |
| POST | `/api/inventory/barcode-scan` | Barcode scan (Premium) | ⏳ Needs TODO |
| POST | `/api/inventory/receipt-scan` | Receipt OCR (Premium) | ⏳ Needs TODO |
| GET | `/api/inventory/expiring-soon` | Expiring items | ⏳ Needs TODO |
| POST | `/api/inventory/ai-predict` | AI predictions (Premium) | ⏳ Needs TODO |

### Cooking Assistant
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/cooking/sessions` | Start cooking session | ⏳ Needs TODO |
| GET | `/api/cooking/sessions/:sessionId` | Get session details | ⏳ Needs TODO |
| PUT | `/api/cooking/sessions/:sessionId/step` | Update step progress | ⏳ Needs TODO |
| POST | `/api/cooking/sessions/:sessionId/complete` | Complete session | ⏳ Needs TODO |
| POST | `/api/cooking/timers` | Create timer | ⏳ Needs TODO |
| DELETE | `/api/cooking/timers/:timerId` | Delete timer | ⏳ Needs TODO |

### Community
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/community/posts` | Fetch posts | ⏳ Needs TODO |
| POST | `/api/community/posts` | Create post (Premium) | ⏳ Needs TODO |
| POST | `/api/community/posts/upload-image` | Upload photo | ⏳ Needs TODO |
| POST | `/api/community/posts/:postId/like` | Like post | ⏳ Needs TODO |
| DELETE | `/api/community/posts/:postId/like` | Unlike post | ⏳ Needs TODO |
| POST | `/api/community/posts/:postId/comments` | Comment on post | ⏳ Needs TODO |
| POST | `/api/community/users/:userId/follow` | Follow user | ⏳ Needs TODO |
| DELETE | `/api/community/users/:userId/follow` | Unfollow user | ⏳ Needs TODO |
| GET | `/api/community/my-posts` | Fetch my posts | ⏳ Needs TODO |

### Subscription
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/subscription/status` | Fetch subscription status | ⏳ Needs TODO |
| GET | `/api/subscription/plans` | Fetch plan details | ⏳ Needs TODO |
| POST | `/api/subscription/subscribe` | Subscribe to premium | ⏳ Needs TODO |
| POST | `/api/subscription/cancel` | Cancel subscription | ⏳ Needs TODO |
| POST | `/api/subscription/restore` | Restore purchases | ⏳ Needs TODO |
| POST | `/api/payments/create-intent` | Create payment intent | ⏳ Needs TODO |
| POST | `/api/payments/confirm` | Confirm payment | ⏳ Needs TODO |

### Scanning
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| POST | `/api/products/barcode-lookup` | Lookup barcode | ⏳ Needs TODO |
| POST | `/api/receipts/scan` | Upload receipt | ⏳ Needs TODO |
| GET | `/api/receipts/:receiptId/status` | Processing status | ⏳ Needs TODO |
| GET | `/api/receipts/:receiptId/items` | Extracted items | ⏳ Needs TODO |

### Preferences
| Method | Endpoint | Description | Status |
|--------|----------|-------------|--------|
| GET | `/api/user/preferences/theme` | Fetch theme | ⏳ Needs TODO |
| PUT | `/api/user/preferences/theme` | Update theme | ⏳ Needs TODO |

---

## 🗄️ LocalStorage Keys Reference

| Key | Description | Usage |
|-----|-------------|-------|
| `authToken` | JWT authentication token | All authenticated requests |
| `user` | User profile data | Profile screens |
| `isAuthenticated` | Authentication status | Route guards |
| `authMethod` | Login method (email/google) | Authentication flows |
| `googleUser` | Google OAuth user data | Profile sync |
| `userProfilePhoto` | Profile photo URL | Profile display |
| `kitchen-nova-theme` | Theme preference | Theme provider |
| `kitchen-nova-notifications-master` | Master notification toggle | Notification settings |
| `kitchen-nova-notifications` | Individual notification settings | Notification settings |
| `kitchen-nova-meal-plan-{userId}` | Meal plan data | Meal planner |
| `kitchen-nova-meal-plan-nutrition-{userId}` | Nutrition summary | Meal planner |
| `kitchen-nova-grocery-lists-{userId}` | Grocery lists | Grocery manager |
| `kitchen-nova-inventory-{userId}` | Inventory items | Inventory tracker |

---

## 🎯 Implementation Priority

### High Priority (Core Features)
1. ✅ Authentication (Complete)
2. ✅ User Profile (Complete)
3. ✅ Favorites (Complete)
4. ⏳ Recipe Feed & Details
5. ⏳ Meal Planner
6. ⏳ Grocery Manager

### Medium Priority (Enhanced Features)
7. ⏳ Inventory Tracker
8. ⏳ Community Feed
9. ⏳ Subscription Management
10. ⏳ Cooking Assistant

### Low Priority (Premium Features)
11. ⏳ Barcode Scanner
12. ⏳ Receipt Scanner
13. ⏳ AI Predictions
14. ⏳ Voice Mode

---

## 📝 Notes

- All endpoints require `Authorization: Bearer {token}` header except public endpoints
- Premium features should return 403 if user is not premium
- Use consistent error response format across all endpoints
- Implement rate limiting on all endpoints
- Use pagination for list endpoints
- Validate all inputs on backend
- Log all API calls for monitoring
- Use HTTPS in production
- Implement request/response compression
- Set up proper CORS policies

---

**Last Updated:** December 2024  
**Version:** 1.0.0  
**Total Endpoints:** 80+  
**Completed:** 20 (✅ TODO Comments Added)  
**Remaining:** 60+ (⏳ Need Implementation)
