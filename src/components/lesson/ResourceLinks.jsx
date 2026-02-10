import { useEffect, useMemo, useState } from 'react'
import { getStrings } from '../../utils/i18n.js'

function ResourceLinks({ sections, completedSections, onSectionComplete }) {
  const [openSection, setOpenSection] = useState(null)
  const strings = getStrings()

  if (!sections || sections.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
        {strings.resourcesSoon}
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

  const loadYouTubeApi = () => {
    if (window.YT && window.YT.Player) {
      return Promise.resolve(window.YT)
    }
    if (window.__ytApiPromise) {
      return window.__ytApiPromise
    }
    window.__ytApiPromise = new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://www.youtube.com/iframe_api'
      document.body.appendChild(script)
      window.onYouTubeIframeAPIReady = () => resolve(window.YT)
    })
    return window.__ytApiPromise
  }

  const YouTubeEmbed = ({ url, sectionTitle }) => {
    const containerId = useMemo(
      () => `yt-${sectionTitle.replace(/\\s+/g, '-').toLowerCase()}`,
      [sectionTitle]
    )
    const isCompleted = completedSections?.[sectionTitle]

    useEffect(() => {
      if (!url || isCompleted) return
      let player
      loadYouTubeApi().then((YT) => {
        player = new YT.Player(containerId, {
          videoId: url.split('/embed/')[1],
          events: {
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                onSectionComplete?.(sectionTitle)
              }
            },
          },
        })
      })
      return () => {
        if (player && player.destroy) player.destroy()
      }
    }, [url, sectionTitle, isCompleted])

    return (
      <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
        <div id={containerId} className="h-full w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => {
        const isOpen = openSection === section.title
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
                  {isOpen ? strings.hide : strings.view}
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
                {isCompleted ? strings.completedSection : strings.markCompleteSection}
              </button>
            </div>

            {isOpen && (
              <div className="mt-4 space-y-3">
                {currentUrl ? (
                  isCanva ? (
                    <div>
                      <div className="relative w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                        <div className="relative h-0 w-full pb-[56.25%]">
                          <iframe
                            loading="lazy"
                            title={`${section.title} content`}
                            src={embedUrl}
                            allow="fullscreen"
                            className="absolute left-0 top-0 h-full w-full border-0 p-0"
                          />
                        </div>
                      </div>
                      <a
                        href={currentUrl}
                        target="_blank"
                        rel="noopener"
                        className="mt-2 inline-block text-xs font-semibold text-emerald-500 hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
                      >
                        {section.title}
                      </a>
                    </div>
                  ) : isYouTube ? (
                    <YouTubeEmbed url={embedUrl} sectionTitle={section.title} />
                  ) : shouldEmbed ? (
                    <div className="aspect-video w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950">
                      <iframe
                        title={`${section.title} content`}
                        src={embedUrl}
                        className="h-full w-full"
                        loading="lazy"
                        allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
                      />
                    </div>
                  ) : (
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener"
                      className="text-sm font-semibold text-emerald-500 hover:text-emerald-600 dark:text-emerald-300 dark:hover:text-emerald-200"
                    >
                      {section.title}
                    </a>
                  )
                ) : (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {strings.noEmbed}
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
