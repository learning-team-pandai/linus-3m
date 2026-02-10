function VideoPlayer({ src, poster, onComplete }) {
  if (!src) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
        No video available for this lesson yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <video
        controls
        className="w-full"
        poster={poster}
        onEnded={onComplete}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    </div>
  )
}

export default VideoPlayer
