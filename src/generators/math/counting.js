import { pickInt, pickOne } from '../shared/random.js'

const ICONS = ['🍎', '🌻', '🐝', '⭐', '🍪', '🐞', '🍊', '🚗', '🎈', '🐠', '🍇', '🦋']

export function generateCounting(rng, { maxCount = 10 } = {}) {
  const icon = pickOne(rng, ICONS)
  const count = pickInt(rng, 1, maxCount)

  return {
    type: 'counting',
    interaction: 'answer',
    prompt: 'Quantos você vê? Conte e escreva o número.',
    speak: 'Quantos você vê? Conte e escreva o número.',
    display: { kind: 'icon-grid', icon, count },
    expectedAnswer: String(count),
  }
}
