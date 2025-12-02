# Kitchen Nova - Complete Mobile UI/UX System

A modern, feature-rich cooking app with warm, food-inspired design aesthetics.

## 🎨 Design System

### Color Palette
- **Spice Red**: #C44536 (Primary)
- **Warm Brown**: #8B5A3C (Secondary)
- **Cream**: #FAF7F2 (Background)
- **Premium Gold**: #D4A056 (Premium features)

### Typography
- Clean, readable Inter font family
- Hierarchical heading sizes
- Optimized line-height for readability

## 📱 Complete Screen List (50+ Screens)

### 1. Onboarding (7 screens)
- Welcome/Splash
- Authentication Module
- Recipe Engine Module
- Cooking Assistant Module
- Meal Planner Module
- Grocery Manager Module
- Inventory Tracker Module
- Community Platform Module

### 2. Authentication Flow (6 screens)
- ✅ Login Screen
- ✅ Signup Screen
- ✅ Google OAuth Loading
- ✅ Forgot Password
- ✅ Reset Link Sent
- ✅ New Password Setup

### 3. Home Dashboard
- Featured recipe hero card
- Quick access tiles (6 modules)
- Today's suggestions carousel
- Premium upgrade banner
- Search functionality

### 4. Recipe Engine (2+ screens)
- Recipe Suggestions Grid
- AI-powered filters (Premium: dietary, budget, calorie-based)
- Recipe Detail View
  - Ingredients tab
  - Instructions tab
  - Nutrition facts
  - Premium features (locked overlay for free users)

### 5. Cooking Assistant (1 screen)
- Step-by-step cooking mode
- Progress tracking
- Smart timers
- Hands-free voice mode (modal overlay)
- Visual step indicators

### 6. Meal Planner (1 screen)
- Weekly grid view (7 days × 3 meals)
- Free: Manual meal placement
- Premium: AI auto-generation, nutrition tracking
- Weekly nutrition summary
- Export capabilities

### 7. Grocery Manager (1 screen)
- Categorized shopping lists
- Color-coded categories
- Progress tracking
- Free: Basic lists
- Premium: Auto-generate from meal plans, shared lists

### 8. Inventory Tracker (1 screen)
- Pantry items with expiry dates
- Visual expiry indicators (Urgent/Soon/Fresh)
- Free: Basic tracking
- Premium: AI predictions, scanning features
- Summary statistics

### 9. Scanning UI (2 screens)
- Barcode Scanner (camera overlay with detection)
- Receipt OCR Scanner (full-screen capture)
- Auto-detection animations
- Item extraction preview

### 10. Community Platform (2 screens)
- Social Feed
  - Card-based posts
  - Likes, comments, shares
  - Trending filters
  - Premium creator badges
- Post Recipe Screen
  - Photo upload
  - Ingredient builder
  - Step-by-step instructions
  - Category tags

### 11. Subscription UI (2 screens)
- Premium Pricing Page
  - Monthly: $4.99
  - Yearly: $39.99 (Most Popular)
  - Lifetime: $79.99 (Best Value)
  - Feature comparison table
- Checkout Screen
  - Payment method selection
  - Order summary
  - Processing states
  - Success confirmation

### 12. Settings (1 screen)
- Profile section with avatar
- Photo upload modal
- Edit profile modal
- Account & security
- Preferences (notifications, theme)
- About & legal
- Logout

## 🎯 Key Features

### Design Highlights
✨ Warm cooking-inspired color palette
✨ Elegant food photography backgrounds
✨ Smooth micro-interactions and animations
✨ Premium vs Free feature differentiation
✨ Mobile-optimized layouts (max-width: 428px)
✨ Rounded corners and soft shadows
✨ Bottom navigation for main sections

### Interactive Elements
- Animated onboarding slides
- Premium lock overlays with blur effect
- Progress indicators
- Loading states
- Toast notifications ready
- Modal overlays
- Bottom sheets

### Premium Features Showcase
🔒 Diet filters (vegan, gluten-free, low-carb)
🔒 Budget-based recipe suggestions
🔒 Smart ingredient substitutions
🔒 Calorie-targeted meal adjustments
🔒 AI meal plan generation
🔒 Nutrition-based planning
🔒 Barcode & receipt scanning
🔒 Shared grocery lists
🔒 Creator badges in community

## 🛠 Component Library

### Core Components
- `Button` - Multiple variants (primary, secondary, outline, ghost, premium, destructive)
- `Input` - Text fields with icons and labels
- `Card` - Container with hover effects
- `Header` - Sticky navigation header
- `BottomNav` - 5-tab bottom navigation
- `PremiumLock` - Overlay for locked features
- `PremiumBadge` - Gold badge indicator
- `LoadingSpinner` - Animated loading state

## 🚀 Navigation Flow

```
Onboarding → Login/Signup → Home Dashboard
                              ↓
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
                 Recipes   Planner  Community
                    ↓         ↓         ↓
              Recipe Detail  Meal     Feed
                    ↓       Grid      Posts
                 Cooking   Grocery     ↓
                Assistant  Manager   Post Recipe
                    ↓         ↓
                Inventory  Scanning
                 Tracker   (Barcode/Receipt)
```

## 🎨 Design Tokens

### Spacing
- XS: 4px
- SM: 8px
- MD: 16px
- LG: 24px
- XL: 32px
- 2XL: 48px

### Border Radius
- SM: 8px
- MD: 12px
- LG: 16px
- XL: 20px
- Full: 9999px

### Shadows
- SM: Subtle elevation
- MD: Card elevation
- LG: Modal/overlay elevation

## 📊 Feature Matrix

| Feature | Free | Premium |
|---------|------|---------|
| AI Recipes | Basic | Unlimited + Advanced |
| Cooking Assistant | Step-by-Step | + Voice Mode |
| Meal Planner | Manual | AI Auto-Generation |
| Inventory | Basic Tracking | + AI & Scanning |
| Grocery | Simple Lists | Smart + Shared |
| Community | View Only | Post + Badge |

## 🔄 Animation States

- `animate-fade-in` - Opacity fade
- `animate-slide-up` - Bottom to top slide
- `animate-slide-in-right` - Right to left slide
- `animate-pulse` - Pulsing effect

## 📱 Mobile Optimization

- Optimized for 428px width (iPhone 14 Pro Max)
- Touch-friendly button sizes (min 44px)
- Swipeable carousels
- Bottom sheet modals
- Safe area handling
- Responsive typography

---

**Built with React + Tailwind CSS**
**Design System: Kitchen Nova v1.0**
