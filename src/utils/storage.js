const STORAGE_KEY = 'linus3m-progress'

const defaultProgress = {
  completedLessons: [],
  currentLessonId: null,
  lastAccessed: null,
  stars: {},
  completedResources: {},
}

export const loadProgress = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return { ...defaultProgress }
    const parsed = JSON.parse(saved)
    return {
      ...defaultProgress,
      ...parsed,
      completedLessons: Array.isArray(parsed.completedLessons)
        ? parsed.completedLessons
        : [],
      stars:
        parsed.stars && typeof parsed.stars === 'object' ? parsed.stars : {},
      completedResources:
        parsed.completedResources && typeof parsed.completedResources === 'object'
          ? parsed.completedResources
          : {},
    }
  } catch (error) {
    console.error('Storage read error:', error)
    return { ...defaultProgress }
  }
}

export const saveProgress = (progress) => {
  try {
    const next = {
      ...progress,
      lastAccessed: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  } catch (error) {
    console.error('Storage write error:', error)
    return { ...defaultProgress }
  }
}

export const setCurrentLesson = (lessonId) => {
  const progress = loadProgress()
  return saveProgress({
    ...progress,
    currentLessonId: lessonId,
  })
}

export const markLessonComplete = (lessonId) => {
  const progress = loadProgress()
  if (progress.completedLessons.includes(lessonId)) {
    return progress
  }
  return saveProgress({
    ...progress,
    completedLessons: [...progress.completedLessons, lessonId],
  })
}

export const setLessonStars = (lessonId, stars) => {
  const progress = loadProgress()
  const clamped = Math.max(1, Math.min(3, Number(stars) || 1))
  return saveProgress({
    ...progress,
    stars: {
      ...progress.stars,
      [lessonId]: clamped,
    },
  })
}

export const markResourceComplete = (lessonId, resourceKey) => {
  const progress = loadProgress()
  const lessonResources = progress.completedResources?.[lessonId] || {}
  if (lessonResources[resourceKey]) return progress

  return saveProgress({
    ...progress,
    completedResources: {
      ...progress.completedResources,
      [lessonId]: {
        ...lessonResources,
        [resourceKey]: true,
      },
    },
  })
}

export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Storage reset error:', error)
  }
  return { ...defaultProgress }
}

export const resetCategoryProgress = (lessonIds) => {
  const progress = loadProgress()
  const idSet = new Set(lessonIds)
  const nextCompleted = progress.completedLessons.filter((id) => !idSet.has(id))
  const nextResources = { ...(progress.completedResources || {}) }
  lessonIds.forEach((id) => {
    delete nextResources[id]
  })

  return saveProgress({
    ...progress,
    completedLessons: nextCompleted,
    completedResources: nextResources,
  })
}
