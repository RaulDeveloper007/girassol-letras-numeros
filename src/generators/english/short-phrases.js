import { pickOne } from '../shared/random.js'

const PHRASES = [
  { text: 'This is a cat.', question: 'What animal is it?', answer: 'CAT' },
  { text: 'I like dogs.', question: 'What does the child like?', answer: 'DOGS' },
  { text: 'The sun is yellow.', question: 'What color is the sun?', answer: 'YELLOW' },
  { text: 'The bird can fly.', question: 'What animal can fly?', answer: 'BIRD' },
]

export function generateShortPhrase(rng) {
  const phrase = pickOne(rng, PHRASES)

  return {
    type: 'short-phrase',
    interaction: 'answer',
    prompt: `${phrase.text}\n${phrase.question}`,
    speak: `${phrase.text} ${phrase.question}`,
    display: { kind: 'reading', text: phrase.text, question: phrase.question },
    expectedAnswer: phrase.answer,
  }
}
