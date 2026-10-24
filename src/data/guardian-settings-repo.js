import { dbGet, dbPut } from './db.js'

const STORE = 'guardianSettings'
const SETTINGS_ID = 'singleton'

export async function getGuardianSettings() {
  const existing = await dbGet(STORE, SETTINGS_ID)
  return existing ?? { id: SETTINGS_ID, pinHash: null, lastBackupAt: null }
}

// dbPut substitui o registro inteiro (IndexedDB não faz merge), então
// buscamos o que já existe antes de gravar só o que mudou.
export async function saveGuardianSettings(partial) {
  const current = await getGuardianSettings()
  return dbPut(STORE, { ...current, ...partial, id: SETTINGS_ID })
}
