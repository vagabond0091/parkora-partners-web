# Theme Configuration Guide

This theme system allows you to easily change colors, gradients, and styling across the entire application.

## Quick Start

All theme values are centralized in `src/theme/theme.ts`. Simply update the class strings to change the theme.

## Changing Colors

### 1. Change Primary Gradient Colors

To change the main brand colors (buttons, text gradients, etc.), update the gradient classes:

```typescript
// Current (orange/pink/purple):
primaryButton: 'bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600'

// Change to blue/cyan/indigo:
primaryButton: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600'
```

**Important:** Make sure to update ALL related gradient classes:
- `primaryButton`
- `primaryButtonHover`
- `primaryText`
- `primaryBackground`
- `decorativeCircle1`
- `decorativeCircle2`

### 2. Change Background Colors

Update the background color in the `colors` section:

```typescript
// Current:
bgDefault: 'bg-gray-50'

// Change to:
bgDefault: 'bg-blue-50'  // Light blue background
// or
bgDefault: 'bg-slate-100'  // Light slate background
```

### 3. Change Shadow Colors

Update shadow colors to match your theme:

```typescript
// Current:
card: 'shadow-xl shadow-purple-900/5'

// Change to:
card: 'shadow-xl shadow-blue-900/5'  // Blue shadows
```

## Available Tailwind Colors

You can use any Tailwind color:
- **Warm**: red, orange, amber, yellow
- **Cool**: blue, cyan, teal, indigo, violet
- **Neutral**: gray, slate, zinc, stone
- **Accent**: pink, purple, fuchsia, rose

## Available Shades

Each color has shades from 50 (lightest) to 950 (darkest):
- Light backgrounds: 50, 100, 200
- Base colors: 400, 500, 600
- Dark accents: 700, 800, 900

## Example: Complete Theme Change

To change from orange/pink/purple to blue/cyan/indigo:

1. **Update gradients:**
```typescript
primaryButton: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600',
primaryButtonHover: 'hover:from-blue-600 hover:via-cyan-600 hover:to-indigo-700',
primaryText: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-600 bg-clip-text text-transparent',
primaryBackground: 'bg-gradient-to-br from-blue-100 via-cyan-100 to-indigo-200',
```

2. **Update shadows:**
```typescript
card: 'shadow-xl shadow-indigo-900/5',
button: 'shadow-lg shadow-indigo-500/30',
```

3. **Update focus rings:**
```typescript
purple: 'focus:ring-indigo-500',
```

## Using the Theme

### Option 1: Use utility functions (Recommended)
```tsx
import { getPrimaryButtonClasses, getCardClasses } from '@/theme';

<Button className={getPrimaryButtonClasses()}>Click me</Button>
```

### Option 2: Use theme object directly
```tsx
import { theme } from '@/theme';

<div className={theme.colors.bgDefault}>Content</div>
```

## Benefits

✅ **Single source of truth** - Change colors in one place  
✅ **Consistent styling** - All components use the same theme  
✅ **Easy updates** - Modify theme.ts to update entire app  
✅ **Type-safe** - TypeScript ensures correct usage  

## Future Enhancements

For more advanced theming (dark mode, multiple themes, runtime switching), consider:
- Adding a theme context/provider
- Creating theme variants (light/dark)
- Using CSS variables for dynamic theming
