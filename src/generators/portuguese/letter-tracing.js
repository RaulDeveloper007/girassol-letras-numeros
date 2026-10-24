import { pickOne } from '../shared/random.js'

const VOWELS = ['A', 'E', 'I', 'O', 'U']
const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V']

export function generateLetterTracing(rng, { pool = 'vowels' } = {}) {
  const letters = pool === 'vowels' ? VOWELS : CONSONANTS
  const letter = pickOne(rng, letters)

  return {
    type: 'letter-tracing',
    interaction: 'trace',
    prompt: `Trace a letra ${letter}`,
    speak: `Trace a letra ${letter}`,
    display: { kind: 'letter', letter },
  }
}
