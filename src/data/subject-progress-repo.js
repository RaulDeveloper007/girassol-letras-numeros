import { dbGet, dbGetAllByIndex, dbPut } from './db.js'

const STORE = 'subjectProgress'

export function getProgress(studentId, subject) {
  return dbGet(STORE, [studentId, subject])
}

export async function ensureProgress(studentId, subject) {
  const existing = await getProgress(studentId, subject)
  if (existing) return existing

  const fresh = { studentId, subject, level: 1, levelSince: new Date().toISOString() }
  await dbPut(STORE, fresh)
  return fresh
}

export function saveProgress(progress) {
  return dbPut(STORE, progress)
}

export function listProgressByStudent(studentId) {
  return dbGetAllByIndex(STORE, 'byStudent', studentId)
}
