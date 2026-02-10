import { useState } from 'react'
import { applyTheme, loadSettings, setSoundEnabled, setTheme } from '../utils/settings.js'

function Settings() {
  const [settings, setSettings] = useState(() => loadSettings())

  const handleSoundToggle = () => {
    const next = setSoundEnabled(!settings.soundEnabled)
    setSettings(next)
  }

  const handleThemeToggle = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark'
    const next = setTheme(nextTheme)
    setSettings(next)
    applyTheme(next.theme)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Settings
            </p>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Preferences</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/'
            }}
            className="rounded-full p-2 text-emerald-500 dark:text-emerald-300"
            aria-label="Back"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              aria-hidden="true"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        <section className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Dark mode
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Switch between light and dark theme.
              </p>
            </div>
            <button
              type="button"
              onClick={handleThemeToggle}
              className={
                'relative h-7 w-12 rounded-full transition ' +
                (settings.theme === 'dark' ? 'bg-emerald-500' : 'bg-slate-300')
              }
              aria-pressed={settings.theme === 'dark'}
            >
              <span
                className={
                  'absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition ' +
                  (settings.theme === 'dark' ? 'left-6' : 'left-0.5')
                }
              />
            </button>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Sound effects
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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
