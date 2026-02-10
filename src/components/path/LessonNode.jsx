const icons = {
  locked: (
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
      <rect x="4" y="11" width="16" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  completed: (
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
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  current: (
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
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
}

function LessonNode({ lesson, status, onClick, style, isMilestone }) {
  const isClickable = status !== 'locked'

  const statusStyles = {
    completed: 'bg-emerald-500 border-emerald-500 text-white',
    current: 'bg-blue-500 border-blue-500 text-white animate-pulse',
    locked: 'bg-slate-200 border-slate-300 text-slate-400',
  }

  const labelStyles = {
    completed: 'text-slate-800',
    current: 'text-slate-900',
    locked: 'text-slate-400',
  }

  const milestoneRing = isMilestone
    ? 'after:absolute after:inset-0 after:rounded-full after:border after:border-dashed after:border-amber-400 after:content-[""]'
    : ''

  return (
    <div className="absolute" style={style}>
      <button
        type="button"
        onClick={isClickable ? onClick : undefined}
        className={
          'group flex flex-col items-center gap-2 text-center transition ' +
          (isClickable ? 'hover:-translate-y-1' : 'cursor-not-allowed')
        }
        aria-disabled={!isClickable}
      >
        <span
          className={
            'relative flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold shadow-sm ' +
            statusStyles[status] +
            ' ' +
            milestoneRing
          }
        >
          <span className="absolute top-1 right-1 text-white">
            {icons[status]}
          </span>
          {lesson.order}
        </span>
        <span className="w-24 text-xs font-semibold leading-tight">
          <span className={labelStyles[status]}>{lesson.title}</span>
          <span className="mt-1 block text-[11px] text-slate-500">
            {lesson.duration}
          </span>
          {isMilestone && (
            <span className="mt-1 block text-[10px] font-semibold text-amber-500">
              Milestone
            </span>
          )}
        </span>
      </button>
    </div>
  )
}

export default LessonNode
