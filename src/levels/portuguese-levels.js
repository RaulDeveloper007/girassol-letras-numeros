import { buildSheet } from '../generators/shared/build-sheet.js'
import { generateLetterTracing } from '../generators/portuguese/letter-tracing.js'
import { generateSyllable } from '../generators/portuguese/syllables.js'
import { generateWordBuilding } from '../generators/portuguese/word-building.js'
import { generateShortReading } from '../generators/portuguese/short-reading.js'
import { generateSpelling } from '../generators/portuguese/spelling.js'

const GENERATORS = {
  'letter-tracing': generateLetterTracing,
  syllable: generateSyllable,
  'word-building': generateWordBuilding,
  'short-reading': generateShortReading,
  spelling: generateSpelling,
}

const STAGE_CONFIG = {
  Semente: {
    weights: { 'letter-tracing': 1 },
    'letter-tracing': { pool: 'vowels' },
  },
  Broto: {
    weights: { 'letter-tracing': 0.6, syllable: 0.4 },
    'letter-tracing': { pool: 'consonants' },
  },
  Folha: {
    weights: { syllable: 0.6, 'word-building': 0.4 },
  },
  Botão: {
    weights: { 'word-building': 0.6, 'short-reading': 0.4 },
  },
  Flor: {
    weights: { 'short-reading': 0.5, spelling: 0.5 },
  },
  Girassol: {
    weights: { 'short-reading': 0.4, spelling: 0.4, 'word-building': 0.2 },
  },
}

export function buildPortugueseSheet({ level, size = 8, excludeSignature = null }) {
  return buildSheet({
    subject: 'portuguese',
    level,
    size,
    excludeSignature,
    stageConfig: STAGE_CONFIG,
    generators: GENERATORS,
  })
}
