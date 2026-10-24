import { STORE_NAMES, dbGetAll, dbPut, dbClear } from '../data/db.js'

const SCHEMA_VERSION = 1

export async function exportBackupData() {
  const data = {}
  for (const storeName of STORE_NAMES) {
    data[storeName] = await dbGetAll(storeName)
  }
  return { schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), data }
}

export function downloadBackupFile(backup) {
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  link.href = url
  link.download = `girassol-backup-${date}.json`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function importBackupData(backup) {
  if (!backup || typeof backup !== 'object' || !backup.data) {
    throw new Error('Arquivo de backup inválido.')
  }
  if (backup.schemaVersion !== SCHEMA_VERSION) {
    throw new Error('Versão de backup incompatível com este app.')
  }

  for (const storeName of STORE_NAMES) {
    const records = backup.data[storeName]
    if (!Array.isArray(records)) continue
    await dbClear(storeName)
    for (const record of records) {
      await dbPut(storeName, record)
    }
  }
}
