import { useEffect } from 'react'

function FullscreenEmbed({ isOpen, url, title, onClose }) {
  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  if (!isOpen || !url) return null

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80">
      <div className="relative h-full w-full">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-slate-700 shadow dark:bg-slate-900 dark:text-slate-200"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            aria-hidden="true"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
        <iframe
          title={title}
          src={url}
          className="h-full w-full"
          allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
        />
      </div>
    </div>
  )
}

export default FullscreenEmbed
