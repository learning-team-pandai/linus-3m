function LessonNode({ lesson, status, onClick, style }) {
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
            'flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold shadow-sm ' +
            statusStyles[status]
          }
        >
          {lesson.order}
        </span>
        <span className="w-24 text-xs font-semibold leading-tight">
          <span className={labelStyles[status]}>{lesson.title}</span>
          <span className="mt-1 block text-[11px] text-slate-500">
            {lesson.duration}
          </span>
        </span>
      </button>
    </div>
  )
}

export default LessonNode
