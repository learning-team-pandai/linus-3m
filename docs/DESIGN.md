# Linus 3M - Design Specification

## Visual Design System

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
- **Headings:** Inter or system sans-serif, bold
- **Body:** Inter or system sans-serif, regular
- **Kids-friendly:** Rounded, friendly, large touch targets (min 44px)

### Spacing
- Base unit: 4px
- Lesson nodes: 64px diameter
- Path stroke: 8px
- Node spacing: 80px vertical

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
- Icon: Lock emoji or SVG
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
- Icon: Checkmark or star
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

### Accessibility
- Respect `prefers-reduced-motion`
- Sufficient color contrast (WCAG AA)
- Focus states for keyboard navigation
