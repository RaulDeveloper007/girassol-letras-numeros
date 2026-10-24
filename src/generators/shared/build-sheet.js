import { createRng, randomSeed } from './random.js'
import { sheetSignature } from './signature.js'
import { createId } from './id.js'
import { getStageInfo } from '../../levels/stage-names.js'

function pickWeighted(rng, weights) {
  const entries = Object.entries(weights)
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0)
  let roll = rng() * total
  for (const [key, weight] of entries) {
    if (roll < weight) return key
    roll -= weight
  }
  return entries[entries.length - 1][0]
}

/**
 * Monta uma folha de 5-10 exercícios para um nível, evitando repetir a
 * assinatura da folha anterior (excludeSignature) em sequência.
 */
export function buildSheet({ subject, level, size = 8, excludeSignature = null, stageConfig, generators, maxAttempts = 5 }) {
  const stage = getStageInfo(level)
  const config = stageConfig[stage.stageName]

  if (!config) {
    throw new Error(`Sem configuração de nível para o estágio "${stage.stageName}" em "${subject}"`)
  }

  let lastResult = null

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const rng = createRng(randomSeed() + attempt)
    const exercises = Array.from({ length: size }, () => {
      const type = pickWeighted(rng, config.weights)
      const generate = generators[type]
      if (!generate) throw new Error(`Gerador não encontrado para o tipo "${type}" em "${subject}"`)
      const exercise = generate(rng, config[type] ?? {})
      return { ...exercise, id: createId(), subject }
    })

    const signature = sheetSignature(exercises)
    lastResult = {
      id: createId(),
      subject,
      level: stage.level,
      stageName: stage.stageName,
      subLevel: stage.subLevel,
      exercises,
      signature,
    }

    if (signature !== excludeSignature) return lastResult
  }

  return lastResult
}
