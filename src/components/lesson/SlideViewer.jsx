function SlideViewer({ slides }) {
  if (!slides || slides.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        Slides are coming soon.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {slides.map((slide, index) => (
        <div
          key={`${slide.type}-${index}`}
          className="rounded-lg border border-slate-200 bg-white p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Slide {index + 1}
          </p>
          <h3 className="mt-2 text-sm font-semibold text-slate-900">
            {slide.title}
          </h3>
          <p className="mt-2 text-sm text-slate-600">{slide.text}</p>
        </div>
      ))}
    </div>
  )
}

export default SlideViewer
