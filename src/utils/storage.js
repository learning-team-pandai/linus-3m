const STORAGE_KEY = 'linus3m-progress'

const defaultProgress = {
  completedLessons: [],
  currentLessonId: null,
  lastAccessed: null,
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

export const resetProgress = () => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Storage reset error:', error)
  }
  return { ...defaultProgress }
}
