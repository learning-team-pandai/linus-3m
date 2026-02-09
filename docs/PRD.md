# Linus 3M - Product Requirements Document

## Overview
An interactive Bahasa Malaysia learning app for kids, structured as 3 progressive modules with a gamified learning path.

## Target Audience
- Primary: Malaysian children (ages 6-12)
- Secondary: Parents/teachers monitoring progress

## Core Modules

### 1. Membaca (Reading) 🔵
**Color:** Blue theme
**Focus:** Letter recognition, phonics, word reading
**Format:** Video lessons → Interactive exercises → Mini-games

### 2. Menulis (Writing) 🟢
**Color:** Green theme
**Focus:** Letter formation, spelling, sentence construction
**Format:** Tracing activities → Writing prompts → Creative exercises

### 3. Mengira (Counting/Arithmetic) 🟠
**Color:** Orange theme
**Focus:** Number recognition, basic operations, problem solving
**Format:** Visual counting → Arithmetic games → Word problems

## Learning Path Design

### Visual Metaphor
Duolingo-style winding path connecting all lessons:
- **Nodes** = Individual lessons (circular buttons)
- **Path** = Curved SVG line showing progression
- **States:**
  - 🔒 Locked (gray) — prerequisite not met
  - ✨ Current (glowing/pulsing) — ready to start
  - ✅ Completed (filled with module color) — done
  - ⭐ Milestone — module completion celebration

### Progression Rules
1. Linear progression within each module
2. Must complete Module 1 to unlock Module 2
3. Must complete Module 2 to unlock Module 3
4. Each lesson has completion criteria (watch video, finish exercise, etc.)

## Technical Requirements

### 100% Client-Side
- No server required
- All content hardcoded as JSON
- User progress in localStorage

### Responsive Design
- Mobile-first (primary use case)
- Works on tablets
- Minimum width: 320px

### Performance
- Initial load < 3s on 3G
- Smooth 60fps animations
- Offline-capable (PWA optional)

## Content Structure (Per Lesson)

```json
{
  "id": "membaca-01",
  "module": "membaca",
  "order": 1,
  "title": "Mengenal Huruf A",
  "type": "lesson",
  "content": {
    "video": "url_or_embed",
    "slides": [...],
    "exercise": {...},
    "game": {...}
  },
  "duration": "5-10 min",
  "prerequisites": []
}
```

## Success Metrics
- Child can complete lesson without adult help
- Clear visual feedback on progress
- Motivating without being addictive
- Works reliably on school-provided tablets

## Future Considerations
- Parent dashboard (separate view)
- Multiple user profiles
- Progress export/backup
- Sound effects & voice narration
