import { useEffect, useRef, useState } from 'react'
import LessonNode from './LessonNode.jsx'
import {
  buildNodePositions,
  getCurrentLessonId,
  getLessonStatus,
} from '../../utils/path.js'

function PathMap({ lessons, progress, onSelectLesson }) {
  const containerRef = useRef(null)
  const [bgAspectRatio, setBgAspectRatio] = useState(0.66)
  const completedIds = progress.completedLessons
  const currentLessonId = getCurrentLessonId(lessons, completedIds)
  const completedResources = progress.completedResources || {}

  const points = buildNodePositions(lessons)

  useEffect(() => {
    const img = new Image()
    img.src = '/images/pathway-bg.png.webp'
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setBgAspectRatio(img.naturalHeight / img.naturalWidth)
      }
    }
  }, [])

  useEffect(() => {
    if (!currentLessonId || !containerRef.current) return
    const node = containerRef.current.querySelector(
      `[data-lesson-id="${currentLessonId}"]`
    )
    if (node && typeof node.scrollIntoView === 'function') {
      node.scrollIntoView({ block: 'center', behavior: 'smooth' })
    }
  }, [currentLessonId])

  return (
    <div
      ref={containerRef}
      className="group relative"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-3 shadow-[0_12px_0_rgba(15,23,42,0.12)] sm:p-6"
        style={{
          aspectRatio: `${1 / bgAspectRatio}`,
          backgroundImage: "url('/images/pathway-bg.png.webp')",
          backgroundSize: '100% 100%',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="relative h-full w-full">
          {lessons.map((lesson, index) => {
            const point = points[index]
            const status = getLessonStatus(lesson, completedIds, currentLessonId)
            const isMilestone = lesson.order % 5 === 0

            return (
              <LessonNode
                key={lesson.id}
                lesson={lesson}
                status={status}
                onClick={() => onSelectLesson(lesson.id)}
                isMilestone={isMilestone}
                collectedStars={Object.entries(completedResources[lesson.id] || {}).filter(([key, value]) => value && key !== 'Video').length}
              totalStars={(lesson.content?.resources || []).filter((section) => section.title !== 'Video').length}
              cardSide={point.x >= 52 ? 'left' : 'right'}
              style={{
                left: `${point.x}%`,
                top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                dataLessonId={lesson.id}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PathMap
