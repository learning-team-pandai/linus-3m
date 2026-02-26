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
      <path d="M12 2v20" />
      <path d="M2 12h20" />
    </svg>
  ),
}

function LessonNode({
  lesson,
  status,
  onClick,
  style,
  collectedStars = 0,
  totalStars = 0,
  dataLessonId,
  cardSide = 'left',
}) {
  const isClickable = status !== 'locked'
  const isCurrent = status === 'current'
  const isBm = lesson.moduleId === 'membaca-menulis'

  const circleStyle =
    status === 'completed'
      ? isBm
        ? 'text-white path-node-circle--completed-bm'
        : 'text-white path-node-circle--completed-math'
      : status === 'current'
        ? 'text-white path-node-circle--current-purple'
        : 'text-white path-node-circle--locked'

  const cardStyles = {
    completed: 'path-node-card--completed border-[#9BCFF2]',
    current: 'path-node-card--current border-[#8AD7B8]',
    locked: 'path-node-card--locked border-[#bcc5b5]',
  }

  const action = isClickable ? onClick : undefined
  const cardVisibilityClass = isCurrent
    ? 'opacity-100 sm:opacity-0 sm:peer-hover:pointer-events-auto sm:peer-hover:opacity-100 sm:peer-focus-visible:pointer-events-auto sm:peer-focus-visible:opacity-100'
    : 'opacity-0 sm:peer-hover:pointer-events-auto sm:peer-hover:opacity-100 sm:peer-focus-visible:pointer-events-auto sm:peer-focus-visible:opacity-100'
  const cardPositionClass =
    cardSide === 'left'
      ? 'right-[calc(100%+0.5rem)] sm:right-[calc(100%+0.75rem)]'
      : 'left-[calc(100%+0.5rem)] sm:left-[calc(100%+0.75rem)]'

  return (
    <div className="absolute z-10" style={style} data-lesson-id={dataLessonId}>
      <button
        type="button"
        onClick={action}
        className={
          'peer btn-3d relative z-20 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white text-xl font-bold shadow-[0_8px_0_rgba(15,23,42,0.25)] sm:h-16 sm:w-16 ' +
          circleStyle +
          ' ' +
          (isClickable ? 'cursor-pointer' : 'cursor-not-allowed')
        }
        aria-disabled={!isClickable}
      >
        {lesson.order}
        <span className="absolute -bottom-1 -right-1 rounded-full border-2 border-white bg-white p-0.5 text-slate-500">
          {icons[status]}
        </span>
      </button>

      <button
        type="button"
        onClick={action}
        className={
          'btn-3d pointer-events-none absolute top-1/2 z-10 min-h-16 w-[10.5rem] -translate-y-1/2 rounded-2xl border-2 p-2 text-left text-slate-800 shadow-[0_6px_0_rgba(15,23,42,0.15)] transition-all duration-200 sm:w-[13rem] sm:p-3 ' +
          cardPositionClass +
          ' ' +
          cardVisibilityClass +
          ' ' +
          cardStyles[status] +
          ' ' +
          (isClickable ? 'cursor-pointer' : 'cursor-not-allowed')
        }
        aria-disabled={!isClickable}
      >
        <p className="max-h-10 overflow-hidden text-sm font-bold leading-tight sm:text-base">
          {lesson.title}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <span className="inline-flex rounded-full bg-slate-200/75 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
            {lesson.duration}
          </span>
          {totalStars > 0 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-white/70 px-1.5 py-0.5">
              {Array.from({ length: totalStars }).map((_, index) => {
                const isCollected = index < collectedStars
                return (
                  <svg
                    key={`node-star-${lesson.id}-${index}`}
                    viewBox="0 0 24 24"
                    className={`h-3 w-3 ${isCollected ? 'text-amber-500' : 'text-slate-300'}`}
                    aria-hidden="true"
                    fill="currentColor"
                  >
                    <path d="M12 2l2.9 6.1 6.7.6-5 4.5 1.5 6.6L12 16.9 5.9 19.8 7.4 13 2.4 8.7l6.7-.6L12 2z" />
                  </svg>
                )
              })}
            </span>
          )}
        </div>
      </button>
    </div>
  )
}

export default LessonNode
