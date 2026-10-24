import { dbGet, dbGetAll, dbPut, dbDelete } from './db.js'

const STORE = 'students'

export function listStudents() {
  return dbGetAll(STORE)
}

export function getStudent(id) {
  return dbGet(STORE, id)
}

export function saveStudent(student) {
  return dbPut(STORE, student)
}

export function deleteStudent(id) {
  return dbDelete(STORE, id)
}

// Garante que existam perfis para começar a usar o app. O responsável pode
// renomear/ajustar no painel (Etapa 6) — nenhum dado além do primeiro nome
// é guardado.
export async function ensureSeedStudents() {
  const existing = await listStudents()
  if (existing.length > 0) return existing

  const seed = [
    { id: 'crianca-5', firstName: 'Criança 1', avatarIcon: '🌼', createdAt: new Date().toISOString() },
    { id: 'crianca-8', firstName: 'Criança 2', avatarIcon: '🌻', createdAt: new Date().toISOString() },
  ]

  for (const student of seed) {
    await saveStudent(student)
  }

  return seed
}
