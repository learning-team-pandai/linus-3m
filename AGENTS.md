# AGENTS.md - Linus 3M Project

## Project Overview
- **Type:** 100% client-side React web app
- **Tech Stack:** React 18 + Vite + Tailwind CSS
- **Data:** Hardcoded JSON (no API/server)
- **Storage:** Browser localStorage for user progress
- **Target:** Mobile-first responsive design

## File Organization
```
linus-3m/
├── src/
│   ├── components/     # Reusable UI components (buttons, cards, etc.)
│   ├── pages/          # Route-level views
│   ├── hooks/          # Custom React hooks (useLocalStorage, etc.)
│   ├── data/           # Hardcoded JSON data
│   │   └── index.js    # All app content goes here
│   └── utils/          # Helper functions
├── public/             # Static assets
└── docs/               # Project docs (optional)
```

## Code Conventions

### Components
- Use functional components with hooks
- Destructure props in params
- Default exports for pages, named for utilities

```jsx
// Good
function ModuleCard({ title, description, onComplete }) {
  return <div>...</div>
}
export default ModuleCard

// Good - hook
function useProgress() {
  const [progress, setProgress] = useLocalStorage('linus3m-progress', {})
  return { progress, setProgress }
}
export { useProgress }
```

### Styling
- Use Tailwind utility classes
- Mobile-first approach (design for mobile, enhance for desktop)
- Use `className` (not `class`)

```jsx
// Good
<div className="bg-blue-500 text-white p-4 rounded-lg md:max-w-md">

// Avoid
<div style={{ backgroundColor: 'blue' }}>
```

### Data Structure
All content lives in `src/data/index.js`:

```js
export const MODULES = [
  {
    id: 1,
    name: "Module Name",
    description: "Brief description",
    content: [
      { type: "text", value: "Content here" },
      { type: "video", url: "..." },
      { type: "quiz", questions: [...] }
    ]
  }
]
```

### LocalStorage Pattern
```js
// Always wrap in try-catch for storage operations
try {
  const saved = localStorage.getItem('linus3m-progress')
  return saved ? JSON.parse(saved) : defaultValue
} catch (e) {
  console.error('Storage error:', e)
  return defaultValue
}
```

## Git Workflow
1. **Pull** before starting work
2. **Commit** when a feature is complete
3. **Use conventional commits:**
   - `feat:` new feature
   - `fix:` bug fix
   - `style:` CSS/styling changes
   - `refactor:` code restructure
   - `docs:` documentation

## Before Marking Done
- [ ] Runs without console errors
- [ ] Works on mobile viewport (test in DevTools)
- [ ] localStorage persistence tested
- [ ] No hardcoded secrets or API keys
- [ ] Responsive design verified

## Testing
- Test at 375px width (iPhone SE)
- Test at 768px width (tablet)
- Verify localStorage in DevTools → Application → Local Storage
- Check console for warnings

## Key Principles
1. **100% client-side** — no server calls
2. **Progressive enhancement** — works without JS, better with it
3. **Mobile-first** — design for small screens first
4. **Keep it simple** — no over-engineering for a simple app

---
*For general agent guidance, see: https://github.com/aimeocakmal/aime-workspace/blob/main/AGENTS.md*
