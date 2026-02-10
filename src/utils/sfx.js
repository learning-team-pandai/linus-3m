import { Howl } from 'howler'
import { isSoundEnabled } from './settings.js'

let celebrateHowl

export const playCelebrate = () => {
  try {
    if (!isSoundEnabled()) return
    if (!celebrateHowl) {
      celebrateHowl = new Howl({
        src: ['/audio/celebrate.mp3'],
        volume: 0.6,
      })
    }
    celebrateHowl.play()
  } catch (error) {
    console.error('Audio playback failed:', error)
  }
}
