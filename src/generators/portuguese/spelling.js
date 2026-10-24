import { pickOne, pickInt } from '../shared/random.js'

const WORDS = ['CASA', 'LIVRO', 'JANELA', 'CADERNO', 'ESCOLA', 'FLOR', 'ARVORE', 'PRAIA']

export function generateSpelling(rng) {
  const word = pickOne(rng, WORDS)
  const blankIndex = pickInt(rng, 1, word.length - 2)
  const masked = word
    .split('')
    .map((letter, i) => (i === blankIndex ? '_' : letter))
    .join('')

  return {
    type: 'spelling',
    interaction: 'answer',
    prompt: `Complete a palavra: ${masked}`,
    speak: 'Complete a palavra.',
    display: { kind: 'fill-blank', masked },
    expectedAnswer: word[blankIndex],
  }
}
