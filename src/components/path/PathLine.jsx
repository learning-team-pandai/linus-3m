import { buildPathD } from '../../utils/path.js'

function PathLine({ points, height, className }) {
  const d = buildPathD(points)

  return (
    <svg
      className={className}
      viewBox={`0 0 100 ${height}`}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d={d}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default PathLine
