# Kitchen Nova - Theme & Notification System

## Overview
This document outlines the theme switching and notification management features implemented in Kitchen Nova.

## Dark Mode Implementation

### Features
- **Three Theme Options:**
  - **Light Mode**: Bright, clean interface optimized for daylight use
  - **Dark Mode**: Dark interface easy on the eyes in low-light environments
  - **System**: Automatically adapts to device/browser theme preferences

### Technical Implementation

#### Theme Context (`/contexts/ThemeContext.tsx`)
- Manages theme state across the entire application
- Persists user preference in localStorage
- Listens to system theme changes using `prefers-color-scheme` media query
- Provides `useTheme()` hook for easy access throughout the app

#### CSS Variables (`/styles/globals.css`)
All colors use CSS custom properties that change based on the `data-theme` attribute:

**Light Mode Colors:**
- Background: `#FFF8F3` (Cream)
- Surface: `#FFFFFF` (White)
- Text Primary: `#2E2E2E` (Charcoal)
- Text Secondary: `#6B6B6B`
- Border: `#E8DDD3`

**Dark Mode Colors:**
- Background: `#1A1A1A`
- Surface: `#2E2E2E`
- Text Primary: `#F5F5F5`
- Text Secondary: `#B0B0B0`
- Border: `#404040`

#### Smooth Transitions
- All color changes animate smoothly with 0.3s ease transitions
- Background, text, and border colors transition seamlessly
- Maintains visual continuity during theme switches

### Components Updated for Dark Mode
All major components now use CSS variables instead of hardcoded colors:
- Card
- Header
- BottomNav
- Input
- ShareModal
- All Auth screens (Login, Signup, etc.)
- Home Screen
- ImageWithFallback

## Notification System

### Features
- **Master Toggle**: Enable/disable all notifications at once
- **Categorized Settings**: Notifications organized by type:
  - **Cooking**: Cooking reminders, timer alerts
  - **General**: Meal planning, grocery reminders, inventory expiry, recipe recommendations
  - **Social**: Community activity (likes, comments, follows)
- **Individual Controls**: Toggle each notification type independently
- **Persistent State**: Preferences saved to localStorage
- **Visual Feedback**: Success toast notifications on changes

### Technical Implementation

#### Notification Context (`/contexts/NotificationContext.tsx`)
- Manages notification preferences state
- Persists settings in localStorage
- Provides `useNotifications()` hook for easy access
- Tracks enabled notification count

#### Notification Settings
7 distinct notification types:
1. Cooking Reminders
2. Timer Alerts
3. Meal Planning
4. Grocery Reminders
5. Inventory Expiry
6. Recipe Recommendations
7. Community Activity

### Integration with Settings
The Settings screen displays real-time notification status:
- Shows number of active notifications when enabled
- Displays "Off" when master toggle is disabled
- Updates dynamically when preferences change

## User Experience

### Theme Switching
1. User navigates to Settings → App Theme
2. Selects desired theme (Light/Dark/System)
3. Theme changes immediately with smooth transitions
4. Preference is saved and persists across sessions
5. System theme users see automatic updates when OS theme changes

### Notification Management
1. User navigates to Settings → Notifications
2. Can toggle master switch to enable/disable all
3. Individual notifications can be toggled when master is on
4. Settings screen shows current notification status
5. All preferences persist across app restarts

## Files Modified/Created

### Created Files
- `/contexts/ThemeContext.tsx` - Theme state management
- `/contexts/NotificationContext.tsx` - Notification state management
- `/screens/AppThemeScreen.tsx` - Theme selection UI
- `/screens/NotificationsScreen.tsx` - Notification preferences UI

### Modified Files
- `/styles/globals.css` - Added dark mode CSS variables and transitions
- `/App.tsx` - Wrapped with ThemeProvider and NotificationProvider
- `/components/Card.tsx` - Uses CSS variables for colors
- `/components/Header.tsx` - Uses CSS variables for colors
- `/components/BottomNav.tsx` - Uses CSS variables for colors
- `/components/Input.tsx` - Uses CSS variables for colors
- `/components/ShareModal.tsx` - Uses CSS variables for colors
- `/components/figma/ImageWithFallback.tsx` - Dark mode compatible fallback
- `/screens/SettingsScreen.tsx` - Integrated theme and notification contexts
- All auth screens - Updated to use CSS variables

## Best Practices

### Adding New Components
When creating new components, always:
1. Use CSS variables instead of hardcoded colors
2. Use `var(--color-surface)` for backgrounds
3. Use `var(--color-text-primary)` for main text
4. Use `var(--color-text-secondary)` for secondary text
5. Use `var(--color-border)` for borders

### Testing Themes
Test both light and dark modes for:
- Readability of all text
- Visibility of borders and dividers
- Proper contrast ratios
- Smooth transitions
- System theme switching (change OS settings)

## Future Enhancements

### Potential Additions
- Custom theme colors
- Scheduled theme switching (auto-dark at night)
- More granular notification timing preferences
- Notification preview/test feature
- Theme preview animations in selection screen
- High contrast mode for accessibility
- Additional notification channels (email, push)
