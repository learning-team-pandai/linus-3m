import { buildPathD } from '../../utils/path.js'

function PathLine({ points, activeCount, height, className }) {
  const fullD = buildPathD(points)
  const activePoints = points.slice(0, Math.max(activeCount, 1))
  const activeD = buildPathD(activePoints)

  return (
    <svg
      className={className}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={fullD}
        fill="none"
        stroke="#E2E8F0"
        className="dark:stroke-slate-700"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray="10 5"
      />
      {activeD && (
        <path
          d={activeD}
          fill="none"
          stroke="#3B82F6"
          className="dark:stroke-blue-400"
          strokeWidth="8"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

export default PathLine
