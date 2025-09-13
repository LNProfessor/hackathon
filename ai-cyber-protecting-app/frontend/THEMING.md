# Commuter Design System - Theming Guide

## Overview
Commuter uses a semantic design token system built on CSS variables and Tailwind CSS. The theme provides a professional, trustworthy dark interface with subtle neon accents perfect for cybersecurity applications.

## Color Tokens

### Core Palette
```css
:root {
  --bg: #0B0F14;            /* deep space - main background */
  --surface: #0F1620;       /* panels/nav - elevated surfaces */
  --card: #121A26;          /* cards - content containers */
  --text: #E6EDF3;          /* primary text - high contrast */
  --muted: #9FB3C8;         /* secondary text - lower contrast */
}
```

### Accent Colors
```css
:root {
  --primary: #35E0C1;       /* mint/teal - primary brand color */
  --primary-600: #14B8A6;   /* darker teal for hovers */
  --violet: #8B5CF6;        /* accent violet */
  --magenta: #FF4F9A;       /* accent magenta */
  --ring: #38BDF8;          /* focus ring color */
}
```

### Status Colors
```css
:root {
  --success: #22C55E;       /* green for secure states */
  --warning: #F59E0B;       /* amber for caution states */
  --danger: #EF4444;        /* red for danger states */
}
```

## Usage in Tailwind

### Background Colors
```jsx
<div className="bg-commuter-bg">         {/* Main background */}
<div className="bg-commuter-surface">    {/* Nav, panels */}
<div className="bg-commuter-card">       {/* Cards, modals */}
```

### Text Colors
```jsx
<h1 className="text-commuter-text">      {/* Primary headings */}
<p className="text-commuter-muted">      {/* Secondary text */}
<span className="text-commuter-primary"> {/* Accent text */}
```

### Interactive Elements
```jsx
<button className="bg-commuter-primary hover:bg-commuter-primary-600">
<div className="border-commuter-surface hover:border-commuter-primary/30">
```

## Gradients

### Tri-Accent Gradient (Use Sparingly)
```css
--gradient-tri: linear-gradient(135deg, var(--primary) 0%, var(--violet) 50%, var(--magenta) 100%);
```

Apply with: `bg-gradient-to-r from-commuter-primary via-commuter-violet to-commuter-magenta`

### Primary Gradient
```css
--gradient-primary: linear-gradient(135deg, var(--primary) 0%, var(--primary-600) 100%);
```

## Glow Effects

### Shadow Classes
```jsx
<div className="shadow-glow-primary">    {/* Teal glow */}
<div className="shadow-glow-violet">     {/* Violet glow */}
<div className="shadow-glow-magenta">    {/* Magenta glow */}
<div className="shadow-glow-success">    {/* Success glow */}
<div className="shadow-glow-warning">    {/* Warning glow */}
<div className="shadow-glow-danger">     {/* Danger glow */}
```

## Component Classes

### Buttons
```jsx
<button className="btn-primary">        {/* Primary CTA */}
<button className="btn-secondary">      {/* Secondary actions */}
```

### Cards
```jsx
<div className="card-primary">          {/* Standard cards */}
<div className="card-feature">          {/* Feature cards with hover */}
```

### Status Zones
```jsx
<div className="status-secure">         {/* Green zone styling */}
<div className="status-caution">        {/* Yellow zone styling */}
<div className="status-danger">         {/* Red zone styling */}
```

## Typography Scale

### Display Text
```jsx
<h1 className="text-display">           {/* 54/48/40px responsive */}
```

### Headlines
```jsx
<h2 className="text-headline">          {/* 32/28/24px responsive */}
```

### Body Text
```jsx
<p className="text-body">               {/* 16px, 1.6 line-height */}
```

### Captions
```jsx
<span className="text-caption">         {/* 14px, muted color */}
```

## Spacing System

Based on 8px grid system:
- `space-2` = 8px
- `space-3` = 12px  
- `space-4` = 16px
- `space-6` = 24px
- `space-8` = 32px
- `space-12` = 48px
- `space-16` = 64px

## Customization

### Changing Brand Colors
Update the CSS variables in `src/index.css`:

```css
:root {
  --primary: #your-brand-color;
  --primary-600: #your-brand-color-darker;
}
```

### Adjusting Background
```css
:root {
  --bg: #your-background-color;
  --surface: #your-surface-color;
  --card: #your-card-color;
}
```

### Modifying Glow Intensity
Update shadow values in `tailwind.config.js`:

```js
boxShadow: {
  'glow-primary': '0 0 30px rgba(53, 224, 193, 0.4)', // Increase 0.4 for stronger glow
}
```

## Accessibility Features

### Focus Management
All interactive elements include proper focus rings:
```jsx
className="focus-visible:ring-2 focus-visible:ring-commuter-ring"
```

### Reduced Motion
Animations respect user preferences:
```css
@media (prefers-reduced-motion: reduce) {
  /* All animations disabled */
}
```

### Contrast Ratios
- Primary text: 14.5:1 (AAA)
- Secondary text: 7.2:1 (AA+)
- Interactive elements: 4.5:1+ (AA)

## Performance Notes

- Uses CSS variables for runtime theme switching
- Minimal JavaScript for animations
- SVG patterns for backgrounds (no heavy images)
- Optimized for Lighthouse 95+ scores

## Examples

### Creating a New Feature Card
```jsx
<div className="card-feature p-8 hover:shadow-glow-primary">
  <div className="w-12 h-12 bg-commuter-primary/10 rounded-xl mb-6">
    <Icon className="w-6 h-6 text-commuter-primary" />
  </div>
  <h3 className="text-headline text-commuter-text mb-4">Feature Title</h3>
  <p className="text-body text-commuter-muted">Feature description...</p>
</div>
```

### Status Indicator
```jsx
<div className={`
  ${zone === 'Red' ? 'status-danger' : zone === 'Yellow' ? 'status-caution' : 'status-secure'}
  p-6 rounded-2xl
`}>
  <h2 className="text-headline text-commuter-text">Security Status</h2>
</div>
```
