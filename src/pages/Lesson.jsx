import { useEffect, useMemo, useRef, useState } from 'react'
import {
  getLessonById,
  getModuleById,
  getNextLessonId,
  ORDERED_LESSONS,
} from '../data/content.js'
import {
  loadProgress,
  markLessonComplete,
  markLessonIncomplete,
  markResourceComplete,
  markResourceIncomplete,
  markLessonCelebrated,
  setCurrentLesson,
} from '../utils/storage.js'
import VideoPlayer from '../components/lesson/VideoPlayer.jsx'
import SlideViewer from '../components/lesson/SlideViewer.jsx'
import Exercise from '../components/lesson/Exercise.jsx'
import ResourceLinks from '../components/lesson/ResourceLinks.jsx'
import Celebration from '../components/celebration/Celebration.jsx'
import { playCelebrate } from '../utils/sfx.js'
import Skeleton from '../components/ui/Skeleton.jsx'
import { getStrings } from '../utils/i18n.js'
import FullscreenEmbed from '../components/lesson/FullscreenEmbed.jsx'
import {
  getCompletedLessonIdsByResources,
  isLessonCompleteByResources,
} from '../utils/progress.js'

const buildTabs = (content) => {
  const tabs = []
  if (content?.video) tabs.push({ id: 'video', label: 'Video' })
  if (content?.slides) tabs.push({ id: 'slides', label: 'Slides' })
  if (content?.exercise) tabs.push({ id: 'exercise', label: 'Exercise' })
  return tabs
}

function Lesson({ lessonId }) {
  const [progress, setProgress] = useState(() => loadProgress())
  const strings = getStrings()

  const lesson = useMemo(() => getLessonById(lessonId), [lessonId])
  const module = useMemo(
    () => (lesson ? getModuleById(lesson.moduleId) : null),
    [lesson]
  )
  const levelNumber = useMemo(() => {
    if (!lesson) return null
    if (typeof lesson.order === 'number') return lesson.order
    const idx = ORDERED_LESSONS.findIndex((item) => item.id === lesson.id)
    return idx >= 0 ? idx + 1 : null
  }, [lesson])

  if (!lesson) {
    return (
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="text-xl font-semibold text-slate-900">
            {strings.lessonNotFound}
          </h1>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/'
            }}
            className="btn-3d mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
          >
            {strings.backToPath}
          </button>
        </div>
      </div>
    )
  }

  const isCompleted = isLessonCompleteByResources(
    lesson,
    progress.completedResources || {}
  )
  const nextLessonId = getNextLessonId(lesson.id)
  const tabs = buildTabs(lesson.content)
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'slides')
  const [showCelebration, setShowCelebration] = useState(false)
  const hasCelebratedRef = useRef(false)
  const prevCollectedRef = useRef(0)
  const hasMountedRef = useRef(false)
  const [isTabLoading, setIsTabLoading] = useState(false)
  const [activeVideo, setActiveVideo] = useState(null)

  const resourceSections = lesson.content?.resources || []
  const videoSection = resourceSections.find((section) => section.title === 'Video')
  const nonVideoSections = resourceSections.filter(
    (section) => section.title !== 'Video'
  )
  const allActivitySections = resourceSections
  const completedSections = progress.completedResources?.[lesson.id] || {}
  const completedLessonIds = useMemo(
    () =>
      getCompletedLessonIdsByResources(
        ORDERED_LESSONS,
        progress.completedResources || {}
      ),
    [progress.completedResources]
  )
  const allActivitiesCompleted =
    allActivitySections.length > 0 &&
    allActivitySections.every((section) => completedSections[section.title])
  const totalStars = nonVideoSections.length || 0
  const collectedStars = nonVideoSections.reduce(
    (sum, section) => sum + (completedSections[section.title] ? 1 : 0),
    0
  )

  useEffect(() => {
    if (!activeTab) return
    setIsTabLoading(true)
    const timer = setTimeout(() => setIsTabLoading(false), 200)
    return () => clearTimeout(timer)
  }, [activeTab])

  const handleComplete = () => {
    if (!allActivitiesCompleted) return
    const nextProgress = markLessonComplete(lesson.id)
    setProgress(nextProgress)
  }

  const handleSectionStatusChange = (sectionTitle, shouldComplete) => {
    const nextProgress = shouldComplete
      ? markResourceComplete(lesson.id, sectionTitle)
      : markResourceIncomplete(lesson.id, sectionTitle)
    setProgress(nextProgress)
    const nextCompleted = nextProgress.completedResources?.[lesson.id] || {}
    const doneCount = allActivitySections.reduce(
      (sum, section) => sum + (nextCompleted[section.title] ? 1 : 0),
      0
    )
    if (allActivitySections.length > 0 && doneCount === allActivitySections.length) {
      const updated = markLessonComplete(lesson.id)
      setProgress(updated)
      if (
        !hasCelebratedRef.current &&
        !updated.celebratedLessons?.includes(lesson.id)
      ) {
        hasCelebratedRef.current = true
        setShowCelebration(true)
        playCelebrate()
        const celebrated = markLessonCelebrated(lesson.id)
        setProgress(celebrated)
      }
      return
    }

    if (!shouldComplete && isCompleted) {
      const updated = markLessonIncomplete(lesson.id)
      setProgress(updated)
    }
  }

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    if (!isCompleted || hasCelebratedRef.current) return
    if (
      nonVideoSections.length > 0 &&
      collectedStars === nonVideoSections.length &&
      !progress.celebratedLessons?.includes(lesson.id)
    ) {
      hasCelebratedRef.current = true
      setShowCelebration(true)
      playCelebrate()
      const celebrated = markLessonCelebrated(lesson.id)
      setProgress(celebrated)
    }
  }, [isCompleted, collectedStars, nonVideoSections.length, progress.celebratedLessons, lesson.id])

  useEffect(() => {
    prevCollectedRef.current = collectedStars
  }, [collectedStars])

  const handleContinue = () => {
    if (!nextLessonId) {
      window.location.hash = '#/'
      return
    }
    if (!allActivitiesCompleted) return
    const nextProgress = setCurrentLesson(nextLessonId)
    setProgress(nextProgress)
    window.location.hash = `#/lesson/${nextLessonId}`
  }

  const renderTab = () => {
    if (activeTab === 'video') {
      return (
        <VideoPlayer
          src={lesson.content?.video?.src}
          poster={lesson.content?.video?.poster}
          onComplete={lesson.completion?.type === 'watch' ? handleComplete : null}
        />
      )
    }
    if (activeTab === 'exercise') {
      return (
        <Exercise
          exercise={lesson.content?.exercise}
          onComplete={lesson.completion?.type === 'interact' ? handleComplete : null}
        />
      )
    }
    if (activeTab === 'slides') {
      return <SlideViewer slides={lesson.content?.slides} />
    }
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-2xl items-start justify-between gap-3 px-4 py-5">
          <div className="flex min-w-0 items-start gap-3 sm:gap-4">
            {levelNumber ? (
              <span className="shrink-0 text-4xl font-bold leading-none text-slate-900 dark:text-slate-100 sm:text-5xl">
                {levelNumber}
              </span>
            ) : null}
            <div className="min-w-0 pt-0.5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 font-playpen">
                {module ? module.name : 'Module'}
              </p>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 font-playpen sm:text-xl">
                {lesson.title}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">{lesson.duration}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.hash = `#/path/${lesson.moduleId}`
            }}
            className="btn-3d btn-3d--icon rounded-full border border-slate-300 p-2 text-emerald-500 dark:border-slate-600 dark:text-emerald-300"
            aria-label={strings.backToPath}
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
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {tabs.length > 0 && (
          <section className="card-hover mb-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={
                    'rounded-full px-4 py-1 text-xs font-semibold transition ' +
                    (activeTab === tab.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {tabs.length > 0 && (
          <section className="card-hover rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            {isTabLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-4 w-56" />
              </div>
            ) : (
              renderTab()
            )}
          </section>
        )}

        {videoSection && (
          <section className="card-hover mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={() =>
                setActiveVideo({
                  url: videoSection.links?.[0]?.url,
                  title: `${lesson.title} video`,
                  openedAt: Date.now(),
                })
              }
              className="btn-3d w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm font-semibold text-emerald-600 hover:text-emerald-700 dark:border-slate-800 dark:bg-slate-950 dark:text-emerald-300"
            >
              {strings.view} {strings.video}
            </button>
          </section>
        )}

        {nonVideoSections.length > 0 && (
          <section className="card-hover mt-4 rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <ResourceLinks
              sections={nonVideoSections}
              completedSections={completedSections}
              onSectionStatusChange={handleSectionStatusChange}
            />
          </section>
        )}

        <section className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {strings.stars}:
            <div className="flex items-center gap-1">
              {Array.from({ length: totalStars }).map((_, index) => {
                const isCollected = index < collectedStars
                return (
                  <svg
                    key={`star-${index}`}
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 ${isCollected ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'}`}
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.9 6.1 6.7.6-5 4.5 1.5 6.6L12 16.9 5.9 19.8 7.4 13 2.4 8.7l6.7-.6L12 2z" />
                  </svg>
                )
              })}
              {totalStars === 0 && (
                <span className="text-[11px] text-slate-400">{strings.noStars}</span>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleContinue}
            disabled={Boolean(nextLessonId) && !allActivitiesCompleted}
            className={
              'btn-3d w-full rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold sm:w-auto dark:border-slate-800 ' +
              (Boolean(nextLessonId) && !allActivitiesCompleted
                ? 'cursor-not-allowed text-slate-400 dark:text-slate-500'
                : 'text-slate-700 dark:text-slate-300')
            }
          >
            {nextLessonId ? strings.nextLesson : strings.backToPath}
          </button>
        </section>

        {isCompleted && (
          <section
            className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700 dark:border-emerald-400/40 dark:bg-emerald-500/10 dark:text-emerald-200"
            role="status"
            aria-live="polite"
          >
            {strings.greatJob} {collectedStars} {strings.stars}.
          </section>
        )}

        <section className="card-hover mt-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {strings.progressSnapshot}
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {completedLessonIds.length} / {ORDERED_LESSONS.length} {strings.completed}
          </p>
        </section>
      </main>

      <Celebration
        isVisible={showCelebration}
        onDone={() => setShowCelebration(false)}
      />
      <FullscreenEmbed
        isOpen={Boolean(activeVideo)}
        url={activeVideo?.url}
        title={activeVideo?.title}
        openedAt={activeVideo?.openedAt}
        durationMs={10000}
        onClose={() => {
          if (
            !isCompleted &&
            activeVideo?.openedAt &&
            Date.now() - activeVideo.openedAt >= 10000
          ) {
            const nextProgress = markResourceComplete(lesson.id, 'Video')
            setProgress(nextProgress)
            const nextCompleted = nextProgress.completedResources?.[lesson.id] || {}
            const doneCount = allActivitySections.reduce(
              (sum, section) => sum + (nextCompleted[section.title] ? 1 : 0),
              0
            )
            if (allActivitySections.length > 0 && doneCount === allActivitySections.length) {
              const updated = markLessonComplete(lesson.id)
              setProgress(updated)
              if (!updated.celebratedLessons?.includes(lesson.id)) {
                hasCelebratedRef.current = true
                setShowCelebration(true)
                playCelebrate()
                const celebrated = markLessonCelebrated(lesson.id)
                setProgress(celebrated)
              }
            }
          }
          setActiveVideo(null)
        }}
      />
    </div>
  )
}

export default Lesson
