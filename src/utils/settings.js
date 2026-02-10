const SETTINGS_KEY = 'linus3m-settings'

const defaultSettings = {
  soundEnabled: true,
  theme: 'light',
}

export const loadSettings = () => {
  try {
    const saved = localStorage.getItem(SETTINGS_KEY)
    if (!saved) return { ...defaultSettings }
    const parsed = JSON.parse(saved)
    return {
      ...defaultSettings,
      ...parsed,
      soundEnabled:
        typeof parsed.soundEnabled === 'boolean'
          ? parsed.soundEnabled
          : true,
      theme: parsed.theme === 'dark' ? 'dark' : 'light',
    }
  } catch (error) {
    console.error('Settings read error:', error)
    return { ...defaultSettings }
  }
}

export const saveSettings = (settings) => {
  try {
    const current = loadSettings()
    const next = {
      ...current,
      ...settings,
      soundEnabled:
        typeof settings.soundEnabled === 'boolean'
          ? settings.soundEnabled
          : current.soundEnabled,
      theme: settings.theme === 'dark' ? 'dark' : settings.theme === 'light' ? 'light' : current.theme,
    }
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
    return next
  } catch (error) {
    console.error('Settings write error:', error)
    return { ...defaultSettings }
  }
}

export const setSoundEnabled = (soundEnabled) => {
  return saveSettings({ soundEnabled: Boolean(soundEnabled) })
}

export const setTheme = (theme) => {
  return saveSettings({ theme: theme === 'dark' ? 'dark' : 'light' })
}

export const isSoundEnabled = () => {
  return loadSettings().soundEnabled
}

export const applyTheme = (theme) => {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}
