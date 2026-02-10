import { useEffect, useState } from 'react'
import { useRive } from '@rive-app/react-canvas'

const fallbackCopy = {
  title: 'Great job!',
  subtitle: 'Lesson completed',
}

function Celebration({ isVisible, onDone }) {
  const [useFallback, setUseFallback] = useState(false)
  const [assetReady, setAssetReady] = useState(false)
  const { RiveComponent, rive } = useRive({
    src: '/rive/celebrate.riv',
    autoplay: false,
  })

  useEffect(() => {
    if (!isVisible) return
    let isMounted = true

    const verifyAsset = async () => {
      try {
        const response = await fetch('/rive/celebrate.riv')
        if (!response.ok) {
          throw new Error('Rive asset not found')
        }
        const buffer = await response.arrayBuffer()
        const header = String.fromCharCode(
          ...new Uint8Array(buffer.slice(0, 4))
        )
        if (header !== 'RIVE') {
          throw new Error('Invalid Rive header')
        }
        if (isMounted) {
          setAssetReady(true)
          setUseFallback(false)
        }
      } catch (error) {
        console.error('Rive asset check failed:', error)
        if (isMounted) {
          setUseFallback(true)
          setAssetReady(false)
        }
      }
    }

    verifyAsset()
    return () => {
      isMounted = false
    }
  }, [isVisible])

  useEffect(() => {
    if (!isVisible || !rive || !assetReady) return
    try {
      rive.reset()
      rive.play()
    } catch (error) {
      console.error('Rive playback failed:', error)
      setUseFallback(true)
    }
  }, [isVisible, rive, assetReady])

  useEffect(() => {
    if (!isVisible) return undefined
    const timer = setTimeout(() => {
      onDone?.()
      setUseFallback(false)
    }, 2500)
    return () => clearTimeout(timer)
  }, [isVisible, onDone])

  if (!isVisible) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center">
      {useFallback || !assetReady ? (
        <div className="rounded-2xl border border-emerald-200 bg-white/90 p-4 text-center shadow-lg dark:border-emerald-400/40 dark:bg-slate-900/90">
          <div className="flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-emerald-500">!</div>
            <p className="mt-2 text-sm font-semibold text-emerald-600">
              {fallbackCopy.title}
            </p>
            <p className="text-xs text-emerald-500">
              {fallbackCopy.subtitle}
            </p>
          </div>
        </div>
      ) : (
        <RiveComponent className="h-full w-full" />
      )}
    </div>
  )
}

export default Celebration
