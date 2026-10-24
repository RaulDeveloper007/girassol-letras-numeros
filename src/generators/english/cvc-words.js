import { pickOne } from '../shared/random.js'

const CVC_WORDS = [
  { word: 'CAT', icon: '🐱' },
  { word: 'DOG', icon: '🐶' },
  { word: 'SUN', icon: '☀️' },
  { word: 'HAT', icon: '🎩' },
  { word: 'PIG', icon: '🐷' },
  { word: 'BUS', icon: '🚌' },
]

export function generateCvcWord(rng) {
  const entry = pickOne(rng, CVC_WORDS)

  return {
    type: 'cvc-word',
    interaction: 'answer',
    prompt: `Write the word: ${entry.icon}`,
    speak: entry.word,
    display: { kind: 'word-prompt', icon: entry.icon },
    expectedAnswer: entry.word,
  }
}
