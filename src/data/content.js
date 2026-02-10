import { ALL_LESSONS, CATEGORIES } from './index.js'

const CATEGORY_ORDER = ['membaca-menulis', 'mengira']

const buildResources = (lesson) => {
  const sections = []

  const pushLinks = (title, data) => {
    if (!data) return
    const links = []
    if (data.canvaPublic) links.push({ label: 'Canva (View)', url: data.canvaPublic })
    if (data.pandaiPublic) links.push({ label: 'Pandai (View)', url: data.pandaiPublic })
    if (data.github) links.push({ label: 'GitHub', url: data.github })
    if (links.length) sections.push({ title, links })
  }

  pushLinks('Pembelajaran', lesson.pembelajaran)
  pushLinks('Latihan Membaca', lesson.latihanMembaca)
  pushLinks('Latihan Menulis', lesson.latihanMenulis)
  pushLinks('Latihan Mengira', lesson.latihanMengira)

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

export const getModuleById = (moduleId) =>
  MODULES.find((module) => module.id === moduleId)
