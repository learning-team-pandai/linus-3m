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

function LessonNode({
  lesson,
  status,
  onClick,
  style,
  isMilestone,
  collectedStars = 0,
  totalStars = 0,
  dataLessonId,
}) {
  const isClickable = status !== 'locked'

  const statusStyles = {
    completed:
      'bg-emerald-500 text-white',
    current:
      'bg-orange-400 text-white animate-pulse',
    locked:
      'bg-slate-400 text-white',
  }

  const labelStyles = {
    completed: 'text-slate-800 dark:text-slate-100',
    current: 'text-slate-900 dark:text-slate-100',
    locked: 'text-slate-400 dark:text-slate-500',
  }

  const milestoneRing = isMilestone
    ? 'after:absolute after:inset-0 after:rounded-full after:border after:border-dashed after:border-amber-400 after:content-[""] dark:after:border-amber-300'
    : ''

  return (
    <div className="absolute" style={style} data-lesson-id={dataLessonId}>
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
            'relative flex h-16 w-16 flex-col items-center justify-center gap-0.5 rounded-full border-4 border-white text-xs font-semibold shadow-[0_6px_0_rgba(15,23,42,0.22)] motion-reduce:animate-none ' +
            statusStyles[status] +
            ' ' +
            milestoneRing
          }
        >
          <span className="absolute top-1 right-1 text-white">
            {icons[status]}
          </span>
          <span>{lesson.order}</span>
          {totalStars > 0 && (
            <span className="flex items-center gap-0.5">
              {Array.from({ length: totalStars }).map((_, index) => {
                const isCollected = index < collectedStars
                return (
                  <svg
                    key={`node-star-${lesson.id}-${index}`}
                    viewBox="0 0 24 24"
                    className={`h-2.5 w-2.5 ${
                      isCollected
                        ? 'text-amber-300'
                        : 'text-slate-300/70 dark:text-slate-600'
                    }`}
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.9 6.1 6.7.6-5 4.5 1.5 6.6L12 16.9 5.9 19.8 7.4 13 2.4 8.7l6.7-.6L12 2z" />
                  </svg>
                )
              })}
            </span>
          )}
        </span>
        <span className="w-24 text-xs font-semibold leading-tight">
          <span className={labelStyles[status]}>{lesson.title}</span>
          <span className="mt-1 block text-[11px] text-slate-500 dark:text-slate-400">
            {lesson.duration}
          </span>
          {isMilestone && (
            <span className="mt-1 block text-[10px] font-semibold text-amber-500 dark:text-amber-300">
              Milestone
            </span>
          )}
        </span>
      </button>
    </div>
  )
}

export default LessonNode
