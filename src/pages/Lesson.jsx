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
  setLessonStars,
  setCurrentLesson,
} from '../utils/storage.js'
import VideoPlayer from '../components/lesson/VideoPlayer.jsx'
import SlideViewer from '../components/lesson/SlideViewer.jsx'
import Exercise from '../components/lesson/Exercise.jsx'
import Celebration from '../components/celebration/Celebration.jsx'
import { playCelebrate } from '../utils/sfx.js'

const buildTabs = (content) => {
  const tabs = []
  if (content?.video) tabs.push({ id: 'video', label: 'Video' })
  if (content?.slides) tabs.push({ id: 'slides', label: 'Slides' })
  if (content?.exercise) tabs.push({ id: 'exercise', label: 'Exercise' })
  return tabs
}

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
  const tabs = buildTabs(lesson.content)
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'slides')
  const [selectedStars, setSelectedStars] = useState(3)
  const [showCelebration, setShowCelebration] = useState(false)
  const hasCelebratedRef = useRef(false)

  useEffect(() => {
    const storedStars = progress.stars?.[lesson.id]
    setSelectedStars(storedStars || 3)
  }, [lesson.id, progress.stars])

  const handleComplete = () => {
    const withStars = setLessonStars(lesson.id, selectedStars)
    const nextProgress = markLessonComplete(lesson.id)
    setProgress({ ...nextProgress, stars: withStars.stars })
  }

  useEffect(() => {
    if (!isCompleted || hasCelebratedRef.current) return
    hasCelebratedRef.current = true
    setShowCelebration(true)
    playCelebrate()
  }, [isCompleted])

  const handleContinue = () => {
    if (!nextLessonId) {
      window.location.hash = '#/'
      return
    }
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
    return <SlideViewer slides={lesson.content?.slides} />
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
        <section className="mb-4 rounded-xl border border-slate-200 bg-white p-4">
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
                    : 'bg-slate-100 text-slate-600')
                }
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5">
          {renderTab()}
        </section>

        <section className="mt-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
            Stars:
            {[1, 2, 3].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedStars(value)}
                className={
                  'rounded-full px-2 py-1 text-xs font-semibold transition ' +
                  (selectedStars === value
                    ? 'bg-amber-400 text-white'
                    : 'bg-slate-100 text-slate-600')
                }
              >
                {value}
              </button>
            ))}
          </div>
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
        </section>

        {isCompleted && (
          <section className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            Great job! You earned {progress.stars?.[lesson.id] || selectedStars}{' '}
            stars.
          </section>
        )}

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

      <Celebration
        isVisible={showCelebration}
        onDone={() => setShowCelebration(false)}
      />
    </div>
  )
}

export default Lesson
