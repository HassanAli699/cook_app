# Kitchen Nova - Developer Guide

## Quick Start for Dark Mode

### Using the Theme in Components

```tsx
import { useTheme } from '../contexts/ThemeContext';

function MyComponent() {
  const { theme, setTheme, actualTheme } = useTheme();
  
  // theme: 'light' | 'dark' | 'system' (user's selection)
  // actualTheme: 'light' | 'dark' (what's actually applied)
  // setTheme: (theme) => void (change the theme)
  
  return (
    <div>Current theme: {actualTheme}</div>
  );
}
```

### Styling with Theme Colors

**❌ Don't use hardcoded colors:**
```tsx
<div className="bg-white text-black">Bad</div>
```

**✅ Do use CSS variables:**
```tsx
<div className="bg-[var(--color-surface)] text-[var(--color-text-primary)]">Good</div>
```

### Available CSS Variables

#### Background Colors
- `--color-background` - Main app background
- `--color-surface` - Cards, modals, elevated surfaces
- `--color-cream` - Subtle backgrounds, hover states

#### Text Colors
- `--color-text-primary` - Main text
- `--color-text-secondary` - Secondary, muted text

#### UI Colors
- `--color-primary` - Primary brand color (Tomato Orange)
- `--color-primary-hover` - Hover state for primary
- `--color-secondary` - Secondary brand color (Sage Green)
- `--color-border` - Borders and dividers

#### Status Colors
- `--color-success` - Success states
- `--color-warning` - Warning states
- `--color-error` - Error states

#### Premium
- `--color-premium-gold` - Premium features
- `--color-premium-gold-dark` - Premium hover states

### Common Patterns

#### Card Component
```tsx
<div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
  <h3 className="text-[var(--color-text-primary)]">Title</h3>
  <p className="text-[var(--color-text-secondary)]">Description</p>
</div>
```

#### Input Component
```tsx
<input 
  className="bg-[var(--color-surface)] border-2 border-[var(--color-border)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)]"
/>
```

#### Modal Overlay
```tsx
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm">
  <div className="bg-[var(--color-surface)] rounded-t-3xl p-6">
    {/* Modal content */}
  </div>
</div>
```

#### Button
```tsx
{/* Primary */}
<button className="bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]">
  Click me
</button>

{/* Secondary */}
<button className="bg-[var(--color-surface)] text-[var(--color-text-primary)] border border-[var(--color-border)]">
  Cancel
</button>
```

## Using Notifications

### Accessing Notification State

```tsx
import { useNotifications } from '../contexts/NotificationContext';

function MyComponent() {
  const { 
    notifications,     // Array of all notification settings
    masterEnabled,     // Boolean - master toggle state
    toggleMaster,      // Function - toggle all on/off
    toggleNotification, // Function - toggle individual notification
    getEnabledCount    // Function - get count of enabled notifications
  } = useNotifications();
  
  return (
    <div>
      {masterEnabled ? `${getEnabledCount()} notifications enabled` : 'Notifications off'}
    </div>
  );
}
```

### Notification Object Structure

```typescript
interface NotificationSetting {
  id: string;           // Unique identifier
  title: string;        // Display title
  description: string;  // Description text
  enabled: boolean;     // Current state
  category: 'general' | 'cooking' | 'social'; // Category
}
```

### Adding a New Notification Type

Edit `/contexts/NotificationContext.tsx`:

```typescript
const [notifications, setNotifications] = useState<NotificationSetting[]>(() => {
  // ... existing notifications
  {
    id: 'new-notification-type',
    title: 'New Feature',
    description: 'Description of when this notification is sent',
    enabled: true,
    category: 'general'  // or 'cooking' or 'social'
  }
  // ...
});
```

Then add the icon mapping in `/screens/NotificationsScreen.tsx`:

```typescript
const iconMap: Record<string, React.ElementType> = {
  // ... existing mappings
  'new-notification-type': YourIcon,
};
```

## Adding New Screens

### Template for New Screen

```tsx
import React from 'react';
import { Header } from '../components/Header';
import { Card } from '../components/Card';

interface NewScreenProps {
  onNavigate: (screen: string) => void;
}

export function NewScreen({ onNavigate }: NewScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20">
      <Header 
        title="Screen Title"
        onBack={() => onNavigate('back')}
      />
      
      <div className="p-4 space-y-4">
        <Card className="p-6">
          <h3 className="mb-2">Card Title</h3>
          <p className="text-[var(--color-text-secondary)]">
            Card content
          </p>
        </Card>
      </div>
    </div>
  );
}
```

### Checklist for New Screens
- [ ] Use `bg-[var(--color-cream)]` for screen background
- [ ] Use `bg-[var(--color-surface)]` for cards/elevated elements
- [ ] Use text color variables for all text
- [ ] Test in both light and dark modes
- [ ] Add smooth transitions where appropriate
- [ ] Ensure modals use theme colors
- [ ] Check contrast ratios for accessibility

## Testing Dark Mode

### Manual Testing Steps

1. **Light Mode:**
   - Go to Settings → App Theme
   - Select "Light"
   - Verify all screens look correct
   - Check text readability
   - Verify images and icons display

2. **Dark Mode:**
   - Go to Settings → App Theme
   - Select "Dark"
   - Verify all screens adapt correctly
   - Check text remains readable
   - Verify no white flashes or artifacts

3. **System Mode:**
   - Go to Settings → App Theme
   - Select "System"
   - Change your OS theme
   - Verify app updates automatically
   - Test both OS light and dark themes

4. **Transitions:**
   - Switch between themes rapidly
   - Verify smooth 300ms transitions
   - Check for any flickering
   - Ensure no layout shifts

### Visual Checklist

For each screen:
- [ ] Background color adapts
- [ ] Text remains readable (primary and secondary)
- [ ] Borders and dividers visible
- [ ] Cards have proper elevation
- [ ] Buttons have good contrast
- [ ] Input fields are usable
- [ ] Modals/overlays work correctly
- [ ] Icons remain visible
- [ ] Images display properly
- [ ] Gradients maintain effect

## Performance Tips

### Avoid Inline Styles for Theme Colors

**❌ Bad:**
```tsx
<div style={{ backgroundColor: theme === 'dark' ? '#2E2E2E' : '#FFFFFF' }}>
```

**✅ Good:**
```tsx
<div className="bg-[var(--color-surface)]">
```

### Use Memoization for Theme-Heavy Components

```tsx
import { memo } from 'react';

const ThemeAwareComponent = memo(function ThemeAwareComponent({ data }) {
  // Component that doesn't need to re-render on every theme change
  return <div>{data}</div>;
});
```

### Batch Theme Changes

The theme context already handles this, but if you're making multiple state changes alongside theme changes, use React's automatic batching:

```tsx
// These will batch automatically in React 18+
setTheme('dark');
setSomeOtherState(value);
setAnotherState(value);
// Only one re-render
```

## Common Pitfalls

### 1. Using Hardcoded Colors
Always use CSS variables, not hardcoded colors.

### 2. Forgetting Modal Backgrounds
Modals need explicit surface colors:
```tsx
<div className="bg-[var(--color-surface)]">
```

### 3. Not Testing System Mode
Always test that system mode responds to OS changes.

### 4. Transition Conflicts
Don't add transition: all; it conflicts with the global transitions.

### 5. Z-Index Issues in Dark Mode
Dark overlays need proper z-index to prevent stacking issues.

## Debugging

### Theme Not Applying?

1. Check if ThemeProvider wraps your component:
```tsx
// In App.tsx
<ThemeProvider>
  <YourApp />
</ThemeProvider>
```

2. Verify data-theme attribute in DevTools:
```html
<html data-theme="dark">
```

3. Check CSS variable values:
```js
getComputedStyle(document.documentElement)
  .getPropertyValue('--color-surface')
```

### Colors Not Changing?

1. Make sure you're using `var(--color-name)` not hardcoded colors
2. Check if element has inline styles overriding
3. Verify CSS specificity isn't causing issues

### Notifications Not Persisting?

1. Check localStorage in DevTools:
   - `kitchen-nova-notifications`
   - `kitchen-nova-notifications-master`

2. Verify NotificationProvider wraps your app:
```tsx
<NotificationProvider>
  <YourApp />
</NotificationProvider>
```

## Resources

### Color Reference
See `/styles/globals.css` for full color palette

### Context APIs
- `/contexts/ThemeContext.tsx`
- `/contexts/NotificationContext.tsx`
- `/contexts/FavoritesContext.tsx`

### Example Screens
- `/screens/AppThemeScreen.tsx` - Theme selection UI
- `/screens/NotificationsScreen.tsx` - Notification management UI
- `/screens/SettingsScreen.tsx` - Integration example

### Documentation
- `/THEME_AND_NOTIFICATIONS.md` - Feature documentation
- `/IMPLEMENTATION_SUMMARY.md` - Implementation overview
- `/DEVELOPER_GUIDE.md` - This file

## Support

For questions or issues:
1. Check this guide first
2. Review the example screens
3. Inspect the context implementations
4. Test in both light and dark modes
5. Verify CSS variables are being used correctly

---

**Remember:** When in doubt, use CSS variables! 🎨
