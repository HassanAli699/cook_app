# Kitchen Nova - Dark Mode Quick Reference Card

## 🎨 CSS Variables Cheat Sheet

### When to Use Which Variable

```tsx
// ✅ DO: Use CSS variables for all colors

// Backgrounds
<div className="bg-[var(--color-background)]">     // Main app background
<div className="bg-[var(--color-surface)]">        // Cards, modals
<div className="bg-[var(--color-cream)]">          // Subtle backgrounds

// Text
<p className="text-[var(--color-text-primary)]">   // Main text
<p className="text-[var(--color-text-secondary)]"> // Muted text

// Borders
<div className="border-[var(--color-border)]">     // All borders

// Buttons
<button className="bg-[var(--color-primary)]">     // Primary actions
<button className="bg-[var(--color-secondary)]">   // Secondary actions

// Status
<div className="bg-[var(--color-success)]/10">     // Success backgrounds
<div className="bg-[var(--color-warning)]/10">     // Warning backgrounds
<div className="bg-[var(--color-error)]/10">       // Error backgrounds

// Premium
<div className="bg-[var(--color-premium-gold)]/10"> // Premium features
```

## ❌ What NOT to Do

```tsx
// ❌ DON'T use hardcoded colors
<div className="bg-white">              // Will be invisible in dark mode
<div className="bg-gray-200">           // Wrong
<div className="bg-green-100">          // Wrong
<p className="text-black">              // Wrong

// ❌ DON'T use inline styles for theme colors
<div style={{ backgroundColor: '#FFFFFF' }}>  // Wrong
<div style={{ color: '#000000' }}>            // Wrong
```

## ✅ Exceptions (When Hardcoded Colors Are OK)

```tsx
// ✅ White text on dark gradient/image overlays
<div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90">
  <h1 className="text-white">Title</h1>  // OK - on dark background
</div>

// ✅ Brand colors that must remain constant
<button className="bg-[#25D366]">       // OK - WhatsApp brand
  <span className="text-white">Share</span>
</button>

// ✅ Gradient backgrounds with white text
<div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
  <p className="text-white">Content</p>  // OK - always readable
</div>

// ✅ Semantic status colors
const strengthColors = [
  'bg-red-500',      // OK - semantic meaning
  'bg-orange-500',   // OK - semantic meaning
  'bg-yellow-500',   // OK - semantic meaning
  'bg-green-500'     // OK - semantic meaning
];
```

## 🔧 Common Fixes

### Input Fields
```tsx
// ❌ Before
<input className="bg-white border-gray-300 text-black" />

// ✅ After
<input className="bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-primary)]" />
```

### Cards
```tsx
// ❌ Before
<div className="bg-white border-gray-200">

// ✅ After
<div className="bg-[var(--color-surface)] border-[var(--color-border)]">
```

### Hover States
```tsx
// ❌ Before
<button className="hover:bg-gray-100">

// ✅ After
<button className="hover:bg-[var(--color-cream)]">
```

### Category Badges
```tsx
// ❌ Before
const colors = {
  produce: 'bg-green-100 text-green-700',
  dairy: 'bg-blue-100 text-blue-700'
};

// ✅ After
const colors = {
  produce: 'bg-[var(--color-success)]/20 text-[var(--color-success)]',
  dairy: 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
};
```

### Toggle Switches
```tsx
// ❌ Before
<div className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md" />

// ✅ After
<div className="absolute top-1 w-5 h-5 bg-[var(--color-surface)] rounded-full shadow-md" />
```

## 📦 Using Theme Context

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  // theme: what user selected ('light', 'dark', 'system')
  // actualTheme: what's actually applied ('light' or 'dark')
  
  return (
    <div>
      <button onClick={() => setTheme('light')}>Light</button>
      <button onClick={() => setTheme('dark')}>Dark</button>
      <button onClick={() => setTheme('system')}>System</button>
    </div>
  );
}
```

## 🔔 Using Notification Context

```tsx
import { useNotifications } from '../contexts/NotificationContext';

function MyComponent() {
  const { 
    notifications,        // All notification settings
    masterEnabled,        // Master toggle state
    toggleMaster,         // Toggle all notifications
    toggleNotification,   // Toggle individual notification
    getEnabledCount      // Get count of enabled
  } = useNotifications();
  
  return (
    <div>
      <p>{getEnabledCount()} notifications enabled</p>
      <button onClick={toggleMaster}>
        {masterEnabled ? 'Disable All' : 'Enable All'}
      </button>
    </div>
  );
}
```

## 🎯 Testing Checklist

### Quick Visual Test
1. Switch to dark mode
2. Can you read all text? ✅
3. Are buttons visible? ✅
4. Do cards stand out? ✅
5. Are inputs usable? ✅
6. Do modals look good? ✅

### Quick Functional Test
1. Switch themes - smooth transition? ✅
2. Toggle notifications - works? ✅
3. Reload page - preferences saved? ✅
4. Change OS theme - system mode works? ✅

## 🚨 Common Mistakes to Avoid

### 1. Forgetting Modal Backgrounds
```tsx
// ❌ Wrong
<div className="fixed inset-0 bg-black/60">
  <div className="bg-white rounded-xl p-6">  // ← Will be invisible!

// ✅ Correct
<div className="fixed inset-0 bg-black/60">
  <div className="bg-[var(--color-surface)] rounded-xl p-6">
```

### 2. Using Gray Shades
```tsx
// ❌ Wrong
<div className="bg-gray-100">  // Won't adapt
<div className="bg-gray-200">  // Won't adapt
<div className="bg-gray-300">  // Won't adapt

// ✅ Correct
<div className="bg-[var(--color-cream)]">   // Light gray equivalent
<div className="bg-[var(--color-border)]">  // Medium gray equivalent
```

### 3. Hardcoded Text Colors
```tsx
// ❌ Wrong
<h1 className="text-black">
<p className="text-gray-600">

// ✅ Correct
<h1 className="text-[var(--color-text-primary)]">
<p className="text-[var(--color-text-secondary)]">
```

### 4. Status Colors Without Opacity
```tsx
// ❌ Wrong - too bright in dark mode
<div className="bg-green-100">

// ✅ Correct - works in both modes
<div className="bg-[var(--color-success)]/10">
<div className="bg-[var(--color-success)]/20">
```

## 💡 Pro Tips

### 1. Opacity for Subtle Backgrounds
```tsx
<div className="bg-[var(--color-primary)]/5">   // 5% opacity
<div className="bg-[var(--color-primary)]/10">  // 10% opacity
<div className="bg-[var(--color-primary)]/20">  // 20% opacity
```

### 2. Hover State Pattern
```tsx
// Light background → Cream on hover
<button className="bg-[var(--color-surface)] hover:bg-[var(--color-cream)]">

// Transparent → Surface on hover
<button className="hover:bg-[var(--color-surface)]">
```

### 3. Border Pattern
```tsx
// Standard border
<div className="border border-[var(--color-border)]">

// Thicker border
<div className="border-2 border-[var(--color-border)]">

// Colored border with opacity
<div className="border-2 border-[var(--color-primary)]/20">
```

### 4. Shadow Pattern
```tsx
// Use CSS variable shadows (adapt to theme)
<div className="shadow-[var(--shadow-sm)]">
<div className="shadow-[var(--shadow-md)]">
<div className="shadow-[var(--shadow-lg)]">
```

## 📱 Mobile-Specific Considerations

### Safe Areas
```tsx
// Bottom navigation with safe area
<nav className="fixed bottom-0 pb-safe">
```

### Touch Targets
```tsx
// Minimum 44x44px for touch
<button className="w-11 h-11">  // 44px minimum
```

### Modals
```tsx
// Mobile-friendly modal
<div className="fixed inset-0 flex items-end">
  <div className="w-full rounded-t-3xl">  // Slides up from bottom
```

## 🎨 Color Contrast Requirements

### WCAG AA (Minimum)
- Normal text: 4.5:1
- Large text: 3:1
- UI components: 3:1

### WCAG AAA (Enhanced)
- Normal text: 7:1
- Large text: 4.5:1

### Kitchen Nova Achieves
- ✅ Light mode: 13.6:1 (AAA)
- ✅ Dark mode: 12.8:1 (AAA)

## 🔍 Debugging

### Check Current Theme
```tsx
console.log(document.documentElement.dataset.theme);  // 'light' or 'dark'
```

### Check CSS Variable Value
```tsx
const value = getComputedStyle(document.documentElement)
  .getPropertyValue('--color-surface');
console.log(value);  // Current color value
```

### Force Theme for Testing
```tsx
document.documentElement.dataset.theme = 'dark';  // Test dark mode
document.documentElement.dataset.theme = 'light'; // Test light mode
```

---

## 📚 Need More Help?

- **Full Documentation:** `/THEME_AND_NOTIFICATIONS.md`
- **Developer Guide:** `/DEVELOPER_GUIDE.md`
- **Implementation Details:** `/IMPLEMENTATION_SUMMARY.md`
- **Testing Guide:** `/TESTING_CHECKLIST.md`
- **Complete Report:** `/FINAL_DARK_MODE_REPORT.md`

---

**Keep this card handy when developing new features!** 🚀
