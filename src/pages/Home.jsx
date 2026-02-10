import { useMemo, useState } from 'react'
import PathMap from '../components/path/PathMap.jsx'
import { MODULES, ORDERED_LESSONS } from '../data/content.js'
import { loadProgress, resetProgress, setCurrentLesson } from '../utils/storage.js'

function Home() {
  const [progress, setProgress] = useState(() => loadProgress())

  const lessons = useMemo(() => ORDERED_LESSONS, [])

  const handleSelectLesson = (lessonId) => {
    const nextProgress = setCurrentLesson(lessonId)
    setProgress(nextProgress)
    window.location.hash = `#/lesson/${lessonId}`
  }

  const handleReset = () => {
    const nextProgress = resetProgress()
    setProgress(nextProgress)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Linus 3M
          </p>
          <h1 className="text-2xl font-bold text-slate-900">
            Learning Path
          </h1>
          <p className="text-sm text-slate-600">
            Tap lesson nodes to start. Progress is saved locally.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        <section className="mb-6 rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Progress</p>
              <p className="text-lg font-semibold text-slate-900">
                {progress.completedLessons.length} of {lessons.length} completed
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold text-red-500 hover:text-red-600"
            >
              Reset
            </button>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${
                  lessons.length === 0
                    ? 0
                    : (progress.completedLessons.length / lessons.length) * 100
                }%`,
              }}
            />
          </div>
        </section>

        <section className="mb-6 grid gap-3 sm:grid-cols-3">
          {MODULES.map((module) => (
            <div
              key={module.id}
              className="rounded-xl border border-slate-200 bg-white p-4"
            >
              <div
                className="h-2 w-10 rounded-full"
                style={{ backgroundColor: module.color }}
              />
              <h2 className="mt-3 text-sm font-semibold text-slate-900">
                {module.name}
              </h2>
              <p className="text-xs text-slate-500">{module.description}</p>
            </div>
          ))}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-base font-semibold text-slate-900">
            Path Nodes
          </h2>
          <PathMap
            lessons={lessons}
            progress={progress}
            onSelectLesson={handleSelectLesson}
          />
        </section>
      </main>
    </div>
  )
}

export default Home
