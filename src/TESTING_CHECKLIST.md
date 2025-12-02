# Kitchen Nova - Testing Checklist

## 🎨 Dark Mode Testing

### Core Functionality
- [ ] Theme switches immediately when selected
- [ ] Theme preference persists after app reload
- [ ] Smooth 300ms transitions occur on theme change
- [ ] No white flashes or color flickering
- [ ] System mode detects OS theme correctly
- [ ] System mode updates when OS theme changes

### Visual Testing - Light Mode
- [ ] Background color is Cream (#FFF8F3)
- [ ] Card backgrounds are White (#FFFFFF)
- [ ] Primary text is dark and readable
- [ ] Secondary text has appropriate contrast
- [ ] Borders are visible but subtle
- [ ] Shadows appear correctly
- [ ] Images display properly
- [ ] Icons are visible

### Visual Testing - Dark Mode
- [ ] Background color is dark (#1A1A1A)
- [ ] Card backgrounds are elevated (#2E2E2E)
- [ ] Primary text is light and readable (#F5F5F5)
- [ ] Secondary text is muted but visible (#B0B0B0)
- [ ] Borders are visible (#404040)
- [ ] Shadows are darker and appropriate
- [ ] Images display properly
- [ ] Icons remain visible

### Screen-by-Screen Testing

#### Onboarding & Auth Screens
- [ ] OnboardingFlow
- [ ] LoginScreen
- [ ] SignupScreen
- [ ] GoogleOAuthScreen
- [ ] ForgotPasswordScreen
- [ ] ResetLinkSentScreen
- [ ] NewPasswordScreen

#### Main App Screens
- [ ] HomeScreen
  - [ ] Header gradient works in both themes
  - [ ] Search bar is visible
  - [ ] Feature cards display correctly
  - [ ] Quick actions are accessible
  
- [ ] RecipeSuggestionsScreen
  - [ ] Recipe cards readable
  - [ ] Images display properly
  - [ ] Filter buttons work
  - [ ] Text overlays on images visible

- [ ] RecipeDetailScreen
  - [ ] Hero image gradient works
  - [ ] Ingredient list readable
  - [ ] Instructions clear
  - [ ] Action buttons visible

- [ ] CookingAssistantScreen
  - [ ] Timer displays clearly
  - [ ] Step instructions readable
  - [ ] Progress indicator visible
  - [ ] Hands-free modal adapts

- [ ] MealPlannerScreen
  - [ ] Calendar view clear
  - [ ] Meal cards display correctly
  - [ ] Add meal modal works
  - [ ] Empty states visible

- [ ] GroceryManagerScreen
  - [ ] List items readable
  - [ ] Checkboxes work
  - [ ] Categories clear
  - [ ] Add item input visible

- [ ] InventoryTrackerScreen
  - [ ] Inventory items display
  - [ ] Expiry dates visible
  - [ ] Categories work
  - [ ] Storage location clear

- [ ] CommunityFeedScreen
  - [ ] Post cards readable
  - [ ] User avatars visible
  - [ ] Like/comment buttons clear
  - [ ] Filter tabs work

- [ ] PostRecipeScreen
  - [ ] Form inputs visible
  - [ ] Text areas work
  - [ ] Image upload clear
  - [ ] Preview button accessible

- [ ] SettingsScreen
  - [ ] Profile section clear
  - [ ] Setting items readable
  - [ ] Badges visible
  - [ ] Icons display properly
  - [ ] Photo modal works
  - [ ] Dietary modal works

- [ ] NotificationsScreen
  - [ ] Master toggle works
  - [ ] Category headers clear
  - [ ] Individual toggles work
  - [ ] Descriptions readable
  - [ ] Success toast appears

- [ ] AppThemeScreen
  - [ ] Theme options display
  - [ ] Preview card works
  - [ ] Current theme shown
  - [ ] Selection feedback clear

- [ ] FavoritesScreen
  - [ ] Recipe cards display
  - [ ] Heart icons visible
  - [ ] Empty state clear
  - [ ] Categories work

- [ ] ChangePasswordScreen
  - [ ] Form inputs visible
  - [ ] Labels readable
  - [ ] Buttons clear

- [ ] LinkedAccountsScreen
  - [ ] Service cards display
  - [ ] Connection status clear
  - [ ] Buttons visible

#### Component Testing

##### Cards
- [ ] Card backgrounds correct color
- [ ] Card borders visible
- [ ] Card shadows appropriate
- [ ] Hover states work
- [ ] Content readable

##### Buttons
- [ ] Primary buttons stand out
- [ ] Secondary buttons visible
- [ ] Hover states work
- [ ] Disabled states clear
- [ ] Text readable on all variants

##### Inputs
- [ ] Input backgrounds visible
- [ ] Border color appropriate
- [ ] Focus state works
- [ ] Placeholder text visible
- [ ] Error states clear

##### Modals
- [ ] Modal backgrounds correct
- [ ] Overlay visible
- [ ] Content readable
- [ ] Close buttons work
- [ ] Animations smooth

##### Headers
- [ ] Header background appropriate
- [ ] Title text readable
- [ ] Back button visible
- [ ] Action buttons clear

##### Bottom Navigation
- [ ] Nav background correct
- [ ] Icons visible
- [ ] Labels readable
- [ ] Active state clear

## 🔔 Notification Testing

### Core Functionality
- [ ] Master toggle enables all notifications
- [ ] Master toggle disables all notifications
- [ ] Individual toggles work when master is on
- [ ] Individual toggles disabled when master is off
- [ ] Preferences persist after reload
- [ ] Success toast appears on changes
- [ ] Settings badge updates correctly

### Visual Testing
- [ ] Toggle switches animate smoothly
- [ ] Active state clearly visible
- [ ] Disabled state obviously different
- [ ] Category headers stand out
- [ ] Notification icons display
- [ ] Descriptions are readable

### Notification Categories
- [ ] Cooking category displays (2 items)
- [ ] General category displays (4 items)
- [ ] Social category displays (1 item)
- [ ] All 7 notifications present

### Settings Integration
- [ ] Badge shows "X active" when on
- [ ] Badge shows "Off" when master disabled
- [ ] Count updates when notifications toggled
- [ ] Navigation to notifications works

## 🔄 Integration Testing

### Theme + Notifications
- [ ] Both systems work together
- [ ] No context conflicts
- [ ] State updates don't interfere
- [ ] Both persist independently

### Theme + Favorites
- [ ] Favorites work in light mode
- [ ] Favorites work in dark mode
- [ ] Heart animations work in both
- [ ] Count updates correctly

### Navigation Testing
- [ ] All navigation works in light mode
- [ ] All navigation works in dark mode
- [ ] Back buttons work everywhere
- [ ] No broken navigation paths

## 📱 Responsive Testing

### Mobile Viewport (428px max)
- [ ] All content fits properly
- [ ] No horizontal scroll
- [ ] Touch targets adequate size
- [ ] Modals slide up correctly
- [ ] Bottom nav accessible

### Tablet/Desktop
- [ ] Container maintains max-width
- [ ] Centered properly
- [ ] Shadow appears around container
- [ ] All interactions work

## ⚡ Performance Testing

### Theme Switching
- [ ] Light to Dark: < 300ms
- [ ] Dark to Light: < 300ms
- [ ] System mode: Instant detection
- [ ] No janky animations
- [ ] No layout shifts

### Notification Toggles
- [ ] Toggle response: Instant
- [ ] Toast appearance: Smooth
- [ ] State updates: No lag
- [ ] List doesn't jump

### LocalStorage
- [ ] Theme loads instantly on refresh
- [ ] Notifications load instantly
- [ ] No flash of wrong theme
- [ ] No flash of wrong state

## 🎯 Accessibility Testing

### Color Contrast
- [ ] Light mode text: 13:1+ ratio
- [ ] Dark mode text: 12:1+ ratio
- [ ] All UI elements meet WCAG AA
- [ ] Premium features distinguishable

### Keyboard Navigation
- [ ] Tab order logical
- [ ] Focus states visible
- [ ] All buttons reachable
- [ ] Modals escapable

### Screen Reader
- [ ] Theme labels announced
- [ ] Toggle states announced
- [ ] Notifications descriptive
- [ ] Success feedback audible

## 🐛 Edge Cases

### Theme Edge Cases
- [ ] Rapid theme switching works
- [ ] LocalStorage full handling
- [ ] Invalid stored theme handling
- [ ] Missing CSS variables fallback

### Notification Edge Cases
- [ ] Toggling during master off
- [ ] Rapid toggle clicking
- [ ] LocalStorage full handling
- [ ] Invalid stored state handling

### Network Edge Cases
- [ ] Works offline (no API calls)
- [ ] No network errors thrown
- [ ] State persists offline

## 🔒 Security Testing

### Data Persistence
- [ ] Only preferences stored locally
- [ ] No sensitive data in localStorage
- [ ] No PII stored
- [ ] Data clearable by user

### XSS Prevention
- [ ] No eval() usage
- [ ] User input sanitized
- [ ] No dangerouslySetInnerHTML
- [ ] Safe CSS variable usage

## ✅ Final Verification

### Before Launch
- [ ] All checklist items passed
- [ ] No console errors
- [ ] No console warnings (relevant ones)
- [ ] Performance metrics acceptable
- [ ] Accessibility score high
- [ ] User testing complete

### Documentation
- [ ] Developer guide reviewed
- [ ] Theme docs complete
- [ ] Notification docs complete
- [ ] Code comments adequate

### Code Quality
- [ ] TypeScript types complete
- [ ] No any types used
- [ ] Props properly typed
- [ ] Contexts properly typed

---

## Test Results

**Tested By:** _____________  
**Date:** _____________  
**Device:** _____________  
**Browser:** _____________  
**OS:** _____________  

**Overall Status:**  
- [ ] ✅ All tests passed
- [ ] ⚠️  Minor issues found (list below)
- [ ] ❌ Major issues found (list below)

**Issues Found:**
1. _____________
2. _____________
3. _____________

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________
