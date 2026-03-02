import { useEffect, useMemo, useState } from 'react'
import { MODULES, ORDERED_LESSONS } from '../data/content.js'
import { loadProgress, resetProgress } from '../utils/storage.js'
import { getCompletedLessonIdsByResources } from '../utils/progress.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import ConfirmModal from '../components/ui/ConfirmModal.jsx'
import { getStrings } from '../utils/i18n.js'

function Home() {
  const [progress, setProgress] = useState(() => loadProgress())
  const [isLoading, setIsLoading] = useState(true)
  const [showResetModal, setShowResetModal] = useState(false)
  const strings = getStrings()

  const cardThemes = {
    'membaca-menulis': {
      border: '#9BCFF2',
      accent: '#4FA7E6',
      iconBg: '#5CB2F0',
      iconShadow: '#2F7FB8',
      title: '#2F6FA3',
    },
    mengira: {
      border: '#8AD7B8',
      accent: '#55C496',
      iconBg: '#67C9A4',
      iconShadow: '#3B9070',
      title: '#2E7A5D',
    },
  }

  const completedStarsByLesson = useMemo(() => {
    const completedResources = progress.completedResources || {}
    return Object.entries(completedResources).reduce(
      (acc, [lessonId, lessonMap]) => {
        if (!lessonMap || typeof lessonMap !== 'object') return acc
        acc[lessonId] = Object.entries(lessonMap).filter(
          ([key, value]) => key !== 'Video' && value
        ).length
        return acc
      },
      {}
    )
  }, [progress.completedResources])

  const effectiveCompletedLessonIds = useMemo(
    () =>
      getCompletedLessonIdsByResources(
        ORDERED_LESSONS,
        progress.completedResources || {}
      ),
    [progress.completedResources]
  )

  const totalStars = useMemo(
    () =>
      Object.values(completedStarsByLesson).reduce(
        (sum, value) => sum + value,
        0
      ),
    [completedStarsByLesson]
  )

  const moduleStats = useMemo(
    () =>
      MODULES.reduce((acc, module) => {
        const moduleLessons = ORDERED_LESSONS.filter(
          (lesson) => lesson.moduleId === module.id
        )
        const totalLessons = moduleLessons.length
        const completedLessons = moduleLessons.filter((lesson) =>
          effectiveCompletedLessonIds.includes(lesson.id)
        ).length
        const collectedStars = moduleLessons.reduce(
          (sum, lesson) => sum + (completedStarsByLesson[lesson.id] || 0),
          0
        )
        const remainingLessons = Math.max(totalLessons - completedLessons, 0)

        acc[module.id] = {
          totalLessons,
          completedLessons,
          collectedStars,
          remainingLessons,
          progressPercent:
            totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100,
        }
        return acc
      }, {}),
    [effectiveCompletedLessonIds, completedStarsByLesson]
  )

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 250)
    return () => clearTimeout(timer)
  }, [])

  const handleReset = () => {
    const nextProgress = resetProgress()
    setProgress(nextProgress)
    setShowResetModal(false)
  }

  const navigateTo = (hashPath) => {
    window.location.assign(hashPath)
  }

  const openModulePath = (moduleId) => {
    navigateTo(`#/path/${moduleId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="bg-white border-b border-slate-200 dark:bg-slate-900 dark:border-slate-800">
        <div className="mx-auto max-w-3xl px-4 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100 font-playpen">
                {strings.appName}
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {strings.homeSubtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                navigateTo('#/settings')
              }}
              className="btn-3d btn-3d--icon rounded-lg border border-slate-200 p-2 text-slate-600 dark:border-slate-700 dark:text-slate-300"
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
        <section className="card-hover mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {strings.progress}
              </p>
              <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                {effectiveCompletedLessonIds.length} {strings.ofLabel} {ORDERED_LESSONS.length}{' '}
                {strings.completed}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 text-amber-500"
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.9 6.1 6.7.6-5 4.5 1.5 6.6L12 16.9 5.9 19.8 7.4 13 2.4 8.7l6.7-.6L12 2z" />
                  </svg>
                  <span>
                    {totalStars} {strings.collectedStarsLabel}
                  </span>
                </span>
              </p>
            </div>
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
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${
                  ORDERED_LESSONS.length === 0
                    ? 0
                    : (effectiveCompletedLessonIds.length / ORDERED_LESSONS.length) *
                      100
                }%`,
              }}
            />
          </div>
        </section>

        <section className="mb-6 grid gap-5 sm:grid-cols-2 sm:gap-3">
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
            : MODULES.map((module) => {
                const theme = cardThemes[module.id] || {
                  border: '#CBD5F5',
                  accent: module.color,
                  iconBg: module.color,
                  iconShadow: '#334155',
                  title: '#1E293B',
                }
                const stats = moduleStats[module.id] || {
                  totalLessons: 0,
                  completedLessons: 0,
                  collectedStars: 0,
                  remainingLessons: 0,
                  progressPercent: 0,
                }
                const moduleSubject =
                  module.id === 'membaca-menulis' ? 'Bahasa Melayu' : 'Matematik'

                return (
                  <div
                    key={module.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => openModulePath(module.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        openModulePath(module.id)
                      }
                    }}
                    className="btn-3d rounded-2xl border-2 bg-white p-4 text-left transition active:scale-95 sm:p-6 dark:bg-slate-900"
                    style={{
                      borderColor: theme.border,
                      boxShadow: `0 10px 0 ${theme.border}, 0 18px 30px rgba(15, 23, 42, 0.08)`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: theme.iconBg,
                          boxShadow: `0 6px 0 ${theme.iconShadow}`,
                        }}
                      >
                        {module.id === 'membaca-menulis' ? (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 16v-6a2 2 0 1 1 4 0v6" />
                            <path d="M3 13h4" />
                            <path d="M10 8v6a2 2 0 1 0 4 0v-1a2 2 0 1 0 -4 0v1" />
                            <path d="M20.732 12a2 2 0 0 0 -3.732 1v1a2 2 0 0 0 3.726 1.01" />
                          </svg>
                        ) : (
                          <svg
                            viewBox="0 0 24 24"
                            className="h-6 w-6 text-white"
                            aria-hidden="true"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M8 10v-7l-2 2" />
                            <path d="M6 16a2 2 0 1 1 4 0c0 .591 -.601 1.46 -1 2l-3 3h4" />
                            <path d="M15 14a2 2 0 1 0 2 -2a2 2 0 1 0 -2 -2" />
                            <path d="M6.5 10h3" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0">
                        <h2
                          className="text-lg font-semibold font-playpen sm:text-xl"
                          style={{ color: theme.title }}
                        >
                          {module.name}
                        </h2>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                          {moduleSubject} - {stats.totalLessons} {strings.moduleUnitLabel}
                        </p>
                      </div>
                    </div>

                    <p className="mt-3 text-3xl font-bold leading-none text-slate-800 sm:text-4xl dark:text-slate-100">
                      {stats.completedLessons}
                      <span className="mx-1 text-slate-500">/</span>
                      {stats.totalLessons}
                      <span className="ml-2 text-sm font-semibold text-slate-600 sm:text-base dark:text-slate-300">
                        {strings.doneLabel}
                      </span>
                    </p>

                    <div className="mt-3 h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${stats.progressPercent}%`,
                          backgroundColor: theme.accent,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      <span className="inline-flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-amber-500"
                          aria-hidden="true"
                          fill="currentColor"
                        >
                          <path d="M12 2l2.9 6.1 6.7.6-5 4.5 1.5 6.6L12 16.9 5.9 19.8 7.4 13 2.4 8.7l6.7-.6L12 2z" />
                        </svg>
                        <span>{stats.collectedStars} {strings.starsLabel}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <svg
                          viewBox="0 0 24 24"
                          className="h-4 w-4 text-slate-500 dark:text-slate-400"
                          aria-hidden="true"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect x="4" y="11" width="16" height="9" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                        <span>{stats.remainingLessons} {strings.remainingLabel}</span>
                      </span>
                    </div>

                  </div>
                )
              })}
        </section>
      </main>

      <ConfirmModal
        isOpen={showResetModal}
        title={strings.resetAllTitle}
        message={strings.resetAllMessage}
        confirmLabel={strings.reset}
        cancelLabel={strings.cancel}
        onConfirm={handleReset}
        onCancel={() => setShowResetModal(false)}
      />
    </div>
  )
}

export default Home
