import { buildSheet } from '../generators/shared/build-sheet.js'
import { generateAlphabetSound } from '../generators/english/alphabet-sounds.js'
import { generateThematicVocabulary } from '../generators/english/thematic-vocabulary.js'
import { generateCvcWord } from '../generators/english/cvc-words.js'
import { generateShortPhrase } from '../generators/english/short-phrases.js'
import { generateSpellingEn } from '../generators/english/spelling.js'

const GENERATORS = {
  'alphabet-sound': generateAlphabetSound,
  'thematic-vocabulary': generateThematicVocabulary,
  'cvc-word': generateCvcWord,
  'short-phrase': generateShortPhrase,
  'spelling-en': generateSpellingEn,
}

const STAGE_CONFIG = {
  Semente: {
    weights: { 'alphabet-sound': 1 },
  },
  Broto: {
    weights: { 'alphabet-sound': 0.3, 'thematic-vocabulary': 0.7 },
    'thematic-vocabulary': { themes: ['colors', 'numbers'] },
  },
  Folha: {
    weights: { 'thematic-vocabulary': 0.5, 'cvc-word': 0.5 },
    'thematic-vocabulary': { themes: ['animals'] },
  },
  Botão: {
    weights: { 'cvc-word': 0.5, 'short-phrase': 0.5 },
  },
  Flor: {
    weights: { 'short-phrase': 0.5, 'spelling-en': 0.5 },
  },
  Girassol: {
    weights: { 'short-phrase': 0.4, 'spelling-en': 0.4, 'cvc-word': 0.2 },
  },
}

export function buildEnglishSheet({ level, size = 8, excludeSignature = null }) {
  return buildSheet({
    subject: 'english',
    level,
    size,
    excludeSignature,
    stageConfig: STAGE_CONFIG,
    generators: GENERATORS,
  })
}
