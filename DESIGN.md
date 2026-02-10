# Linus 3M - Design Document

## Design Philosophy

### Flat/Simplicity Design
- Flat design embraces simplicity and minimalism
- Clean, uncluttered interfaces with focus on content
- No gradients, shadows, or 3D effects
- Simple shapes and bold colors
- Clear visual hierarchy
- Reference: https://www.ucxdelayinstitute.com/blog/flat-design-everything-about-it/

## Typography

### Primary Font: Poppins
- **Font Family**: Poppins (https://fonts.google.com/specimen/Poppins)
- **Usage**: Primary font for most use cases
- **Weights**: 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Characteristics**: Modern, geometric, highly legible

### Secondary Font: Playpen Sans
- **Font Family**: Playpen Sans (https://fonts.google.com/specimen/Playpen+Sans)
- **Usage**: Secondary font for playful/fun usage
- **Characteristics**: Handwritten style, friendly, approachable
- **Use cases**: Headers, special callouts, child-friendly elements

### Font Implementation
```css
/* Import in CSS or index.html */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playpen+Sans:wght@400;500;600;700&display=swap');

/* Usage */
font-family: 'Poppins', sans-serif;  /* Primary */
font-family: 'Playpen Sans', cursive; /* Secondary/Playful */
```

## Iconography

### Icon Standards
- **Format**: All icons and images rendered as SVG
- **Source**: Tabler Icons (https://github.com/tabler/tabler-icons)
- **Style**: Outline style, consistent stroke width
- **Size**: 24px default, 20px for small, 32px for large

### No Emoji Policy
- **No usage of emoji** as image/illustration
- Use SVG icons exclusively for all visual elements
- Replace emoji with appropriate Tabler icons:
  - 📚 → `book` icon
  - ✏️ → `pencil` icon
  - 🧮 → `calculator` icon
  - ✅ → `check` icon
  - ❤️ → `heart` icon
  - 🏠 → `home` icon
  - ⭐ → `star` icon

### Icon Implementation
```bash
# Install Tabler Icons
npm install @tabler/icons-react
```

```jsx
// Usage in React
import { IconBook, IconPencil, IconCalculator } from '@tabler/icons-react';

<IconBook size={24} stroke={2} />
<IconPencil size={20} color="#4F46E5" />
```

## Orientation

### Landscape Default
- **Primary Orientation**: Landscape
- **Target**: Tablets and desktop devices
- **Mobile Behavior**: App remains in landscape even when mobile is tilted to portrait
- **Lock**: Use screen orientation lock to maintain landscape

### Implementation
```javascript
// Lock orientation to landscape
if (screen.orientation && screen.orientation.lock) {
  screen.orientation.lock('landscape');
}

// CSS for orientation handling
@media (orientation: portrait) {
  .app-container {
    transform: rotate(90deg);
    transform-origin: center;
    width: 100vh;
    height: 100vw;
    position: fixed;
  }
}
```

## Color Palette

### Primary Colors
- **Primary Blue**: `#4F46E5` (Indigo 600) - Membaca & Menulis
- **Primary Green**: `#059669` (Emerald 600) - Mengira
- **Background**: `#FFFFFF` (White)
- **Surface**: `#F9FAFB` (Gray 50)

### Neutral Colors
- **Text Primary**: `#111827` (Gray 900)
- **Text Secondary**: `#6B7280` (Gray 500)
- **Border**: `#E5E7EB` (Gray 200)
- **Divider**: `#F3F4F6` (Gray 100)

### Status Colors
- **Success**: `#10B981` (Emerald 500)
- **Warning**: `#F59E0B` (Amber 500)
- **Error**: `#EF4444` (Red 500)
- **Info**: `#3B82F6` (Blue 500)

## Spacing System

### Base Unit: 4px
- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

### Container
- **Max Width**: 1280px
- **Padding**: 16px (mobile), 24px (tablet), 32px (desktop)

## Components

### Buttons
- **Border Radius**: 8px (rounded-lg)
- **Padding**: 12px 24px
- **Font**: Poppins 500
- **Shadow**: None (flat design)

### Cards
- **Border Radius**: 12px (rounded-xl)
- **Padding**: 24px
- **Background**: White
- **Border**: 1px solid `#E5E7EB`
- **Shadow**: None (flat design)

### Inputs
- **Border Radius**: 8px
- **Border**: 1px solid `#E5E7EB`
- **Focus Border**: `#4F46E5`
- **Padding**: 12px 16px

## Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## Animation

### Animation Platform: Rive
- **Tool**: Rive (https://rive.app)
- **Usage**: All animations in the app use Rive
- **Format**: `.riv` files
- **Benefits**: Lightweight, interactive, runs at 60fps

### Animation Guidelines
- Use Rive for:
  - Character animations
  - Loading states
  - Success/check animations
  - Interactive feedback
  - Page transitions
- Keep animations smooth and purposeful
- Duration: 200-400ms for micro-interactions
- Duration: 500-800ms for larger transitions

### Implementation
```bash
# Install Rive React
npm install @rive-app/react-canvas
```

```jsx
// Usage in React
import { useRive } from '@rive-app/react-canvas';

const MyComponent = () => {
  const { RiveComponent } = useRive({
    src: '/animations/loading.riv',
    autoplay: true,
  });

  return <RiveComponent style={{ width: 200, height: 200 }} />;
};
```

## Sound

### Audio Library: Howler.js
- **Library**: Howler.js (https://howlerjs.com)
- **Usage**: All sound effects and audio playback
- **Format**: Web Audio API wrapper

### Audio Guidelines
- **File Size**: Keep each sound file less than 100 KB
- **Format**: Use `.mp3` or `.ogg` for compatibility
- **Compression**: Optimize audio files before adding

### Sound Categories
- **UI Sounds**: Button clicks, toggles, notifications (10-30 KB)
- **Feedback Sounds**: Success, error, completion (20-50 KB)
- **Ambient Sounds**: Background music, loops (50-100 KB)
- **Voice**: Instructions, pronunciations (under 100 KB each)

### Implementation
```bash
# Install Howler.js
npm install howler
```

```jsx
// Usage in React
import { Howl } from 'howler';

const playSound = () => {
  const sound = new Howl({
    src: ['/sounds/click.mp3'],
    volume: 0.5,
  });
  sound.play();
};
```

### Audio Assets Structure
```
public/
└── sounds/
    ├── ui/
    │   ├── click.mp3
    │   ├── toggle.mp3
n    │   └── notification.mp3
    ├── feedback/
    │   ├── success.mp3
    │   ├── error.mp3
    │   └── complete.mp3
    └── voice/
        └── instructions/
```

## Accessibility

- Minimum contrast ratio: 4.5:1 for text
- Focus indicators for all interactive elements
- Touch targets: minimum 44x44px
- Reduced motion support

---

*Last updated: February 10, 2026*
