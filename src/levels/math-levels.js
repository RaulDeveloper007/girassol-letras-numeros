import { buildSheet } from '../generators/shared/build-sheet.js'
import { generateCounting } from '../generators/math/counting.js'
import { generateSequence } from '../generators/math/sequences.js'
import { generateAddition, generateSubtraction } from '../generators/math/addition-subtraction.js'
import { generateMultiplication } from '../generators/math/multiplication-table.js'

const GENERATORS = {
  counting: generateCounting,
  sequence: generateSequence,
  addition: generateAddition,
  subtraction: generateSubtraction,
  multiplication: generateMultiplication,
}

const STAGE_CONFIG = {
  Semente: {
    weights: { counting: 1 },
    counting: { maxCount: 10 },
  },
  Broto: {
    weights: { counting: 0.4, sequence: 0.6 },
    counting: { maxCount: 20 },
    sequence: { maxStart: 10, steps: [1] },
  },
  Folha: {
    weights: { sequence: 0.5, addition: 0.5 },
    sequence: { maxStart: 20, steps: [1, 2] },
    addition: { maxA: 9, maxB: 9, allowCarry: false },
  },
  Botão: {
    weights: { addition: 0.5, subtraction: 0.5 },
    addition: { maxA: 18, maxB: 18, allowCarry: true },
    subtraction: { maxA: 18, maxB: 9, allowBorrow: false },
  },
  Flor: {
    weights: { addition: 0.5, subtraction: 0.5 },
    addition: { maxA: 50, maxB: 50, allowCarry: true },
    subtraction: { maxA: 50, maxB: 30, allowBorrow: true },
  },
  Girassol: {
    weights: { multiplication: 0.6, addition: 0.2, subtraction: 0.2 },
    multiplication: { tables: [2, 3, 4, 5, 10] },
    addition: { maxA: 80, maxB: 80, allowCarry: true },
    subtraction: { maxA: 80, maxB: 60, allowBorrow: true },
  },
}

export function buildMathSheet({ level, size = 8, excludeSignature = null }) {
  return buildSheet({ subject: 'math', level, size, excludeSignature, stageConfig: STAGE_CONFIG, generators: GENERATORS })
}
