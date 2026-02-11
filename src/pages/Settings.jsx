import { useState } from 'react'
import { applyTheme, loadSettings, setLanguage, setSoundEnabled, setTheme } from '../utils/settings.js'
import { getStrings } from '../utils/i18n.js'

function Settings() {
  const [settings, setSettings] = useState(() => loadSettings())
  const strings = getStrings()

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

  const handleLanguageSelect = (lang) => {
    const next = setLanguage(lang)
    setSettings(next)
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              {strings.settings}
            </p>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{strings.preferences}</h1>
          </div>
          <button
            type="button"
            onClick={() => {
              window.location.hash = '#/'
            }}
            className="btn-3d btn-3d--icon rounded-full border border-slate-300 p-2 text-emerald-500 dark:border-slate-600 dark:text-emerald-300"
            aria-label={strings.back}
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
                {strings.language}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {strings.languageDesc}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleLanguageSelect('bm')}
                className={
                  'btn-3d rounded-full px-3 py-1 text-xs font-semibold ' +
                  (settings.language === 'bm'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                }
              >
                BM
              </button>
              <button
                type="button"
                onClick={() => handleLanguageSelect('en')}
                className={
                  'btn-3d rounded-full px-3 py-1 text-xs font-semibold ' +
                  (settings.language === 'en'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300')
                }
              >
                EN
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {strings.darkMode}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {strings.darkModeDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={handleThemeToggle}
              className={
                'btn-3d relative h-7 w-12 rounded-full transition ' +
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
                {strings.soundEffects}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {strings.soundEffectsDesc}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSoundToggle}
              className={
                'btn-3d relative h-7 w-12 rounded-full transition ' +
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
