# Linus 3M - Architecture & Technical Decisions

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | React 18 | Component-based, hooks for state, huge ecosystem |
| Build Tool | Vite | Fast dev server, modern ES modules, easy config |
| Styling | Tailwind CSS | Utility-first, mobile-first, consistent design system |
| Storage | localStorage | Native browser API, persists across sessions |
| Assets | Static files | Simple, no CDN needed, works offline |

## Architecture Patterns

### 1. Component Structure

```
src/
├── components/
│   ├── ui/              # Reusable primitives
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Icon.jsx
│   ├── path/            # Learning path specific
│   │   ├── PathMap.jsx       # SVG path container
│   │   ├── LessonNode.jsx    # Individual node
│   │   └── PathLine.jsx      # Connecting lines
│   ├── lesson/          # Lesson content types
│   │   ├── VideoPlayer.jsx
│   │   ├── SlideViewer.jsx
│   │   ├── Exercise.jsx
│   │   └── MiniGame.jsx
│   └── layout/
│       ├── Header.jsx
│       ├── Navigation.jsx
│       └── Footer.jsx
├── pages/
│   ├── Home.jsx         # Path overview (main screen)
│   ├── Lesson.jsx       # Individual lesson view
│   └── Profile.jsx      # User progress/stats
├── hooks/
│   ├── useProgress.js   # localStorage + progress logic
│   ├── useLesson.js     # Current lesson data
│   └── useAudio.js      # Sound playback
├── data/
│   ├── content.js       # All lesson content
│   ├── strings.js       # UI text (BM/EN)
│   └── config.js        # App configuration
└── utils/
    ├── storage.js       # localStorage wrapper
    ├── path.js          # Path calculation helpers
    └── validation.js    # Completion checking
```

### 2. State Management

**No Redux needed!** React Context + hooks is sufficient.

```javascript
// contexts/ProgressContext.jsx
const ProgressContext = createContext()

function ProgressProvider({ children }) {
  const [progress, setProgress] = useLocalStorage('linus3m-progress', {
    completedLessons: [],
    currentLesson: 'membaca-01',
    stars: {},
    lastAccessed: null
  })
  
  const completeLesson = (lessonId, starsEarned) => {
    setProgress(prev => ({
      ...prev,
      completedLessons: [...prev.completedLessons, lessonId],
      stars: { ...prev.stars, [lessonId]: starsEarned }
    }))
  }
  
  return (
    <ProgressContext.Provider value={{ progress, completeLesson }}>
      {children}
    </ProgressContext.Provider>
  )
}
```

### 3. Data Flow

```
User Action
    ↓
Component (Lesson.jsx)
    ↓
Hook (useProgress)
    ↓
Storage (localStorage)
    ↓
Re-render with new state
```

### 4. Routing Strategy

Simple URL structure (hash router for static hosting):

| URL | View |
|-----|------|
| `#/` | Home (Learning Path) |
| `#/lesson/:lessonId` | Lesson content |
| `#/profile` | User progress |

```javascript
// Simple hash router
function Router() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || '/')
  
  useEffect(() => {
    const handleHash = () => setRoute(window.location.hash.slice(1) || '/')
    window.addEventListener('hashchange', handleHash)
    return () => window.removeEventListener('hashchange', handleHash)
  }, [])
  
  switch(route) {
    case '/': return <Home />
    case '/profile': return <Profile />
    default:
      if (route.startsWith('/lesson/')) {
        const lessonId = route.split('/')[2]
        return <Lesson id={lessonId} />
      }
      return <Home />
  }
}
```

## Key Technical Decisions

### 1. Why No Server?
- Content is static and known upfront
- Simpler deployment (any static host)
- Works offline
- No maintenance/security concerns
- Faster load times

### 2. Why localStorage over IndexedDB?
- Simpler API
- Data is small (< 100KB)
- No complex queries needed
- Easier to debug/inspect

### 3. Why SVG for the Path?
- Scalable to any screen size
- Animatable (stroke-dashoffset)
- Small file size
- Easy to generate programmatically

### 4. Why Tailwind over CSS Modules?
- Faster prototyping
- Consistent design system
- No naming fatigue
- Smaller bundle (purged in production)

## Performance Optimizations

### 1. Code Splitting
```javascript
// Lazy load lesson types
const VideoPlayer = lazy(() => import('./components/lesson/VideoPlayer'))
const MiniGame = lazy(() => import('./components/lesson/MiniGame'))
```

### 2. Image Optimization
- Use WebP with JPEG fallback
- Lazy load images below fold
- Appropriate sizing (don't serve desktop images to mobile)

### 3. Asset Preloading
```html
<!-- index.html -->
<link rel="preload" href="/fonts/main.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/images/logo.png" as="image">
```

### 4. localStorage Safety
```javascript
// utils/storage.js
const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (e) {
      console.error('Storage read error:', e)
      return defaultValue
    }
  },
  
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (e) {
      // Quota exceeded or private mode
      console.error('Storage write error:', e)
      return false
    }
  }
}
```

## Accessibility (A11y)

### Requirements
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- Color-blind friendly (don't rely on color alone)

### Implementation
```jsx
// Always include aria labels
<button 
  aria-label="Start lesson: Huruf A"
  onClick={startLesson}
>
  <span aria-hidden="true">▶️</span> Mula
</button>

// Focus management
const startButtonRef = useRef()
useEffect(() => {
  // Focus first interactive element on mount
  startButtonRef.current?.focus()
}, [])

// Reduced motion support
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches
```

## Security Considerations

1. **No user input stored** — prevents XSS
2. **No external API calls** — eliminates CORS/CSRF concerns
3. **Content Security Policy** — can be strict since all assets are local
4. **No sensitive data** — progress is just lesson IDs, not PII

## Build & Deployment

```bash
# Development
npm run dev

# Production build
npm run build
# Outputs to dist/ — deploy to any static host

# Recommended hosts
- GitHub Pages (free)
- Netlify (free tier)
- Vercel (free tier)
- Firebase Hosting (free tier)
```

## Future Enhancements (v2+)

- Service Worker for offline support
- IndexedDB for larger content (videos)
- Multiple user profiles
- Parent dashboard
- Progress sync (if we add accounts)
- Sound effects & background music
