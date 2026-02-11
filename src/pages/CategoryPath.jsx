import { useEffect, useMemo, useRef, useState } from 'react'
import { LESSONS, MODULES } from '../data/content.js'
import { loadProgress, resetCategoryProgress, setCurrentLesson } from '../utils/storage.js'
import PathMap from '../components/path/PathMap.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'
import { getStrings } from '../utils/i18n.js'

function CategoryPath({ categoryId }) {
  const [progress, setProgress] = useState(() => loadProgress())
  const [isLoading, setIsLoading] = useState(true)
  const [showResetModal, setShowResetModal] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const stickySentinelRef = useRef(null)
  const strings = getStrings()
  const pathThemes = {
    'membaca-menulis': {
      border: '#9BCFF2',
      background: '#EAF6FF',
      accent: '#4FA7E6',
      title: '#2F6FA3',
    },
    mengira: {
      border: '#8AD7B8',
      background: '#E9F8F1',
      accent: '#55C496',
      title: '#2E7A5D',
    },
  }

  const category = useMemo(
    () => MODULES.find((cat) => cat.id === categoryId),
    [categoryId]
  )
  const lessons = useMemo(
    () => LESSONS.filter((lesson) => lesson.moduleId === categoryId),
    [categoryId]
  )
  const pathTheme = pathThemes[categoryId] || {
    border: '#CBD5F5',
    background: '#F8FAFF',
    accent: '#4F46E5',
    title: '#1E293B',
  }
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

  useEffect(() => {
    if (!stickySentinelRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSticky(!entry.isIntersecting)
      },
      { threshold: 0 }
    )
    observer.observe(stickySentinelRef.current)
    return () => observer.disconnect()
  }, [])

  const handleSelectLesson = (lessonId) => {
    const nextProgress = setCurrentLesson(lessonId)
    setProgress(nextProgress)
    window.location.hash = `#/lesson/${lessonId}`
  }

  const handleReset = () => {
    const lessonIds = lessons.map((lesson) => lesson.id)
    const nextProgress = resetCategoryProgress(lessonIds)
    setProgress(nextProgress)
    setShowResetModal(false)
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {strings.pathNotFound}
          </h1>
            <button
              type="button"
              onClick={() => {
                window.location.hash = '#/'
              }}
              className="btn-3d btn-3d--icon mt-4 rounded-full p-2 text-emerald-500 dark:text-emerald-300"
              aria-label={strings.back}
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
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 font-playpen">
                {strings.appName}
              </p>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-playpen">
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
              className="btn-3d btn-3d--icon rounded-full border border-slate-300 p-2 text-emerald-500 dark:border-slate-600 dark:text-emerald-300"
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
        <div ref={stickySentinelRef} className="h-0" />
        <section
          className="card-hover sticky top-0 z-10 mb-6 rounded-xl border p-4 backdrop-blur"
          style={{
            borderColor: pathTheme.border,
            backgroundColor: pathTheme.background,
            boxShadow: `0 10px 0 ${pathTheme.border}, 0 18px 30px rgba(15, 23, 42, 0.08)`,
          }}
        >
          <div className="flex items-center gap-4">
            <div>
              <p className="text-sm text-slate-600">{strings.progress}</p>
              <p className="text-lg font-semibold" style={{ color: pathTheme.title }}>
                {completedInCategory.length} of {lessons.length} {strings.completed}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetModal(true)}
                className="btn-3d btn-3d--icon rounded-full border border-slate-300 p-2 text-red-500 hover:text-red-600 dark:border-slate-600"
                aria-label="Reset progress"
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
                  <path d="M3 12a9 9 0 1 0 3-6.7" />
                  <path d="M3 4v4h4" />
                </svg>
              </button>
              {isSticky && (
                <button
                  type="button"
                  onClick={() => {
                    window.location.hash = '#/'
                  }}
                  className="btn-3d btn-3d--icon rounded-full border border-slate-300 p-2 text-emerald-500 dark:border-slate-600 dark:text-emerald-300"
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
              )}
            </div>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/60">
            <div
              className="h-full rounded-full transition-all"
              style={{
                backgroundColor: pathTheme.accent,
                width: `${
                  lessons.length === 0
                    ? 0
                    : (completedInCategory.length / lessons.length) * 100
                }%`,
              }}
            />
          </div>
        </section>

        <section className="card-hover rounded-xl border border-slate-200 bg-white p-6 pt-10 dark:border-slate-800 dark:bg-slate-900">
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

      <ConfirmModal
        isOpen={showResetModal}
        title={strings.resetPathTitle}
                message={`${strings.resetPathMessage} ${category?.name || ''}`}
        confirmLabel={strings.reset}
        cancelLabel={strings.cancel}
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  )
}

export default CategoryPath
