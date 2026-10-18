let memoryUnlocked = false

export const hasPlayedIntro = () => {
  if (typeof window === 'undefined') return false

  return memoryUnlocked || sessionStorage.getItem('introPlayed') === 'true'
}

export const setIntroPlayed = () => {
  memoryUnlocked = true
  if (typeof window === 'undefined') return

  try {
    sessionStorage.setItem('introPlayed', 'true')
  } catch (e) {
    // ignore
  }
}

export const resetIntro = () => {
  memoryUnlocked = false
  if (typeof window === 'undefined') return

  try {
    sessionStorage.removeItem('introPlayed')
  } catch (e) {
    // ignore
  }
}