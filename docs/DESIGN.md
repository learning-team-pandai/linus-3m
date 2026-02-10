# Linus 3M - Design Specification

## Visual Design System

### Design Philosophy: Flat/Simplicity Design

Flat design embraces simplicity and minimalism. This approach focuses on:
- **Clean, open spaces** - Uncluttered layouts with breathing room
- **Crisp edges** - Sharp, defined boundaries without bevels or shadows
- **Bright colors** - Vibrant, solid color palettes
- **2D illustrations** - Simple, flat graphics without depth effects
- **Minimalist approach** - Removing unnecessary ornamentation

**Reference:** https://www.canva.com/design/DAG_kYO30XE/Tomy3r1CL0YnyzF-aqP4mw/edit

### Color Palette

| Module | Primary | Secondary | Accent |
|--------|---------|-----------|--------|
| Membaca (Reading) | `#3B82F6` (Blue 500) | `#60A5FA` (Blue 400) | `#1D4ED8` (Blue 700) |
| Menulis (Writing) | `#22C55E` (Green 500) | `#4ADE80` (Green 400) | `#15803D` (Green 700) |
| Mengira (Math) | `#F97316` (Orange 500) | `#FB923C` (Orange 400) | `#C2410C` (Orange 700) |

**Neutral Colors:**
- Background: `#F8FAFC` (Slate 50)
- Locked: `#94A3B8` (Slate 400)
- Text: `#1E293B` (Slate 800)
- White: `#FFFFFF`

### Typography

**Primary Font: Poppins**
- URL: https://fonts.google.com/specimen/Poppins
- Usage: Primary font for most use cases
- Weights: 400 (Regular), 600 (SemiBold), 700 (Bold)

**Secondary Font: Playpen Sans**
- URL: https://fonts.google.com/specimen/Playpen+Sans
- Usage: Secondary font for playful/fun usage
- Weights: 400 (Regular), 600 (SemiBold)

**Implementation:**
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Playpen+Sans:wght@400;600&display=swap" rel="stylesheet">
```

**Typography Scale:**
- Headings: Poppins Bold
- Body: Poppins Regular
- Playful elements: Playpen Sans
- Kids-friendly: Rounded, friendly, large touch targets (min 44px)

### Icon & Image Guidelines

**Icons:**
- **Source:** Tabler Icons - https://tabler.io/icons
- **Format:** All icons rendered as SVG
- **Repository:** https://github.com/tabler/tabler-icons
- **Style:** Simple, flat, consistent line weight

**Images:**
- **Format:** All images rendered as SVG where possible
- **Style:** Flat illustrations, no gradients or shadows
- **NO EMOJI:** No usage of emoji as image/illustration

**Implementation:**
```jsx
// Using Tabler Icons (React)
import { IconBook, IconCalculator, IconLock } from '@tabler/icons-react';

// SVG usage
<IconBook size={24} stroke={2} />
```

### Spacing
- Base unit: 4px
- Lesson nodes: 64px diameter
- Path stroke: 8px
- Node spacing: 80px vertical

## Orientation

**Default: Landscape**

The app will use **landscape orientation** as default even when the mobile device is tilted to portrait mode.

**Implementation:**
```css
/* Force landscape */
@screen (orientation: portrait) {
  .app-container {
    transform: rotate(90deg);
    transform-origin: center center;
    width: 100vh;
    height: 100vw;
    position: fixed;
    overflow: hidden;
  }
}
```

**Or using CSS:**
```css
html {
  /* Prevent auto-rotation */
  orientation: landscape;
}

@media (orientation: portrait) {
  body::before {
    content: "Please rotate your device to landscape mode";
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #F8FAFC;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    text-align: center;
    padding: 20px;
  }
}
```

## Learning Path UI

### Path Structure
```
START (Flag icon)
  ↓
○━━━━○━━━━○━━━━🏆  [Membaca - Blue]
  ↓
○━━━━○━━━━○━━━━🏆  [Menulis - Green]  
  ↓
○━━━━○━━━━○━━━━🎉  [Mengira - Orange]
```

### Node States

#### 1. Locked (Future lessons)
```
┌─────────────────┐
│   ┌───────┐     │
│   │  🔒   │     │
│   │ GRAY  │     │
│   └───────┘     │
│   Lesson Name   │
└─────────────────┘
```
- Circle: 64px, gray fill (`#94A3B8`)
- Icon: Tabler Icon `IconLock`
- Text: Grayed out, smaller

#### 2. Current (Ready to start)
```
┌─────────────────┐
│   ┌───────┐     │
│   │  ✨   │     │
│   │PULSE  │     │
│   └───────┘     │
│   Lesson Name   │
└─────────────────┘
```
- Circle: 64px, module color, **pulsing animation**
- Shadow: Soft glow effect
- Animation: `scale(1) → scale(1.05) → scale(1)` every 2s

#### 3. Completed (Done)
```
┌─────────────────┐
│   ┌───────┐     │
│   │  ✅   │     │
│   │ COLOR │     │
│   └───────┘     │
│   Lesson Name   │
└─────────────────┘
```
- Circle: 64px, module color fill
- Icon: Tabler Icon `IconCheck` or `IconStar`
- Path behind: Colored stroke connecting completed nodes

#### 4. Milestone (Module complete)
```
┌─────────────────┐
│      ⭐         │
│   ┌───────┐     │
│   │TROPHY │     │
│   └───────┘     │
│   GREAT JOB!    │
└─────────────────┘
```
- Special celebration animation
- Confetti effect (optional)
- Unlock next module

### Path Rendering

**SVG Path Strategy:**
```svg
<svg viewBox="0 0 400 2000">
  <!-- Completed path (colored) -->
  <path d="M200,50 Q250,100 200,150 T200,250" 
        stroke="#3B82F6" 
        stroke-width="8" 
        fill="none"/>
  
  <!-- Future path (gray dashed) -->
  <path d="M200,250 Q250,300 200,350" 
        stroke="#94A3B8" 
        stroke-width="8" 
        stroke-dasharray="10,5"
        fill="none"/>
</svg>
```

**Path Formula:**
- Quadratic Bezier curves for organic winding look
- Control points alternate left/right for "snake" pattern
- Node centers land on path endpoints

### Layout

```
┌─────────────────────────┐
│  ← Linus 3M    [Menu]   │  Header
├─────────────────────────┤
│                         │
│   ┌───────┐             │
│   │START  │             │  Scrollable
│   └───┬───┘             │  Path Viewport
│       │                 │
│   ════╧════             │
│       │                 │
│   ┌───┴───┐             │
│   │LESSON │ ◄── Current │
│   └───┬───┘     (pulse) │
│       │                 │
│   ┌───┴───┐             │
│   │LESSON │ (locked)    │
│   └───────┘             │
│                         │
└─────────────────────────┘
```

## Lesson Screen

### Layout
```
┌─────────────────────────┐
│  ← Back       Progress  │
├─────────────────────────┤
│                         │
│    [CONTENT AREA]       │
│                         │
│  ┌─────────────────┐    │
│  │                 │    │
│  │   Video/Game    │    │
│  │                 │    │
│  └─────────────────┘    │
│                         │
│  Instructions here...   │
│                         │
│  ┌─────────────────┐    │
│  │    CONTINUE     │    │
│  └─────────────────┘    │
│                         │
└─────────────────────────┘
```

### Content Types

1. **Video Lesson**
   - Embedded player or `<video>` tag
   - Full-screen option
   - Auto-pause if switching tabs

2. **Interactive Exercise**
   - Drag-and-drop (matching)
   - Multiple choice (big touch targets)
   - Fill-in-blank with hints

3. **Mini Game**
   - Simple mechanics (tap, swipe, drag)
   - Immediate feedback (correct/wrong sounds)
   - Score/points optional

## Animations

### Transitions
- Page transitions: 300ms ease-in-out
- Button presses: 100ms scale(0.95)
- Path drawing: 500ms stroke-dashoffset

### Micro-interactions
- Current lesson pulse: `scale(1) → scale(1.08) → scale(1)`, 2s loop
- Completion checkmark: Pop-in with bounce
- Unlock: Shake + color flash
- Celebration: Rive confetti overlay (2.5s), fallback card if asset missing

### Accessibility
- Respect `prefers-reduced-motion`
- Sufficient color contrast (WCAG AA)
- Focus states for keyboard navigation

## Settings

### Sound Effects
- Toggle stored in localStorage (`linus3m-settings`)
- Default: enabled
- Affects celebration and feedback audio (Howler.js)

### Celebration Fallback
- If Rive asset fails to load, show simple overlay card
- Message: "Great job! Lesson completed"

## Component Examples

### Button Component
```jsx
// Flat design button
<button className="
  bg-emerald-500 hover:bg-emerald-600
  text-white font-poppins font-semibold
  px-6 py-3 rounded-lg
  transition-colors duration-200
  active:scale-95
">
  Start Lesson
</button>
```

### Card Component
```jsx
// Flat design card
<div className="
  bg-white rounded-xl
  p-6 shadow-sm
  border border-slate-100
">
  <h3 className="font-poppins font-bold text-slate-800">
    Lesson Title
  </h3>
  <p className="font-poppins text-slate-600 mt-2">
    Description
  </p>
</div>
```

### Icon Usage
```jsx
import { IconBook, IconCheck, IconLock } from '@tabler/icons-react';

// Locked lesson
<IconLock size={24} className="text-slate-400" />

// Completed lesson
<IconCheck size={24} className="text-white" />

// Current lesson
<IconBook size={24} className="text-white animate-pulse" />
```

## Controls & Links

- Primary buttons: Emerald (`#10B981`)
- Toggles/switches: Emerald (`#10B981`)
- Links: Emerald (`#10B981`)
- Active tabs/lines: Blue (`#3B82F6`)
