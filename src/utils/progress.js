export const isLessonCompleteByResources = (lesson, completedResources = {}) => {
  const sections = lesson?.content?.resources || []
  if (!sections.length) return false
  const lessonMap = completedResources?.[lesson.id] || {}
  return sections.every((section) => Boolean(lessonMap[section.title]))
}

export const getCompletedLessonIdsByResources = (
  lessons = [],
  completedResources = {}
) =>
  lessons
    .filter((lesson) => isLessonCompleteByResources(lesson, completedResources))
    .map((lesson) => lesson.id)

