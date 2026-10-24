import { pickOne, pickInt } from '../shared/random.js'

const WORDS = ['CAT', 'DOG', 'SUN', 'BOOK', 'FISH', 'BIRD', 'STAR', 'TREE']

export function generateSpellingEn(rng) {
  const word = pickOne(rng, WORDS)
  const blankIndex = pickInt(rng, 1, Math.max(word.length - 2, 1))
  const masked = word
    .split('')
    .map((letter, i) => (i === blankIndex ? '_' : letter))
    .join('')

  return {
    type: 'spelling-en',
    interaction: 'answer',
    prompt: `Complete the word: ${masked}`,
    speak: 'Complete the word.',
    display: { kind: 'fill-blank', masked },
    expectedAnswer: word[blankIndex],
  }
}
