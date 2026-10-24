import { dbGet, dbPut } from './db.js'

const STORE = 'progressionRules'

// Valores padrão, ajustáveis pelo responsável no painel (Etapa 6):
// X folhas seguidas, com acerto >= Y% e tempo <= Z segundos, para avançar.
const DEFAULT_RULES = {
  math: { sheetsRequired: 3, minAccuracy: 80, maxTimeSeconds: 420 },
  portuguese: { sheetsRequired: 3, minAccuracy: 80, maxTimeSeconds: 420 },
  english: { sheetsRequired: 3, minAccuracy: 80, maxTimeSeconds: 420 },
}

export async function getRules(subject) {
  const existing = await dbGet(STORE, subject)
  if (existing) return existing

  const fresh = { subject, ...DEFAULT_RULES[subject] }
  await dbPut(STORE, fresh)
  return fresh
}

export function saveRules(rules) {
  return dbPut(STORE, rules)
}
