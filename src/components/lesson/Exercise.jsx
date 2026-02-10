import { useState } from 'react'

function Exercise({ exercise, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [feedback, setFeedback] = useState(null)

  if (!exercise) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Exercises will appear here.
      </div>
    )
  }

  const handleSubmit = () => {
    if (!selected) return
    const isCorrect = selected.correct
    setFeedback(isCorrect ? exercise.feedback?.correct : exercise.feedback?.wrong)
    if (isCorrect) {
      onComplete?.()
    }
  }

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{exercise.question}</p>
      <div className="mt-4 space-y-2">
        {exercise.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setSelected(option)}
            className={
              'w-full rounded-lg border px-4 py-2 text-left text-sm transition ' +
              (selected?.id === option.id
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10'
                : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700')
            }
          >
            {option.label}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-4 rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white"
      >
        Check Answer
      </button>
      {feedback && (
        <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-200">{feedback}</p>
      )}
    </div>
  )
}

export default Exercise
