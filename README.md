# Linus 3M

A 100% client-side web application. No server required.

## Features

- ✅ 100% browser-based — runs locally without a server
- ✅ All data hardcoded (no API calls)
- ✅ Progress saved to browser localStorage
- ✅ Mobile-responsive design

## Tech Stack

- **React** — UI framework
- **Vite** — Build tool & dev server
- **Tailwind CSS** — Utility-first CSS

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Data Storage

User progress is stored in the browser's `localStorage`:
- Key: `linus3m-progress`
- Format: JSON `{ completed: [], currentModule: 1 }`

To reset progress: Click "Reset" button or clear browser storage.

## Deployment

Build outputs to `dist/` folder. Can be deployed to any static host (GitHub Pages, Netlify, Vercel, etc.)
