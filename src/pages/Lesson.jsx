import { useMemo, useState } from 'react'
import {
  getLessonById,
  getModuleById,
  getNextLessonId,
  ORDERED_LESSONS,
} from '../data/content.js'
import {
  loadProgress,
  markLessonComplete,
  setCurrentLesson,
} from '../utils/storage.js'

function Lesson({ lessonId }) {
  const [progress, setProgress] = useState(() => loadProgress())

  const lesson = useMemo(() => getLessonById(lessonId), [lessonId])
  const module = useMemo(
    () => (lesson ? getModuleById(lesson.moduleId) : null),
    [lesson]
  )

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-xl font-semibold text-slate-900">
            Lesson not found
          </h1>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/'
            }}
            className="mt-4 text-sm font-semibold text-blue-500"
          >
            Back to path
          </button>
        </div>
      </div>
    )
  }

  const isCompleted = progress.completedLessons.includes(lesson.id)
  const nextLessonId = getNextLessonId(lesson.id)

  const handleComplete = () => {
    const nextProgress = markLessonComplete(lesson.id)
    setProgress(nextProgress)
  }

  const handleContinue = () => {
    if (!nextLessonId) {
      window.location.hash = '#/'
      return
    }
    const nextProgress = setCurrentLesson(nextLessonId)
    setProgress(nextProgress)
    window.location.hash = `#/lesson/${nextLessonId}`
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {module ? module.name : 'Module'}
            </p>
            <h1 className="text-xl font-semibold text-slate-900">
              {lesson.title}
            </h1>
            <p className="text-xs text-slate-500">{lesson.duration}</p>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/'
            }}
            className="text-sm font-semibold text-blue-500"
          >
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-600">
            Lesson content will be added here in Phase 4. For now, this is a
            placeholder view for navigation and progress testing.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleComplete}
              className={
                'rounded-lg px-4 py-2 text-sm font-semibold text-white ' +
                (isCompleted ? 'bg-emerald-400' : 'bg-emerald-500')
              }
            >
              {isCompleted ? 'Completed' : 'Mark Complete'}
            </button>
            <button
              type="button"
              onClick={handleContinue}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              {nextLessonId ? 'Next Lesson' : 'Back to Path'}
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Progress Snapshot
          </h2>
          <p className="mt-2 text-xs text-slate-500">
            Completed lessons: {progress.completedLessons.length} of{' '}
            {ORDERED_LESSONS.length}
          </p>
        </section>
      </main>
    </div>
  )
}

export default Lesson
