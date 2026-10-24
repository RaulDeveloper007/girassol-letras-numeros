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
  { word: 'RATO', syllables: ['RA', 'TO'], icon: '🐭' },
  { word: 'VACA', syllables: ['VA', 'CA'], icon: '🐮' },
  { word: 'GALO', syllables: ['GA', 'LO'], icon: '🐓' },
  { word: 'FOCA', syllables: ['FO', 'CA'], icon: '🦭' },
  { word: 'BOTO', syllables: ['BO', 'TO'], icon: '🐬' },
  { word: 'URSO', syllables: ['UR', 'SO'], icon: '🐻' },
  { word: 'FOGO', syllables: ['FO', 'GO'], icon: '🔥' },
  { word: 'BOLO', syllables: ['BO', 'LO'], icon: '🎂' },
  { word: 'SUCO', syllables: ['SU', 'CO'], icon: '🧃' },
  { word: 'PIPA', syllables: ['PI', 'PA'], icon: '🪁' },
  { word: 'SOPA', syllables: ['SO', 'PA'], icon: '🍲' },
  { word: 'COPO', syllables: ['CO', 'PO'], icon: '🥤' },
  { word: 'CASA', syllables: ['CA', 'SA'], icon: '🏠' },
  { word: 'MESA', syllables: ['ME', 'SA'], icon: '🪑' },
  { word: 'FACA', syllables: ['FA', 'CA'], icon: '🔪' },
  { word: 'GELO', syllables: ['GE', 'LO'], icon: '🧊' },
  { word: 'UVA', syllables: ['U', 'VA'], icon: '🍇' },
  { word: 'TOMATE', syllables: ['TO', 'MA', 'TE'], icon: '🍅' },
  { word: 'BANANA', syllables: ['BA', 'NA', 'NA'], icon: '🍌' },
  { word: 'CENOURA', syllables: ['CE', 'NOU', 'RA'], icon: '🥕' },
  { word: 'MANGA', syllables: ['MAN', 'GA'], icon: '🥭' },
  { word: 'MORANGO', syllables: ['MO', 'RAN', 'GO'], icon: '🍓' },
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
