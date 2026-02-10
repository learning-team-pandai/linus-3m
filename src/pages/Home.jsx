import { useEffect, useMemo, useState } from 'react'
import { MODULES, ORDERED_LESSONS } from '../data/content.js'
import { loadProgress, resetProgress } from '../utils/storage.js'
import Skeleton from '../components/ui/Skeleton.jsx'

function Home() {
  const [progress, setProgress] = useState(() => loadProgress())
  const [isLoading, setIsLoading] = useState(true)

  const completedStarsByLesson = useMemo(() => {
    const completedResources = progress.completedResources || {}
    return Object.entries(completedResources).reduce((acc, [lessonId, lessonMap]) => {
      if (!lessonMap || typeof lessonMap !== 'object') return acc
      acc[lessonId] = Object.values(lessonMap).filter(Boolean).length
      return acc
    }, {})
  }, [progress.completedResources])

  const totalStars = useMemo(() => {
    return Object.values(completedStarsByLesson).reduce((sum, value) => sum + value, 0)
  }, [completedStarsByLesson])


  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250)
    return () => clearTimeout(timer)
  }, [])

  const handleReset = () => {
    const nextProgress = resetProgress()
    setProgress(nextProgress)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 font-playpen">
                Linus 3M
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Tap lesson nodes to start. Progress is saved locally.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/settings'
              }}
              className="rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              aria-label="Settings"
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
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c0 .67.26 1.31.73 1.78.47.47 1.11.73 1.78.73H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
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
                {progress.completedLessons.length} of {ORDERED_LESSONS.length} completed
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Total stars: {totalStars}</p>
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
                  ORDERED_LESSONS.length === 0
                    ? 0
                    : (progress.completedLessons.length / ORDERED_LESSONS.length) * 100
                }%`,
              }}
            />
          </div>
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-2">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`module-skeleton-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <Skeleton className="h-2 w-10" />
                  <Skeleton className="mt-3 h-4 w-24" />
                  <Skeleton className="mt-2 h-3 w-32" />
                </div>
              ))
            : MODULES.map((module) => (
                <div
                  key={module.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
                >
                  <div
                    className="h-2 w-10 rounded-full"
                    style={{ backgroundColor: module.color }}
                  />
                  <h2 className="mt-3 text-sm font-semibold text-slate-900 dark:text-slate-100 font-playpen">
                    {module.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{module.description}</p>
                  <button
                    type="button"
                    onClick={() => {
                      window.location.hash = `#/path/${module.id}`
                    }}
                    className="mt-3 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white"
                  >
                    Open Path
                  </button>
                </div>
              ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          Select a path to start learning.
        </section>
      </main>
    </div>
  )
}

export default Home
