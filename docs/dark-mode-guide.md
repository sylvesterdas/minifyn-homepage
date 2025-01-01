# Dark Mode Implementation Guide

## Overview

Implementation details for MiniFyn's dark mode using next-themes and Tailwind CSS, optimized for Vercel free tier.

## Core Implementation

### Setup

```javascript
// _app.js
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={true}>
  <Component {...pageProps} />
</ThemeProvider>

// tailwind.config.js
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50',
          dark: '#1a2530',
          50: '#f8fafc',
          // ... other shades
        },
        // ... other color definitions
      }
    }
  }
}
```

### Key Features

- Dark theme by default
- System theme detection
- Theme persistence (localStorage)
- Zero client/server hydration mismatch
- No flash of wrong theme
- WCAG AA compliant contrast ratios

## Color System

### Base Colors

- Primary: Blues (#2C3E50 to #1a2530)
- Secondary: Blues (#3498DB to #2980b9)
- Surface: White to Dark (#ffffff to #111827)
- Text: Dark Gray to Light Gray (#4A4A4A to #F9FAFB)

### Interactive States

```css
/* Button Example */
bg-white dark:bg-dark-surface
hover:bg-primary-50 dark:hover:bg-dark-lighter
active:bg-primary-100 dark:active:bg-dark-lightest
```

### Text Hierarchy

- Primary: text-primary-900 dark:text-primary-50
- Secondary: text-primary-600 dark:text-primary-200
- Muted: text-primary-400 dark:text-primary-400

## Component Guidelines

### Basic Usage

```jsx
// Component Example
<div className="
  bg-white dark:bg-dark-surface
  text-primary-600 dark:text-primary-200
  border border-primary-200 dark:border-dark-lighter
">
```

### Common Patterns

- Surface Colors: bg-white dark:bg-dark-surface
- Border Colors: border-primary-200 dark:border-dark-lighter
- Text Colors: text-primary-600 dark:text-primary-200
- Interactive: hover:bg-primary-50 dark:hover:bg-dark-lighter

### Images & Icons

- Use dark mode aware SVGs when possible
- Adjust image brightness: dark:brightness-90
- Consider icon colors: text-primary-500 dark:text-primary-300

## Performance Considerations

- Theme stored in localStorage
- No additional API calls
- No database queries
- Minimal JavaScript overhead
- Uses Tailwind's built-in dark mode
- Instant theme switching
- Cached preferences

## Testing Guidelines

- Test in both themes
- Verify contrast ratios
- Check transition animations
- Validate form states
- Review third-party components
- Test system preference changes
- Verify zero-flash implementation

## Best Practices

- Use semantic color names
- Maintain WCAG AA compliance
- Keep consistent interactive states
- Avoid fixed color values
- Consider animation transitions
- Test edge cases
