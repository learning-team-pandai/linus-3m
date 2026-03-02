import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

function FullscreenEmbed({ isOpen, url, title, onClose, openedAt, durationMs = 10000 }) {
  const [progress, setProgress] = useState(0)
  const radius = 18
  const circumference = useMemo(() => 2 * Math.PI * radius, [radius])

  useEffect(() => {
    if (!isOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !openedAt) return
    let frame
    const tick = () => {
      const elapsed = Date.now() - openedAt
      const next = Math.min(elapsed / durationMs, 1)
      setProgress(next)
      if (next < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [isOpen, openedAt, durationMs])

  if (!isOpen || !url) return null
  if (typeof document === 'undefined') return null

  const effectiveProgress = isOpen && openedAt ? progress : 0
  const offset = circumference * (1 - effectiveProgress)

  return createPortal(
    <div className="fixed inset-0 z-50 bg-slate-950/80">
      <div className="relative h-full w-full">
        <button
          type="button"
          onClick={onClose}
          className="btn-3d btn-3d--icon absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow dark:bg-slate-900 dark:text-slate-200"
          aria-label="Close"
        >
          <svg className="absolute left-0 top-0 h-10 w-10" viewBox="0 0 40 40">
            <circle
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="3"
            />
            <circle
              cx="20"
              cy="20"
              r={radius}
              fill="none"
              stroke="rgba(16, 185, 129, 0.9)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90 20 20)"
            />
          </svg>
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
    </div>,
    document.body
  )
}

export default FullscreenEmbed
