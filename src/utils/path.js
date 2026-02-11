export const buildNodePositions = (
  lessons,
  { startY = 40, stepY = 80, leftX = 25, rightX = 75 } = {}
) =>
  lessons.map((lesson, index) => ({
    id: lesson.id,
    x: index % 2 === 0 ? leftX : rightX,
    y: startY + index * stepY,
  }))

export const buildPathD = (points) => {
  if (!points.length) return ''
  const [first, ...rest] = points
  let d = `M ${first.x} ${first.y}`
  rest.forEach((point, index) => {
    const prev = points[index]
    const midY = (prev.y + point.y) / 2
    d += ` Q ${prev.x} ${midY} ${point.x} ${point.y}`
  })
  return d
}

export const getCurrentLessonId = (lessons, completedIds) => {
  const current = lessons.find((lesson) => {
    if (completedIds.includes(lesson.id)) return false
    if (!lesson.requires || lesson.requires.length === 0) return true
    return lesson.requires.every((req) => completedIds.includes(req))
  })
  return current ? current.id : null
}

export const getLessonStatus = (lesson, completedIds, currentLessonId) => {
  if (completedIds.includes(lesson.id)) return 'completed'
  if (lesson.id === currentLessonId) return 'current'
  return 'locked'
}
