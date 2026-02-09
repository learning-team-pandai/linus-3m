// Hardcoded data - no server needed
export const APP_DATA = {
  title: "Linus 3M",
  version: "1.0.0",
  description: "A 100% offline-capable progressive web app",
  author: "Aime & Akmal"
}

export const MODULES = [
  {
    id: 1,
    name: "Module 1",
    description: "Getting Started",
    content: [
      { type: "text", value: "Welcome to Linus 3M!" },
      { type: "text", value: "This is sample content stored as JSON." }
    ]
  },
  {
    id: 2,
    name: "Module 2", 
    description: "Core Concepts",
    content: [
      { type: "text", value: "Core concepts go here." }
    ]
  },
  {
    id: 3,
    name: "Module 3",
    description: "Advanced Topics",
    content: [
      { type: "text", value: "Advanced topics go here." }
    ]
  }
]

// Helper to save/load user progress from localStorage
export const storage = {
  getProgress: () => {
    const saved = localStorage.getItem('linus3m-progress')
    return saved ? JSON.parse(saved) : { completed: [], currentModule: 1, lastAccessed: null }
  },
  
  saveProgress: (progress) => {
    localStorage.setItem('linus3m-progress', JSON.stringify({
      ...progress,
      lastAccessed: new Date().toISOString()
    }))
  },
  
  resetProgress: () => {
    localStorage.removeItem('linus3m-progress')
  }
}
