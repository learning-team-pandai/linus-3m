import { useEffect, useMemo, useState } from 'react'
import { LESSONS, MODULES } from '../data/content.js'
import { loadProgress, resetCategoryProgress, setCurrentLesson } from '../utils/storage.js'
import PathMap from '../components/path/PathMap.jsx'
import Skeleton from '../components/ui/Skeleton.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'
import { getStrings } from '../utils/i18n.js'
import { getCompletedLessonIdsByResources } from '../utils/progress.js'

function CategoryPath({ categoryId }) {
  const [progress, setProgress] = useState(() => loadProgress())
  const [isLoading, setIsLoading] = useState(true)
  const [showResetModal, setShowResetModal] = useState(false)
  const [isProgressPanelOpen, setIsProgressPanelOpen] = useState(false)
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
    return getCompletedLessonIdsByResources(
      lessons,
      progress.completedResources || {}
    )
  }, [lessons, progress.completedResources])
  const progressPercent = useMemo(() => {
    if (!lessons.length) return 0
    return Math.round((completedInCategory.length / lessons.length) * 100)
  }, [completedInCategory.length, lessons.length])
  const progressPercentColor =
    progressPercent < 50
      ? '#ef4444'
      : progressPercent < 80
        ? '#f59e0b'
        : '#10b981'
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
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-5 sm:py-6">
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 font-playpen">
                {strings.appName}
              </p>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-playpen sm:text-2xl">
                {category.name}
              </h1>
              <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                {category.description}
              </p>
            </div>
            <div className="relative flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsProgressPanelOpen((prev) => !prev)}
                className="peer btn-3d btn-3d--icon rounded-full border border-slate-300 p-2 text-slate-600 hover:text-slate-700 dark:border-slate-600 dark:text-slate-300"
                aria-label={isProgressPanelOpen ? 'Hide progress panel' : 'Show progress panel'}
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
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </button>
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
              <div
                className={
                  'pointer-events-none fixed left-2 right-2 top-20 rounded-xl border p-3 opacity-0 backdrop-blur-md transition-all duration-200 sm:absolute sm:left-auto sm:right-16 sm:top-12 sm:w-[22rem] sm:p-4 ' +
                  (isProgressPanelOpen
                    ? 'pointer-events-auto translate-y-0 opacity-100'
                    : 'peer-hover:pointer-events-auto peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus-visible:pointer-events-auto peer-focus-visible:translate-y-0 peer-focus-visible:opacity-100')
                }
                style={{
                  borderColor: pathTheme.border,
                  backgroundColor: 'rgba(255,255,255,0.92)',
                  boxShadow: '0 8px 20px rgba(15, 23, 42, 0.12)',
                }}
              >
                <p className="text-xs text-slate-600 sm:text-sm">{strings.progress}</p>
                <p
                  className="text-base font-semibold sm:text-lg"
                  style={{ color: pathTheme.title }}
                >
                  {completedInCategory.length} / {lessons.length} {strings.completed}{' '}
                  <span style={{ color: progressPercentColor }}>({progressPercent}%)</span>
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200/80">
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
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5 sm:py-6">
        <section className="relative rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
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
              progress={{
                ...progress,
                completedLessons: completedInCategory,
              }}
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
