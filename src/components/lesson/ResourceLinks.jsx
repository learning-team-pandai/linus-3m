import { useState } from 'react'

function ResourceLinks({ sections, completedSections, onSectionComplete }) {
  const [openSection, setOpenSection] = useState(null)

  if (!sections || sections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        Resources are coming soon.
      </div>
    )
  }

  const handleToggle = (section) => {
    if (openSection === section.title) {
      setOpenSection(null)
      return
    }
    setOpenSection(section.title)
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = openSection === section.title
        const currentUrl = section.links[0]?.url
        const isCompleted = completedSections?.[section.title]

        return (
          <div
            key={section.title}
            className="rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => handleToggle(section)}
                className="flex items-center gap-2 text-left text-sm font-semibold text-emerald-500 hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
                aria-expanded={isOpen}
              >
                {section.title}
                <span className="text-xs text-slate-400">
                  {isOpen ? 'Hide' : 'View'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => onSectionComplete?.(section.title)}
                className={
                  'rounded-full px-3 py-1 text-xs font-semibold transition ' +
                  (isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                }
              >
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </button>
            </div>

            {isOpen && (
              <div className="mt-4 space-y-3">
                {currentUrl ? (
                  <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                    <iframe
                      title={`${section.title} content`}
                      src={currentUrl}
                      className="h-full w-full"
                      loading="lazy"
                      allow="fullscreen"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    No embeddable content available.
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default ResourceLinks
