import { useEffect, useRef, useState } from 'react'
import LessonNode from './LessonNode.jsx'
import {
  buildNodePositions,
  getCurrentLessonId,
  getLessonStatus,
  PATHWAY_MAP_HEIGHT,
} from '../../utils/path.js'

function PathMap({ lessons, progress, onSelectLesson }) {
  const containerRef = useRef(null)
  const mapFrameRef = useRef(null)
  const [mapWidth, setMapWidth] = useState(0)
  const [bgAspectRatio, setBgAspectRatio] = useState(0.66)
  const completedIds = progress.completedLessons
  const currentLessonId = getCurrentLessonId(lessons, completedIds)
  const completedResources = progress.completedResources || {}

  const tileHeight = Math.max(420, Math.round((mapWidth || 720) * bgAspectRatio))
  const points = buildNodePositions(lessons, { tileHeight })
  const lastPoint = points[points.length - 1]
  const pathHeight = Math.max(PATHWAY_MAP_HEIGHT, (lastPoint?.y || 0) + 220)

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
    if (!mapFrameRef.current || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry?.contentRect?.width) {
        setMapWidth(entry.contentRect.width)
      }
    })
    observer.observe(mapFrameRef.current)
    return () => observer.disconnect()
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
        ref={mapFrameRef}
        className="relative overflow-hidden rounded-2xl p-3 shadow-[0_12px_0_rgba(15,23,42,0.12)] sm:p-6"
        style={{
          backgroundImage: "url('/images/pathway-bg.png.webp')",
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'repeat-y',
        }}
      >
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
                collectedStars={Object.entries(completedResources[lesson.id] || {}).filter(([key, value]) => value && key !== 'Video').length}
              totalStars={(lesson.content?.resources || []).filter((section) => section.title !== 'Video').length}
              cardSide={point.x >= 52 ? 'left' : 'right'}
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
    </div>
  )
}

export default PathMap
