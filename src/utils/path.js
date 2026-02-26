export const PATHWAY_MAP_HEIGHT = 1400

// Node anchors refined from user-marked red dots on pathway image.
// Index 0 -> lesson order 1.
const RED_DOT_NODE_POINTS = [
  { x: 42, y: 4.0 },
  { x: 58, y: 7.1 },
  { x: 49, y: 10.2 },
  { x: 39, y: 13.3 },
  { x: 62, y: 16.4 },
  { x: 41, y: 19.5 },
  { x: 56, y: 22.6 },
  { x: 55, y: 25.7 },
  { x: 39, y: 28.8 },
  { x: 63, y: 31.9 },
  { x: 41, y: 35.0 },
  { x: 55, y: 38.1 },
  { x: 55, y: 41.2 },
  { x: 38, y: 44.3 },
  { x: 62, y: 47.4 },
  { x: 43, y: 50.5 },
  { x: 50, y: 53.6 },
  { x: 58, y: 56.7 },
  { x: 37, y: 59.8 },
  { x: 64, y: 62.9 },
  { x: 45, y: 66.0 },
  { x: 50, y: 69.1 },
  { x: 56, y: 72.2 },
  { x: 39, y: 75.3 },
  { x: 63, y: 78.4 },
  { x: 43, y: 81.5 },
  { x: 49, y: 84.6 },
  { x: 57, y: 87.7 },
  { x: 37, y: 90.8 },
  { x: 61, y: 93.9 },
  { x: 40, y: 98.0 },
]
const FALLBACK_Y_START_PERCENT = 4
const FALLBACK_Y_END_PERCENT = 96

const getLinearPercent = (order, total, start, end) => {
  if (total <= 1) return start
  return start + ((order - 1) / (total - 1)) * (end - start)
}

export const buildNodePositions = (
  lessons,
  {
    centerX = 50,
    sway = 17,
    phase = 0,
  } = {}
) =>
  lessons.map((lesson, index) => {
    const order = lesson.order || index + 1
    const total = lessons.length || 1
    const fixed = RED_DOT_NODE_POINTS[order - 1]
    if (fixed && order <= RED_DOT_NODE_POINTS.length) {
      return {
        id: lesson.id,
        x: fixed.x,
        y: fixed.y,
      }
    }

    const y = getLinearPercent(
      order,
      total,
      FALLBACK_Y_START_PERCENT,
      FALLBACK_Y_END_PERCENT
    )
    const smoothOrder = order - RED_DOT_NODE_POINTS.length
    const smoothTotal = Math.max(total - RED_DOT_NODE_POINTS.length, 1)
    const t = smoothTotal <= 1 ? 0 : smoothOrder / smoothTotal
    const theta = t * Math.PI * 3.2
    const x = centerX + sway * Math.sin(theta + phase)

    return {
      id: lesson.id,
      x: Math.max(26, Math.min(74, Number(x.toFixed(2)))),
      y: Math.max(5, Math.min(95, Number(y.toFixed(2)))),
    }
  })

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
