import { ALL_LESSONS, CATEGORIES } from './index.js'
import contentMap from './content-map.json'

const CATEGORY_ORDER = ['membaca-menulis', 'mengira']

const buildResources = (lesson) => {
  const sections = []
  const numberKey = String(lesson.number || '').trim()
  const categoryMap = contentMap[lesson.category] || {}
  const entry = categoryMap[numberKey]

  if (!entry) return sections

  if (lesson.category === 'membaca-menulis') {
    if (entry.pembelajaran) {
      sections.push({
        title: 'Pembelajaran',
        links: [{ label: 'Pembelajaran', url: entry.pembelajaran }],
      })
    }
    if (entry.latihanMembaca) {
      sections.push({
        title: 'Latihan Membaca',
        links: [{ label: 'Latihan Membaca', url: entry.latihanMembaca }],
      })
    }
    if (entry.latihanMenulis) {
      sections.push({
        title: 'Latihan Menulis',
        links: [{ label: 'Latihan Menulis', url: entry.latihanMenulis }],
      })
    }
    const videoLinks = [entry.video1, entry.video2, entry.video3].filter(Boolean)
    if (videoLinks.length) {
      sections.push({
        title: 'Video',
        links: videoLinks.map((url, index) => ({
          label: `Video ${index + 1}`,
          url,
        })),
      })
    }
  }

  if (lesson.category === 'mengira') {
    if (entry.github) {
      sections.push({
        title: 'Pembelajaran',
        links: [{ label: 'Pembelajaran', url: entry.github }],
      })
    }
    if (entry.canva) {
      sections.push({
        title: 'Latihan Mengira',
        links: [{ label: 'Latihan Mengira', url: entry.canva }],
      })
    }
    if (entry.video1) {
      sections.push({
        title: 'Video',
        links: [{ label: 'Video', url: entry.video1 }],
      })
    }
  }

  return sections
}

export const MODULES = CATEGORIES.map((category) => ({
  id: category.id,
  name: category.name,
  description: category.description,
  color: category.color,
}))

const groupedLessons = CATEGORY_ORDER.map((categoryId) => {
  const lessons = ALL_LESSONS.filter((lesson) => lesson.category === categoryId)
  lessons.sort((a, b) => (a.number || 0) - (b.number || 0))
  return { categoryId, lessons }
})

let sequence = 1

export const LESSONS = groupedLessons.flatMap(({ categoryId, lessons }) => {
  return lessons.map((lesson, index) => ({
    id: lesson.id,
    moduleId: categoryId,
    order: lesson.number || index + 1,
    sequence: sequence++,
    title: lesson.title,
    duration: '5-10 min',
    type: 'lesson',
    requires: index === 0 ? [] : [lessons[index - 1].id],
    content: {
      resources: buildResources(lesson),
    },
    completion: { type: 'manual' },
  }))
})

export const ORDERED_LESSONS = [...LESSONS].sort(
  (a, b) => a.sequence - b.sequence
)

const lessonsByModule = MODULES.reduce((acc, module) => {
  acc[module.id] = LESSONS.filter((lesson) => lesson.moduleId === module.id).sort(
    (a, b) => a.order - b.order
  )
  return acc
}, {})

export const getLessonById = (lessonId) =>
  LESSONS.find((lesson) => lesson.id === lessonId)

export const getNextLessonId = (lessonId) => {
  const current = getLessonById(lessonId)
  if (!current) return null
  const list = lessonsByModule[current.moduleId] || []
  const index = list.findIndex((lesson) => lesson.id === lessonId)
  if (index === -1 || index === list.length - 1) {
    return null
  }
  return list[index + 1].id
}

export const getPreviousLessonId = (lessonId) => {
  const current = getLessonById(lessonId)
  if (!current) return null
  const list = lessonsByModule[current.moduleId] || []
  const index = list.findIndex((lesson) => lesson.id === lessonId)
  if (index <= 0) {
    return null
  }
  return list[index - 1].id
}

export const getModuleById = (moduleId) =>
  MODULES.find((module) => module.id === moduleId)
