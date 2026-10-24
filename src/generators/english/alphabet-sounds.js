import { pickOne } from '../shared/random.js'

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function generateAlphabetSound(rng) {
  const letter = pickOne(rng, ALPHABET)

  return {
    type: 'alphabet-sound',
    interaction: 'trace',
    prompt: `Trace the letter ${letter}`,
    speak: letter,
    display: { kind: 'letter', letter },
  }
}
