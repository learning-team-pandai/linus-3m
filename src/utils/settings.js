const SETTINGS_KEY = 'linus3m-settings'

const defaultSettings = {
  soundEnabled: true,
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
    }
  } catch (error) {
    console.error('Settings read error:', error)
    return { ...defaultSettings }
  }
}

export const saveSettings = (settings) => {
  try {
    const next = { ...defaultSettings, ...settings }
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

export const isSoundEnabled = () => {
  return loadSettings().soundEnabled
}
