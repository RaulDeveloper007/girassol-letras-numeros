import { pickInt, pickOne } from '../shared/random.js'

export function generateSequence(rng, { maxStart = 10, steps = [1] } = {}) {
  const step = pickOne(rng, steps)
  const start = pickInt(rng, 1, maxStart)
  const length = 5
  const sequence = Array.from({ length }, (_, i) => start + step * i)
  const hiddenIndex = pickInt(rng, 2, length - 1)
  const answer = sequence[hiddenIndex]
  const items = sequence.map((n, i) => (i === hiddenIndex ? '❓' : String(n)))

  return {
    type: 'sequence',
    interaction: 'answer',
    prompt: 'Qual número completa a sequência?',
    speak: 'Qual número completa a sequência?',
    display: { kind: 'sequence', items },
    expectedAnswer: String(answer),
  }
}
