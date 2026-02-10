import LessonNode from './LessonNode.jsx'
import PathLine from './PathLine.jsx'
import {
  buildNodePositions,
  getCurrentLessonId,
  getLessonStatus,
} from '../../utils/path.js'

function PathMap({ lessons, progress, onSelectLesson }) {
  const completedIds = progress.completedLessons
  const currentLessonId = getCurrentLessonId(lessons, completedIds)

  const points = buildNodePositions(lessons)
  const lastPoint = points[points.length - 1]
  const pathHeight = lastPoint ? lastPoint.y + 80 : 200

  return (
    <div className="relative min-h-[300px]">
      <PathLine
        points={points}
        height={pathHeight}
        className="absolute left-0 top-0 h-full w-full"
      />
      <div className="relative" style={{ height: pathHeight }}>
        {lessons.map((lesson, index) => {
          const point = points[index]
          const status = getLessonStatus(lesson, completedIds, currentLessonId)

          return (
            <LessonNode
              key={lesson.id}
              lesson={lesson}
              status={status}
              onClick={() => onSelectLesson(lesson.id)}
              style={{
                left: `${point.x}%`,
                top: `${point.y}px`,
                transform: 'translate(-50%, -50%)',
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default PathMap
