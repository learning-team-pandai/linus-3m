import { useState } from 'react'
import { getStrings } from '../../utils/i18n.js'
import FullscreenEmbed from './FullscreenEmbed.jsx'

function ResourceLinks({ sections, completedSections, onSectionStatusChange }) {
  const strings = getStrings()

  if (!sections || sections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        {strings.resourcesSoon}
      </div>
    )
  }

  const buildCanvaEmbedUrl = (url) => {
    if (!url) return ''
    return url.includes('?') ? `${url}&embed` : `${url}?embed`
  }

  const isCanvaUrl = (url) => url && url.includes('canva.com/design/')
  const isYouTubeUrl = (url) =>
    url && (url.includes('youtube.com') || url.includes('youtu.be'))

  const buildYouTubeEmbedUrl = (url) => {
    try {
      const parsed = new URL(url)
      if (parsed.hostname === 'youtu.be') {
        const id = parsed.pathname.replace('/', '').trim()
        return id ? `https://www.youtube.com/embed/${id}` : null
      }
      if (parsed.hostname.includes('youtube.com')) {
        const id = parsed.searchParams.get('v')
        if (id) return `https://www.youtube.com/embed/${id}`
        const pathMatch = parsed.pathname.match(/\/embed\/(.+)$/)
        if (pathMatch) return `https://www.youtube.com/embed/${pathMatch[1]}`
        return null
      }
      return null
    } catch {
      return null
    }
  }

  const [activeEmbed, setActiveEmbed] = useState(null)
  const [openMenuSection, setOpenMenuSection] = useState(null)

  const getSectionIcon = (title) => {
    if (title === 'Video') {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="m10 9 6 3-6 3z" />
        </svg>
      )
    }
    if (title.toLowerCase().includes('latihan')) {
      return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="6" y="4" width="12" height="16" rx="2" />
          <path d="M9 9h6M9 13h6M9 17h4" />
        </svg>
      )
    }
    return (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 6h16v12H4z" />
        <path d="M12 6v12" />
      </svg>
    )
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const currentUrl = section.links[0]?.url
        const isCompleted = completedSections?.[section.title]
        const isCanva = isCanvaUrl(currentUrl)
        const isYouTube = isYouTubeUrl(currentUrl)
        const embedUrl = isCanva
          ? buildCanvaEmbedUrl(currentUrl)
          : isYouTube
            ? buildYouTubeEmbedUrl(currentUrl)
            : currentUrl
        const shouldEmbed = Boolean(embedUrl)
        const handleOpen = () => {
          if (!currentUrl) return
          if (shouldEmbed) {
            setActiveEmbed({
              url: embedUrl,
              title: `${section.title} content`,
              sectionTitle: section.title,
              openedAt: Date.now(),
            })
            return
          }
          window.open(currentUrl, '_blank', 'noopener')
        }

        return (
          <div
            key={section.title}
            className="card-hover rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
                  {getSectionIcon(section.title)}
                </span>
                <button
                  type="button"
                  onClick={handleOpen}
                  className="text-left text-base font-semibold text-slate-800 hover:text-emerald-600 dark:text-slate-100 dark:hover:text-emerald-300"
                >
                  {section.title}
                </button>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={
                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold ' +
                    (isCompleted
                      ? 'border border-emerald-300 bg-emerald-100 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300'
                      : 'border border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300')
                  }
                >
                  {isCompleted ? strings.completedSection : strings.notStartedSection}
                </span>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMenuSection((prev) =>
                        prev === section.title ? null : section.title
                      )
                    }
                    className="btn-3d h-8 w-8 rounded-full border border-slate-300 bg-white p-0 text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    aria-label="Open section actions"
                  >
                    <svg viewBox="0 0 24 24" className="mx-auto h-4 w-4" aria-hidden="true" fill="currentColor">
                      <circle cx="6" cy="12" r="1.6" />
                      <circle cx="12" cy="12" r="1.6" />
                      <circle cx="18" cy="12" r="1.6" />
                    </svg>
                  </button>
                  {openMenuSection === section.title && (
                    <div className="absolute right-0 top-10 z-30 min-w-36 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                      <button
                        type="button"
                        onClick={() => {
                          onSectionStatusChange?.(section.title, !isCompleted)
                          setOpenMenuSection(null)
                        }}
                        className="w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                      >
                        {isCompleted
                          ? strings.markIncompleteSection
                          : strings.markCompleteSection}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {!currentUrl && (
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                {strings.noEmbed}
              </p>
            )}
          </div>
        )
      })}
      <FullscreenEmbed
        isOpen={Boolean(activeEmbed)}
        url={activeEmbed?.url}
        title={activeEmbed?.title}
        openedAt={activeEmbed?.openedAt}
        durationMs={10000}
        onClose={() => {
          if (
            activeEmbed?.sectionTitle &&
            activeEmbed?.openedAt &&
            Date.now() - activeEmbed.openedAt >= 10000
          ) {
            onSectionStatusChange?.(activeEmbed.sectionTitle, true)
          }
          setActiveEmbed(null)
        }}
      />
    </div>
  )
}

export default ResourceLinks
