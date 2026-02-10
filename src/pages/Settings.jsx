import { useState } from 'react'
import { loadSettings, setSoundEnabled } from '../utils/settings.js'

function Settings() {
  const [settings, setSettings] = useState(() => loadSettings())

  const handleSoundToggle = () => {
    const next = setSoundEnabled(!settings.soundEnabled)
    setSettings(next)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Settings
            </p>
            <h1 className="text-xl font-semibold text-slate-900">Preferences</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/'
            }}
            className="text-sm font-semibold text-blue-500"
          >
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">
                Sound effects
              </p>
              <p className="text-xs text-slate-500">
                Toggle celebration and feedback sounds.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSoundToggle}
              className={
                'relative h-7 w-12 rounded-full transition ' +
                (settings.soundEnabled ? 'bg-emerald-500' : 'bg-slate-300')
              }
              aria-pressed={settings.soundEnabled}
            >
              <span
                className={
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ' +
                  (settings.soundEnabled ? 'left-6' : 'left-0.5')
                }
              />
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Settings
