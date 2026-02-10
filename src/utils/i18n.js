import { STRINGS } from '../data/strings.js'
import { loadSettings } from './settings.js'

export const getStrings = () => {
  const { language } = loadSettings()
  return STRINGS[language] || STRINGS.bm
}
