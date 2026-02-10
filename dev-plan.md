# Linus 3M - Development Plan

## Project Overview
**Linus 3M** - Program Literasi 3M (Membaca, Menulis & Mengira) for Malaysian children ages 7-17.

- **Tech Stack:** React + Vite + Tailwind CSS
- **Type:** 100% client-side PWA (no server)
- **Data:** 47 lessons hardcoded in src/data/index.js
- **Storage:** localStorage for user progress
- **Branch:** `aime` (development)

---

## Phase 1: Project Setup & Core Infrastructure

### 1.1 Dependencies & Configuration
- [ ] Install @tabler/icons-react for SVG icons
- [ ] Configure Google Fonts (Poppins + Playpen Sans)
- [ ] Set up Tailwind config with custom colors
- [ ] Add landscape orientation lock utility

### 1.2 Base Components
- [ ] Create Button component (primary, secondary, ghost variants)
- [ ] Create Card component (lesson card, category card)
- [ ] Create Icon component (wrapper for Tabler icons)
- [ ] Create Layout component (header, sidebar, main content)

**Assigned to:** Codex

---

## Phase 2: Navigation & Routing

### 2.1 Route Structure
```
/                    → Home/Dashboard
/category/:id        → Category view (Membaca/Mengira)
/lesson/:id          → Lesson detail view
/progress            → User progress dashboard
/bookmarks           → Saved lessons
/settings            → App settings
```

### 2.2 Navigation Components
- [ ] Sidebar navigation (collapsible)
- [ ] Breadcrumb component
- [ ] Category selector
- [ ] Lesson list/grid toggle

**Assigned to:** Codex

---

## Phase 3: Home/Dashboard Screen

### 3.1 Hero Section
- [ ] App title and tagline
- [ ] Quick stats (lessons completed, in progress)
- [ ] Continue learning button (last accessed lesson)

### 3.2 Category Cards
- [ ] Membaca & Menulis card (24 lessons)
- [ ] Mengira card (23 lessons)
- [ ] Progress indicators for each category

### 3.3 Recent Activity
- [ ] Recently viewed lessons
- [ ] Quick bookmark access

**Assigned to:** Codex

---

## Phase 4: Category View (Membaca / Mengira)

### 4.1 Lesson List
- [ ] Grid/list view toggle
- [ ] Lesson cards with:
  - Lesson number
  - Title
  - Completion status
  - Bookmark button
  - Quick action buttons (Pembelajaran, Latihan)

### 4.2 Filters & Search
- [ ] Search by lesson title
- [ ] Filter by completion status
- [ ] Sort by number/title/progress

### 4.3 Progress Tracking
- [ ] Category progress bar
- [ ] Lessons completed count
- [ ] Estimated time to complete

**Assigned to:** Codex

---

## Phase 5: Lesson Detail View

### 5.1 Lesson Header
- [ ] Lesson number and title
- [ ] Back button
- [ ] Bookmark toggle
- [ ] Completion toggle

### 5.2 Content Sections
- [ ] **Pembelajaran** tab
  - Canva embed/iframe
  - Pandai link button
  - External link to Canva
  
- [ ] **Latihan** tabs (for BM lessons)
  - Latihan Membaca tab
  - Latihan Menulis tab
  - Canva links for each
  
- [ ] **Latihan Mengira** tab (for Math lessons)
  - Canva worksheet links

### 5.3 Navigation
- [ ] Previous lesson button
- [ ] Next lesson button
- [ ] Related lessons

**Assigned to:** Codex

---

## Phase 6: User Progress Features

### 6.1 Progress Dashboard
- [ ] Overall completion percentage
- [ ] Category breakdown (BM vs Math)
- [ ] Lessons completed list
- [ ] Lessons in progress list

### 6.2 Bookmarks
- [ ] Bookmarked lessons list
- [ ] Quick access from sidebar
- [ ] Remove bookmark functionality

### 6.3 LocalStorage Integration
- [ ] Save progress on lesson complete
- [ ] Save last accessed lesson
- [ ] Save bookmarks
- [ ] Export/import progress (optional)

**Assigned to:** Codex

---

## Phase 7: PWA Features

### 7.1 Service Worker
- [ ] Offline capability
- [ ] Cache static assets
- [ ] Background sync (optional)

### 7.2 Manifest
- [ ] App icons (multiple sizes)
- [ ] Theme colors
- [ ] Display mode (standalone)
- [ ] Orientation: landscape

### 7.3 Install Prompt
- [ ] Custom install button
- [ ] Install instructions

**Assigned to:** Codex

---

## Phase 8: Polish & Optimization

### 8.1 Animations
- [ ] Page transitions
- [ ] Card hover effects
- [ ] Loading skeletons
- [ ] Progress animations

### 8.2 Responsive Design
- [ ] Tablet optimization (primary target)
- [ ] Mobile landscape mode
- [ ] Touch-friendly interactions

### 8.3 Performance
- [ ] Lazy load lesson content
- [ ] Optimize images
- [ ] Code splitting by route

**Assigned to:** Codex

---

## Phase 9: Testing & Deployment

### 9.1 Testing
- [ ] Component tests (Vitest)
- [ ] E2E tests (Playwright)
- [ ] Mobile device testing
- [ ] Offline functionality testing

### 9.2 Build & Deploy
- [ ] Production build
- [ ] GitHub Pages / Vercel setup
- [ ] Custom domain configuration
- [ ] SSL certificate

**Assigned to:** Aime + Codex

---

## Development Workflow

### Git Workflow
1. **Branch:** `aime` (active development)
2. **Main:** `main` (production - Akmal merges)
3. **Commits:** Clear, descriptive messages
4. **Push:** After each completed feature

### Code Standards
- Use functional components + hooks
- Props destructuring in params
- Tabler icons only (no emoji)
- Tailwind classes (no custom CSS)
- Poppins font default, Playpen Sans for playful elements

### Communication
- **Aime:** Planning, architecture, reviews, git management
- **Codex:** Component development, implementation
- **Akmal:** Requirements, feedback, final approval

---

## File Structure

```
linus-3m/
├── public/
│   ├── icons/           # PWA icons
│   └── manifest.json
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Icon.jsx
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   └── LessonCard.jsx
│   ├── pages/           # Route components
│   │   ├── Home.jsx
│   │   ├── Category.jsx
│   │   ├── Lesson.jsx
│   │   ├── Progress.jsx
│   │   └── Bookmarks.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useProgress.js
│   │   ├── useBookmarks.js
│   │   └── useLocalStorage.js
│   ├── data/
│   │   └── index.js     # Lesson data (47 lessons)
│   ├── utils/
│   │   └── helpers.js   # Utility functions
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── DESIGN.md            # Design system
├── dev-plan.md          # This document
└── package.json
```

---

## Next Steps

1. ✅ Data structure complete (src/data/index.js)
2. ✅ Design system documented (DESIGN.md)
3. ⏳ Set up base components (Phase 1)
4. ⏳ Implement routing (Phase 2)
5. ⏳ Build Home screen (Phase 3)

---

*Created: February 10, 2026*
*Last updated: February 10, 2026*
