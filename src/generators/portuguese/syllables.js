import { pickOne, shuffle } from '../shared/random.js'

const CONSONANTS = ['B', 'C', 'D', 'F', 'G', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'V']
const VOWELS = ['A', 'E', 'I', 'O', 'U']

export function generateSyllable(rng) {
  const consonant = pickOne(rng, CONSONANTS)
  const vowel = pickOne(rng, VOWELS)
  const syllable = `${consonant}${vowel}`

  const otherConsonants = shuffle(rng, CONSONANTS.filter((c) => c !== consonant)).slice(0, 2)
  const distractors = otherConsonants.map((c) => `${c}${vowel}`)
  const options = shuffle(rng, [syllable, ...distractors])

  return {
    type: 'syllable-recognition',
    interaction: 'choice',
    prompt: 'Ouça e toque na sílaba certa.',
    speak: syllable,
    display: { kind: 'choice-text', options },
    correctValue: syllable,
  }
}
