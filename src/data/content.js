// Sample content for Phase 2/4 (dummy lessons for path and content system)

export const MODULES = [
  {
    id: 'membaca',
    name: 'Membaca',
    color: '#3B82F6',
    description: 'Belajar membaca dari huruf A hingga Z',
  },
  {
    id: 'menulis',
    name: 'Menulis',
    color: '#22C55E',
    description: 'Latihan menulis dan ejaan',
  },
  {
    id: 'mengira',
    name: 'Mengira',
    color: '#F97316',
    description: 'Mengenal nombor dan operasi asas',
  },
]

export const LESSONS = [
  {
    id: 'membaca-01',
    moduleId: 'membaca',
    order: 1,
    sequence: 1,
    title: 'Huruf A',
    duration: '5 min',
    type: 'lesson',
    requires: [],
    content: {
      slides: [
        { type: 'intro', title: 'Kenal Huruf A', text: 'Ini adalah huruf A.' },
        { type: 'example', title: 'A untuk Api', text: 'A seperti Api.' },
      ],
      exercise: {
        question: 'Manakah huruf A?',
        options: [
          { id: 'a', label: 'A', correct: true },
          { id: 'b', label: 'B', correct: false },
          { id: 'c', label: 'C', correct: false },
        ],
        feedback: {
          correct: 'Tahniah! Betul.',
          wrong: 'Cuba lagi.',
        },
      },
    },
    completion: { type: 'interact' },
  },
  {
    id: 'membaca-02',
    moduleId: 'membaca',
    order: 2,
    sequence: 2,
    title: 'Huruf B',
    duration: '5 min',
    type: 'lesson',
    requires: ['membaca-01'],
    content: {
      video: {
        src: '/videos/sample.mp4',
        poster: '/images/sample-poster.jpg',
      },
      slides: [
        { type: 'intro', title: 'Kenal Huruf B', text: 'Ini adalah huruf B.' },
      ],
    },
    completion: { type: 'watch' },
  },
  {
    id: 'membaca-03',
    moduleId: 'membaca',
    order: 3,
    sequence: 3,
    title: 'Suku Kata KV',
    duration: '6 min',
    type: 'lesson',
    requires: ['membaca-02'],
    content: {
      slides: [
        { type: 'intro', title: 'Ka Ku', text: 'Mari belajar suku kata.' },
      ],
    },
    completion: { type: 'manual' },
  },
  {
    id: 'membaca-04',
    moduleId: 'membaca',
    order: 4,
    sequence: 4,
    title: 'Perkataan Mudah',
    duration: '6 min',
    type: 'lesson',
    requires: ['membaca-03'],
    content: {
      slides: [
        { type: 'intro', title: 'Perkataan', text: 'Bina perkataan ringkas.' },
      ],
    },
    completion: { type: 'manual' },
  },
  {
    id: 'menulis-01',
    moduleId: 'menulis',
    order: 1,
    sequence: 5,
    title: 'Menulis Garisan',
    duration: '5 min',
    type: 'lesson',
    requires: ['membaca-04'],
    content: {
      slides: [
        { type: 'intro', title: 'Garisan', text: 'Latih tangan menulis.' },
      ],
    },
    completion: { type: 'manual' },
  },
  {
    id: 'menulis-02',
    moduleId: 'menulis',
    order: 2,
    sequence: 6,
    title: 'Menulis Huruf A',
    duration: '6 min',
    type: 'lesson',
    requires: ['menulis-01'],
    content: {
      slides: [
        { type: 'intro', title: 'Menulis A', text: 'Latihan menulis A.' },
      ],
    },
    completion: { type: 'manual' },
  },
  {
    id: 'menulis-03',
    moduleId: 'menulis',
    order: 3,
    sequence: 7,
    title: 'Menulis Suku Kata',
    duration: '6 min',
    type: 'lesson',
    requires: ['menulis-02'],
    content: {
      slides: [
        { type: 'intro', title: 'Suku Kata', text: 'Gabungkan suku kata.' },
      ],
    },
    completion: { type: 'manual' },
  },
  {
    id: 'mengira-01',
    moduleId: 'mengira',
    order: 1,
    sequence: 8,
    title: 'Kenal Nombor 1-5',
    duration: '6 min',
    type: 'lesson',
    requires: ['menulis-03'],
    content: {
      slides: [
        { type: 'intro', title: 'Nombor 1-5', text: 'Mari kira bersama.' },
      ],
    },
    completion: { type: 'manual' },
  },
  {
    id: 'mengira-02',
    moduleId: 'mengira',
    order: 2,
    sequence: 9,
    title: 'Kenal Nombor 6-10',
    duration: '6 min',
    type: 'lesson',
    requires: ['mengira-01'],
    content: {
      slides: [
        { type: 'intro', title: 'Nombor 6-10', text: 'Teruskan mengira.' },
      ],
    },
    completion: { type: 'manual' },
  },
  {
    id: 'mengira-03',
    moduleId: 'mengira',
    order: 3,
    sequence: 10,
    title: 'Tambah Mudah',
    duration: '7 min',
    type: 'lesson',
    requires: ['mengira-02'],
    content: {
      slides: [
        { type: 'intro', title: 'Tambah', text: 'Mari belajar tambah.' },
      ],
    },
    completion: { type: 'manual' },
  },
]

export const ORDERED_LESSONS = [...LESSONS].sort(
  (a, b) => a.sequence - b.sequence
)

export const getLessonById = (lessonId) =>
  LESSONS.find((lesson) => lesson.id === lessonId)

export const getNextLessonId = (lessonId) => {
  const index = ORDERED_LESSONS.findIndex((lesson) => lesson.id === lessonId)
  if (index === -1 || index === ORDERED_LESSONS.length - 1) {
    return null
  }
  return ORDERED_LESSONS[index + 1].id
}

export const getModuleById = (moduleId) =>
  MODULES.find((module) => module.id === moduleId)
