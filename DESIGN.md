# DESIGN.md - Design System Reference

## Overview
Flat design style with modern, clean aesthetics suitable for educational content and learning platforms.

---

## Color Palette

### Primary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Primary Blue** | `#4A90D9` | Headers, primary buttons, links |
| **Primary Green** | `#5CB85C` | Success states, progress indicators |
| **Accent Yellow** | `#F0AD4E` | Highlights, warnings, stars/ratings |
| **Coral/Orange** | `#E07B53` | CTA buttons, important elements |

### Secondary Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Soft Blue** | `#7AB8E8` | Secondary elements, backgrounds |
| **Mint Green** | `#7ED9A6` | Success messages, badges |
| **Light Yellow** | `#F5D78E` | Backgrounds, cards |
| **Soft Pink** | `#E8A5C0` | Accent elements |
| **Lavender** | `#B8A5E8` | Special sections |

### Neutral Colors
| Color Name | Hex Code | Usage |
|------------|----------|-------|
| **Dark Gray** | `#4A4A4A` | Primary text |
| **Medium Gray** | `#7A7A7A` | Secondary text |
| **Light Gray** | `#B0B0B0` | Placeholder text |
| **Background Gray** | `#F5F5F5` | Page backgrounds |
| **White** | `#FFFFFF` | Card backgrounds, content areas |
| **Border Gray** | `#E0E0E0` | Borders, dividers |

---

## Typography

### Font Families
- **Primary Font**: Poppins (Google Fonts)
- **Secondary Font**: Nunito or Open Sans (for body text)
- **Accent Font**: Playpen Sans (for fun/casual elements)

### Font Weights
| Weight | Usage |
|--------|-------|
| **Light (300)** | Subtle text, captions |
| **Regular (400)** | Body text, descriptions |
| **Medium (500)** | Subheadings, labels |
| **Semi-Bold (600)** | Section headings, buttons |
| **Bold (700)** | Main headings, important text |

### Type Scale
| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| **H1** | 32px | 700 | 1.2 |
| **H2** | 28px | 600 | 1.3 |
| **H3** | 24px | 600 | 1.3 |
| **H4** | 20px | 600 | 1.4 |
| **Body Large** | 18px | 400 | 1.6 |
| **Body** | 16px | 400 | 1.6 |
| **Body Small** | 14px | 400 | 1.5 |
| **Caption** | 12px | 400 | 1.4 |

---

## Visual Elements

### Cards

#### Default Card
- **Background**: White (`#FFFFFF`)
- **Border Radius**: 16px (large), 12px (medium), 8px (small)
- **Shadow**: None (flat design)
- **Border**: 1px solid `#E0E0E0` (optional)
- **Padding**: 24px internal padding

#### Category Card (Colored Border Style)
Based on reference: White card with colored left border or full border

**Left Border Style:**
- **Background**: White or very light tint (`#FAFAFA`)
- **Border Radius**: 16px
- **Left Border**: 6px solid color
- **Padding**: 20px 24px
- **Shadow**: None

**Full Border Style:**
- **Background**: White
- **Border Radius**: 16px
- **Border**: 3px solid color (all sides)
- **Padding**: 20px 24px

**Category Color Mapping:**
| Category | Border Color | Background Tint | Use Case |
|----------|--------------|-----------------|----------|
| **Membaca** (Reading) | `#7ED9A6` (Green) | `#F0FFF4` | Reading lessons |
| **Menulis** (Writing) | `#F5D78E` (Yellow/Gold) | `#FFFBEB` | Writing lessons |
| **Mengira** (Counting/Math) | `#7AB8E8` (Blue) | `#EBF8FF` | Math lessons |
| **Sains** (Science) | `#B8A5E8` (Purple) | `#F3F0FF` | Science lessons |
| **General** | `#E0E0E0` (Gray) | `#FFFFFF` | Default cards |

**Card Content:**
- **Icon**: 48px × 48px, colored to match border
- **Title**: 20px, Semi-Bold, Dark Gray
- **Description**: 14px, Regular, Medium Gray
- **Spacing**: 16px between elements

### Buttons

#### 3D Effect Button (Primary Style)
Based on reference: Flat color with 3D border effect (candy/game style)

| Variant | Background | 3D Border (Bottom/Right) | Text Color |
|---------|------------|--------------------------|------------|
| **Green** | `#7ED9A6` | `#5CB85C` (darker green) | White |
| **Yellow/Gold** | `#F5D78E` | `#D4A84B` (darker gold) | `#4A4A4A` |
| **Purple** | `#B8A5E8` | `#9B8AC8` (darker purple) | White |
| **Blue** | `#7AB8E8` | `#5A98C8` (darker blue) | White |
| **Coral** | `#F5A58E` | `#D4856E` (darker coral) | White |

**3D Button Structure:**
- **Main Background**: Flat color (see table above)
- **Border Radius**: 16px
- **Padding**: 16px 32px (horizontal), 20px vertical
- **3D Effect**: 
  - Border-bottom: 6px solid [darker shade]
  - Border-right: 4px solid [darker shade]
  - OR use box-shadow: `0 6px 0 [darker shade]`
- **Font**: Bold, uppercase optional

**Button Interactions & Animations:**

*Hover State:*
- **Background**: Slightly brighter (lighten by ~10%)
- **Transform**: `scale(1.02)` - subtle grow effect
- **Transition**: `all 0.2s ease-out`
- **Cursor**: Pointer

*Active/Pressed State (Click):*
- **Transform**: `translateY(6px)` - button moves down
- **Box-shadow/3D Border**: Reduced to `0 0 0 [darker shade]` (appears pressed flat)
- **Background**: Slightly darker than normal (darken by ~5%)
- **Transition**: `all 0.1s ease-out` (faster response)

*Disabled State:*
- **Opacity**: 0.5
- **Cursor**: Not-allowed
- **No hover effects**

**CSS Animation Example:**
```css
.btn-3d {
  background: #7ED9A6;
  border: none;
  border-radius: 16px;
  box-shadow: 0 6px 0 #5CB85C;
  transition: all 0.2s ease-out;
}

.btn-3d:hover {
  background: #8EEDC0; /* brighter */
  transform: scale(1.02);
}

.btn-3d:active {
  transform: translateY(6px);
  box-shadow: 0 0 0 #5CB85C;
  background: #6EC996; /* darker */
}
```

#### Flat Button (Alternative)
- **Background**: Primary Blue (`#4A90D9`)
- **Text**: White, Semi-Bold
- **Border Radius**: 12px
- **Padding**: 16px 32px
- **Hover**: Slightly darker shade

#### Secondary Button
- **Background**: White
- **Border**: 2px solid Primary Blue
- **Text**: Primary Blue
- **Border Radius**: 12px
- **Padding**: 16px 32px

#### Icon Button
- **Size**: 48px × 48px
- **Border Radius**: 12px
- **Background**: Varies by context
- **Icon Size**: 24px

### Icons
- **Style**: Outlined/line icons (Tabler Icons)
- **Stroke Width**: 2px
- **Size Options**: 16px, 20px, 24px, 32px
- **Color**: Inherits from text or accent color

### Inputs
- **Background**: White
- **Border**: 2px solid `#E0E0E0`
- **Border Radius**: 12px
- **Padding**: 16px
- **Focus Border**: Primary Blue
- **Placeholder**: Light Gray

---

## Spacing System

### Base Unit: 8px

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight spacing |
| `space-2` | 8px | Default spacing |
| `space-3` | 12px | Small gaps |
| `space-4` | 16px | Standard padding |
| `space-5` | 24px | Card padding |
| `space-6` | 32px | Section gaps |
| `space-7` | 48px | Large sections |
| `space-8` | 64px | Page sections |

### Layout Spacing
- **Page Padding**: 24px (mobile), 48px (desktop)
- **Max Content Width**: 1200px
- **Grid Gap**: 24px
- **Section Spacing**: 48px

---

## Layout Principles

### Grid System
- **Columns**: 12-column grid
- **Gutter**: 24px
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px

### Alignment
- **Text**: Left-aligned (LTR languages)
- **Cards**: Top-aligned content
- **Buttons**: Center-aligned in containers

### Visual Hierarchy
1. Large headings with primary colors
2. Supporting text in neutral grays
3. Accent colors for interactive elements
4. Ample white space between sections

---

## Illustration Style

### Character Design
- **Style**: Flat, geometric shapes
- **Proportions**: Friendly, slightly exaggerated
- **Colors**: Soft pastels from primary palette
- **Details**: Minimal shading, clean outlines

### Background Elements
- **Shapes**: Organic, rounded blobs
- **Colors**: Soft gradients or solid pastels
- **Opacity**: 10-30% for decorative elements

---

## Animation Guidelines

### Micro-interactions
- **Duration**: 200-300ms
- **Easing**: ease-out
- **Properties**: transform, opacity

### Page Transitions
- **Duration**: 400ms
- **Style**: Fade + slight translate

### Button Animations

**3D Candy Buttons:**
| State | Effect | Duration | Easing |
|-------|--------|----------|--------|
| **Default** | 3D border visible, normal position | - | - |
| **Hover** | Scale up 1.02, brighter color | 200ms | ease-out |
| **Pressed/Active** | Translate down 6px, 3D border flattens, darker color | 100ms | ease-out |
| **Release** | Return to default state | 200ms | ease-out |

**Standard Buttons:**
| State | Effect | Duration |
|-------|--------|----------|
| **Hover** | Background darkens 10%, scale 1.02 | 200ms |
| **Active** | Scale 0.98 (pressed look) | 100ms |

### Hover States
- **Scale**: 1.02 for cards and buttons
- **Brightness**: +10% for buttons on hover
- **Shadow**: None (maintain flat design)

---

## Accessibility

### Contrast Ratios
- **Normal Text**: 4.5:1 minimum
- **Large Text**: 3:1 minimum
- **Interactive Elements**: 3:1 minimum

### Focus States
- **Outline**: 2px solid Primary Blue
- **Offset**: 2px
- **Border Radius**: Matches element

### Touch Targets
- **Minimum Size**: 44px × 44px
- **Spacing**: 8px between touch targets

---

## Platform-Specific Notes

### Mobile
- Cards: Full width with 16px padding
- Touch-friendly buttons (min 48px height)
- Simplified navigation

### Desktop
- Cards: Multi-column grid
- Hover states active
- Full navigation visible

---

## Assets

### Icons
- Source: Tabler Icons (https://tabler-icons.io)
- Format: SVG
- Size: 24px default

### Fonts
- Poppins: https://fonts.google.com/specimen/Poppins
- Playpen Sans: https://fonts.google.com/specimen/Playpen+Sans

---

*Last Updated: 2026-02-11*
*References:*
- *Flat Design Style Image (2557516d-742a-4cca-ac69-408bc2cc1d68.jpg)*
- *3D Button Style Image (a9ed6aaf-beb4-48d4-8ed4-8a03cead14ec.jpg)*
- *Colored Border Card Style Image (3908a294-78f6-4e74-9929-9b0d19fe3443.jpg)*
