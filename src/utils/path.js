export const PATHWAY_MAP_HEIGHT = 1400

// Zigzag-corner path for BM map to keep nodes on each S-turn corner.
const BM_FIXED_X = {
  1: 60,
  2: 41,
  3: 59,
  4: 40,
}
const BM_TUNE_START_ORDER = 5
const BM_CORNER_X_PATTERN_FROM_5 = [59, 40, 60, 41, 59, 40, 60, 41]
const BM_STEP_Y_PATTERN_BASE = [126, 142, 118, 150]
const BM_STEP_Y_PATTERN_FROM_5 = [120, 146, 122, 148, 124, 144, 120, 150]
const BM_Y_OFFSET = {
  5: 20,
  6: 70,
}

export const buildNodePositions = (
  lessons,
  {
    startY = 140,
    stepY = 108,
    tileHeight = 680,
    centerX = 50,
    sway = 17,
    phase = 0,
  } = {}
) =>
  lessons.map((lesson, index) => {
    const order = lesson.order || index + 1
    const isBm = lesson.moduleId === 'membaca-menulis'
    let y = Math.round(startY + index * stepY)
    if (isBm) {
      let accum = startY
      for (let i = 1; i < order; i += 1) {
        const stepPattern = i >= BM_TUNE_START_ORDER
          ? BM_STEP_Y_PATTERN_FROM_5
          : BM_STEP_Y_PATTERN_BASE
        accum += stepPattern[(i - 1) % stepPattern.length]
      }
      y = Math.round(accum + (BM_Y_OFFSET[order] || 0))
    }
    const localY = ((y % tileHeight) + tileHeight) % tileHeight
    const theta = (localY / tileHeight) * (Math.PI * 2) + phase
    const xFromCurve = centerX + sway * Math.sin(theta)
    let x = xFromCurve
    if (isBm) {
      if (BM_FIXED_X[order] != null) {
        x = BM_FIXED_X[order]
      } else {
        x =
          BM_CORNER_X_PATTERN_FROM_5[
            (Math.max(order, BM_TUNE_START_ORDER) - BM_TUNE_START_ORDER) %
              BM_CORNER_X_PATTERN_FROM_5.length
          ]
      }
    }
    return {
      id: lesson.id,
      x: Math.max(26, Math.min(74, Number(x.toFixed(2)))),
      y,
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
