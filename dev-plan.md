# Linus 3M - Detailed Development Plan

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

#### Install Packages
```bash
npm install @tabler/icons-react
npm install react-router-dom
npm install -D @types/react @types/react-dom
```

#### Configure Fonts (index.html)
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Playpen+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

#### Tailwind Config Extensions (tailwind.config.js)
```javascript
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        playful: ['Playpen Sans', 'cursive'],
      },
      colors: {
        primary: {
          blue: '#4F46E5',
          green: '#059669',
        },
        membaca: '#4F46E5',
        mengira: '#059669',
      }
    }
  }
}
```

#### Orientation Lock Utility (src/utils/orientation.js)
```javascript
export const lockOrientation = () => {
  if (screen.orientation && screen.orientation.lock) {
    screen.orientation.lock('landscape').catch(err => {
      console.warn('Orientation lock failed:', err);
    });
  }
};

export const unlockOrientation = () => {
  if (screen.orientation && screen.orientation.unlock) {
    screen.orientation.unlock();
  }
};
```

**Estimated time:** 30 minutes

---

### 1.2 Base Components

#### Button Component (src/components/Button.jsx)
**Props Interface:**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: string; // Tabler icon name
  iconPosition?: 'left' | 'right';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}
```

**Requirements:**
- [ ] Primary: bg-membaca (blue) or bg-mengira (green), white text
- [ ] Secondary: white bg, colored border
- [ ] Ghost: transparent with hover state
- [ ] Loading spinner state
- [ ] Disabled state with reduced opacity
- [ ] Icon support using Tabler icons
- [ ] Consistent padding: sm(8px 16px), md(12px 24px), lg(16px 32px)
- [ ] Border radius: 8px (rounded-lg)
- [ ] Font: Poppins 500

**Usage Example:**
```jsx
<Button variant="primary" size="md" icon="book">
  Start Lesson
</Button>
```

---

#### Card Component (src/components/Card.jsx)
**Props Interface:**
```typescript
interface CardProps {
  children: React.ReactNode;
  variant: 'default' | 'lesson' | 'category' | 'stat';
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}
```

**Requirements:**
- [ ] Default: white bg, gray border, 12px radius
- [ ] Lesson card: includes thumbnail, title, progress bar, action buttons
- [ ] Category card: large icon, title, lesson count, progress ring
- [ ] Stat card: number display with label, optional trend indicator
- [ ] Hover effect: subtle scale (1.02) + shadow
- [ ] Padding: 24px (p-6)
- [ ] No shadows (flat design)

---

#### Icon Component (src/components/Icon.jsx)
**Props Interface:**
```typescript
interface IconProps {
  name: string; // Tabler icon name
  size?: number; // default: 24
  stroke?: number; // default: 2
  color?: string;
  className?: string;
}
```

**Requirements:**
- [ ] Wrapper around @tabler/icons-react
- [ ] Dynamic icon import
- [ ] Size variants: sm(20), md(24), lg(32), xl(48)
- [ ] Consistent stroke width: 2px
- [ ] Color inheritance from parent

**Supported Icons (map to these):**
- `book` - Membaca
- `pencil` - Menulis
- `calculator` - Mengira
- `home` - Home
- `bookmark` - Save
- `check` - Complete
- `chevron-right` - Next
- `chevron-left` - Previous
- `search` - Search
- `settings` - Settings
- `chart-bar` - Progress
- `menu-2` - Menu
- `x` - Close

---

#### Layout Component (src/components/Layout.jsx)
**Props Interface:**
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
  title?: string;
}
```

**Structure:**
```
Layout
├── Header (fixed, 64px height)
│   ├── Logo/App name
│   ├── Search bar (collapsible)
│   ├── Bookmark quick access
│   └── Settings button
├── Sidebar (fixed, 240px width, collapsible)
│   ├── Navigation links
│   ├── Progress summary
│   └── Category selector
└── Main Content (flex-1, scrollable)
    └── {children}
```

**Requirements:**
- [ ] Header: fixed top, z-50, bg-white, border-b
- [ ] Sidebar: collapsible on mobile, icons + labels
- [ ] Main: min-h-screen, pt-16, pl-64 (when sidebar open)
- [ ] Responsive: sidebar hides on mobile (drawer mode)
- [ ] Landscape lock on mount

**Estimated time:** 2 hours

**Acceptance Criteria:**
- [ ] All base components render correctly
- [ ] Button variants work as expected
- [ ] Icons display without errors
- [ ] Layout is responsive
- [ ] No console errors

---

## Phase 2: Navigation & Routing

### 2.1 Route Configuration (src/App.jsx)

```javascript
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'category/:categoryId', element: <Category /> },
      { path: 'lesson/:lessonId', element: <Lesson /> },
      { path: 'progress', element: <Progress /> },
      { path: 'bookmarks', element: <Bookmarks /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);
```

### 2.2 Sidebar Navigation (src/components/Sidebar.jsx)

**Props Interface:**
```typescript
interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}
```

**Navigation Items:**
```javascript
const navItems = [
  { id: 'home', label: 'Home', icon: 'home', path: '/' },
  { id: 'membaca', label: 'Membaca & Menulis', icon: 'book', path: '/category/membaca-menulis' },
  { id: 'mengira', label: 'Mengira', icon: 'calculator', path: '/category/mengira' },
  { id: 'progress', label: 'Progress', icon: 'chart-bar', path: '/progress' },
  { id: 'bookmarks', label: 'Bookmarks', icon: 'bookmark', path: '/bookmarks' },
  { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' },
];
```

**Requirements:**
- [ ] Active state highlighting
- [ ] Collapsible on mobile (drawer)
- [ ] Progress indicator in sidebar footer
- [ ] Category icons with colors

---

### 2.3 Breadcrumb Component (src/components/Breadcrumb.jsx)

**Props Interface:**
```typescript
interface BreadcrumbProps {
  items: Array<{ label: string; path?: string }>;
}
```

**Requirements:**
- [ ] Home as first item
- [ ] Separator: chevron-right icon
- [ ] Last item not clickable
- [ ] Responsive truncation

**Example:**
```
Home > Membaca & Menulis > Lesson 1: Kenali Huruf Besar
```

---

### 2.4 Category Selector (src/components/CategorySelector.jsx)

**Requirements:**
- [ ] Horizontal tabs or cards
- [ ] Show lesson count
- [ ] Progress preview
- [ ] Click to navigate

**Estimated time:** 1.5 hours

**Acceptance Criteria:**
- [ ] All routes accessible
- [ ] Sidebar navigation works
- [ ] Breadcrumbs display correctly
- [ ] Active states visible
- [ ] Mobile drawer functions

---

## Phase 3: Home/Dashboard Screen

### 3.1 Hero Section (src/pages/Home.jsx)

**Components:**
```jsx
<HeroSection>
  <AppLogo size="lg" />
  <Tagline>"Program Literasi 3M untuk Kanak-Kanak"</Tagline>
  <StatsRow>
    <StatCard label="Lessons" value="47" />
    <StatCard label="Completed" value={completedCount} />
    <StatCard label="In Progress" value={inProgressCount} />
  </StatsRow>
  {lastAccessed && (
    <ContinueLearningButton lesson={lastAccessed} />
  )}
</HeroSection>
```

**Requirements:**
- [ ] Large app logo/branding
- [ ] Tagline with Playpen Sans font
- [ ] Quick stats display
- [ ] Continue learning CTA (if has progress)

---

### 3.2 Category Cards Section

**Layout:** 2-column grid on desktop, stacked on mobile

**CategoryCard Component:**
```typescript
interface CategoryCardProps {
  id: string;
  name: string;
  description: string;
  lessonCount: number;
  completedCount: number;
  color: string;
  icon: string;
}
```

**Visual Elements:**
- [ ] Large category icon (48px)
- [ ] Category name (Poppins 600, 20px)
- [ ] Description text
- [ ] Progress ring showing completion %
- [ ] Lesson count badge
- [ ] Color-coded border (blue for BM, green for Math)

---

### 3.3 Recent Activity Section

**Components:**
- [ ] Horizontal scroll of recent lessons
- [ ] Mini lesson cards (compact)
- [ ] "View All" link to progress page

---

### 3.4 Quick Actions

**Buttons:**
- [ ] Start from beginning (Lesson 1)
- [ ] Jump to random lesson
- [ ] View bookmarks

**Estimated time:** 2 hours

**Acceptance Criteria:**
- [ ] Hero displays correctly
- [ ] Category cards show accurate progress
- [ ] Continue learning button works
- [ ] Recent activity populated
- [ ] All navigation links functional

---

## Phase 4: Category View (Membaca / Mengira)

### 4.1 Lesson List (src/pages/Category.jsx)

**State Management:**
```typescript
interface CategoryState {
  viewMode: 'grid' | 'list';
  searchQuery: string;
  filterStatus: 'all' | 'completed' | 'incomplete';
  sortBy: 'number' | 'title' | 'progress';
}
```

**View Modes:**

**Grid View:**
- 3 columns on desktop, 2 on tablet
- Card with thumbnail placeholder
- Lesson number badge
- Title
- Progress bar
- Bookmark button
- Quick action buttons

**List View:**
- Single column
- Compact horizontal card
- Number, title, progress, actions in row

---

### 4.2 LessonCard Component (src/components/LessonCard.jsx)

**Props Interface:**
```typescript
interface LessonCardProps {
  lesson: Lesson;
  variant: 'grid' | 'list';
  isCompleted: boolean;
  isBookmarked: boolean;
  onBookmark: () => void;
  onComplete: () => void;
}
```

**Elements:**
- [ ] Lesson number (circle badge)
- [ ] Title (truncated if too long)
- [ ] Completion checkbox/toggle
- [ ] Bookmark star icon
- [ ] Action buttons:
  - "Learn" → pembelajaran
  - "Practice" → latihan

---

### 4.3 Search & Filter Bar

**Components:**
- [ ] Search input with icon
- [ ] View mode toggle (grid/list)
- [ ] Filter dropdown (all/completed/incomplete)
- [ ] Sort dropdown

**Search Logic:**
- Filter lessons by title (case insensitive)
- Real-time search (debounced 300ms)

---

### 4.4 Category Header

**Elements:**
- [ ] Breadcrumb navigation
- [ ] Category title with icon
- [ ] Overall progress bar
- [ ] "X of Y lessons completed"

**Estimated time:** 3 hours

**Acceptance Criteria:**
- [ ] Grid/list toggle works
- [ ] Search filters lessons
- [ ] Sorting changes order
- [ ] Bookmark toggles save
- [ ] Completion status updates
- [ ] Progress bar accurate

---

## Phase 5: Lesson Detail View

### 5.1 Lesson Header (src/pages/Lesson.jsx)

**Elements:**
```jsx
<LessonHeader>
  <BackButton />
  <Breadcrumb items={[...]} />
  <LessonTitle />
  <ActionButtons>
    <BookmarkToggle />
    <CompleteToggle />
    <ShareButton /> (optional)
  </ActionButtons>
</LessonHeader>
```

---

### 5.2 Tab Navigation

**Tabs for BM Lessons:**
1. **Pembelajaran** - Main learning content
2. **Latihan Membaca** - Reading exercises
3. **Latihan Menulis** - Writing exercises

**Tabs for Math Lessons:**
1. **Pembelajaran** - Main learning content
2. **Latihan Mengira** - Math exercises

**Tab Component Requirements:**
- [ ] Active tab highlight
- [ ] Smooth transition between tabs
- [ ] Persist tab state

---

### 5.3 Content Display

**Pembelajaran Tab:**
- [ ] Canva embed iframe (if possible)
- [ ] Fallback: Link button to Canva
- [ ] Pandai link button
- [ ] Fullscreen toggle

**Latihan Tabs:**
- [ ] List of available exercises
- [ ] Canva link for each
- [ ] Pandai link (if available)
- [ ] Download/print option

**External Link Button Component:**
```jsx
<ExternalLinkButton 
  href={url}
  icon="external-link"
  label="Open in Canva"
  variant="primary"
/>
```

---

### 5.4 Lesson Navigation Footer

**Elements:**
- [ ] Previous lesson button (disabled if first)
- [ ] Lesson indicator (X of Y)
- [ ] Next lesson button (disabled if last)
- [ ] "Back to Category" button

**Estimated time:** 3 hours

**Acceptance Criteria:**
- [ ] All tabs display correct content
- [ ] External links open in new tab
- [ ] Bookmark toggle saves to storage
- [ ] Complete toggle updates progress
- [ ] Navigation works between lessons
- [ ] Back button returns to category

---

## Phase 6: User Progress Features

### 6.1 Progress Dashboard (src/pages/Progress.jsx)

**Sections:**

**Overall Stats:**
- [ ] Circular progress chart (overall completion)
- [ ] Total lessons: 47
- [ ] Completed count
- [ ] In progress count
- [ ] Not started count

**Category Breakdown:**
- [ ] BM progress bar
- [ ] Math progress bar
- [ ] Side-by-side comparison

**Recent Activity:**
- [ ] Last 5 accessed lessons
- [ ] Timestamp
- [ ] Quick continue button

**Completed Lessons List:**
- [ ] Collapsible section
- [ ] Grid of completed lesson cards
- [ ] Date completed

---

### 6.2 Bookmarks Page (src/pages/Bookmarks.jsx)

**Empty State:**
- [ ] Illustration (SVG)
- [ ] "No bookmarks yet" message
- [ ] CTA to browse lessons

**With Bookmarks:**
- [ ] Grid of bookmarked lessons
- [ ] Remove bookmark button
- [ ] Quick access to lesson

---

### 6.3 LocalStorage Hooks

**useProgress Hook (src/hooks/useProgress.js):**
```javascript
const useProgress = () => {
  const [progress, setProgress] = useState(() => loadFromStorage());
  
  const markComplete = (lessonId) => { ... };
  const markIncomplete = (lessonId) => { ... };
  const isCompleted = (lessonId) => { ... };
  const getCompletionRate = () => { ... };
  const getLastAccessed = () => { ... };
  const setLastAccessed = (lessonId) => { ... };
  
  return { progress, markComplete, markIncomplete, ... };
};
```

**useBookmarks Hook (src/hooks/useBookmarks.js):**
```javascript
const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState(() => loadFromStorage());
  
  const addBookmark = (lessonId) => { ... };
  const removeBookmark = (lessonId) => { ... };
  const isBookmarked = (lessonId) => { ... };
  const getBookmarkedLessons = () => { ... };
  
  return { bookmarks, addBookmark, removeBookmark, ... };
};
```

**Data Structure:**
```javascript
{
  completed: ['3m-bm-pembelajaran-01', '3m-bm-pembelajaran-02'],
  bookmarks: ['3m-mt-pembelajaran-05'],
  lastAccessed: '3m-bm-pembelajaran-03',
  lastUpdated: '2026-02-10T10:00:00Z'
}
```

---

### 6.4 Export/Import (Optional)

**Features:**
- [ ] Export progress as JSON file
- [ ] Import progress from JSON
- [ ] Merge or replace option

**Estimated time:** 3 hours

**Acceptance Criteria:**
- [ ] Progress persists across sessions
- [ ] Bookmarks persist across sessions
- [ ] Dashboard shows accurate stats
- [ ] Completion toggle updates everywhere
- [ ] Last accessed tracked correctly

---

## Phase 7: PWA Features

### 7.1 Web App Manifest (public/manifest.json)

```json
{
  "name": "Linus 3M",
  "short_name": "Linus3M",
  "description": "Program Literasi 3M untuk Kanak-Kanak",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4F46E5",
  "orientation": "landscape",
  "icons": [
    { "src": "/icons/icon-72x72.png", "sizes": "72x72" },
    { "src": "/icons/icon-96x96.png", "sizes": "96x96" },
    { "src": "/icons/icon-128x128.png", "sizes": "128x128" },
    { "src": "/icons/icon-144x144.png", "sizes": "144x144" },
    { "src": "/icons/icon-152x152.png", "sizes": "152x152" },
    { "src": "/icons/icon-192x192.png", "sizes": "192x192" },
    { "src": "/icons/icon-384x384.png", "sizes": "384x384" },
    { "src": "/icons/icon-512x512.png", "sizes": "512x512" }
  ]
}
```

---

### 7.2 Service Worker (public/sw.js)

**Features:**
- [ ] Cache static assets (JS, CSS, HTML)
- [ ] Cache lesson data
- [ ] Offline fallback page
- [ ] Background sync for progress (optional)

**Cache Strategy:**
- Cache-first for static assets
- Network-first for dynamic content

---

### 7.3 PWA Registration (src/utils/pwa.js)

```javascript
export const registerSW = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered'))
      .catch(err => console.error('SW error:', err));
  }
};
```

---

### 7.4 Install Prompt

**Install Button Component:**
- [ ] Detect if PWA is installable
- [ ] Show custom install button
- [ ] Hide after installed
- [ ] Instructions for manual install

**Estimated time:** 2 hours

**Acceptance Criteria:**
- [ ] Manifest valid
- [ ] Icons generated
- [ ] Service worker registered
- [ ] App works offline
- [ ] Install prompt appears

---

## Phase 8: Polish & Optimization

### 8.1 Animations

**Page Transitions:**
- [ ] Fade in/out between routes
- [ ] Slide transitions for mobile
- [ ] Duration: 200-300ms
- [ ] Easing: ease-out

**Micro-interactions:**
- [ ] Button hover: scale(1.02)
- [ ] Card hover: translateY(-4px)
- [ ] Bookmark toggle: heart pulse
- [ ] Completion check: checkmark draw
- [ ] Loading skeletons

**Implementation:**
```css
/* Using Tailwind */
.transition-all duration-200 ease-out
.hover:scale-102
.hover:-translate-y-1
```

---

### 8.2 Loading States

**Skeleton Components:**
- [ ] LessonCardSkeleton
- [ ] CategoryCardSkeleton
- [ ] ProgressStatsSkeleton

---

### 8.3 Error Handling

**Error Boundaries:**
- [ ] Global error boundary
- [ ] Component-level error handling
- [ ] Friendly error messages
- [ ] Retry buttons

**Error Pages:**
- [ ] 404 Not Found
- [ ] 500 Error
- [ ] Offline fallback

---

### 8.4 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px (primary)
- Desktop: > 1024px

**Touch Optimization:**
- [ ] Minimum touch target: 44x44px
- [ ] Swipe gestures (optional)
- [ ] Pinch to zoom disabled (for PWA)

**Estimated time:** 3 hours

**Acceptance Criteria:**
- [ ] Animations smooth (60fps)
- [ ] Loading states visible
- [ ] Errors handled gracefully
- [ ] Touch targets adequate
- [ ] Works on tablet (primary target)

---

## Phase 9: Testing & Deployment

### 9.1 Testing Strategy

**Unit Tests (Vitest):**
- [ ] Button component
- [ ] Card component
- [ ] Icon component
- [ ] useProgress hook
- [ ] useBookmarks hook
- [ ] Data utilities

**Integration Tests:**
- [ ] Navigation flow
- [ ] Lesson completion flow
- [ ] Bookmark flow
- [ ] Search and filter

**E2E Tests (Playwright):**
- [ ] Complete user journey
- [ ] Offline functionality
- [ ] PWA installation
- [ ] Cross-browser testing

**Manual Testing:**
- [ ] iPad/tablet testing
- [ ] Mobile landscape mode
- [ ] Screen reader accessibility

---

### 9.2 Build Configuration

**Vite Config:**
- [ ] Production optimizations
- [ ] Asset minification
- [ ] Code splitting
- [ ] Source maps (dev only)

---

### 9.3 Deployment

**GitHub Pages:**
- [ ] GitHub Actions workflow
- [ ] Auto-deploy on push to main
- [ ] Custom domain (optional)

**Vercel (Alternative):**
- [ ] Vercel project setup
- [ ] Environment variables
- [ ] Preview deployments

---

### 9.4 Post-Deployment

**Monitoring:**
- [ ] Error tracking (Sentry optional)
- [ ] Analytics (optional)
- [ ] Performance monitoring

**Documentation:**
- [ ] README.md
- [ ] CHANGELOG.md
- [ ] User guide

**Estimated time:** 4 hours

**Acceptance Criteria:**
- [ ] All tests pass
- [ ] Build successful
- [ ] Deployed and accessible
- [ ] PWA installable
- [ ] No critical bugs

---

## Development Workflow

### Git Workflow
1. **Branch:** `aime` (active development)
2. **Main:** `main` (production - Akmal merges)
3. **Commits:** Clear, descriptive messages
   - `feat: add Button component`
   - `fix: correct progress calculation`
   - `docs: update README`
4. **Push:** After each completed feature

### Code Standards
- Use functional components + hooks
- Props destructuring in params
- Tabler icons only (no emoji)
- Tailwind classes (no custom CSS)
- Poppins font default, Playpen Sans for playful elements
- Max line length: 100 characters
- Semicolons required

### Communication
- **Aime:** Planning, architecture, reviews, git management
- **Codex:** Component development, implementation
- **Akmal:** Requirements, feedback, final approval

### Commit Checklist
Before each commit:
- [ ] Code works without errors
- [ ] No console warnings
- [ ] Components render correctly
- [ ] Responsive design tested
- [ ] Commit message is descriptive

---

## File Structure

```
linus-3m/
├── public/
│   ├── icons/              # PWA icons (multiple sizes)
│   ├── sw.js               # Service worker
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Icon.jsx
│   │   ├── Layout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── Header.jsx
│   │   ├── Breadcrumb.jsx
│   │   ├── LessonCard.jsx
│   │   ├── CategoryCard.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── SearchBar.jsx
│   │   ├── TabNav.jsx
│   │   └── Skeletons/      # Loading skeletons
│   │       ├── LessonCardSkeleton.jsx
│   │       └── CategoryCardSkeleton.jsx
│   ├── pages/              # Route components
│   │   ├── Home.jsx
│   │   ├── Category.jsx
│   │   ├── Lesson.jsx
│   │   ├── Progress.jsx
│   │   ├── Bookmarks.jsx
│   │   └── Settings.jsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useProgress.js
│   │   ├── useBookmarks.js
│   │   ├── useLocalStorage.js
│   │   └── useOrientation.js
│   ├── data/
│   │   └── index.js        # Lesson data (47 lessons)
│   ├── utils/              # Utility functions
│   │   ├── helpers.js
│   │   ├── orientation.js
│   │   └── pwa.js
│   ├── App.jsx             # Router configuration
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── docs/
│   └── DESIGN.md           # Design system
├── tests/                  # Test files
│   ├── unit/
│   └── e2e/
├── dev-plan.md             # This document
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## Timeline Estimate

| Phase | Description | Estimated Time |
|-------|-------------|----------------|
| 1 | Setup & Base Components | 2.5 hours |
| 2 | Navigation & Routing | 1.5 hours |
| 3 | Home/Dashboard | 2 hours |
| 4 | Category View | 3 hours |
| 5 | Lesson Detail | 3 hours |
| 6 | Progress Features | 3 hours |
| 7 | PWA Features | 2 hours |
| 8 | Polish & Optimization | 3 hours |
| 9 | Testing & Deployment | 4 hours |
| **Total** | | **~24 hours** |

---

## Next Steps

1. ✅ Data structure complete (src/data/index.js)
2. ✅ Design system documented (DESIGN.md)
3. ✅ Detailed dev plan (dev-plan.md)
4. ⏳ Set up base components (Phase 1) - **Ready for Codex**
5. ⏳ Implement routing (Phase 2)
6. ⏳ Build Home screen (Phase 3)

---

*Created: February 10, 2026*
*Last updated: February 10, 2026*
