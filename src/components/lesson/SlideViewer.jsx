function SlideViewer({ slides }) {
  if (!slides || slides.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {slides.map((slide, index) => (
        <div
          key={`${slide.type}-${index}`}
          className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Slide {index + 1}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
            {slide.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{slide.text}</p>
        </div>
      ))}
    </div>
  )
}

export default SlideViewer
