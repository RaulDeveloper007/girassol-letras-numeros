import { pickInt } from '../shared/random.js'

export function generateAddition(rng, { maxA = 9, maxB = 9, allowCarry = true } = {}) {
  const a = pickInt(rng, 1, maxA)
  let b = pickInt(rng, 1, maxB)

  if (!allowCarry) {
    let guard = 0
    while ((a % 10) + (b % 10) > 9 && guard < 20) {
      b = pickInt(rng, 1, maxB)
      guard += 1
    }
  }

  return {
    type: 'addition',
    interaction: 'answer',
    prompt: `Quanto é ${a} + ${b}?`,
    speak: `Quanto é ${a} mais ${b}?`,
    display: { kind: 'equation', a, operator: '+', b },
    expectedAnswer: String(a + b),
  }
}

export function generateSubtraction(rng, { maxA = 9, maxB = 9, allowBorrow = true } = {}) {
  const a = pickInt(rng, 2, maxA)
  let b = pickInt(rng, 1, Math.min(maxB, a))

  if (!allowBorrow) {
    let guard = 0
    while (a % 10 < b % 10 && guard < 20) {
      b = pickInt(rng, 1, Math.min(maxB, a))
      guard += 1
    }
  }

  return {
    type: 'subtraction',
    interaction: 'answer',
    prompt: `Quanto é ${a} - ${b}?`,
    speak: `Quanto é ${a} menos ${b}?`,
    display: { kind: 'equation', a, operator: '-', b },
    expectedAnswer: String(a - b),
  }
}
