// Efeitos sonoros gerados por síntese (Web Audio API), sem nenhum arquivo
// de áudio de terceiros -- leve e 100% original.
let audioContext = null

function getContext() {
  if (!audioContext) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    audioContext = new AudioContextClass()
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume()
  }
  return audioContext
}

function playTone(ctx, { frequency, startTime, duration, gain = 0.18, type = 'sine' }) {
  const oscillator = ctx.createOscillator()
  const gainNode = ctx.createGain()

  oscillator.type = type
  oscillator.frequency.value = frequency

  gainNode.gain.setValueAtTime(0, startTime)
  gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.02)
  gainNode.gain.linearRampToValueAtTime(0, startTime + duration)

  oscillator.connect(gainNode)
  gainNode.connect(ctx.destination)

  oscillator.start(startTime)
  oscillator.stop(startTime + duration + 0.02)
}

function playSequence(notes) {
  const ctx = getContext()
  let time = ctx.currentTime
  for (const note of notes) {
    playTone(ctx, { ...note, startTime: time })
    time += note.gap ?? note.duration
  }
}

function safePlay(build) {
  try {
    build()
  } catch (error) {
    console.warn('Não foi possível reproduzir o som:', error)
  }
}

export function playCorrectSound() {
  safePlay(() =>
    playSequence([
      { frequency: 523.25, duration: 0.11 }, // C5
      { frequency: 659.25, duration: 0.11 }, // E5
      { frequency: 783.99, duration: 0.18 }, // G5
    ])
  )
}

export function playWrongSound() {
  safePlay(() =>
    playSequence([
      { frequency: 329.63, duration: 0.14, gain: 0.14 },
      { frequency: 246.94, duration: 0.2, gain: 0.14 },
    ])
  )
}

export function playTraceDoneSound() {
  safePlay(() => playSequence([{ frequency: 440, duration: 0.16, gain: 0.15 }]))
}

export function playLevelUpSound() {
  safePlay(() =>
    playSequence([
      { frequency: 523.25, duration: 0.09 },
      { frequency: 659.25, duration: 0.09 },
      { frequency: 783.99, duration: 0.09 },
      { frequency: 1046.5, duration: 0.28 },
    ])
  )
}
