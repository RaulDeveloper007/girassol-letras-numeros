import { pickInt, pickOne } from '../shared/random.js'

export function generateMultiplication(rng, { tables = [2, 3, 4, 5, 10] } = {}) {
  const table = pickOne(rng, tables)
  const multiplier = pickInt(rng, 1, 10)

  return {
    type: 'multiplication',
    interaction: 'answer',
    prompt: `Quanto é ${table} × ${multiplier}?`,
    speak: `Quanto é ${table} vezes ${multiplier}?`,
    display: { kind: 'equation', a: table, operator: '×', b: multiplier },
    expectedAnswer: String(table * multiplier),
  }
}
