import { pickOne, shuffle } from '../shared/random.js'

const WORD_BANK = [
  { word: 'BOLA', syllables: ['BO', 'LA'], icon: '⚽' },
  { word: 'GATO', syllables: ['GA', 'TO'], icon: '🐱' },
  { word: 'SAPO', syllables: ['SA', 'PO'], icon: '🐸' },
  { word: 'LUA', syllables: ['LU', 'A'], icon: '🌙' },
  { word: 'PATO', syllables: ['PA', 'TO'], icon: '🦆' },
  { word: 'FADA', syllables: ['FA', 'DA'], icon: '🧚' },
  { word: 'MALA', syllables: ['MA', 'LA'], icon: '🧳' },
  { word: 'DADO', syllables: ['DA', 'DO'], icon: '🎲' },
]

export function generateWordBuilding(rng) {
  const entry = pickOne(rng, WORD_BANK)
  const scrambled = shuffle(rng, entry.syllables)

  return {
    type: 'word-building',
    interaction: 'answer',
    prompt: `Junte as sílabas e escreva a palavra: ${scrambled.join(' - ')}`,
    speak: 'Junte as sílabas e escreva a palavra.',
    display: { kind: 'syllable-scramble', syllables: scrambled, icon: entry.icon },
    expectedAnswer: entry.word,
  }
}
