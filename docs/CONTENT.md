# Linus 3M - Content Structure

## Data Model

All content lives in `src/data/content.js` as hardcoded JSON.

### Module Structure

```javascript
export const MODULES = [
  {
    id: 'membaca',
    name: 'Membaca',
    nameEn: 'Reading',
    color: '#3B82F6',
    icon: '📖',
    description: 'Belajar membaca dari huruf A hingga Z',
    totalLessons: 26, // Adjust based on actual content
    lessons: [
      // Lessons array
    ]
  },
  {
    id: 'menulis',
    name: 'Menulis', 
    nameEn: 'Writing',
    color: '#22C55E',
    icon: '✏️',
    description: 'Latihan menulis dan ejaan',
    totalLessons: 20,
    lessons: []
  },
  {
    id: 'mengira',
    name: 'Mengira',
    nameEn: 'Counting', 
    color: '#F97316',
    icon: '🔢',
    description: 'Mengenal nombor dan operasi asas',
    totalLessons: 24,
    lessons: []
  }
]
```

### Lesson Structure

```javascript
{
  id: 'membaca-01',           // Unique ID: {module}-{sequence}
  moduleId: 'membaca',        // Parent module
  order: 1,                   // Display order (1-indexed)
  title: 'Huruf A',           // Lesson title
  titleEn: 'Letter A',        // English translation (optional)
  duration: '5 min',          // Estimated time
  type: 'lesson',             // 'lesson' | 'quiz' | 'game' | 'milestone'
  
  // Prerequisites
  requires: [],               // Array of lesson IDs that must be completed
  
  // Content
  content: {
    // Type 1: Video Lesson
    video: {
      src: '/videos/membaca-01.mp4',  // Path in public/ folder
      poster: '/thumbs/membaca-01.jpg',
      duration: 120  // seconds
    },
    
    // Type 2: Slides/Steps
    slides: [
      {
        type: 'image',
        src: '/images/huruf-a.png',
        text: 'Ini adalah huruf A',
        audio: '/audio/ini-huruf-a.mp3'
      },
      {
        type: 'text',
        text: 'A untuk... Api! 🔥',
        highlight: 'A'  // Letter to emphasize
      }
    ],
    
    // Type 3: Interactive Exercise
    exercise: {
      type: 'matching',  // 'matching' | 'multiple-choice' | 'tracing' | 'arrange'
      instructions: 'Padankan huruf dengan gambar',
      items: [
        { letter: 'A', image: '/images/apple.png', word: 'Apple' },
        { letter: 'B', image: '/images/ball.png', word: 'Ball' }
      ]
    },
    
    // Type 4: Mini Game
    game: {
      type: 'memory',  // 'memory' | 'drag-drop' | 'tap-sequence' | 'maze'
      config: {
        pairs: 6,
        timeLimit: 60
      }
    }
  },
  
  // Completion criteria
  completion: {
    type: 'watch',  // 'watch' | 'interact' | 'score' | 'manual'
    threshold: 100  // For score-based: minimum points to pass
  },
  
  // Rewards
  reward: {
    stars: 3,       // Max stars earnable
    badge: null,    // Special badge ID (optional)
    unlocks: []     // Lesson IDs unlocked upon completion
  }
}
```

### Example: Complete Membaca Lesson

```javascript
{
  id: 'membaca-01',
  moduleId: 'membaca',
  order: 1,
  title: 'Mengenal Huruf A',
  titleEn: 'Learning Letter A',
  duration: '5 min',
  type: 'lesson',
  requires: [],
  
  content: {
    slides: [
      {
        type: 'intro',
        text: 'Hari ini kita akan belajar huruf A!',
        mascot: 'linus-excited'
      },
      {
        type: 'letter',
        letter: 'A',
        uppercase: '/images/A-upper.png',
        lowercase: '/images/A-lower.png',
        sound: '/audio/sound-a.mp3'
      },
      {
        type: 'vocabulary',
        words: [
          { word: 'Api', image: '/images/api.png', sound: '/audio/api.mp3' },
          { word: 'Angin', image: '/images/angin.png', sound: '/audio/angin.mp3' },
          { word: 'Ayam', image: '/images/ayam.png', sound: '/audio/ayam.mp3' }
        ]
      }
    ],
    
    exercise: {
      type: 'multiple-choice',
      question: 'Manakah huruf A?',
      options: [
        { id: 'a', image: '/images/letter-a.png', correct: true },
        { id: 'b', image: '/images/letter-b.png', correct: false },
        { id: 'c', image: '/images/letter-c.png', correct: false }
      ],
      feedback: {
        correct: 'Tahnilah! Betul sekali! 🎉',
        wrong: 'Cuba lagi! Cuba cari huruf A 😊'
      }
    }
  },
  
  completion: { type: 'interact' },
  reward: { stars: 3, unlocks: ['membaca-02'] }
}
```

## Content Spreadsheet → JSON

When you have your content spreadsheet ready, we'll convert it to this JSON structure. The mapping will be:

| Spreadsheet Column | JSON Field |
|-------------------|------------|
| Module | `moduleId` |
| Lesson No | `order` |
| Title (BM) | `title` |
| Title (EN) | `titleEn` |
| Content Type | `content.*` keys |
| Duration | `duration` |
| Prerequisites | `requires` |
| Media Files | `content.*.src` |

## Asset Organization

```
public/
├── videos/
│   ├── membaca/
│   │   ├── membaca-01.mp4
│   │   └── membaca-02.mp4
│   ├── menulis/
│   └── mengira/
├── audio/
│   ├── membaca/
│   ├── menulis/
│   └── mengira/
├── images/
│   ├── letters/       # A-Z letter images
│   ├── vocabulary/    # Word illustrations
│   ├── ui/           # Icons, buttons, backgrounds
│   └── mascots/      # Linus character poses
└── fonts/            # Custom fonts if needed
```

## Localizable Strings

For UI text (buttons, messages), we'll have a separate file:

```javascript
// src/data/strings.js
export const STRINGS = {
  bm: {
    start: 'Mula',
    continue: 'Teruskan',
    back: 'Kembali',
    completed: 'Selesai!',
    tryAgain: 'Cuba Lagi',
    greatJob: 'Tahniah!',
    // ... more
  },
  en: {
    start: 'Start',
    continue: 'Continue',
    // ...
  }
}
```
