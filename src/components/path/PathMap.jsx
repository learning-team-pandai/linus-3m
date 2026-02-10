import { useEffect, useRef } from 'react'
import LessonNode from './LessonNode.jsx'
import PathLine from './PathLine.jsx'
import {
  buildNodePositions,
  getCurrentLessonId,
  getLessonStatus,
} from '../../utils/path.js'

function PathMap({ lessons, progress, onSelectLesson }) {
  const containerRef = useRef(null)
  const completedIds = progress.completedLessons
  const currentLessonId = getCurrentLessonId(lessons, completedIds)
  const completedResources = progress.completedResources || {}

  const points = buildNodePositions(lessons)
  const lastPoint = points[points.length - 1]
  const pathHeight = lastPoint ? lastPoint.y + 80 : 200
  const currentIndex = currentLessonId
    ? lessons.findIndex((lesson) => lesson.id === currentLessonId)
    : lessons.length - 1
  const activeCount = currentIndex >= 0 ? currentIndex + 1 : 1

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
    <div ref={containerRef} className="relative min-h-[300px] md:min-h-[400px]">
      <PathLine
        points={points}
        activeCount={activeCount}
        height={pathHeight}
        className="absolute left-0 top-0 h-full w-full"
      />
      <div className="relative" style={{ height: pathHeight }}>
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
              collectedStars={Object.values(completedResources[lesson.id] || {}).filter(Boolean).length}
              totalStars={lesson.content?.resources?.length || 0}
              style={{
                left: `${point.x}%`,
                top: `${point.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
              dataLessonId={lesson.id}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PathMap
