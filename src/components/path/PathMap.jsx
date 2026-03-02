import { useEffect, useMemo, useRef, useState } from 'react'
import LessonNode from './LessonNode.jsx'
import RobotGuide3D from './RobotGuide3D.jsx'
import {
  buildNodePositions,
  getCurrentLessonId,
  getLessonStatus,
} from '../../utils/path.js'

const CENTER_SIDE_ORDERS = new Set([4, 5, 9, 10, 14, 15, 19, 24])
const RIGHT_SIDE_ORDERS = new Set([1, 3, 6, 8, 11, 13, 16, 18, 21, 23, 26, 28, 29, 31])
const LEFT_SIDE_ORDERS = new Set([2, 7, 12, 17, 20, 22, 25, 27, 30])

const getRobotSideByOrder = (order) => {
  if (RIGHT_SIDE_ORDERS.has(order)) return 'right'
  if (LEFT_SIDE_ORDERS.has(order)) return 'left'
  if (CENTER_SIDE_ORDERS.has(order)) return 'center'
  return 'center'
}

function PathMap({ lessons, progress, onSelectLesson }) {
  const containerRef = useRef(null)
  const bgAspectRatio = 7
  const [isRobotReadyToMount, setIsRobotReadyToMount] = useState(() =>
    typeof document !== 'undefined' ? document.readyState === 'complete' : false
  )
  const [hoveredLessonId, setHoveredLessonId] = useState(null)
  const [isMobileViewport, setIsMobileViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 640 : false
  )
  const [interactionTick, setInteractionTick] = useState(0)
  const completedIds = progress.completedLessons
  const currentLessonId = getCurrentLessonId(lessons, completedIds)
  const [robotLessonId, setRobotLessonId] = useState(() => currentLessonId || null)
  const completedResources = progress.completedResources || {}

  const points = buildNodePositions(lessons)
  const lessonsByOrder = lessons.reduce((acc, lesson) => {
    acc[lesson.order] = lesson
    return acc
  }, {})
  const ordersByLessonId = lessons.reduce((acc, lesson) => {
    acc[lesson.id] = lesson.order
    return acc
  }, {})
  const pointsByLessonId = lessons.reduce((acc, lesson, index) => {
    acc[lesson.id] = points[index]
    return acc
  }, {})
  const lessonsById = useMemo(
    () =>
      lessons.reduce((acc, lesson) => {
        acc[lesson.id] = lesson
        return acc
      }, {}),
    [lessons]
  )

  const buildOrderedPath = useMemo(
    () => (fromOrder, toOrder) => {
      if (!fromOrder || !toOrder || fromOrder === toOrder) return []
      const step = fromOrder < toOrder ? 1 : -1
      const route = []
      for (
        let order = fromOrder + step;
        step > 0 ? order <= toOrder : order >= toOrder;
        order += step
      ) {
        if (lessonsByOrder[order]) route.push(lessonsByOrder[order].id)
      }
      return route
    },
    [lessonsByOrder]
  )

  const effectiveRobotLessonId = robotLessonId || currentLessonId || null
  const effectiveTargetLessonId = hoveredLessonId || currentLessonId || effectiveRobotLessonId
  const effectiveRobotOrder = effectiveRobotLessonId
    ? ordersByLessonId[effectiveRobotLessonId] || null
    : null
  const effectiveTargetOrder = effectiveTargetLessonId
    ? ordersByLessonId[effectiveTargetLessonId] || null
    : null
  const routeDirection =
    effectiveRobotOrder && effectiveTargetOrder
      ? Math.sign(effectiveTargetOrder - effectiveRobotOrder)
      : 0
  const robotRoute = useMemo(() => {
    if (!effectiveRobotLessonId || !effectiveTargetLessonId) return []
    const fromOrder = ordersByLessonId[effectiveRobotLessonId]
    const toOrder = ordersByLessonId[effectiveTargetLessonId]
    return buildOrderedPath(fromOrder, toOrder)
  }, [
    buildOrderedPath,
    effectiveRobotLessonId,
    effectiveTargetLessonId,
    ordersByLessonId,
  ])

  const robotTargetLessonId = robotRoute[0] || effectiveRobotLessonId || currentLessonId
  const robotNextTargetLessonId = robotRoute[1] || null
  const robotPreviousLessonId = effectiveRobotLessonId || robotTargetLessonId

  const robotTargetPoint =
    pointsByLessonId[robotTargetLessonId] ||
    pointsByLessonId[currentLessonId] ||
    points[0] || { x: 50, y: 50 }
  const robotNextTargetPoint = robotNextTargetLessonId
    ? pointsByLessonId[robotNextTargetLessonId] || null
    : null
  const robotTargetOrder =
    ordersByLessonId[robotTargetLessonId] || ordersByLessonId[currentLessonId] || 1
  const robotPreviousOrder = ordersByLessonId[robotPreviousLessonId] || robotTargetOrder
  const robotTarget = {
    ...robotTargetPoint,
    side: getRobotSideByOrder(robotTargetOrder),
    isCurrentNode: robotTargetLessonId === currentLessonId,
    isExistingNode: robotTargetLessonId === effectiveRobotLessonId,
    isHoveredNode: hoveredLessonId != null && robotTargetLessonId === hoveredLessonId,
    travelDirection: Math.sign(robotTargetOrder - robotPreviousOrder),
    routeDirection,
    routeFromOrder: effectiveRobotOrder ?? robotPreviousOrder ?? robotTargetOrder,
    routeToOrder: effectiveTargetOrder ?? robotTargetOrder,
    next: robotNextTargetPoint
      ? {
          ...robotNextTargetPoint,
          side: getRobotSideByOrder(
            ordersByLessonId[robotNextTargetLessonId] || robotTargetOrder
          ),
        }
      : null,
  }

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    const handleResize = () => setIsMobileViewport(window.innerWidth <= 640)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined
    if (document.readyState === 'complete') {
      const raf = requestAnimationFrame(() => setIsRobotReadyToMount(true))
      return () => cancelAnimationFrame(raf)
    }
    const handleLoad = () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsRobotReadyToMount(true))
      })
    }
    window.addEventListener('load', handleLoad, { once: true })
    return () => window.removeEventListener('load', handleLoad)
  }, [])

  useEffect(() => {
    if (!isMobileViewport || !hoveredLessonId) return undefined
    const hoveredLesson = lessonsById[hoveredLessonId]
    if (!hoveredLesson) return undefined
    const hoveredStatus = getLessonStatus(hoveredLesson, completedIds, currentLessonId)
    if (hoveredStatus !== 'locked') return undefined
    if (robotLessonId !== hoveredLessonId) return undefined
    const timer = setTimeout(() => {
      setHoveredLessonId((prev) => (prev === hoveredLessonId ? null : prev))
    }, 3000)
    return () => clearTimeout(timer)
  }, [
    isMobileViewport,
    hoveredLessonId,
    interactionTick,
    lessonsById,
    completedIds,
    currentLessonId,
    robotLessonId,
  ])

  return (
    <div
      ref={containerRef}
      className="group relative"
      onPointerDownCapture={() => setInteractionTick((tick) => tick + 1)}
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
        {isRobotReadyToMount ? (
          <RobotGuide3D
            target={robotTarget}
            targetKey={robotTargetLessonId || 'fallback'}
            onArrive={(arrivedLessonId) => {
              setRobotLessonId(arrivedLessonId)
            }}
          />
        ) : null}
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
                collectedStars={
                  Object.entries(completedResources[lesson.id] || {}).filter(
                    ([, value]) => value
                  ).length
                }
                totalStars={(lesson.content?.resources || []).length}
                cardSide={point.x >= 52 ? 'left' : 'right'}
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                dataLessonId={lesson.id}
                onHoverStart={(id) => setHoveredLessonId(id)}
                onHoverEnd={() => setHoveredLessonId(null)}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PathMap
