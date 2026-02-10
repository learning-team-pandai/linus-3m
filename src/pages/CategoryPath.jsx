import { useEffect, useMemo, useState } from 'react'
import { LESSONS, MODULES } from '../data/content.js'
import { loadProgress, resetProgress, setCurrentLesson } from '../utils/storage.js'
import PathMap from '../components/path/PathMap.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'

function CategoryPath({ categoryId }) {
  const [progress, setProgress] = useState(() => loadProgress())
  const [isLoading, setIsLoading] = useState(true)

  const category = useMemo(
    () => MODULES.find((cat) => cat.id === categoryId),
    [categoryId]
  )
  const lessons = useMemo(
    () => LESSONS.filter((lesson) => lesson.moduleId === categoryId),
    [categoryId]
  )
  const completedInCategory = useMemo(() => {
    const lessonIds = new Set(lessons.map((lesson) => lesson.id))
    return progress.completedLessons.filter((id) => lessonIds.has(id))
  }, [lessons, progress.completedLessons])
  const starsInCategory = useMemo(() => {
    const completedResources = progress.completedResources || {}
    return lessons.reduce(
      (acc, lesson) => {
        const total = lesson.content?.resources?.length || 0
        const collected = Object.values(
          completedResources[lesson.id] || {}
        ).filter(Boolean).length
        return {
          total: acc.total + total,
          collected: acc.collected + collected,
        }
      },
      { total: 0, collected: 0 }
    )
  }, [lessons, progress.completedResources])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [])

  const handleSelectLesson = (lessonId) => {
    const nextProgress = setCurrentLesson(lessonId)
    setProgress(nextProgress)
    window.location.hash = `#/lesson/${lessonId}`
  }

  const handleReset = () => {
    const nextProgress = resetProgress()
    setProgress(nextProgress)
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            Category not found
          </h1>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/'
            }}
            className="mt-4 rounded-full p-2 text-emerald-500 dark:text-emerald-300"
            aria-label="Back"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Linus 3M
              </p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {category.name}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {category.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/'
              }}
              className="rounded-full p-2 text-emerald-500 dark:text-emerald-300"
              aria-label="Back"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Progress</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {completedInCategory.length} of {lessons.length} completed
              </p>
              <div className="mt-2 flex items-center gap-1">
                {Array.from({ length: starsInCategory.total }).map((_, index) => {
                  const isCollected = index < starsInCategory.collected
                  return (
                    <svg
                      key={`category-star-${index}`}
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 ${isCollected ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                      aria-hidden="true"
                      fill="currentColor"
                    >
                      <path d="M12 2l2.9 6.1 6.7.6-5 4.5 1.5 6.6L12 16.9 5.9 19.8 7.4 13 2.4 8.7l6.7-.6L12 2z" />
                    </svg>
                  )
                })}
                {starsInCategory.total === 0 && (
                  <span className="text-[11px] text-slate-400">No stars</span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-red-500 hover:text-red-600"
            >
              Reset
            </button>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${
                  lessons.length === 0
                    ? 0
                    : (completedInCategory.length / lessons.length) * 100
                }%`,
              }}
            />
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Path Nodes
            </h2>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-5 w-56" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-52" />
            </div>
          ) : (
            <PathMap
              lessons={lessons}
              progress={progress}
              onSelectLesson={handleSelectLesson}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default CategoryPath
